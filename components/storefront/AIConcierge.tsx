import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Sparkles, Mic, MicOff, X, MessageSquare, Volume2 } from '../common/Icons';
import { useStore } from '../../context/StoreContext';

const AIConcierge: React.FC = () => {
  const { config, products } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  // Manual base64 decoding following Gemini API guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual base64 encoding following Gemini API guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    try {
      // Initialize Gemini SDK instance directly before connection
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const systemPrompt = `You are a high-end liquor store sommelier at "Liquor Spot". 
      You are elegant, knowledgeable, and helpful. 
      Recommend products from our catalog. Current catalog includes: ${products.map(p => `${p.name} (${p.category} - ${p.price})`).join(', ')}.
      Keep responses concise and sophisticated. Speak warmly.`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: systemPrompt,
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              
              // Use manual encoding helper to avoid spread operator stack issues
              const base64 = encode(new Uint8Array(int16.buffer));
              
              // Only send input after session promise is resolved to prevent race conditions
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + ' ' + msg.serverContent!.outputTranscription!.text).trim());
            }
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const ctx = outputAudioContextRef.current!;
              // Schedule playback for gapless streaming
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            // Stop all active sources if model turn is interrupted
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: () => setIsActive(false)
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    setIsActive(false);
    setTranscription('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen && (
        <div className="mb-6 w-80 bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-black p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Sparkles className="text-neutral-300" size={18} />
              <span className="font-serif italic font-medium">Concierge</span>
            </div>
            <button onClick={() => { setIsOpen(false); stopSession(); }} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
          </div>
          
          <div className="p-6 space-y-6 min-h-[200px] flex flex-col justify-between">
            {isActive ? (
              <>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-black/5 rounded-full animate-ping"></div>
                    <div className="relative w-16 h-16 bg-black text-white rounded-full flex items-center justify-center">
                      <Volume2 size={24} />
                    </div>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Listening...</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl max-h-32 overflow-y-auto">
                    <p className="text-sm font-light text-neutral-600 italic">
                      {transcription || "Ask for recommendations..."}
                    </p>
                </div>
                <button onClick={stopSession} className="w-full py-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <MicOff size={16} /> Stop Session
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={32} className="mx-auto mb-4 text-neutral-200" />
                <p className="text-sm text-neutral-500 mb-6 font-light">Experience real-time AI guidance through our collection.</p>
                <button 
                  onClick={startSession}
                  className="w-full py-4 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <Mic size={16} /> Begin Consultation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
        aria-label="Toggle AI Concierge"
      >
        <Sparkles className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};

export default AIConcierge;
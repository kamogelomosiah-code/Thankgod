
import { Product, Order, StoreConfig, PrimaryColorPreset, Customer } from './types';

export const CURRENCY = 'R';

// Helper for luxury minimalist placeholders
export const getPlaceholder = (id: string | number) => `https://via.placeholder.com/800x1000/F4F4F4/A3A3A3?text=LS+PRODUCT+${id}`;

export const INITIAL_CONFIG: StoreConfig = {
  storeName: "Liquor Spot",
  primaryColor: PrimaryColorPreset.Charcoal,
  layout: 'grid',
  heroImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000",
  heroHeadline: "The Fine Art of Selection",
  heroSubheadline: "Sourced globally. Delivered across Africa within 60 minutes.",
  contactEmail: "concierge@liquorspot.com",
  contactPhone: "+27 (0) 10 999 8888"
};

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Adebayo Mensah', email: 'ade@lagos.com', phone: '+234 801 234 5678', location: 'Lagos, Nigeria', totalSpent: 12500, joinDate: '2023-01-12' },
  { id: '2', name: 'Zanele Mbeki', email: 'zanele@jhb.co.za', phone: '+27 72 123 4567', location: 'Johannesburg, RSA', totalSpent: 8400, joinDate: '2023-02-15' },
  { id: '3', name: 'Kofi Annan', email: 'kofi@accra.gh', phone: '+233 24 123 4567', location: 'Accra, Ghana', totalSpent: 5200, joinDate: '2023-03-10' },
  { id: '4', name: 'Amara Diop', email: 'amara@dakar.sn', phone: '+221 77 123 4567', location: 'Dakar, Senegal', totalSpent: 3100, joinDate: '2023-04-05' },
  { id: '5', name: 'Tewodros Kassaye', email: 'ted@addis.et', phone: '+251 91 123 4567', location: 'Addis Ababa, Ethiopia', totalSpent: 6700, joinDate: '2023-05-20' },
  { id: '6', name: 'Fatoumata Traore', email: 'fatou@bamako.ml', phone: '+223 66 123 4567', location: 'Bamako, Mali', totalSpent: 2200, joinDate: '2023-06-14' },
  { id: '7', name: 'Chinua Okeke', email: 'chinua@enugu.ng', phone: '+234 701 234 5678', location: 'Enugu, Nigeria', totalSpent: 15400, joinDate: '2023-07-01' },
  { id: '8', name: 'Wanjiku Kamau', email: 'wanjiku@nairobi.ke', phone: '+254 712 345 678', location: 'Nairobi, Kenya', totalSpent: 9200, joinDate: '2023-08-12' },
  { id: '9', name: 'Moussa Sarr', email: 'moussa@abidjan.ci', phone: '+225 05 123 4567', location: 'Abidjan, Ivory Coast', totalSpent: 4500, joinDate: '2023-09-09' },
  { id: '10', name: 'Naledi Selebi', email: 'naledi@gabs.bw', phone: '+267 71 123 4567', location: 'Gaborone, Botswana', totalSpent: 7800, joinDate: '2023-10-30' },
  { id: '11', name: 'Omar Mansour', email: 'omar@cairo.eg', phone: '+20 10 123 4567', location: 'Cairo, Egypt', totalSpent: 11000, joinDate: '2023-11-02' },
  { id: '12', name: 'Belinda Nyoni', email: 'belinda@hrare.zw', phone: '+263 77 123 4567', location: 'Harare, Zimbabwe', totalSpent: 3900, joinDate: '2023-12-05' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Reserve Japanese Malt",
    category: "Spirits",
    subcategory: "Whisky",
    price: 2450.00,
    stock: 12,
    sku: "LS-WHI-01",
    image: getPlaceholder(1),
    description: "A masterwork of balance and refinement, featuring subtle peat and floral notes.",
    abv: 43.0,
    volume: "750ml",
    featured: true
  },
  {
    id: 2,
    name: "Vintage Anejo 1942",
    category: "Spirits",
    subcategory: "Tequila",
    price: 3800.00,
    stock: 8,
    sku: "LS-TEQ-02",
    image: getPlaceholder(2),
    description: "Slow-aged in small batches for a minimum of two years.",
    abv: 38,
    volume: "750ml",
    featured: true
  },
  {
    id: 3,
    name: "Botanical Dry Gin",
    category: "Spirits",
    subcategory: "Gin",
    price: 549.00,
    stock: 24,
    sku: "LS-GIN-03",
    image: getPlaceholder(3),
    description: "A crisp, complex infusion of 12 hand-picked botanicals.",
    abv: 43.4,
    volume: "750ml",
    featured: true
  },
  {
    id: 4,
    name: "Grand Cuvée Brut",
    category: "Wine",
    subcategory: "Champagne",
    price: 799.00,
    stock: 40,
    sku: "LS-CHAM-04",
    image: getPlaceholder(4),
    description: "The gold standard of celebrations with fine bubbles and brioche notes.",
    abv: 12.0,
    volume: "750ml",
    featured: true
  },
  {
    id: 5,
    name: "Stellenbosch Oak Red",
    category: "Wine",
    subcategory: "Red",
    price: 325.00,
    stock: 30,
    sku: "LS-RED-05",
    image: getPlaceholder(5),
    description: "Full-bodied Cabernet Sauvignon with dark berry intensity.",
    abv: 14.5,
    volume: "750ml",
    featured: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-8821",
    customerName: "Adebayo Mensah",
    customerEmail: "ade@lagos.com",
    customerPhone: "+234 801 234 5678",
    date: new Date().toISOString(),
    status: "out-for-delivery",
    total: 2450.00,
    deliveryAddress: "Victoria Island, Lagos, NG",
    items: [
      { productId: 1, name: "Reserve Japanese Malt", price: 2450.00, quantity: 1, image: getPlaceholder(1) }
    ]
  }
];

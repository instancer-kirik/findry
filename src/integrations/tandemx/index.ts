// TandemX Shop Integration

// API endpoint
const TANDEMX_API_URL = 'https://tandemx.fly.dev/api';

// Types
export interface TandemXProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  tags: string[];
  created_at: string;
}

export interface TandemXShopInfo {
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  owner: {
    name: string;
    username: string;
    avatar_url: string;
  };
  product_count: number;
}

// Functions
export const fetchTandemXProducts = async (): Promise<TandemXProduct[]> => {
  try {
    const response = await fetch(`${TANDEMX_API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching TandemX products:', error);
    return [];
  }
};

export const fetchTandemXShopInfo = async (): Promise<TandemXShopInfo | null> => {
  try {
    const response = await fetch(`${TANDEMX_API_URL}/shop-info`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shop info: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TandemX shop info:', error);
    return null;
  }
};

export const fetchTandemXProductById = async (productId: string): Promise<TandemXProduct | null> => {
  try {
    const response = await fetch(`${TANDEMX_API_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching TandemX product ${productId}:`, error);
    return null;
  }
};

// Mock implementation for development purposes
// Remove this when connecting to the real API
export const mockTandemXShopInfo: TandemXShopInfo = {
  name: 'TandemX Shop',
  description: 'Innovative products for creative professionals',
  logo_url: 'https://via.placeholder.com/200',
  banner_url: 'https://via.placeholder.com/1200x300',
  owner: {
    name: 'TandemX Creator',
    username: 'tandemx',
    avatar_url: 'https://via.placeholder.com/100'
  },
  product_count: 12
};

export const mockTandemXProducts: TandemXProduct[] = [
  {
    id: '1',
    name: 'Digital Art Canvas Pro',
    description: 'Professional-grade digital canvas for artists',
    price: 129.99,
    image_url: 'https://via.placeholder.com/400',
    category: 'Art Tools',
    tags: ['digital', 'canvas', 'art'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Audio Production Suite',
    description: 'Complete toolkit for audio producers and musicians',
    price: 199.99,
    image_url: 'https://via.placeholder.com/400',
    category: 'Music Tools',
    tags: ['audio', 'production', 'music'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Creative Inspiration Cards',
    description: 'Deck of 50 cards with creative prompts for artists',
    price: 24.99,
    image_url: 'https://via.placeholder.com/400',
    category: 'Creative Tools',
    tags: ['inspiration', 'cards', 'creativity'],
    created_at: new Date().toISOString()
  }
];

// Helper to use mock data during development
export const useMockData = true;

export const getTandemXProducts = async (): Promise<TandemXProduct[]> => {
  if (useMockData) {
    return mockTandemXProducts;
  }
  return fetchTandemXProducts();
};

export const getTandemXShopInfo = async (): Promise<TandemXShopInfo | null> => {
  if (useMockData) {
    return mockTandemXShopInfo;
  }
  return fetchTandemXShopInfo();
};

export const getTandemXProductById = async (productId: string): Promise<TandemXProduct | null> => {
  if (useMockData) {
    return mockTandemXProducts.find(product => product.id === productId) || null;
  }
  return fetchTandemXProductById(productId);
}; 
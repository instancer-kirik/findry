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
    id: '01GXY23Z4K5P6Q7R8S9T',
    name: 'Professional Canvas Set',
    description: 'High-quality canvas set for professional artists, includes 5 premium canvases in various sizes.',
    price: 89.99,
    image_url: 'https://via.placeholder.com/500x400',
    category: 'Art Supplies',
    tags: ['canvas', 'professional', 'painting'],
    created_at: '2023-04-15T10:30:00Z'
  },
  {
    id: '02GXY23Z4K5P6Q7R8S9U',
    name: 'Digital Drawing Tablet',
    description: 'Precision drawing tablet with pressure sensitivity and wireless connectivity.',
    price: 149.99,
    image_url: 'https://via.placeholder.com/500x400',
    category: 'Digital Art',
    tags: ['tablet', 'digital', 'drawing'],
    created_at: '2023-04-18T14:20:00Z'
  },
  {
    id: '03GXY23Z4K5P6Q7R8S9V',
    name: 'Ceramic Sculpting Kit',
    description: 'Complete kit for ceramic sculpting, includes tools, clay and step-by-step guide.',
    price: 65.50,
    image_url: 'https://via.placeholder.com/500x400',
    category: 'Sculpture',
    tags: ['ceramic', 'sculpting', 'tools'],
    created_at: '2023-04-20T09:15:00Z'
  },
  {
    id: '04GXY23Z4K5P6Q7R8S9W',
    name: 'Premium Acrylic Paint Set',
    description: 'Set of 24 premium acrylic paints with vibrant colors and long-lasting finish.',
    price: 45.99,
    image_url: 'https://via.placeholder.com/500x400',
    category: 'Art Supplies',
    tags: ['acrylic', 'paint', 'colors'],
    created_at: '2023-04-22T16:40:00Z'
  },
  {
    id: '05GXY23Z4K5P6Q7R8S9X',
    name: 'Professional Photography Backdrop',
    description: 'Studio-quality backdrop for professional photography, wrinkle-resistant material.',
    price: 79.99,
    image_url: 'https://via.placeholder.com/500x400',
    category: 'Photography',
    tags: ['backdrop', 'studio', 'photography'],
    created_at: '2023-04-25T11:50:00Z'
  },
  {
    id: '06GXY23Z4K5P6Q7R8S9Y',
    name: 'Calligraphy Starter Set',
    description: 'Everything you need to start with calligraphy, includes pens, nibs, ink and guide book.',
    price: 38.50,
    image_url: 'https://via.placeholder.com/500x400',
    category: 'Calligraphy',
    tags: ['calligraphy', 'pens', 'starter'],
    created_at: '2023-04-28T13:25:00Z'
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
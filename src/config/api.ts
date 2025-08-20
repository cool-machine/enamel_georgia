// API Configuration for Enamel Georgia
export const API_CONFIG = {
  // Use Azure backend in production, local backend in development
  BASE_URL: import.meta.env.PROD 
    ? 'https://enamel-georgia-api.azurewebsites.net/api/v1'
    : 'http://localhost:3001/api/v1',
  
  // Timeout for API requests
  TIMEOUT: 10000,
  
  // Default pagination
  DEFAULT_LIMIT: 20,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// API Response types matching our backend
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  products?: Product[];
  pagination?: PaginationInfo;
  // The actual API returns data as an array directly, with meta info
}

export interface Product {
  id: string;
  name: string;
  price: string | number; // Backend returns string, frontend expects number
  type: 'TRANSPARENT' | 'OPAQUE' | 'OPALE';
  category: string;
  enamelNumber: string;
  image: string;
  inStock: boolean;
  quantity: number;
  slug?: string;
  description?: string;
  colorCode?: string;
  specifications?: {
    firingTemp: string;
    mesh: string;
    weight: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  type?: 'TRANSPARENT' | 'OPAQUE' | 'OPALE';
  search?: string;
  sortBy?: 'name' | 'price' | 'type' | 'enamelNumber';
  sortOrder?: 'asc' | 'desc';
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
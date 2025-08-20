import { API_CONFIG, ApiResponse, ProductsResponse, Product, ProductFilters, ApiError } from '@/config/api';

class ProductApiService {
  private baseUrl = API_CONFIG.BASE_URL;
  
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          ...options?.headers,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const data: ApiResponse<T> = await response.json();
      
      if (!response.ok) {
        throw new ApiError(
          data.message || 'API request failed',
          response.status,
          data.errors
        );
      }
      
      if (!data.success) {
        throw new ApiError(
          data.message || 'API returned error',
          response.status,
          data.errors
        );
      }
      
      return data.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout');
        }
        throw new ApiError(`Network error: ${error.message}`);
      }
      
      throw new ApiError('Unknown error occurred');
    }
  }
  
  // Get all products with filtering and pagination
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const url = `${this.baseUrl}/products?${params.toString()}`;
    const response = await this.fetchWithErrorHandling<Product[] & { meta?: any }>(url);
    
    // Handle the actual API response format
    if (Array.isArray(response)) {
      return {
        products: response,
        pagination: {
          page: 1,
          limit: response.length,
          total: response.length,
          pages: 1
        }
      };
    }
    
    // If response has data property
    if (response && (response as any).data) {
      const data = (response as any).data;
      const meta = (response as any).meta || {};
      return {
        products: Array.isArray(data) ? data : [data],
        pagination: {
          page: meta.page || 1,
          limit: meta.limit || 20,
          total: meta.total || 0,
          pages: meta.totalPages || 1
        }
      };
    }
    
    return {
      products: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 }
    };
  }
  
  // Get single product by ID
  async getProduct(id: string): Promise<Product> {
    const url = `${this.baseUrl}/products/${id}`;
    const response = await this.fetchWithErrorHandling<Product>(url);
    return response;
  }
  
  // Search products
  async searchProducts(query: string, limit: number = 10): Promise<{ products: Product[] }> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });
    
    const url = `${this.baseUrl}/products/search?${params.toString()}`;
    return this.fetchWithErrorHandling<{ products: Product[] }>(url);
  }
  
  // Get product statistics
  async getProductStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    averagePrice: number;
  }> {
    const url = `${this.baseUrl}/products/stats`;
    return this.fetchWithErrorHandling(url);
  }
  
  // Get products by type (helper method)
  async getProductsByType(type: 'TRANSPARENT' | 'OPAQUE' | 'OPALE', limit?: number): Promise<ProductsResponse> {
    return this.getProducts({ type, limit });
  }
  
  // Get featured/popular products (using first few products for now)
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const response = await this.getProducts({ limit, sortBy: 'name' });
    return response.products;
  }
}

// Export singleton instance
export const productApi = new ProductApiService();
export default productApi;
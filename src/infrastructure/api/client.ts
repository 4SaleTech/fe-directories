import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v2',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add headers
    this.client.interceptors.request.use(
      (config) => {
        // Add standard 4Sale headers
        config.headers['Device-Id'] = process.env.NEXT_PUBLIC_DEVICE_ID || '00000001-e89b-12d3-a456-426614174000';
        config.headers['Device-Type'] = process.env.NEXT_PUBLIC_DEVICE_TYPE || 'web';
        config.headers['Version-Number'] = process.env.NEXT_PUBLIC_VERSION_NUMBER || '30.5.4';
        config.headers['Application-Source'] = process.env.NEXT_PUBLIC_APPLICATION_SOURCE || 'q84sale';

        // Add language preference (X-Language takes precedence over Accept-Language)
        const locale = config.headers['X-Language'] || 'ar';
        config.headers['X-Language'] = locale;
        config.headers['Accept-Language'] = locale; // Fallback

        // Add JWT token if available (for authenticated requests)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle errors globally
        if (error.response) {
          console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api';

export interface HttpClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, data?: unknown, options?: RequestInit): Promise<T>;
  put<T>(url: string, data?: unknown, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
}

export class AxiosHttpClient implements HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
      },
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
      },
      (error: AxiosError) => {
        const apiError = this.createApiErrorFromAxiosError(error);
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${apiError.status}: ${apiError.message}`);
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    const config = this.convertRequestInitToAxiosConfig(options);
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    const config = this.convertRequestInitToAxiosConfig(options);
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    const config = this.convertRequestInitToAxiosConfig(options);
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const config = this.convertRequestInitToAxiosConfig(options);
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  private convertRequestInitToAxiosConfig(options: RequestInit): AxiosRequestConfig {
    const config: AxiosRequestConfig = {};
    
    // Convert headers
    if (options.headers) {
      config.headers = this.convertHeadersToObject(options.headers);
    }
    
    // Convert abort signal
    if (options.signal) {
      config.signal = options.signal as AbortSignal;
    }
    
    return config;
  }

  private convertHeadersToObject(headers: HeadersInit): Record<string, string> {
    if (headers instanceof Headers) {
      const result: Record<string, string> = {};
      headers.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    
    if (Array.isArray(headers)) {
      const result: Record<string, string> = {};
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
      return result;
    }
    
    return headers as Record<string, string>;
  }

  private createApiErrorFromAxiosError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const message = this.extractErrorMessage(error.response.data);
      return {
        message,
        status: error.response.status,
        code: `HTTP_${error.response.status}`,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      return {
        message: 'Request timeout. Please try again.',
        status: 0,
        code: 'TIMEOUT_ERROR',
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  private extractErrorMessage(errorData: unknown): string {
    if (typeof errorData === 'string') {
      return errorData;
    }
    
    if (typeof errorData === 'object' && errorData !== null) {
      const error = errorData as Record<string, unknown>;
      return (error.message as string) || (error.error as string) || 'An error occurred';
    }
    
    return 'An error occurred';
  }
}

// Backward compatibility: keep the old FetchHttpClient class for now
export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw this.createApiError(response.status, errorMessage);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        // Network error
        throw this.createApiError(0, 'Network error. Please check your connection.');
      }
      throw error;
    }
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const errorBody = await response.text();
      if (errorBody) {
        try {
          const errorJson = JSON.parse(errorBody);
          return errorJson.message || errorJson.error || 'An error occurred';
        } catch {
          return errorBody;
        }
      }
      return `HTTP ${response.status} ${response.statusText}`;
    } catch {
      return `HTTP ${response.status} ${response.statusText}`;
    }
  }

  private createApiError(status: number, message: string): ApiError {
    return {
      message,
      status,
      code: status > 0 ? `HTTP_${status}` : 'NETWORK_ERROR',
    };
  }
}

// Export the new Axios implementation as default
export default AxiosHttpClient; 
const API_BASE_URL = 'http://91.147.104.165:666/api';

export interface ApiError {
  message: string;
  detail?: string;
  [key: string]: any;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    date_joined: string;
  };
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    full_name: string;
    date_joined: string;
  };
  access: string;
  refresh: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  date_joined: string;
}

export interface RefreshResponse {
  access: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAccessToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(errorData.detail || errorData.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('access_token');
  }

  private setTokens(access: string, refresh: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setTokens(data.access, data.refresh);
    return data;
  }

  async register(
    email: string,
    password: string,
    fullName?: string
  ): Promise<RegisterResponse> {
    const data = await this.request<RegisterResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName || '',
      }),
    });
    this.setTokens(data.access, data.refresh);
    return data;
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const data = await this.request<RefreshResponse>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    localStorage.setItem('access_token', data.access);
    return data.access;
  }

  async getCurrentUser(): Promise<UserResponse> {
    return await this.request<UserResponse>('/auth/me/');
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const apiClient = new ApiClient();


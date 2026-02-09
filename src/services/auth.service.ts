import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  PasswordResetRequest,
  PasswordResetConfirm
} from '../types/user.types';

// Mock storage for offline demo
const MOCK_USERS_KEY = 'mock_users';

export class AuthService {
  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock user storage for demo
  private getMockUsers(): any[] {
    const users = localStorage.getItem(MOCK_USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveMockUser(user: any): void {
    const users = this.getMockUsers();
    users.push(user);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(1000); // Simulate API call
    
    // For demo: Check mock storage first
    const users = this.getMockUsers();
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );

    if (!user) {
      // Simulate backend API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    }

    // Return mock user if found
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    await this.delay(1000); // Simulate API call
    
    // For demo: Save to mock storage
    const user = {
      id: `user_${Date.now()}`,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      created_at: new Date(),
      password: data.password // In real app, this would be hashed
    };

    this.saveMockUser(user);

    // Simulate backend API call
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      // Return mock response for demo
      const { password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      };
    }
  }

  async forgotPassword(data: PasswordResetRequest): Promise<void> {
    await this.delay(1000); // Simulate API call

    // Simulate backend API call
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }
  }

  async resetPassword(data: PasswordResetConfirm): Promise<void> {
    await this.delay(1000); // Simulate API call

    // Simulate backend API call
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async logout(): Promise<void> {
    // Clear tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Simulate backend API call
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();

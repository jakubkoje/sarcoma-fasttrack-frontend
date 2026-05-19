import { $fetch } from 'ofetch'
import type { AuthCredentials, AuthResponse } from '~/types/auth'

/**
 * Auth service encapsulates API calls; adjust paths to match backend.
 */
export class AuthService {
  private readonly client: typeof $fetch

  constructor(baseURL = '/api') {
    this.client = $fetch.create({
      baseURL
    })
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.client<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials
    })
  }

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    return this.client<AuthResponse>('/auth/register', {
      method: 'POST',
      body: credentials
    })
  }

  async logout(): Promise<void> {
    await this.client('/auth/logout', { method: 'POST' })
  }
}

export const authService = new AuthService()

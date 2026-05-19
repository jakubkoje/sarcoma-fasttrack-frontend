export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
}

export interface AuthCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
}

export interface ApiError {
  message: string
  statusCode?: number
  code?: string
  details?: unknown
}

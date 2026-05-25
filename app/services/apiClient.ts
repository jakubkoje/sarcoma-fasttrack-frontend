import { $fetch, type FetchResponse } from 'ofetch'
import { navigateTo, useRuntimeConfig } from '#imports'
import { useAuthStore } from '~/stores/auth'
import type {
  ArticleCreate,
  ArticleListResponse,
  ArticleRead,
  ArticleStatus,
  ArticleUpdate,
  HTTPValidationError,
  LoginRequest,
  OrganizationCreate,
  OrganizationListResponse,
  OrganizationRead,
  OrganizationUpdate,
  PatientCreate,
  PatientListResponse,
  PatientRead,
  PatientUpdate,
  ReportCreate,
  ReportListResponse,
  ReportRead,
  ReportUpdate,
  TokenResponse,
  UserCreate,
  UserListResponse,
  UserRead
} from '~/types/api'

export interface ApiError {
  message: string
  statusCode?: number
  code?: string
  details?: unknown
}

export class ApiClient {
  private readonly client: typeof $fetch
  private readonly apiPrefix = '/api/v1'
  private authToken: string | null = null
  private readonly tokenProvider?: () => string | null
  private readonly onUnauthorized?: () => void

  constructor(baseURL = '', tokenProvider?: () => string | null, onUnauthorized?: () => void) {
    this.tokenProvider = tokenProvider
    this.onUnauthorized = onUnauthorized
    this.client = $fetch.create({
      baseURL,
      onRequest: ({ options }) => {
        const token = this.authToken ?? this.tokenProvider?.()
        if (token) {
          const headers = new Headers(options.headers as HeadersInit | undefined)
          headers.set('Authorization', `Bearer ${token}`)
          options.headers = headers
        }
      },
      onResponseError: ({ request, response }) => {
        const apiError = this.normalizeResponseError(response)
        if (response.status === 401 && !String(request).includes('/auth/login')) {
          this.onUnauthorized?.()
        }
        throw apiError
      }
    })
  }

  setToken(token: string | null) {
    this.authToken = token
  }

  clearToken() {
    this.authToken = null
  }

  // Health endpoints
  dbHealth() {
    return this.client<Record<string, unknown>>('/health/db')
  }

  // Auth
  async login(payload: LoginRequest): Promise<TokenResponse> {
    const response = await this.client<TokenResponse>(`${this.apiPrefix}/auth/login`, {
      method: 'POST',
      body: payload
    })
    this.setToken(response.access_token ?? null)
    return response
  }

  // Patients
  listPatients(): Promise<PatientListResponse> {
    return this.client<PatientListResponse>(`${this.apiPrefix}/patients`)
  }

  getPatient(patientId: number): Promise<PatientRead> {
    return this.client<PatientRead>(`${this.apiPrefix}/patients/${patientId}`)
  }

  createPatient(payload: PatientCreate): Promise<PatientRead> {
    return this.client<PatientRead>(`${this.apiPrefix}/patients`, {
      method: 'POST',
      body: payload
    })
  }

  updatePatient(patientId: number, payload: PatientUpdate): Promise<PatientRead> {
    return this.client<PatientRead>(`${this.apiPrefix}/patients/${patientId}`, {
      method: 'PUT',
      body: payload
    })
  }

  deletePatient(patientId: number): Promise<void> {
    return this.client<void>(`${this.apiPrefix}/patients/${patientId}`, {
      method: 'DELETE'
    })
  }

  // Reports
  listReports(): Promise<ReportListResponse> {
    return this.client<ReportListResponse>(`${this.apiPrefix}/reports`)
  }

  createReport(payload: ReportCreate): Promise<ReportRead> {
    return this.client<ReportRead>(`${this.apiPrefix}/reports`, {
      method: 'POST',
      body: payload
    })
  }

  getReport(reportId: number): Promise<ReportRead> {
    return this.client<ReportRead>(`${this.apiPrefix}/reports/${reportId}`)
  }

  updateReport(reportId: number, payload: ReportUpdate): Promise<ReportRead> {
    return this.client<ReportRead>(`${this.apiPrefix}/reports/${reportId}`, {
      method: 'PUT',
      body: payload
    })
  }

  updateReportStatus(reportId: number, status: string): Promise<ReportRead> {
    return this.client<ReportRead>(`${this.apiPrefix}/reports/${reportId}/status`, {
      method: 'PATCH',
      body: { status }
    })
  }

  updateReportFeedback(reportId: number, feedback: string): Promise<ReportRead> {
    return this.client<ReportRead>(`${this.apiPrefix}/reports/${reportId}/feedback`, {
      method: 'PATCH',
      body: { feedback_specialist: feedback }
    })
  }

  deleteReport(reportId: number): Promise<void> {
    return this.client<void>(`${this.apiPrefix}/reports/${reportId}`, {
      method: 'DELETE'
    })
  }

  // Users
  listUsers(): Promise<UserListResponse> {
    return this.client<UserListResponse>(`${this.apiPrefix}/users`)
  }

  createUser(payload: UserCreate): Promise<UserRead> {
    return this.client<UserRead>(`${this.apiPrefix}/users`, {
      method: 'POST',
      body: payload
    })
  }

  // Organizations
  listOrganizations(): Promise<OrganizationListResponse> {
    return this.client<OrganizationListResponse>(`${this.apiPrefix}/organizations`)
  }

  createOrganization(payload: OrganizationCreate): Promise<OrganizationRead> {
    return this.client<OrganizationRead>(`${this.apiPrefix}/organizations`, {
      method: 'POST',
      body: payload
    })
  }

  getOrganization(orgId: number): Promise<OrganizationRead> {
    return this.client<OrganizationRead>(`${this.apiPrefix}/organizations/${orgId}`)
  }

  updateOrganization(orgId: number, payload: OrganizationUpdate): Promise<OrganizationRead> {
    return this.client<OrganizationRead>(`${this.apiPrefix}/organizations/${orgId}`, {
      method: 'PUT',
      body: payload
    })
  }

  deleteOrganization(orgId: number): Promise<void> {
    return this.client<void>(`${this.apiPrefix}/organizations/${orgId}`, {
      method: 'DELETE'
    })
  }

  // Articles
  listArticles(): Promise<ArticleListResponse> {
    return this.client<ArticleListResponse>(`${this.apiPrefix}/articles`)
  }

  getArticle(articleId: number): Promise<ArticleRead> {
    return this.client<ArticleRead>(`${this.apiPrefix}/articles/${articleId}`)
  }

  createArticle(payload: ArticleCreate): Promise<ArticleRead> {
    return this.client<ArticleRead>(`${this.apiPrefix}/articles`, {
      method: 'POST',
      body: payload
    })
  }

  updateArticle(articleId: number, payload: ArticleUpdate): Promise<ArticleRead> {
    return this.client<ArticleRead>(`${this.apiPrefix}/articles/${articleId}`, {
      method: 'PUT',
      body: payload
    })
  }

  updateArticleStatus(articleId: number, status: ArticleStatus): Promise<ArticleRead> {
    return this.client<ArticleRead>(`${this.apiPrefix}/articles/${articleId}/status`, {
      method: 'PATCH',
      body: { status }
    })
  }

  deleteArticle(articleId: number): Promise<void> {
    return this.client<void>(`${this.apiPrefix}/articles/${articleId}`, {
      method: 'DELETE'
    })
  }

  private normalizeResponseError(response?: FetchResponse<HTTPValidationError | { detail?: string; message?: string }>): ApiError {
    const data = response?._data
    const detail = data?.detail
    const detailMessages = Array.isArray(detail)
      ? detail.map((item) => item.msg).filter(Boolean)
      : typeof detail === 'string'
        ? [detail]
        : undefined
    const message = detailMessages?.length
      ? detailMessages.join(', ')
      : data && 'message' in data && typeof data.message === 'string'
        ? data.message
        : response?.statusText || 'Request failed'

    return {
      message,
      statusCode: response?.status,
      details: data
    }
  }
}

export function createApiClient(baseURL?: string, tokenProvider?: () => string | null, onUnauthorized?: () => void) {
  const resolvedBase = baseURL ?? process.env.NUXT_PUBLIC_API_BASE ?? ''
  return new ApiClient(resolvedBase, tokenProvider, onUnauthorized)
}

export function useApiClient(baseURL?: string) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  return createApiClient(baseURL ?? config.public.apiBase, () => auth.validToken.value, () => {
    auth.clearToken()
    navigateTo('/login', { replace: true })
  })
}

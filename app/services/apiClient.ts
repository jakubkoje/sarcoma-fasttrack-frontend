import { $fetch, type FetchError } from 'ofetch'
import { useRuntimeConfig } from '#imports'
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
import type { ApiError } from '~/types/auth'

export class ApiClient {
  private readonly client: typeof $fetch
  private readonly apiPrefix = '/api/v1'
  private authToken: string | null = null
  private readonly tokenProvider?: () => string | null

  constructor(baseURL = '', tokenProvider?: () => string | null) {
    this.tokenProvider = tokenProvider
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
      onResponseError: ({ error }) => {
        throw this.normalizeError(error)
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

  private normalizeError(error: unknown): ApiError {
    const fetchError = error as FetchError<HTTPValidationError> | undefined
    const detailMessages = fetchError?.data?.detail?.map((item) => item.msg).filter(Boolean)
    const message = detailMessages?.length
      ? detailMessages.join(', ')
      : fetchError?.message || 'Request failed'

    return {
      message,
      statusCode: fetchError?.response?.status,
      details: fetchError?.data
    }
  }
}

export const apiClient = createApiClient()

export function createApiClient(baseURL?: string, tokenProvider?: () => string | null) {
  const resolvedBase = baseURL ?? process.env.NUXT_PUBLIC_API_BASE ?? ''
  return new ApiClient(resolvedBase, tokenProvider)
}

export function useApiClient(baseURL?: string) {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  return createApiClient(baseURL ?? config.public.apiBase, () => auth.token.value)
}

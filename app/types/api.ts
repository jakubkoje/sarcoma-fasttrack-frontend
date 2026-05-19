export type Nullable<T> = T | null

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type?: string
  user_role?: string
}

// Patients
export interface PatientCreate {
  first_name: string
  last_name: string
  address: string
  birth_number: string
  phone: string
  email?: Nullable<string>
  managing_org_id?: Nullable<number>
}

export interface PatientUpdate {
  fhir_id?: Nullable<string>
}

export interface PatientRead {
  id: number
  fhir_id: string
  first_name?: Nullable<string>
  last_name?: Nullable<string>
  address?: Nullable<string>
  birth_number?: Nullable<string>
  phone?: Nullable<string>
  email?: Nullable<string>
  managing_org_id?: Nullable<string>
  identifier_rc?: Nullable<string>
  insurance_company_code?: Nullable<string>
  address_text?: Nullable<string>
  address_city?: Nullable<string>
  address_postal_code?: Nullable<string>
  address_country?: Nullable<string>
  family_name?: Nullable<string>
  given_name?: Nullable<string>
  birth_date?: Nullable<string>
  gender?: Nullable<string>
  managing_organization_id?: Nullable<number>
}

export type PatientListResponse = PatientRead[]

// Reports
export interface ReportCreate {
  fhir_id?: Nullable<string>
  patient_id: number
  doctor_id: number
  target_organization_id: number
  status?: Nullable<string>
  is_new_patient?: boolean
  any_imaging_performed?: boolean
  additional_imaging_planned?: boolean
  additional_imaging_note?: Nullable<string>
  anamnesis?: Nullable<string>
  mkn10_code?: Nullable<string>
  family_history?: Nullable<string>
  anticoagulant_medication?: boolean
  anticoagulant_detail?: Nullable<string>
  histology_performed?: boolean
  histology_date?: Nullable<string>
  histology_result?: Nullable<string>
  summary?: Nullable<string>
  feedback_specialist?: Nullable<string>
  attachment_path?: Nullable<string>
  note?: Nullable<string>
}

export interface ReportUpdate {
  fhir_id?: Nullable<string>
  patient_id?: Nullable<number>
  doctor_id?: Nullable<number>
  target_organization_id?: Nullable<number>
  status?: Nullable<string>
  note?: Nullable<string>
}

export interface ReportRead {
  id: number
  fhir_id?: Nullable<string>
  patient_id: number
  doctor_id: number
  target_organization_id: number
  status: string
  authored_on?: Nullable<string>
  note?: Nullable<string>
  feedback_specialist?: Nullable<string>
  mkn10_code?: Nullable<string>
  status_cz?: Nullable<string>
  is_new_patient?: Nullable<boolean>
  any_imaging_performed?: Nullable<boolean>
  additional_imaging_planned?: Nullable<boolean>
  additional_imaging_note?: Nullable<string>
  anamnesis?: Nullable<string>
  family_history?: Nullable<string>
  anticoagulant_medication?: Nullable<boolean>
  anticoagulant_detail?: Nullable<string>
  histology_performed?: Nullable<boolean>
  histology_date?: Nullable<string>
  histology_result?: Nullable<string>
  summary?: Nullable<string>
  attachment_path?: Nullable<string>
  created_at?: Nullable<string>
  updated_at?: Nullable<string>
  specialist?: Nullable<string>
  specialist_confidence?: Nullable<number>
  severity?: Nullable<string>
  severity_code?: Nullable<number>
  severity_confidence?: Nullable<number>
  overall_confidence?: Nullable<number>
}

export type ReportListResponse = ReportRead[]

// Users
export type UserRole = 'doctor' | 'specialist' | 'admin' | 'coordinator'

export interface UserCreate {
  email: string
  password: string
  role: UserRole
  practitioner_name?: Nullable<string>
  organization_id?: Nullable<number>
  ico?: Nullable<string>
}

export interface UserRead {
  id: number
  email: string
  is_active: boolean
  role: UserRole
  fhir_id?: Nullable<string>
}

export type UserListResponse = UserRead[]

// Organizations
export interface OrganizationCreate {
  name: string
  type_code?: string
  address?: Nullable<string>
  contact?: Nullable<string>
}

export interface OrganizationUpdate {
  fhir_id?: Nullable<string>
}

export interface OrganizationRead {
  id: number
  fhir_id: string
  name?: Nullable<string>
  type_code?: Nullable<string>
  address?: Nullable<string>
  contact?: Nullable<string>
}

export type OrganizationListResponse = OrganizationRead[]

// Validation
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}

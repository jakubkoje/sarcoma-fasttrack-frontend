<script setup lang="ts">
import { reactive, ref } from 'vue'
import { definePageMeta } from '#imports'
import { useApiClient } from '~/services/apiClient'
import type { UserRole } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const client = useApiClient()

const loading = ref(false)
const lastAction = ref<string | null>(null)
const lastResponse = ref<unknown>(null)
const lastError = ref<string | null>(null)
const token = ref<string | null>(null)

const loginForm = reactive({
  email: '',
  password: ''
})

const patientForm = reactive({
  fhir_id: '',
  id: '' // for update
})

const reportForm = reactive({
  id: '',
  fhir_id: '',
  patient_id: '',
  practitioner_id: '',
  target_organization_id: '',
  status: 'DRAFT'
})

const userForm = reactive({
  email: '',
  password: '',
  role: 'doctor' as UserRole,
  organization_id: '',
  doctor_fhir_id: '',
  practitioner_fhir_id: '',
  ico: ''
})

const organizationForm = reactive({
  id: '',
  fhir_id: ''
})

function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error'
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    return (error as any).message
  }
  return JSON.stringify(error)
}

async function run<T>(label: string, fn: () => Promise<T>) {
  loading.value = true
  lastAction.value = label
  lastError.value = null
  try {
    lastResponse.value = await fn()
  } catch (error) {
    lastError.value = getErrorMessage(error)
    lastResponse.value = null
  } finally {
    loading.value = false
  }
}

function withId(value: string) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) throw new Error('ID must be a number')
  return parsed
}

async function handleLogin() {
  await run('login', async () => {
    const res = await client.login({
      email: loginForm.email,
      password: loginForm.password
    })
    token.value = res.access_token
    client.setToken(res.access_token)
    return res
  })
}

// Patients
const listPatients = () => run('list patients', () => client.listPatients())
const createPatient = () => run('create patient', () => client.createPatient({ fhir_id: patientForm.fhir_id }))
const updatePatient = () => run('update patient', () => client.updatePatient(withId(patientForm.id), { fhir_id: patientForm.fhir_id || null }))

// Reports
const listReports = () => run('list reports', () => client.listReports())
const createReport = () => run('create report', () => client.createReport({
  fhir_id: reportForm.fhir_id || null,
  patient_id: withId(reportForm.patient_id),
  doctor_id: withId(reportForm.practitioner_id),
  target_organization_id: withId(reportForm.target_organization_id),
  status: reportForm.status || null
}))
const updateReport = () => run('update report', () => client.updateReport(withId(reportForm.id), {
  fhir_id: reportForm.fhir_id || null,
  patient_id: reportForm.patient_id ? withId(reportForm.patient_id) : null,
  doctor_id: reportForm.practitioner_id ? withId(reportForm.practitioner_id) : null,
  target_organization_id: reportForm.target_organization_id ? withId(reportForm.target_organization_id) : null,
  status: reportForm.status || null
}))

// Users
const listUsers = () => run('list users', () => client.listUsers())
const createUser = () => run('create user', () =>
  client.createUser({
    email: userForm.email,
    password: userForm.password,
    role: userForm.role,
    organization_id: userForm.organization_id ? withId(userForm.organization_id) : null,
    doctor_fhir_id: userForm.doctor_fhir_id || null,
    practitioner_fhir_id: userForm.practitioner_fhir_id || null,
    ico: userForm.ico || null
  })
)

// Organizations
const listOrganizations = () => run('list organizations', () => client.listOrganizations())
const createOrganization = () => run('create organization', () => client.createOrganization({ fhir_id: organizationForm.fhir_id }))
const updateOrganization = () => run('update organization', () => client.updateOrganization(withId(organizationForm.id), { fhir_id: organizationForm.fhir_id || null }))

// Health
const checkDbHealth = () => run('db health', () => client.dbHealth())
</script>

<template>
  <div class="space-y-6 p-6">
    <header class="flex items-center gap-3">
      <h1 class="text-2xl font-semibold">API Tester</h1>
      <UBadge v-if="token" color="green" variant="soft">
        Token set
      </UBadge>
      <UBadge v-else color="orange" variant="soft">
        No token
      </UBadge>
      <UBadge v-if="lastAction" color="gray" variant="soft">
        Last: {{ lastAction }}
      </UBadge>
    </header>

    <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <UCard>
        <template #header>Health</template>
        <div class="flex flex-wrap gap-2">
          <UButton :loading="loading" @click="checkDbHealth">/health/db</UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>Login</template>
        <div class="space-y-3">
          <UFormGroup label="Email">
            <UInput v-model="loginForm.email" placeholder="email@example.com" />
          </UFormGroup>
          <UFormGroup label="Password">
            <UInput v-model="loginForm.password" type="password" placeholder="••••••••" />
          </UFormGroup>
          <UButton :loading="loading" @click="handleLogin">Login & set token</UButton>
        </div>
      </UCard>
    </section>

    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <UCard>
        <template #header>Patients</template>
        <div class="space-y-3">
          <div class="flex gap-2 flex-wrap">
            <UButton :loading="loading" @click="listPatients">List</UButton>
            <UButton :loading="loading" @click="createPatient" color="green">Create</UButton>
          </div>
          <UFormGroup label="FHIR ID">
            <UInput v-model="patientForm.fhir_id" placeholder="patient fhir id" />
          </UFormGroup>
          <UFormGroup label="Patient ID (for update)">
            <UInput v-model="patientForm.id" placeholder="e.g. 1" />
          </UFormGroup>
          <div class="flex flex-wrap gap-2">
            <UButton :loading="loading" @click="updatePatient" color="blue">Update</UButton>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>Reports</template>
        <div class="space-y-3">
          <div class="flex flex-wrap gap-2">
            <UButton :loading="loading" @click="listReports">List</UButton>
            <UButton :loading="loading" @click="createReport" color="green">Create</UButton>
          </div>
          <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
            <UFormGroup label="Report ID (for update)">
              <UInput v-model="reportForm.id" placeholder="e.g. 1" />
            </UFormGroup>
            <UFormGroup label="FHIR ID">
              <UInput v-model="reportForm.fhir_id" placeholder="optional fhir id" />
            </UFormGroup>
            <UFormGroup label="Patient ID">
              <UInput v-model="reportForm.patient_id" placeholder="patient id" />
            </UFormGroup>
            <UFormGroup label="Practitioner ID">
              <UInput v-model="reportForm.practitioner_id" placeholder="practitioner id" />
            </UFormGroup>
            <UFormGroup label="Target Organization ID">
              <UInput v-model="reportForm.target_organization_id" placeholder="org id" />
            </UFormGroup>
            <UFormGroup label="Status">
              <UInput v-model="reportForm.status" placeholder="DRAFT/..." />
            </UFormGroup>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton :loading="loading" @click="updateReport" color="blue">Update</UButton>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>Users</template>
        <div class="space-y-3">
          <div class="flex flex-wrap gap-2">
            <UButton :loading="loading" @click="listUsers">List</UButton>
            <UButton :loading="loading" @click="createUser" color="green">Create</UButton>
          </div>
          <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
            <UFormGroup label="Email">
              <UInput v-model="userForm.email" placeholder="user email" />
            </UFormGroup>
            <UFormGroup label="Password">
              <UInput v-model="userForm.password" type="password" placeholder="password" />
            </UFormGroup>
            <UFormGroup label="Role">
              <USelect v-model="userForm.role" :options="['doctor','specialist','admin']" />
            </UFormGroup>
            <UFormGroup label="Organization ID">
              <UInput v-model="userForm.organization_id" placeholder="org id (optional)" />
            </UFormGroup>
            <UFormGroup label="Doctor FHIR ID">
              <UInput v-model="userForm.doctor_fhir_id" placeholder="doctor fhir id" />
            </UFormGroup>
            <UFormGroup label="Practitioner FHIR ID">
              <UInput v-model="userForm.practitioner_fhir_id" placeholder="practitioner fhir id" />
            </UFormGroup>
            <UFormGroup label="ICO">
              <UInput v-model="userForm.ico" placeholder="ico" />
            </UFormGroup>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>Organizations</template>
        <div class="space-y-3">
          <div class="flex flex-wrap gap-2">
            <UButton :loading="loading" @click="listOrganizations">List</UButton>
            <UButton :loading="loading" @click="createOrganization" color="green">Create</UButton>
          </div>
          <UFormGroup label="FHIR ID">
            <UInput v-model="organizationForm.fhir_id" placeholder="org fhir id" />
          </UFormGroup>
          <UFormGroup label="Organization ID (for update)">
            <UInput v-model="organizationForm.id" placeholder="e.g. 1" />
          </UFormGroup>
          <div class="flex flex-wrap gap-2">
            <UButton :loading="loading" @click="updateOrganization" color="blue">Update</UButton>
          </div>
        </div>
      </UCard>
    </section>

    <UCard>
      <template #header>Response</template>
      <div class="space-y-2">
        <div class="text-sm text-gray-600">
          Last action: {{ lastAction || 'None' }}
        </div>
        <div v-if="loading" class="text-blue-600">Loading...</div>
        <div v-if="lastError" class="text-red-600">Error: {{ lastError }}</div>
        <pre
          v-if="lastResponse"
          class="rounded p-3 text-xs overflow-auto bg-gray-100 dark-bg-gray-800 text-gray-900 dark:text-gray-300 dark:bg-gray-900 dark:text-gray-100"
        >{{ JSON.stringify(lastResponse, null, 2) }}</pre>
      </div>
    </UCard>
  </div>
</template>

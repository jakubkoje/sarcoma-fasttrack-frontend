<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useApiClient } from '~/services/apiClient'
import { definePageMeta, useRuntimeConfig, useRouter, useToast } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { $fetch } from 'ofetch'
import type { ReportRead, UserRead } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const api = useApiClient()
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const data = ref<ReportRead[]>([])
const users = ref<UserRead[]>([])
const patientNameCache = ref<Map<number, string>>(new Map())
const organizationNameCache = ref<Map<number, string>>(new Map())

const userMap = computed(() => new Map(users.value.map((u) => [u.id, u])))

const statusLabels: Record<string, { label: string; color: 'neutral' | 'primary' | 'green'; bgColor: string; borderColor: string; textColor: string }> = {
  DRAFT: {
    label: 'Draft',
    color: 'neutral',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  ACTIVE: {
    label: 'Active',
    color: 'primary',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-400 dark:border-yellow-600',
    textColor: 'text-yellow-800 dark:text-yellow-300'
  },
  SUBMITTED: {
    label: 'Submitted',
    color: 'primary',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-400 dark:border-blue-600',
    textColor: 'text-blue-800 dark:text-blue-300'
  },
  SENT: {
    label: 'Sent',
    color: 'primary',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-400 dark:border-green-600',
    textColor: 'text-green-800 dark:text-green-300'
  },
  DONE: {
    label: 'Done',
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-400 dark:border-green-600',
    textColor: 'text-green-800 dark:text-green-300'
  },
  ERROR: {
    label: 'Error',
    color: 'neutral',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-400 dark:border-red-600',
    textColor: 'text-red-800 dark:text-red-300'
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'neutral',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    borderColor: 'border-rose-400 dark:border-rose-600',
    textColor: 'text-rose-800 dark:text-rose-300'
  }
}

const availableStatuses = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'SENT', label: 'Sent' },
  { value: 'DONE', label: 'Done' },
  { value: 'ERROR', label: 'Error' },
  { value: 'CANCELLED', label: 'Cancelled' }
]

const updatingStatus = ref<Set<number>>(new Set())
const toast = useToast()

const columns: ColumnDef<ReportRead>[] = [
  { accessorKey: 'id', header: '#', cell: ({ row }) => `#${row.original.id}` },
  {
    accessorKey: 'patient_id',
    header: 'Patient',
    cell: ({ row }) => {
      const id = row.original.patient_id
      return patientNameCache.value.get(id) || `#${id}`
    }
  },
  {
    accessorKey: 'practitioner_id',
    header: 'Doctor',
    cell: ({ row }) => practitionerName(row.original.doctor_id)
  },
  {
    accessorKey: 'target_organization_id',
    header: 'Organization',
    cell: ({ row }) => {
      const id = row.original.target_organization_id
      return organizationNameCache.value.get(id) || `#${id}`
    }
  },
  { id: 'severity', accessorKey: 'severity', header: 'Severity' },
  { id: 'status', accessorKey: 'status', header: 'Status' }
]

const fetchPatientName = async (id: number): Promise<string> => {
  if (patientNameCache.value.has(id)) {
    return patientNameCache.value.get(id)!
  }

  try {
    const baseURL = config.public.apiBase || ''
    const token = auth.validToken.value
    const response = await $fetch<{ name: string }>(`/api/v1/patients/${id}/name`, {
      baseURL,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    const name = response?.name || `#${id}`
    patientNameCache.value.set(id, name)
    return name
  } catch {
    const fallback = `#${id}`
    patientNameCache.value.set(id, fallback)
    return fallback
  }
}

const fetchOrganizationName = async (id: number): Promise<string> => {
  if (organizationNameCache.value.has(id)) {
    return organizationNameCache.value.get(id)!
  }

  try {
    const baseURL = config.public.apiBase || ''
    const token = auth.validToken.value
    const response = await $fetch<{ name: string }>(`/api/v1/organizations/${id}/name`, {
      baseURL,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    const name = response?.name || `#${id}`
    organizationNameCache.value.set(id, name)
    return name
  } catch {
    const fallback = `#${id}`
    organizationNameCache.value.set(id, fallback)
    return fallback
  }
}

const loadReports = async () => {
  isLoading.value = true
  try {
    const [reports, userList] = await Promise.all([
      api.listReports(),
      api.listUsers()
    ])

    // Add mock severity data to each report
    const reportsWithSeverity = reports.map((report, index) => ({
      ...report,
      severity: !report.severity ? (index % 3 === 0 ? '1' : index % 3 === 1 ? '2' : '3') : report.severity
    }))

    data.value = reportsWithSeverity as typeof reports
    users.value = userList

    // Fetch all unique patient and organization names
    const patientIds = new Set(reports.map(r => r.patient_id))
    const orgIds = new Set(reports.map(r => r.target_organization_id))

    const namePromises = []

    for (const patientId of patientIds) {
      namePromises.push(fetchPatientName(patientId))
    }

    for (const orgId of orgIds) {
      namePromises.push(fetchOrganizationName(orgId))
    }

    await Promise.all(namePromises)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadReports)

const handleRowClick = (id: number) => {
  if (id) void router.push(`/reports/${id}`)
}

const editReport = (id: number) => {
  void router.push(`/sarcoma-form?edit=${id}`)
}

const deleteReport = (id: number) => {
  console.log('Deleting report', id)
}

function practitionerName(id: number) {
  const user = userMap.value.get(id)
  return user?.email || `#${id}`
}

const updateStatus = async (reportId: number, newStatus: string) => {
  updatingStatus.value.add(reportId)
  try {
    const updated = await api.updateReportStatus(reportId, newStatus)
    // Update the report in the data array
    const index = data.value.findIndex(r => r.id === reportId)
    if (index !== -1) {
      data.value[index] = updated
    }
    toast.add({
      title: 'Status changed',
      description: `Status was changed to "${statusLabels[newStatus]?.label || newStatus}"`
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Status change failed'
    toast.add({ title: 'Error', description: message })
  } finally {
    updatingStatus.value.delete(reportId)
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-3">
          Reports overview
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          List of all submitted forms with patient information
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <UCard class="border-l-4 border-l-red-500">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Critical (Severity 1)</p>
              <p class="text-2xl font-bold text-red-700">{{ data.filter(r => (r as any).severity === 1).length }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p class="text-2xl font-bold text-gray-900">{{ data.filter(r => r.status === 'PENDING').length }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Sent</p>
              <p class="text-2xl font-bold text-gray-900">{{ data.filter(r => r.status === 'SENT').length }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
              <p class="text-2xl font-bold text-gray-900">{{ data.filter(r => r.status === 'DRAFT').length }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">All reports</h3>
            <UButton
              color="primary"
              icon="i-lucide-plus"
              @click="router.push('/sarcoma-form')"
            >
              New record
            </UButton>
          </div>
        </template>

        <UTable
          :data="data"
          :columns="columns"
          :loading="isLoading"
          :on-select="(event, row) => handleRowClick(row.original.id)"
          class="[&_tbody_tr]:cursor-pointer [&_tbody_tr]:hover:bg-primary-50 dark:[&_tbody_tr]:hover:bg-gray-800 [&_tbody_tr]:transition-colors"
        >
          <template #severity-cell="{ row }">
            <div v-if="row.original.severity">
              <div
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 font-medium text-sm',
                  row.original.severity === '1'
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300'
                    : row.original.severity === '2'
                    ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600 text-orange-800 dark:text-orange-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300'
                ]"
              >
                <span>{{ row.original.severity === '1' ? 'High' : row.original.severity === '2' ? 'Medium' : 'Low' }}</span>
              </div>
            </div>
            <span v-else class="text-gray-400">—</span>
          </template>

          <template #status-cell="{ row }">
            <div
              v-if="statusLabels[row.original.status]"
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 font-medium text-sm',
                statusLabels[row.original.status]?.bgColor || 'bg-gray-100',
                statusLabels[row.original.status]?.borderColor || 'border-gray-300',
                statusLabels[row.original.status]?.textColor || 'text-gray-700'
              ]"
            >
              <span>{{ statusLabels[row.original.status]?.label || row.original.status }}</span>
            </div>
            <div
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-700 font-medium text-sm"
            >
              <span>{{ row.original.status }}</span>
            </div>
          </template>
        </UTable>

        <template #footer v-if="data.length === 0">
          <UEmpty
            icon="i-lucide-file-x"
            title="No reports"
            description="No forms have been created yet."
          >
            <UButton
              color="primary"
              @click="router.push('/sarcoma-form')"
            >
              Create first form
            </UButton>
          </UEmpty>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

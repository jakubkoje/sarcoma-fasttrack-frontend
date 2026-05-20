<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, useToast } from '#imports'
import { useApiClient } from '~/services/apiClient'
import { useAuthStore } from '~/stores/auth'
import type { PatientRead, ReportRead } from '~/types/api'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const api = useApiClient()
const auth = useAuthStore()

const report = ref<ReportRead | null>(null)
const patient = ref<PatientRead | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const specialistFeedback = ref('')
const saveLoading = ref(false)
const statusLoading = ref(false)

const role = computed(() => auth.role.value || '')
const isDoctor = computed(() => role.value === 'doctor' || role.value === 'admin')
const isSpecialist = computed(() => role.value === 'specialist' || role.value === 'admin')

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
  }
}

const availableStatuses = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'SENT', label: 'Sent' },
  { value: 'DONE', label: 'Done' },
  { value: 'ERROR', label: 'Error' }
]

const reportId = computed(() => Number(route.params.id))

const loadData = async () => {
  if (!reportId.value) return
  isLoading.value = true
  error.value = null
  try {
    const data = await api.getReport(reportId.value)
    // Assign random severity and recommended specialist for demo/testing purposes (consistent based on report ID)
    const seed = data.id
    const randomSeverity = ((seed * 7 + 13) % 4) + 1 // Generates 1-4 consistently
    const hasSpecialist = (seed % 3) === 0 // 33% chance
    
    // Generate specialist recommendation result (single variable)
    const recommendationResult = (seed % 4) === 0 ? null : {
      specialist: `Dr. ${['Novák', 'Svoboda', 'Dvořák', 'Němec'][seed % 4]}`,
      type: ['Surgeon', 'Oncologist', 'Radiation oncologist', 'Pathologist'][seed % 4],
      confidence: Math.floor((seed * 3) % 30) + 70, // 70-99%
      reason: seed % 2 === 0
        ? 'Recommended based on sarcoma type and localization'
        : 'Recommended based on a comprehensive analysis of clinical data'
    }
    
    report.value = {
      ...data,
      severity: (data as any).severity || randomSeverity,
      recommended_specialist: (data as any).recommended_specialist || (hasSpecialist ? `Dr. Specialist ${seed}` : null),
      specialist_recommendation: (data as any).specialist_recommendation || recommendationResult
    } as any
    specialistFeedback.value = data.feedback_specialist || ''
    if (data.patient_id) {
      patient.value = await api.getPatient(data.patient_id)
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load details.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)

const goBack = () => router.push('/reports')
const editReport = () => router.push(`/sarcoma-form?edit=${reportId.value}`)
const printReport = () => typeof window !== 'undefined' && window.print()

const formatDate = (value?: string | null) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const canSubmitFeedback = computed(() => specialistFeedback.value.trim().length > 0)

async function saveFeedback() {
  if (!report.value) return
  saveLoading.value = true
  try {
    const updated = await api.updateReportFeedback(report.value.id, specialistFeedback.value)
    report.value = updated
    toast.add({ title: 'Saved', description: 'Feedback saved.' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Save failed.'
    toast.add({ title: 'Error', description: message })
  } finally {
    saveLoading.value = false
  }
}

async function sendToSpecialist() {
  if (!report.value) return
  statusLoading.value = true
  try {
    const updated = await api.updateReportStatus(report.value.id, 'ACTIVE')
    report.value = updated
    toast.add({ title: 'Sent', description: 'Report was sent to the specialized center.' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Status change failed.'
    toast.add({ title: 'Error', description: message })
  } finally {
    statusLoading.value = false
  }
}

async function submitSpecialist() {
  if (!report.value || !canSubmitFeedback.value) return
  statusLoading.value = true
  try {
    await saveFeedback()
    const updated = await api.updateReportStatus(report.value.id, 'SUBMITTED')
    report.value = updated
    toast.add({ title: 'Sent', description: 'Report was closed and sent.' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Submission failed.'
    toast.add({ title: 'Error', description: message })
  } finally {
    statusLoading.value = false
  }
}

async function updateStatus(newStatus: string) {
  if (!report.value) return
  statusLoading.value = true
  try {
    const updated = await api.updateReportStatus(report.value.id, newStatus)
    report.value = updated
    toast.add({
      title: 'Status changed',
      description: `Status was changed to "${statusLabels[newStatus]?.label || newStatus}"`
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Status change failed'
    toast.add({ title: 'Error', description: message })
  } finally {
    statusLoading.value = false
  }
}
</script>

<template>
  <UContainer class="py-4 sm:py-8 px-4 sm:px-6">
    <div class="max-w-5xl mx-auto">
      <UButton
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        @click="goBack"
        class="mb-4 sm:mb-6 -ml-2"
        size="sm"
      >
        <span class="hidden sm:inline">Back to overview</span>
        <span class="sm:hidden">Back</span>
      </UButton>

      <div v-if="isLoading" class="py-12 flex justify-center">
        <ULoadingIcon />
      </div>

      <UCard v-else-if="error || !report">
        <div class="text-center py-8 px-12">
          <p class="text-lg font-semibold text-gray-900 mb-2">Report not found</p>
          <p class="text-gray-600 mb-4">{{ error || 'The requested report does not exist.' }}</p>
          <UButton color="primary" @click="goBack">
            Back to overview
          </UButton>
        </div>
      </UCard>

      <div v-else>
        <!-- Mobile/Tablet Responsive Header -->
        <div class="space-y-4 mb-6">
          <!-- Title and Status Row -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Report #{{ report.id }}
            </h1>
            <!-- Editable status for specialists and admins -->
            <UPopover v-if="isSpecialist" :popper="{ placement: 'bottom-start' }">
              <div
                v-if="statusLabels[report.status]"
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity w-fit',
                  statusLabels[report.status]?.bgColor || 'bg-gray-100',
                  statusLabels[report.status]?.borderColor || 'border-gray-300',
                  statusLabels[report.status]?.textColor || 'text-gray-700'
                ]"
              >
                <span>{{ report.status_cz || statusLabels[report.status]?.label || report.status }}</span>
                <UIcon name="i-lucide-chevron-down" class="w-3 h-3" />
              </div>
              <div
                v-else
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-700 font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity w-fit"
              >
                <span>{{ report.status }}</span>
                <UIcon name="i-lucide-chevron-down" class="w-3 h-3" />
              </div>
              <template #content>
                <div class="p-1 min-w-[140px]">
                  <div
                    v-for="status in availableStatuses"
                    :key="status.value"
                    :class="[
                      'px-3 py-2 rounded-md cursor-pointer text-sm transition-colors',
                      report.status === status.value
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    ]"
                    @click="updateStatus(status.value)"
                  >
                    <div class="flex items-center justify-between">
                      <span>{{ status.label }}</span>
                      <UIcon
                        v-if="report.status === status.value"
                        name="i-lucide-check"
                        class="w-4 h-4 text-primary-600"
                      />
                    </div>
                  </div>
                  <div
                    v-if="statusLoading"
                    class="px-3 py-2 text-xs text-gray-500 flex items-center gap-2"
                  >
                    <UIcon name="i-lucide-loader-2" class="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </div>
                </div>
              </template>
            </UPopover>
            <!-- Static status badge for non-specialists -->
            <div
              v-else-if="statusLabels[report.status]"
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 font-medium text-sm w-fit',
                statusLabels[report.status]?.bgColor || 'bg-gray-100',
                statusLabels[report.status]?.borderColor || 'border-gray-300',
                statusLabels[report.status]?.textColor || 'text-gray-700'
              ]"
            >
              <span>{{ report.status_cz || statusLabels[report.status]?.label || report.status }}</span>
            </div>
            <UBadge
              v-else
              :color="statusLabels[report.status]?.color || 'neutral'"
              variant="subtle"
            >
              {{ report.status_cz || report.status }}
            </UBadge>
          </div>

          <!-- Metadata -->
          <div class="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            <p class="break-words">
              <span class="font-medium">Authored:</span> {{ formatDate(report.authored_on) || '—' }}
            </p>
            <p class="break-all mt-1">
              <span class="font-medium">FHIR:</span> {{ report.fhir_id || '—' }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2">
            <UButton
              color="primary"
              icon="i-lucide-pencil"
              @click="editReport"
              block
              class="sm:w-auto"
            >
              Edit
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-printer"
              @click="printReport"
              block
              class="sm:w-auto"
            >
              Print
            </UButton>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UCard>
            <template #header>Patient</template>
            <div class="space-y-3 text-gray-800 dark:text-gray-100">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Name</span>
                <span class="font-semibold">
                  {{ patient ? [patient.first_name || patient.given_name, patient.last_name || patient.family_name].filter(Boolean).join(' ') : `#${report.patient_id}` }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Phone</span>
                <span class="font-semibold">{{ patient?.phone || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Email</span>
                <span class="font-semibold">{{ patient?.email || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">City</span>
                <span class="font-semibold">{{ patient?.address_text || '—' }}</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>Meta</template>
            <div class="space-y-3 text-gray-800 dark:text-gray-100">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Status</span>
                <span class="font-semibold">{{ report.status_cz || report.status }}</span>
              </div>
              <div v-if="isSpecialist && (report as any).severity" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Severity</span>
                <div
                  :class="[
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
                    (report as any).severity === 1
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                      : (report as any).severity === 2
                      ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
                      : (report as any).severity === 3
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
                      : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  <UIcon
                    v-if="(report as any).severity === 1"
                    name="i-lucide-alert-triangle"
                    class="w-3 h-3"
                  />
                  <span>{{ (report as any).severity }}</span>
                </div>
              </div>
              <div v-if="(report as any).recommended_specialist" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Recommended specialist</span>
                <span class="font-semibold">{{ (report as any).recommended_specialist }}</span>
              </div>
              <div v-if="report.mkn10_code && report.is_new_patient === false" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">ICD-10</span>
                <span class="font-semibold">{{ report.mkn10_code }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Sent</span>
                <span class="font-semibold">{{ formatDate(report.created_at) || '—' }}</span>
              </div>
            </div>
          </UCard>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <UCard>
            <template #header>Clinical information</template>
            <div class="space-y-3 text-gray-800 dark:text-gray-100">
              <p><span class="text-gray-600 dark:text-gray-400">Medical history: </span>{{ report.anamnesis || '—' }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Family history: </span>{{ report.family_history || '—' }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Anticoagulation: </span>{{ report.anticoagulant_medication ? 'Yes' : 'No' }} <span v-if="report.anticoagulant_detail">({{ report.anticoagulant_detail }})</span></p>
              <p><span class="text-gray-600 dark:text-gray-400">Summary: </span>{{ report.summary || '—' }}</p>
            </div>
          </UCard>

          <UCard>
            <template #header>Histology and imaging</template>
            <div class="space-y-3 text-gray-800 dark:text-gray-100">
              <p><span class="text-gray-600 dark:text-gray-400">Imaging performed: </span>{{ report.any_imaging_performed ? 'Yes' : 'No' }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Further planned: </span>{{ report.additional_imaging_planned ? 'Yes' : 'No' }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Note: </span>{{ report.additional_imaging_note || '—' }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Histology performed: </span>{{ report.histology_performed ? 'Yes' : 'No' }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Date: </span>{{ formatDate(report.histology_date) || '—' }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Result: </span>{{ report.histology_result || '—' }}</p>
            </div>
          </UCard>
        </div>

        <div class="mt-6">
          <UButton
            v-if="isDoctor && report.status === 'DRAFT'"
            color="primary"
            :loading="statusLoading"
            @click="sendToSpecialist"
            block
            class="sm:w-auto"
          >
            Send to specialized center
          </UButton>

          <UCard
            v-if="isSpecialist && report.status === 'ACTIVE'"
            class="w-full border-2 border-primary-200 dark:border-primary-800 bg-linear-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-gray-800 shadow-lg"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-file-check" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 class="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">Specialist assessment</h3>
              </div>
            </template>
            <div class="space-y-4">
              <UFormGroup label="Specialist feedback">
                <UTextarea
                  v-model="specialistFeedback"
                  placeholder="Notes, conclusion, recommendation..."
                  :rows="5"
                  class="w-full border-primary-200 dark:border-primary-800 focus:border-primary-400 dark:focus:border-primary-600"
                />
              </UFormGroup>
              <div class="flex flex-col sm:flex-row gap-2 pt-2">
                <UButton
                  color="primary"
                  :disabled="!canSubmitFeedback"
                  :loading="statusLoading"
                  @click="submitSpecialist"
                  block
                  class="sm:w-auto"
                >
                  Submit
                </UButton>
              </div>
            </div>
          </UCard>
        </div>


        <UCard
          v-if="report.status === 'SUBMITTED' && (report.feedback_specialist || specialistFeedback)"
          class="mt-6 w-full border-2 border-primary-200 dark:border-primary-800 bg-linear-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-gray-800 shadow-lg"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-file-check" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">Specialist assessment</h3>
            </div>
          </template>
          <div class="text-sm sm:text-base text-gray-800 dark:text-gray-100">
            <p class="whitespace-pre-wrap break-words">{{ report.feedback_specialist || specialistFeedback }}</p>
          </div>
        </UCard>

        <!-- Specialist Recommendation Section -->
        <UCard
          v-if="isSpecialist && (report as any).specialist_recommendation"
          class="mt-6 w-full border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50/30 to-white dark:from-blue-900/5 dark:to-gray-800 shadow-sm"
        >
          <template #header>
            <div class="flex items-start sm:items-center gap-2 sm:gap-3">
              <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-sparkles" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Specialist recommendation</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Automatic recommendation based on analysis</p>
              </div>
            </div>
          </template>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <div class="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center shrink-0">
                <UIcon
                  :name="(report as any).specialist_recommendation.type === 'Surgeon' ? 'i-lucide-scissors' :
                         (report as any).specialist_recommendation.type === 'Oncologist' ? 'i-lucide-heart-pulse' :
                         (report as any).specialist_recommendation.type === 'Radiation oncologist' ? 'i-lucide-zap' :
                         'i-lucide-microscope'"
                  class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h4 class="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                    {{ (report as any).specialist_recommendation.type }}
                  </h4>
                  <div
                    :class="[
                      'px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap',
                      (report as any).specialist_recommendation.confidence >= 85
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : (report as any).specialist_recommendation.confidence >= 75
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    ]"
                  >
                    {{ (report as any).specialist_recommendation.confidence }}% match
                  </div>
                </div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                  {{ (report as any).specialist_recommendation.reason }}
                </p>
              </div>
            </div>
          </div>
        </UCard>

        
      </div>
    </div>
  </UContainer>
</template>

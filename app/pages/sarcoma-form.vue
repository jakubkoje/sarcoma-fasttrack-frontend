<script setup lang="ts">
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import * as z from 'zod'
import { useSarcomaFormStore } from '~/stores/sarcomaForm'
import { useApiClient } from '~/services/apiClient'
import type { PatientCreate, ReportCreate } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})


// Care center options
const careCenters = [
  { label: 'Masarykův onkologický ústav', value: 'mos' },
  { label: 'FN Motol', value: 'fn-motol' }
]

// Patient type options
const patientTypes = [
  { value: 'new', label: 'Nový pacient' },
  { value: 'existing', label: 'Existující pacient' }
]

// Imaging options
const imagingOptions = [
  { value: 'sonografie', label: 'Sonografie' },
  { value: 'ct', label: 'CT' },
  { value: 'pet-ct', label: 'PET' },
  { value: 'pet-mri', label: 'MRI' }
]

// Insurance companies
const insuranceCompanies = [
  { value: 'vzp', label: 'VZP' },
  { value: 'vozp', label: 'VOZP' },
  { value: 'cpzp', label: 'ČPZP' },
  { value: 'ozp', label: 'OZP' },
  { value: 'zpsms', label: 'ZPSMS' },
  { value: 'zpmvcr', label: 'ZPMV ČR' },
  { value: 'rbp', label: 'RBP' }
]

// MKN10 options
const mkn10Options = [
  { value: 'C49.0', label: 'C49.0 - Pojivová a měkká tkáň hlavy‚ obličeje a krku' },
  { value: 'C49.1', label: 'C49.1 - Pojivová a měkká tkáň horní končetiny včetně ramene' },
  { value: 'C49.2', label: 'C49.2 - Pojivová a měkká tkáň dolní končetiny včetně boku' },
  { value: 'C49.3', label: 'C49.3 - Pojivová a měkká tkáň hrudníku' },
  { value: 'C49.4', label: 'C49.4 - Pojivová a měkká tkáň břicha' }
]

const { formData, currentStep, reset } = useSarcomaFormStore()

// Stepper steps
const isMobile = useMediaQuery('(max-width: 767px)')
const steps = computed(() => [
  {
    title: 'Centrum péče',
    value: 0
  },
  {
    title: 'Typ pacienta',
    value: 1
  },
  {
    title: 'Kontakt na pacienta',
    value: 2
  },
  {
    title: 'Zobrazovací vyšetření',
    value: 3
  },
  {
    title: 'Anamnéza',
    value: 4
  },
  {
    title: formData.value.patientType === 'existing' ? 'Diagnostický souhrn' : 'Histologická verifikace',
    value: 5
  },
  {
    title: 'Finalizace',
  },
  {
    title: 'Shrnutí',
    ui: {
      indicator: 'w-10 h-10 text-lg font-bold'
    }
  }
])
const stepperOrientation = computed(() => isMobile.value ? 'vertical' : 'horizontal')

watch(steps, (items) => {
  const maxIndex = items.length - 1
  if (currentStep.value > maxIndex) currentStep.value = maxIndex
  if (currentStep.value < 0) currentStep.value = 0
})

// Validation schemas
const step2Schema = z.object({
  firstName: z.string().min(1, 'Povinné pole'),
  lastName: z.string().min(1, 'Povinné pole'),
  address: z.string().min(1, 'Povinné pole'),
  insurance: z.string().min(1, 'Vyberte pojišťovnu'),
  birthNumber: z.string().min(1, 'Povinné pole'),
  phone: z.string().min(1, 'Povinné pole'),
  email: z.string().email('Neplatný email').optional().or(z.literal(''))
})

const toast = useToast()

// Navigation handlers
const canProceed = computed(() => {
  // Step 0: Care center selection
  if (currentStep.value === 0) {
    return formData.value.careCenter !== ''
  }

  // Step 1: Patient type
  if (currentStep.value === 1) {
    return formData.value.patientType !== ''
  }

  // Step 2: Contact info
  if (currentStep.value === 2) {
    try {
      console.log('Full formData:', formData.value)
      const data = {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        address: formData.value.address,
        insurance: formData.value.insurance,
        birthNumber: formData.value.birthNumber,
        phone: formData.value.phone,
        email: formData.value.email
      }
      console.log('Extracted data for validation:', data)
      console.log('Field values:', {
        firstName: `"${formData.value.firstName}" (length: ${formData.value.firstName.length})`,
        lastName: `"${formData.value.lastName}" (length: ${formData.value.lastName.length})`,
        insurance: `"${formData.value.insurance}" (length: ${formData.value.insurance.length})`
      })
      step2Schema.parse(data)
      console.log('Step 2 validation passed')
      return true
    } catch (e) {
      console.error('Step 2 validation failed:', e)
      return false
    }
  }

  // Step 3: Imaging examination (must have at least 1 imaging selected with date and description)
  if (currentStep.value === 3) {
    if (formData.value.selectedImaging.length === 0) {
      return false
    }
    // Check that each selected imaging has date and description filled
    return formData.value.selectedImaging.every((imaging: string) => {
      const details = formData.value.imagingDetails[imaging]
      return details && details.date && details.description
    })
  }

  // Step 4: Anamneza
  if (currentStep.value === 4) {
    // Existing patients can skip this step since they likely have medical history on file
    if (formData.value.patientType === 'existing') {
      return true
    }
    return formData.value.anamneza !== ''
  }

  // Step 5: Histological verification or Diagnostic Summary
  if (currentStep.value === 5) {
    if (formData.value.patientType === 'existing') {
      return formData.value.mkn10 !== '' && formData.value.diagnosticSummary !== ''
    }
    // For new patients: if they selected "yes" for histological verification, validate date and results
    if (formData.value.histologicalVerification === 'yes') {
      return formData.value.histologicalDate !== '' && formData.value.histologicalResults !== ''
    }
    // If they selected "no" or haven't selected yet, they can still proceed
    return formData.value.histologicalVerification !== ''
  }

  // Step 6: Finalizace (no specific validation - optional fields)
  if (currentStep.value === 6) {
    return true
  }

  // Step 7: Summary (always allow proceeding - just a review step)
  if (currentStep.value === 7) {
    return true
  }

  return true
})

const nextStep = () => {
  // Step 3: Check if at least one imaging is selected
  if (currentStep.value === 3 && formData.value.selectedImaging.length === 0) {
    toast.add({
      title: 'Upozornění',
      description: 'Musíte vybrat alespoň jeden typ zobrazovacího vyšetření.'
    })
    return
  }

  if (currentStep.value < steps.value.length - 1 && canProceed.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Handle imaging selection
const handleImagingChange = (selected: string[]) => {
  // Initialize details for new selections
  selected.forEach(imaging => {
    if (!formData.value.imagingDetails[imaging]) {
      formData.value.imagingDetails[imaging] = { date: '', description: '' }
      // Default to open for new selections
      formData.value.openImagingDetails[imaging] = true
    }
  })

  // Remove details for unselected items
  Object.keys(formData.value.imagingDetails).forEach(key => {
    if (!selected.includes(key)) {
      delete formData.value.imagingDetails[key]
      delete formData.value.openImagingDetails[key]
    }
  })
}

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    formData.value.attachments = Array.from(target.files)
  }
}

// ePacs file upload handler
const handleEPacsFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    formData.value.ePacsFiles = Array.from(target.files)
  }
}

// Save as draft
const saveAsDraft = () => {
  console.log('Saving draft:', formData.value)

  toast.add({
    title: 'Uloženo',
    description: 'Formulář byl uložen jako koncept'
  })

  // TODO: Save draft to backend/localStorage
}

// Form submission
const isSubmitting = ref(false)

const submitForm = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  const api = useApiClient()

  try {
    // Step 1: Create or find patient
    let patientId: number
    try {
      // Try to create patient first
      const patientData: PatientCreate = {
        first_name: formData.value.firstName,
        last_name: formData.value.lastName,
        address: formData.value.address,
        birth_number: formData.value.birthNumber,
        phone: formData.value.phone,
        email: formData.value.email || null
      }
      const createdPatient = await api.createPatient(patientData)
      patientId = createdPatient.id
    } catch (error) {
      // If patient creation fails, try to find existing patient
      // For now, we'll rethrow - in production you might want to search by birth_number
      throw error
    }

    // Step 2: Map care center to organization ID
    // TODO: Replace fixed organization with value from user/session when available
    const targetOrganizationId = 14

    // Step 3: Get practitioner ID from current user
    // TODO: Get from user session - using temporary fixed ID
    const practitionerId = 19

    // Step 4: Prepare imaging notes
    const imagingNotes = formData.value.selectedImaging
      .map((imaging: string) => {
        const details = formData.value.imagingDetails[imaging]
        const label = imagingOptions.find(o => o.value === imaging)?.label || imaging
        return `${label}: ${details?.date || 'N/A'} - ${details?.description || 'N/A'}`
      })
      .join('\n\n')

    // Step 5: Prepare additional imaging note
    const additionalImagingNote = formData.value.furtherExaminations
      .map((exam: { date: string; description: string }, idx: number) => `Vyšetření ${idx + 1} (${exam.date}): ${exam.description}`)
      .join('\n\n')

    // Step 6: Prepare report payload
    const reportPayload: ReportCreate = {
      patient_id: patientId,
      doctor_id: practitionerId,
      target_organization_id: targetOrganizationId,
      status: 'DRAFT',
      is_new_patient: formData.value.patientType === 'new',
      any_imaging_performed: formData.value.selectedImaging.length > 0,
      additional_imaging_planned: formData.value.furtherExaminations.length > 0,
      additional_imaging_note: additionalImagingNote || null,
      anamnesis: formData.value.anamneza || null,
      mkn10_code: formData.value.mkn10 || null,
      family_history: formData.value.familyPredispositions || null,
      anticoagulant_medication: formData.value.bloodThinners === 'yes',
      anticoagulant_detail: formData.value.bloodThinnersDetails || null,
      histology_performed: formData.value.histologicalVerification === 'yes',
      histology_date: formData.value.histologicalDate || null,
      histology_result: formData.value.histologicalResults || null,
      summary: formData.value.summaryNotes || null,
      // TODO: Handle file uploads - attachment_path might need file upload endpoint first
      attachment_path: formData.value.attachments.length > 0 
        ? formData.value.attachments.map((f: File) => f.name).join(', ') 
        : null,
      note: imagingNotes || null
    }

    // Step 7: Create report
    const report = await api.createReport(reportPayload)

    toast.add({
      title: 'Úspěch',
      description: 'Formulář byl úspěšně odeslán.'
    })

    // Step 8: Reset form completely and navigate
    reset()
    // Ensure step is reset to first step
    currentStep.value = 0
    
    navigateTo('/reports')
  } catch (error) {
    console.error('Error submitting form:', error)
    const errorMessage = error instanceof Error ? error.message : 'Nepodařilo se odeslat formulář.'
    toast.add({
      title: 'Chyba',
      description: errorMessage
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-5xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-300 mb-3">
            Pacient s podezřením na sarkom
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Formulář pro rychlé předání pacienta do specializovaného centra sarkomů
          </p>
        
        </div>

        <div class="rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700">
          <!-- Progress Section -->
          <div class="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-400">Průběh vyplňování</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 dark:bg-gray-800 text-primary-700 text-xs font-semibold">
                  {{ currentStep + 1 }}/{{ steps.length }}
                </span>
              </div>
              <UButton
                color="neutral"
                variant="outline"
                size="md"
                @click="saveAsDraft"
                class="w-full sm:w-auto"
              >
                Uložit koncept
              </UButton>
            </div>
          </div>

          <div class="p-6 md:p-8">
            <UStepper
              v-model="currentStep"
              :items="steps"
              color="primary"
              :orientation="stepperOrientation"
              disabled
              class="mb-10"
            />

            <!-- Step 0: Care Center Selection -->
            <div v-show="currentStep === 0" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Výběr centra péče</h3>
                <p class="text-gray-600 dark:text-gray-400">Vyberte specializované centrum, kam chcete pacienta předat</p>
              </div>

              <UFormField
                required
              >
                <UInputMenu
                  v-model="formData.careCenter"
                  :items="careCenters"
                  value-key="value"
                  placeholder="Vyberte centrum..."
                  size="lg"
                  class="max-w-md"
                />
              </UFormField>

            
            </div>

            <!-- Step 1: Patient Type -->
            <div v-show="currentStep === 1" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Typ pacienta</h3>
                <p class="text-gray-600">Vyberte, zda se jedná o nového nebo existujícího pacienta</p>
              </div>

              <UFormField
                required
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <label
                    v-for="option in patientTypes"
                    :key="option.value"
                    :class="[
                      'relative flex cursor-pointer rounded-lg border p-6 transition-all',
                      formData.patientType === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-gray-800 dark:text-gray-300 ring-2 ring-primary-500'
                        : 'border-gray-300 hover:border-gray-400 dark:text-gray-300'
                    ]"
                  >
                    <div class="flex items-start w-full">
                      <div class="flex items-center h-6">
                        <input
                          type="radio"
                          v-model="formData.patientType"
                          :value="option.value"
                          class="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                      </div>
                      <div class="ml-4 flex-1">
                        <div class="text-lg font-semibold text-gray-900 dark:text-gray-300">
                          {{ option.label }}
                        </div>
                        <div class="mt-1 text-sm text-gray-500 dark:text-gray-300">
                          {{ option.value === 'new' ? 'První vyšetření, podezření na sarkom' : 'Pacient s existující diagnózou, kontrola nebo konzultace' }}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </UFormField>
            </div>

            <!-- Step 2: Contact Information -->
            <div v-show="currentStep === 2" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Kontaktní údaje pacienta</h3>
                <p class="text-gray-600">Základní identifikační informace pro registraci pacienta</p>
              </div>

              <div class="border-l-4 border-primary-500 rounded-r-xl p-5 mb-8">
                <div class="flex items-start gap-3">
                  <div class="shrink-0 mt-0.5">
                    <svg class="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-primary-900 mb-1">Ochrana osobních údajů</p>
                    <p class="text-sm text-primary-800">Všechny údaje jsou šifrovány a zpracovávány v souladu s GDPR.</p>
                  </div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-md">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900 dark:text-gray-300">Osobní údaje</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300">Identifikační údaje dle občanského průkazu</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-6 space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormField label="Jméno" required>
                      <UInput
                        v-model="formData.firstName"
                        placeholder="např. Jan"
                        size="lg"
                      />
                    </UFormField>

                    <UFormField label="Příjmení" required>
                      <UInput
                        v-model="formData.lastName"
                        placeholder="např. Novák"
                        size="lg"
                      />
                    </UFormField>
                  </div>

                  <UFormField label="Adresa trvalého bydliště" required>
                    <UInput
                      v-model="formData.address"
                      placeholder="např. Karlova 123, 110 00 Praha 1"
                      size="lg"
                    />
                  </UFormField>
                  
                </div>
              </div>

              <!-- Health Insurance -->
              <div class="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center shadow-md">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900 dark:text-gray-300">Zdravotní pojištění</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300">Údaje pro identifikaci v systému pojišťovny</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-6 space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormField label="Zdravotní pojišťovna" required>
                      <USelect
                        v-model="formData.insurance"
                        :items="insuranceCompanies"
                        placeholder="Vyberte pojišťovnu"
                        size="lg"
                      />
                    </UFormField>

                    <UFormField label="Rodné číslo" required>
                      <UInput
                        v-model="formData.birthNumber"
                        placeholder="123456/7890"
                        size="lg"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>

              <!-- Contact Details -->
              <div class="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-md">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900 dark:text-gray-300">Kontaktní informace</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300">Pro komunikaci se specializovaným centrem</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-6 space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormField label="Telefonní číslo" required>
                      <UInput
                        v-model="formData.phone"
                        placeholder="+420 123 456 789"
                        type="tel"
                        size="lg"
                      />
                    </UFormField>

                    <UFormField label="E-mailová adresa">
                      <UInput
                        v-model="formData.email"
                        placeholder="jmeno@example.com"
                        type="email"
                        size="lg"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Imaging Examination -->
            <div v-show="currentStep === 3" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Zobrazovací vyšetření</h3>
                <p class="text-gray-600">Informace o provedených diagnostických vyšetřeních</p>
              </div>

              <!-- Warning for new patients without imaging -->
              <div v-if="formData.patientType === 'new' && formData.selectedImaging.length === 0" class="rounded-lg bg-yellow-50 border-2 border-yellow-200 p-5">
                <div class="flex items-start gap-3">
                  <div class="shrink-0 mt-0.5">
                    <svg class="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-yellow-900 mb-1">Důležité upozornění</p>
                    <p class="text-sm text-yellow-800">Pokud nebylo provedeno žádné zobrazovací vyšetření, tak odešlete pacienta na vyšetření některou zobrazovací metodou.</p>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Provedená vyšetření</h4>
                  <p class="text-sm text-gray-600">Vyberte všechna zobrazovací vyšetření, která byla u pacienta provedena</p>
                </div>

                <UFormField
                  label="Typy zobrazovacích vyšetření"
                  required
                  description="Musí být vybráno alespoň jedno vyšetření"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                    <label
                      v-for="option in imagingOptions"
                      :key="option.value"
                      :class="[
                        'relative flex items-center cursor-pointer rounded-lg border p-4 transition-all',
                        formData.selectedImaging.includes(option.value)
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                          : 'border-gray-300 hover:border-gray-400'
                      ]"
                    >
                      <input
                        type="checkbox"
                        :checked="formData.selectedImaging.includes(option.value)"
                        @change="(e) => {
                          const checked = (e.target as HTMLInputElement).checked
                          if (checked) {
                            formData.selectedImaging.push(option.value)
                            handleImagingChange(formData.selectedImaging)
                          } else {
                            formData.selectedImaging = formData.selectedImaging.filter((v: string) => v !== option.value)
                            handleImagingChange(formData.selectedImaging)
                          }
                        }"
                        class="h-5 w-5 text-primary-600 border-gray-300 dark:border-gray-800 rounded focus:ring-primary-500"
                      />
                      <span class="ml-3 text-base font-medium text-gray-900">
                        {{ option.label }}
                      </span>
                    </label>
                  </div>
                </UFormField>
              </div>

              <!-- Details for each selected imaging -->
              <div v-if="formData.selectedImaging.length > 0" class="mt-10">
                <div class="border-l-4 border-primary-500 pl-6 mb-8">
                  <h4 class="text-xl font-bold text-gray-900 mb-2">Detaily vyšetření</h4>
                  <p class="text-sm text-gray-600">Doplňte datum a popis výsledků pro každé vyšetření</p>
                </div>

                <div class="space-y-8">
                  <div
                    v-for="imaging in formData.selectedImaging"
                    :key="imaging"
                    class="bg-white border-2 border-primary-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <!-- Imaging Type Header -->
                    <div class="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h4 class="text-2xl font-bold text-gray-900">
                          {{ imagingOptions.find(o => o.value === imaging)?.label || imaging }}
                        </h4>
                      </div>
                      <UButton
                        color="neutral"
                        variant="ghost"
                        icon="i-heroicons-chevron-down-20-solid"
                        :class="[
                          'transition-transform duration-200',
                          formData.openImagingDetails[imaging] ? 'transform rotate-180' : ''
                        ]"
                        @click="formData.openImagingDetails[imaging] = !formData.openImagingDetails[imaging]"
                      />
                    </div>

                    <!-- Form Fields with Better Spacing -->
                    <div v-show="formData.openImagingDetails[imaging]" class="space-y-6">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Datum vyšetření
                          <span class="text-red-500">*</span>
                        </label>
                        <UInput
                          v-model="formData.imagingDetails[imaging]!.date"
                          type="date"
                          size="xl"
                          class="max-w-xs"
                        />
                        <p class="text-xs text-gray-500 mt-2">Kdy bylo vyšetření provedeno</p>
                      </div>

                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                          Popis a výsledky vyšetření
                          <span class="text-red-500">*</span>
                        </label>
                        <UTextarea
                          v-model="formData.imagingDetails[imaging]!.description"
                          placeholder="Popište nálezy, velikost, lokalizaci, charakteristiku léze..."
                          :rows="5"
                          size="xl"
                          class="w-full font-mono text-sm"
                        />
                        <p class="text-xs text-gray-500 mt-2">
                          Uveďte: lokalizaci, velikost léze, charakteristiku, případné metastázy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Further Examinations -->
              <div class="space-y-6 mt-8">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Plánovaná vyšetření</h4>
                  <p class="text-sm text-gray-600">Informace o objednaných dalších vyšetřeních</p>
                </div>

                <div class="bg-white rounded-xl border-2 border-gray-200 dark:border-gray-800 shadow-sm p-6">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      :checked="formData.furtherExaminations.length > 0"
                      @change="(e) => {
                        const checked = (e.target as HTMLInputElement).checked
                        if (checked && formData.furtherExaminations.length === 0) {
                          formData.furtherExaminations.push({ date: '', description: '' })
                        } else if (!checked) {
                          formData.furtherExaminations = []
                        }
                      }"
                      class="h-5 w-5 text-primary-600 border-gray-300 dark:border-gray-800 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span class="text-base font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-600 transition-colors">
                        Je pacient objednán na nějaké další vyšetření?
                      </span>
                    </div>
                  </label>

                  <div v-if="formData.furtherExaminations.length > 0" class="mt-6 space-y-6">
                    <div
                      v-for="(exam, index) in formData.furtherExaminations"
                      :key="index"
                      class="pt-6 border-t-2 border-gray-200 dark:border-gray-700 space-y-6"
                    >
                      <div class="flex items-center justify-between mb-4">
                        <h5 class="text-lg font-bold text-gray-900 dark:text-gray-300">Vyšetření {{ index + 1 }}</h5>
                        <UButton
                          v-if="formData.furtherExaminations.length > 1"
                          color="neutral"
                          variant="ghost"
                          size="sm"
                          @click="formData.furtherExaminations.splice(index, 1)"
                        >
                          Odebrat
                        </UButton>
                      </div>

                      <div class="space-y-2">
                        <label class="block">
                          <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                            <svg class="w-4 h-4 text-primary-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Datum plánovaného vyšetření
                          </span>
                          <UInput
                            v-model="exam.date"
                            type="date"
                            size="lg"
                            class="shadow-sm max-w-xs"
                          />
                          <p class="text-xs text-gray-500 dark:text-gray-300 mt-2">Termín objednaného vyšetření</p>
                        </label>
                      </div>

                      <div class="space-y-2">
                        <label class="block">
                          <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                            <svg class="w-4 h-4 text-primary-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Specifikace vyšetření
                          </span>
                          <UTextarea
                            v-model="exam.description"
                            placeholder="např. MRI břicha s kontrastem pro upřesnění nálezu..."
                            :rows="4"
                            size="lg"
                            class="shadow-sm w-full"
                          />
                          <p class="text-xs text-gray-500 dark:text-gray-300 mt-2">Typ vyšetření a účel objednání</p>
                        </label>
                      </div>
                    </div>

                    <UButton
                      color="primary"
                      variant="outline"
                      size="lg"
                      class="w-full"
                      @click="formData.furtherExaminations.push({ date: '', description: '' })"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Přidat další vyšetření
                    </UButton>
                  </div>
                </div>
              </div>

              <!-- ePacs Upload Section -->
              <div class="space-y-6 mt-8">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-2">ePACS nahrání</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Nahrajte výsledky zobrazovacích vyšetření</p>
                </div>

                <div class="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      v-model="formData.ePacsUpload"
                      @change="() => { if (!formData.ePacsUpload) formData.ePacsFiles = [] }"
                      class="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span class="text-base font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-600 transition-colors">
                        Nahrát výsledky přes ePACS
                      </span>
                      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Nahrajte DICOM soubory nebo snímky ze zobrazovacích vyšetření
                      </p>
                    </div>
                  </label>

                  <div v-if="formData.ePacsUpload" class="mt-6">
                    <label class="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div class="flex flex-col items-center justify-center py-6">
                        <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="mb-2 text-base text-gray-700 dark:text-gray-300">
                          <span class="font-semibold">Klikněte pro výběr souborů</span> nebo přetáhněte
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-300">
                          DICOM soubor
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".dcm,.dicom,.jpg,.jpeg,.png,.pdf"
                        class="hidden"
                        @change="handleEPacsFileUpload"
                      />
                    </label>

                    <div v-if="formData.ePacsFiles.length > 0" class="mt-4 space-y-2">
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Nahrané soubory ({{ formData.ePacsFiles.length }}):</p>
                      <div class="bg-white rounded-lg border border-gray-200 divide-y max-h-60 overflow-y-auto">
                        <div
                          v-for="(file, index) in formData.ePacsFiles"
                          :key="index"
                          class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div class="flex items-center gap-3 flex-1 min-w-0">
                            <svg class="w-5 h-5 text-primary-600 dark:text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-900 dark:text-gray-300 truncate">{{ file.name }}</p>
                              <p class="text-xs text-gray-500 dark:text-gray-300">{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            @click="formData.ePacsFiles.splice(index, 1)"
                            class="text-red-600 hover:text-red-800 font-medium text-sm ml-4 shrink-0"
                          >
                            Odebrat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <UAlert
                color="primary"
                variant="soft"
                title="Sdílení výsledků"
                description="PROSÍM ZAŠLETE VÝSLEDKY ZOBRAZOVACÍCH METOD PŘES ePACS systém co nejdříve."
                class="mt-6"
              />
            </div>

            <!-- Step 4: Anamneza -->
            <div v-show="currentStep === 4" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Anamnéza pacienta</h3>
                <p class="text-gray-600">Lékařská historie a rodinné predispozice</p>
              </div>

              <div class="space-y-6">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Osobní anamnéza</h4>
                  <p class="text-sm text-gray-600">Uveďte relevantní informace o zdravotním stavu pacienta</p>
                </div>

                <UFormField
                  label="Anamnéza"
                  required
                  description="Důležité informace: předchozí onemocnění, chirurgické zákroky, aktuální léčba, chronická onemocnění"
                >
                  <UTextarea
                    v-model="formData.anamneza"
                    placeholder="Např.: Diabetes mellitus 2. typu na PAD, hypertenze, stav po operaci cholecystektomie 2018..."
                    :rows="8"
                    size="lg"
                    class="w-full"
                  />
                  <template #help>
                    <div class="text-sm text-gray-500 mt-2 space-y-1">
                      <p><strong>Zahrňte prosím:</strong></p>
                      <ul class="list-disc list-inside ml-4 space-y-1">
                        <li>Předchozí onkologická onemocnění</li>
                        <li>Chronická onemocnění</li>
                        <li>Operace a hospitalizace</li>
                        <li>Aktuální medikace</li>
                        <li>Alergie</li>
                      </ul>
                    </div>
                  </template>
                </UFormField>
              </div>

              <div class="space-y-6 mt-8">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Rodinná anamnéza</h4>
                  <p class="text-sm text-gray-600">Informace o výskytu onkologických onemocnění v rodině</p>
                </div>

                <UFormField
                  label="Rodinné predispozice"
                  description="Výskyt sarkomů nebo jiných nádorových onemocnění u příbuzných"
                >
                  <UTextarea
                    v-model="formData.familyPredispositions"
                    placeholder="Např.: Matka - karcinom prsu (60 let), otec - karcinom tlustého střeva (65 let)..."
                    :rows="5"
                    size="lg"
                    class="w-full"
                  />
                  <template #help>
                    <div class="text-sm text-gray-500 mt-2">
                      Uveďte stupeň příbuzenství, typ onemocnění a věk vzniku
                    </div>
                  </template>
                </UFormField>
              </div>
            </div>

            <!-- Step 5: Histological Verification / Diagnostic Summary -->
            <div v-show="currentStep === 5" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ formData.patientType === 'existing' ? 'Diagnostický souhrn' : 'Histologická verifikace' }}
                </h3>
                <p class="text-gray-600">
                  {{ formData.patientType === 'existing' ? 'Souhrnné informace o diagnóze' : 'Informace o biopsii a antikoagulační léčbě' }}
                </p>
              </div>

              <!-- Existing Patient: Diagnostic Summary -->
              <div v-if="formData.patientType === 'existing'" class="space-y-6">
                
                <div class="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                  <div class="px-6 py-4 border-b-2 border-gray-200 bg-gray-50 dark:bg-gray-800">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-md">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-lg font-bold text-gray-900">Diagnóza a souhrn</h4>
                        <p class="text-sm text-gray-600">Vyberte diagnózu dle MKN-10 a doplňte souhrn</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 space-y-10">
                    <UFormField
                      label="Diagnóza (MKN-10)"
                      required
                      description="Vyberte odpovídající kód diagnózy ze seznamu"
                      class="mb-12"
                    >
                      <UInputMenu
                        v-model="formData.mkn10"
                        :items="mkn10Options"
                        value-key="value"
                        placeholder="Vyberte diagnózu..."
                        size="lg"
                        class="w-full"
                        trailing-icon="i-heroicons-chevron-down-20-solid"
                      />
                    </UFormField>

                    <UFormField
                      label="Diagnostický souhrn"
                      required
                      description="Detailní popis diagnózy a stavu pacienta"
                      class="mt-12"
                    >
                      <UTextarea
                        v-model="formData.diagnosticSummary"
                        placeholder="Doplňte diagnostický souhrn..."
                        :rows="8"
                        size="lg"
                        class="w-full shadow-sm"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>

              <!-- New Patient: Histological Verification -->
              <div v-else class="space-y-6 mt-8">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Histologické vyšetření</h4>
                  <p class="text-sm text-gray-600">Informace o provedené biopsii a výsledcích</p>
                </div>

                <UFormField
                  label="Byla provedena histologická verifikace (biopsie)?"
                  description="Core-cut biopsie, incizní biopsie, excizní biopsie"
                >
                  <div class="flex gap-4 mt-3">
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        v-model="formData.histologicalVerification"
                        value="yes"
                        class="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span class="ml-2 text-base font-medium text-gray-900">Ano</span>
                    </label>
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        v-model="formData.histologicalVerification"
                        value="no"
                        class="h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span class="ml-2 text-base font-medium text-gray-900">Ne</span>
                    </label>
                  </div>
                </UFormField>

                <div v-if="formData.histologicalVerification === 'yes'" class="bg-white dark:bg-gray-800 rounded-xl border-2 border-primary-300 shadow-sm overflow-hidden mt-6">
                  <div class="px-6 py-4 bg-primary-50 dark:bg-gray-800 border-b-2 border-primary-200">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-md">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h5 class="text-lg font-bold text-primary-900">Výsledky histologického vyšetření</h5>
                        <p class="text-sm text-primary-800">Informace o provedené biopsii a výsledcích</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 space-y-6">
                    <div class="space-y-2">
                      <label class="block">
                        <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Datum histologického vyšetření
                          <span class="text-red-500">*</span>
                        </span>
                        <UInput
                          v-model="formData.histologicalDate"
                          type="date"
                          size="lg"
                          class="shadow-sm max-w-xs"
                        />
                        <p class="text-xs text-gray-500 mt-2">Kdy byla biopsie provedena</p>
                      </label>
                    </div>

                    <div class="space-y-2">
                      <label class="block">
                        <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Výsledek histologie a bližší popis
                          <span class="text-red-500">*</span>
                        </span>
                        <UTextarea
                          v-model="formData.histologicalResults"
                          placeholder="např. Core-cut biopsie, histologicky vřetenobuněčný tumor, pozitivní na SMA, Ki-67 20%..."
                          :rows="6"
                          size="lg"
                          class="shadow-sm w-full font-mono text-sm"
                        />
                        <p class="text-xs text-gray-500 mt-2">
                          Zahrňte typ biopsie, morfologický popis, imunohistochemické markery a jejich výsledky
                        </p>
                      </label>
                    </div>

                    <div class="rounded-lg bg-primary-50 dark:bg-gray-800 border border-primary-200 p-4">
                      <div class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-primary-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="text-sm text-primary-800">
                          <p class="font-semibold mb-1">Klíčové informace k uvedení:</p>
                          <ul class="list-disc list-inside space-y-1 ml-2">
                            <li>Typ biopsie (Core-cut, incizní, excizní)</li>
                            <li>Morfologický popis tumoru</li>
                            <li>Imunohistochemické markery (SMA, S100, CD34, Ki-67, atd.)</li>
                            <li>Stupeň malignity (grade)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="formData.histologicalVerification === 'no'" class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div class="text-sm text-yellow-800">
                    <strong>Doporučení:</strong> Histologická verifikace je klíčová pro správnou diagnózu a plánování léčby sarkomu. Pokud ještě nebyla provedena, bude pravděpodobně indikována specializovaným centrem.
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 6: Finalizace -->
            <div v-show="currentStep === 6" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Finalizace</h3>
                <p class="text-gray-600">Závěrečné poznámky a nahrání dokumentace</p>
              </div>

              <div class="bg-primary-50 dark:bg-gray-800 border-2 border-primary-200 rounded-xl p-6">
                <h4 class="text-lg font-bold text-gray-900 mb-1">Téměř hotovo!</h4>
                <p class="text-sm text-gray-700">
                  Prosím doplňte shrnutí případu a případně nahrajte související dokumentaci.
                </p>
              </div>

              <div class="space-y-6">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Klinické shrnutí</h4>
                  <p class="text-sm text-gray-600">Stručné shrnutí případu pro specializované centrum</p>
                </div>

                <UFormField
                  label="Shrnutí důvodu podezření na sarkom"
                  description="Klíčové informace, které by mělo specializované centrum vědět"
                >
                  <UTextarea
                    v-model="formData.summaryNotes"
                    placeholder="např. 65letý pacient s rychle rostoucí hmotou na stehně, sonograficky 8x6cm suspektní nádorová masa s neostře ohraničenými okraji, doporučuji rychlé konzultaci..."
                    :rows="8"
                    size="lg"
                    class="w-full"
                  />
                  <template #help>
                    <div class="text-sm text-gray-500 mt-2 space-y-1">
                      <p><strong>Důležité body k zahrnutí:</strong></p>
                      <ul class="list-disc list-inside ml-4 space-y-1">
                        <li>Hlavní důvod podezření na sarkom</li>
                        <li>Rychlost růstu léze</li>
                        <li>Klinické symptomy (bolest, funkční omezení)</li>
                        <li>Naléhavost případu</li>
                        <li>Specifické otázky pro specializované centrum</li>
                      </ul>
                    </div>
                  </template>
                </UFormField>
              </div>

              <div class="space-y-6 mt-8">
                <div class="border-l-4 border-primary-500 pl-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Přílohy</h4>
                  <p class="text-sm text-gray-600">Nahrání lékařských zpráv, snímků a další dokumentace</p>
                </div>

                <UFormField
                  label="Nahrání souborů"
                  description="Můžete nahrát více souborů najednou"
                >
                  <div class="mt-3">
                    <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-colors">
                      <div class="flex flex-col items-center justify-center">
                        <p class="mb-2 text-base text-gray-700">
                          <span class="font-semibold">Klikněte pro výběr souborů</span> nebo přetáhněte
                        </p>
                        <p class="text-sm text-gray-500">
                          PDF, JPG, PNG
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.dicom,.dcm"
                        class="hidden"
                        @change="handleFileUpload"
                      />
                    </label>

                    <div v-if="formData.attachments.length > 0" class="mt-4 space-y-2">
                      <p class="text-sm font-medium text-gray-700">Vybrané soubory:</p>
                      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y">
                        <div
                          v-for="(file, index) in formData.attachments"
                          :key="index"
                          class="px-4 py-3 flex items-center justify-between"
                        >
                          <div>
                            <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                            <p class="text-xs text-gray-500">{{ (file.size / 1024).toFixed(2) }} KB</p>
                          </div>
                          <button
                            type="button"
                            @click="formData.attachments.splice(index, 1)"
                            class="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            Odebrat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </UFormField>
              </div>

              <div class="mt-6 rounded-lg bg-yellow-50 border-2 border-yellow-200 p-5">
                <div class="flex items-start gap-3">
                  <div class="shrink-0 mt-0.5">
                    <svg class="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-yellow-900 mb-1">Důležité upozornění</p>
                    <p class="text-sm text-yellow-800">Ujistěte se, že všechny poskytnuté údaje jsou správné a kompletní. Po odeslání bude formulář zaslán specializovanému centru.</p>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 border-2 border-green-200 rounded-xl p-6 mt-6">
                <div class="text-sm text-green-800">
                  <strong>Bezpečnost a soukromí:</strong> Všechna data jsou přenášena šifrovaným připojením a ukládána v souladu s GDPR a zákonem o zdravotních službách. Přístup k datům mají pouze oprávnění zdravotničtí pracovníci specializovaného centra.
                </div>
              </div>
            </div>

            <!-- Step 7: Shrnutí -->
            <div v-show="currentStep === 7" class="space-y-8">
              <div class="mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Shrnutí</h3>
                <p class="text-gray-600">Zkontrolujte všechny zadané informace před odesláním</p>
              </div>

              <!-- Care Center -->
              <UCard>
                <template #header>
                  <h4 class="text-lg font-semibold text-gray-900">Centrum péče</h4>
                </template>
                <dl class="grid grid-cols-1 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Specializované centrum</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ careCenters.find(c => c.value === formData.careCenter)?.label || '-' }}</dd>
                  </div>
                </dl>
              </UCard>

              <!-- Patient Type & Contact -->
              <UCard>
                <template #header>
                  <h4 class="text-lg font-semibold text-gray-900">Informace o pacientovi</h4>
                </template>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Typ pacienta</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ patientTypes.find(p => p.value === formData.patientType)?.label || '-' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Jméno a příjmení</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formData.firstName }} {{ formData.lastName }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Rodné číslo</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formData.birthNumber }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Zdravotní pojišťovna</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ insuranceCompanies.find(i => i.value === formData.insurance)?.label || '-' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Adresa</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formData.address }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Telefon</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formData.phone }}</dd>
                  </div>
                  <div v-if="formData.email">
                    <dt class="text-sm font-medium text-gray-500">E-mail</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formData.email }}</dd>
                  </div>
                </dl>
              </UCard>

              <!-- Imaging -->
              <UCard v-if="formData.selectedImaging.length > 0">
                <template #header>
                  <h4 class="text-lg font-semibold text-gray-900">Zobrazovací vyšetření</h4>
                </template>
                <div class="space-y-4">
                  <div v-for="imaging in formData.selectedImaging" :key="imaging" class="border-l-4 border-primary-500 pl-4">
                    <h5 class="font-medium text-gray-900">{{ imagingOptions.find(i => i.value === imaging)?.label }}</h5>
                    <dl class="mt-2 space-y-1">
                      <div>
                        <dt class="text-sm text-gray-500 inline">Datum:</dt>
                        <dd class="text-sm text-gray-900 inline ml-2">{{ formData.imagingDetails[imaging]?.date || '-' }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm text-gray-500">Popis:</dt>
                        <dd class="text-sm text-gray-900 mt-1">{{ formData.imagingDetails[imaging]?.description || '-' }}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </UCard>

              <!-- Anamneza -->
              <UCard v-if="formData.anamneza || formData.familyPredispositions">
                <template #header>
                  <h4 class="text-lg font-semibold text-gray-900">Anamnéza</h4>
                </template>
                <dl class="space-y-4">
                  <div v-if="formData.anamneza">
                    <dt class="text-sm font-medium text-gray-500">Osobní anamnéza</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ formData.anamneza }}</dd>
                  </div>
                  <div v-if="formData.familyPredispositions">
                    <dt class="text-sm font-medium text-gray-500">Rodinná anamnéza</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ formData.familyPredispositions }}</dd>
                  </div>
                </dl>
              </UCard>

              <!-- Histological / Diagnostic -->
              <UCard v-if="formData.patientType === 'existing' || formData.histologicalVerification">
                <template #header>
                  <h4 class="text-lg font-semibold text-gray-900">
                    {{ formData.patientType === 'existing' ? 'Diagnostický souhrn' : 'Histologická verifikace' }}
                  </h4>
                </template>
                <dl class="space-y-4">
                  <template v-if="formData.patientType === 'existing'">
                    <div v-if="formData.mkn10">
                      <dt class="text-sm font-medium text-gray-500">Diagnóza (MKN-10)</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ mkn10Options.find(m => m.value === formData.mkn10)?.label || formData.mkn10 }}</dd>
                    </div>
                    <div v-if="formData.diagnosticSummary">
                      <dt class="text-sm font-medium text-gray-500">Diagnostický souhrn</dt>
                      <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ formData.diagnosticSummary }}</dd>
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Histologická verifikace provedena</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ formData.histologicalVerification === 'yes' ? 'Ano' : 'Ne' }}</dd>
                    </div>
                    <template v-if="formData.histologicalVerification === 'yes'">
                      <div v-if="formData.histologicalDate">
                        <dt class="text-sm font-medium text-gray-500">Datum vyšetření</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ formData.histologicalDate }}</dd>
                      </div>
                      <div v-if="formData.histologicalResults">
                        <dt class="text-sm font-medium text-gray-500">Výsledky</dt>
                        <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ formData.histologicalResults }}</dd>
                      </div>
                    </template>
                  </template>
                </dl>
              </UCard>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="border-t-2 border-gray-200 dark:border-gray-700 px-6 py-6">
            <div class="flex justify-between items-center">
              <UButton
                v-if="currentStep > 0"
                color="neutral"
                variant="outline"
                size="lg"
                @click="prevStep"
              >
                Zpět
              </UButton>
              <div v-else />

              <div class="flex items-center gap-4">
                <div v-if="currentStep < steps.length - 1" class="text-sm text-gray-600 hidden md:block">
                  Krok {{ currentStep + 1 }} z {{ steps.length }}
                </div>

                <UButton
                  v-if="currentStep < steps.length - 1"
                  color="primary"
                  size="lg"
                  :disabled="!canProceed"
                  @click="nextStep"
                >
                  Pokračovat
                </UButton>
                <UButton
                  v-else
                  color="primary"
                  size="xl"
                  :loading="isSubmitting"
                  :disabled="isSubmitting"
                  @click="submitForm"
                >
                  Odeslat formulář
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </template>

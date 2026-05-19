import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const initialFormData = () => ({
  // Step 0: Care center selection
  careCenter: '',

  // Step 1: Patient type
  patientType: '',

  // Step 2: Patient contact
  firstName: '',
  lastName: '',
  address: '',
  insurance: '',
  birthNumber: '',
  phone: '',
  email: '',

  // Step 3: Imaging examination
  selectedImaging: [] as string[],
  imagingDetails: {} as Record<string, { date: string; description: string }>,
  openImagingDetails: {} as Record<string, boolean>,
  furtherExaminations: [] as Array<{ date: string; description: string }>,
  ePacsUpload: false,
  ePacsFiles: [] as File[],

  // Step 4: Anamneza
  anamneza: '',
  familyPredispositions: '',

  // Step 5: Histological verification
  bloodThinners: '',
  bloodThinnersDetails: '',
  histologicalVerification: '',
  histologicalDate: '',
  histologicalResults: '',

  // Step 5: Diagnostic Summary (Existing Patient)
  mkn10: '',
  diagnosticSummary: '',

  // Step 6: Submission
  summaryNotes: '',
  attachments: [] as File[]
})

export function useSarcomaFormStore() {
  const formData = useLocalStorage('sarcoma-form-data', initialFormData(), {
    serializer: StorageSerializers.object
  })
  const currentStep = useLocalStorage<number>('sarcoma-form-step', 0)

  function reset() {
    formData.value = initialFormData()
    currentStep.value = 0
  }

  return {
    formData,
    currentStep,
    reset
  }
}

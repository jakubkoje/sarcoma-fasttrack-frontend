import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { useToast } from '#imports'
import { authService } from '~/services/auth'
import type { AuthCredentials, ApiError } from '~/types/auth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  remember: z.boolean().optional()
})

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

type Schema = z.output<typeof schema>

export function useAuthForm() {
  const isSubmitting = ref(false)
  const errorMessage = ref<string | null>(null)
  const toast = useToast()
  const providers = [{
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: 'Google', description: 'Login with Google' })
    }
  }, {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
      toast.add({ title: 'GitHub', description: 'Login with GitHub' })
    }
  }]

  async function onSubmit(payload: FormSubmitEvent<Schema>) {
    isSubmitting.value = true
    errorMessage.value = null

    try {
      const result = await authService.login(payload.data as AuthCredentials)
      toast.add({ title: 'Logged in', description: `Welcome back ${result.user.email}` })
    } catch (error: unknown) {
      const message = extractErrorMessage(error)
      errorMessage.value = message
      toast.add({ title: 'Login failed', description: message, color: 'red' })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    schema,
    fields,
    providers,
    isSubmitting,
    errorMessage,
    onSubmit
  }
}

function extractErrorMessage(error: unknown): string {
  const apiError = error as Partial<ApiError>
  if (typeof apiError?.message === 'string') return apiError.message
  if (error instanceof Error) return error.message
  return 'Unexpected error occurred'
}

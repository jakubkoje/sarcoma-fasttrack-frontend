<script setup lang="ts">
import { ref } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { useApiClient } from '~/services/apiClient'
import { useAuthStore } from '~/stores/auth'

const toast = useToast()
const api = useApiClient()
const auth = useAuthStore()
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  modelValue: 'admin@admin.com',
  label: 'Email',
  placeholder: 'Enter your email',
  required: false
  // required: true
}, {
  name: 'password',
  label: 'Password',
  modelValue: 'admin',
  type: 'password',
  placeholder: 'Enter your password'
  // required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

const schema = z.object({
  email: z.string().optional(),
  password: z.string('Password is required').min(5, 'Password must be at least 5 characters').optional(),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

const router = useRouter()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  errorMessage.value = null
  try {
    const { email, password } = payload.data
    const emailHardcoded = 'admin@admin.com'
    const passwordHardcoded = 'admin'
    const res = await api.login({ email: emailHardcoded, password: passwordHardcoded })
    // const res = await api.login({ email, password })
    const userRole = res.user_role || null
    auth.setToken(res.access_token)
    auth.setRole(userRole)
    api.setToken(res.access_token)
    toast.add({ title: 'Logged in', description: 'Token saved' })
    
    // Redirect based on role
    if (userRole === 'doctor') {
      router.push('/dashboard')
    } else if (userRole === 'specialist') {
      router.push('/analytics')
    } else if (userRole === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    errorMessage.value = message
    toast.add({ title: 'Error', description: message, color: 'red' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials."
        icon="i-lucide-user"
        :fields="fields"
        :loading="isSubmitting"
        :error="errorMessage"
        :submit="{ label: 'Log in', block: true }"
        @submit="onSubmit"
      />

      <!-- Disclaimer -->
      <div class="mt-6 px-4">
        <p class="text-xs text-center text-gray-600 dark:text-gray-400">
          The application is intended for healthcare professionals.
        </p>
      </div>
    </UPageCard>
  </div>
</template>

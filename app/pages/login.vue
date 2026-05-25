<script setup lang="ts">
import { ref, computed } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { definePageMeta, useRouter, useToast } from '#imports'
import { useApiClient } from '~/services/apiClient'
import { useAuthStore } from '~/stores/auth'

const toast = useToast()
const api = useApiClient()
const auth = useAuthStore()
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

type TestAccount = {
  id: string
  label: string
  email: string
  password: string
}

const testAccounts: TestAccount[] = [
  { id: 'admin', label: 'Admin', email: 'admin@admin.com', password: 'admin' },
  { id: 'doctor', label: 'Doctor', email: 'doctor@sft.local', password: 'doctor' },
  { id: 'specialist', label: 'Specialist', email: 'specialist@sft.local', password: 'specialist' },
  { id: 'coordinator', label: 'Coordinator', email: 'coordinator@sft.local', password: 'coordinator' }
]

const selectedAccountId = ref<string>(testAccounts[0]!.id)
const selectedAccount = computed<TestAccount>(
  () => testAccounts.find((a) => a.id === selectedAccountId.value) ?? testAccounts[0]!
)

const formKey = ref(0)
const fields = computed<AuthFormField[]>(() => [{
  name: 'email',
  type: 'email',
  modelValue: selectedAccount.value.email,
  label: 'Email',
  placeholder: 'Enter your email',
  required: false
}, {
  name: 'password',
  label: 'Password',
  modelValue: selectedAccount.value.password,
  type: 'password',
  placeholder: 'Enter your password'
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}])

function onAccountChange() {
  formKey.value += 1
  errorMessage.value = null
}

const schema = z.object({
  email: z.string().optional(),
  password: z.string('Password is required').min(5, 'Password must be at least 5 characters').optional(),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

const router = useRouter()

definePageMeta({
  layout: false
})

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  errorMessage.value = null
  try {
    const email = payload.data.email || selectedAccount.value.email
    const password = payload.data.password || selectedAccount.value.password
    const res = await api.login({ email, password })
    const userRole = res.user_role || null
    auth.setToken(res.access_token)
    auth.setRole(userRole)
    api.setToken(res.access_token)
    toast.add({ title: 'Logged in', description: `Signed in as ${selectedAccount.value.label}` })

    router.push('/dashboard')
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
  <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 overflow-hidden">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :key="formKey"
        :schema="schema"
        title="Login"
        icon="i-lucide-user"
        :fields="fields"
        :loading="isSubmitting"
        :error="errorMessage"
        :submit="{ label: 'Log in', block: true }"
        @submit="onSubmit"
      >
        <template #description>
          <div class="space-y-4">
            <p>Enter your credentials.</p>
            <UFormField label="Test account">
              <USelect
                v-model="selectedAccountId"
                :items="testAccounts.map((a) => ({ label: a.label, value: a.id }))"
                trailing-icon="i-lucide-chevron-down"
                class="w-full"
                @update:model-value="onAccountChange"
              />
            </UFormField>
          </div>
        </template>
      </UAuthForm>

      <!-- Disclaimer -->
      <div class="mt-6 px-4">
        <p class="text-xs text-center text-gray-600 dark:text-gray-400">
          The application is intended for healthcare professionals.
        </p>
      </div>
    </UPageCard>
  </div>
</template>

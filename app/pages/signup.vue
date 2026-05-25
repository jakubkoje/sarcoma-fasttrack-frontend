<script setup lang="ts">
import { reactive } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: false
})

const roleOptions = [
  { label: 'Doctor', value: 'doktor' },
  { label: 'Coordinator', value: 'koordinator' }
]

const schema = z.object({
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Select a role'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  role: undefined as { label: string; value: string } | undefined,
  password: '',
  confirmPassword: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Sign up form submitted:', event.data)
  // Implement your sign-up logic here
  // navigateTo('/dashboard')
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4 overflow-hidden">
    <div class="w-full max-w-md max-h-full overflow-y-auto">
      <!-- Logo/Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">Create account</h1>
        <p class="text-base text-gray-600 dark:text-gray-300">Start using Sarkom FastTrack</p>
      </div>

      <!-- Form Card -->
      <UCard class="shadow-xl border-2 border-gray-200">
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label class="block">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Email
                <span class="text-red-500">*</span>
              </span>
              <UFormGroup name="email">
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="your-email@example.com"
                  size="xl"
                  class="shadow-sm w-full"
                />
              </UFormGroup>
            </label>
          </div>

          <!-- Role Field -->
          <div class="space-y-2">
            <label class="block">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Role
                <span class="text-red-500">*</span>
              </span>
              <UFormGroup name="role">
                <UInputMenu
                  v-model="state.role"
                  :items="roleOptions"
                  :portal="false"
                  placeholder="Select your role..."
                  size="xl"
                  trailing-icon="i-lucide-chevron-down"
                  class="shadow-sm w-full"
                />
              </UFormGroup>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">Select whether you are a doctor or a coordinator</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Password
                <span class="text-red-500">*</span>
              </span>
              <UFormGroup name="password">
                <UInput
                  v-model="state.password"
                  type="password"
                  placeholder="At least 8 characters"
                  size="xl"
                  class="shadow-sm w-full"
                />
              </UFormGroup>
            </label>
            <p class="text-xs text-gray-500 mt-1">Use at least 8 characters for a strong password</p>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label class="block">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Confirm password
                <span class="text-red-500">*</span>
              </span>
              <UFormGroup name="confirmPassword">
                <UInput
                  v-model="state.confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  size="xl"
                  class="shadow-sm w-full"
                />
              </UFormGroup>
            </label>
          </div>

          <!-- Submit Button -->
          <UButton
            type="submit"
            size="xl"
            block
            color="primary"
            class="mt-8 shadow-md hover:shadow-lg transition-shadow"
          >
            Sign up
          </UButton>
        </UForm>
      </UCard>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-primary-600 hover:text-primary-700 font-semibold ml-1 hover:underline transition-colors"
          >
            Log in
          </NuxtLink>
        </p>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-300">
          By signing up you agree to our terms of use and privacy policy
        </p>
      </div>
    </div>
  </div>
</template>

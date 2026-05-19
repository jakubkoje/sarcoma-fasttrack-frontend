<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const roleOptions = [
  { label: 'Doktor', value: 'doktor' },
  { label: 'Koordinátor', value: 'koordinator' }
]

const schema = z.object({
  email: z.string().email('Neplatný email'),
  role: z.string().min(1, 'Vyberte roli'),
  password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků'),
  confirmPassword: z.string().min(8, 'Heslo musí mít alespoň 8 znaků')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hesla se neshodují",
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
  <div class="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">Vytvořit účet</h1>
        <p class="text-base text-gray-600 dark:text-gray-300">Začněte používat Sarkom FastTrack</p>
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
                  placeholder="vas-email@example.com"
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
                  placeholder="Vyberte vaši roli..."
                  size="xl"
                  class="shadow-sm w-full"
                />
              </UFormGroup>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">Vyberte, zda jste lékař nebo koordinátor</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Heslo
                <span class="text-red-500">*</span>
              </span>
              <UFormGroup name="password">
                <UInput
                  v-model="state.password"
                  type="password"
                  placeholder="Alespoň 8 znaků"
                  size="xl"
                  class="shadow-sm w-full"
                />
              </UFormGroup>
            </label>
            <p class="text-xs text-gray-500 mt-1">Použijte alespoň 8 znaků pro silné heslo</p>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label class="block">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Potvrdit heslo
                <span class="text-red-500">*</span>
              </span>
              <UFormGroup name="confirmPassword">
                <UInput
                  v-model="state.confirmPassword"
                  type="password"
                  placeholder="Zadejte heslo znovu"
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
            Registrovat se
          </UButton>
        </UForm>
      </UCard>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Již máte účet?
          <NuxtLink
            to="/login"
            class="text-primary-600 hover:text-primary-700 font-semibold ml-1 hover:underline transition-colors"
          >
            Přihlásit se
          </NuxtLink>
        </p>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-300">
          Registrací souhlasíte s našimi podmínkami používání a zásadami ochrany osobních údajů
        </p>
      </div>
    </div>
  </div>
</template>

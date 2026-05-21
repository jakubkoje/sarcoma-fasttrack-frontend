<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from '#imports'
import { useApiClient } from '~/services/apiClient'
import type { OrganizationCreate, OrganizationRead, OrganizationUpdate } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})

const api = useApiClient()
const toast = useToast()

const organizations = ref<OrganizationRead[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const regionFilter = ref<string>('all')
const isFormOpen = ref(false)
const isSaving = ref(false)
const editingId = ref<number | null>(null)

const blankForm = (): {
  name: string
  type_code: string
  address: string
  contact: string
  email: string
  capacity: number | null
  region: string
  catchment_area: string
} => ({
  name: '',
  type_code: 'prov',
  address: '',
  contact: '',
  email: '',
  capacity: null,
  region: '',
  catchment_area: ''
})

const form = reactive(blankForm())

const isEdit = computed(() => editingId.value !== null)
const canSave = computed(() =>
  form.name.trim().length > 0 &&
  form.type_code.trim().length > 0 &&
  form.address.trim().length > 0 &&
  form.contact.trim().length > 0
)

async function load() {
  isLoading.value = true
  errorMessage.value = null
  try {
    organizations.value = await api.listOrganizations()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Failed to load organizations.'
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

const regions = computed(() => {
  const set = new Set<string>(['all'])
  for (const org of organizations.value) {
    if (org.region) set.add(org.region)
  }
  return Array.from(set)
})

const filtered = computed(() => {
  if (regionFilter.value === 'all') return organizations.value
  return organizations.value.filter(org => org.region === regionFilter.value)
})

function resetForm() {
  Object.assign(form, blankForm())
  editingId.value = null
}

function openCreate() {
  resetForm()
  isFormOpen.value = true
}

function openEdit(org: OrganizationRead) {
  editingId.value = org.id
  form.name = org.name ?? ''
  form.type_code = org.type_code ?? 'prov'
  form.address = org.address ?? ''
  form.contact = org.contact ?? ''
  form.email = org.email ?? ''
  form.capacity = org.capacity ?? null
  form.region = org.region ?? ''
  form.catchment_area = org.catchment_area ?? ''
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  resetForm()
}

function payloadCreate(): OrganizationCreate {
  return {
    name: form.name.trim(),
    type_code: form.type_code.trim(),
    address: form.address.trim(),
    contact: form.contact.trim(),
    email: form.email.trim() || null,
    capacity: form.capacity ?? null,
    region: form.region.trim() || null,
    catchment_area: form.catchment_area.trim() || null
  }
}

function payloadUpdate(): OrganizationUpdate {
  const p = payloadCreate()
  return p
}

async function save() {
  if (!canSave.value) return
  isSaving.value = true
  try {
    if (isEdit.value && editingId.value !== null) {
      const updated = await api.updateOrganization(editingId.value, payloadUpdate())
      const idx = organizations.value.findIndex(o => o.id === updated.id)
      if (idx >= 0) organizations.value.splice(idx, 1, updated)
      toast.add({ title: 'Saved', description: `${updated.name ?? 'Organization'} updated.` })
    } else {
      const created = await api.createOrganization(payloadCreate())
      organizations.value.push(created)
      toast.add({ title: 'Created', description: `${created.name ?? 'Organization'} added.` })
    }
    closeForm()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Save failed.' })
  } finally {
    isSaving.value = false
  }
}

async function remove(org: OrganizationRead) {
  if (typeof window !== 'undefined' && !window.confirm(`Delete ${org.name ?? 'this organization'}?`)) return
  try {
    await api.deleteOrganization(org.id)
    organizations.value = organizations.value.filter(o => o.id !== org.id)
    toast.add({ title: 'Deleted', description: 'Organization removed.' })
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Delete failed.' })
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Specialized centers
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Register and maintain sarcoma reference centers, their capacity, and catchment area.
          </p>
        </div>
        <UButton color="primary" icon="i-lucide-plus" size="lg" @click="openCreate">
          New center
        </UButton>
      </div>

      <div v-if="regions.length > 1" class="mb-6 flex flex-wrap gap-2 items-center">
        <span class="text-xs uppercase tracking-wide text-gray-500 mr-2">Region</span>
        <UButton
          v-for="r in regions"
          :key="r"
          :color="regionFilter === r ? 'primary' : 'neutral'"
          :variant="regionFilter === r ? 'solid' : 'outline'"
          size="sm"
          @click="regionFilter = r"
        >
          {{ r === 'all' ? 'All regions' : r }}
        </UButton>
      </div>

      <div v-if="isLoading" class="py-16 flex justify-center">
        <ULoadingIcon />
      </div>

      <UCard v-else-if="errorMessage" class="border-red-200 dark:border-red-900">
        <p class="text-red-700 dark:text-red-300">{{ errorMessage }}</p>
        <UButton class="mt-4" color="neutral" variant="outline" @click="load">Retry</UButton>
      </UCard>

      <UCard v-else>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left border-b border-gray-200 dark:border-gray-800">
              <th class="py-3 px-2">Name</th>
              <th class="py-3 px-2">Region</th>
              <th class="py-3 px-2">Capacity</th>
              <th class="py-3 px-2">Catchment area</th>
              <th class="py-3 px-2">Contact</th>
              <th class="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="py-6 px-2 text-center text-gray-500 dark:text-gray-400">
                No centers match this filter.
              </td>
            </tr>
            <tr
              v-for="org in filtered"
              :key="org.id"
              class="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <td class="py-3 px-2">
                <div class="font-semibold text-gray-900 dark:text-gray-100">{{ org.name || '—' }}</div>
                <div class="text-xs text-gray-500">#{{ org.id }} · {{ org.type_code || '—' }}</div>
              </td>
              <td class="py-3 px-2">
                <UBadge v-if="org.region" color="primary" variant="subtle">{{ org.region }}</UBadge>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="py-3 px-2">{{ org.capacity ?? '—' }}</td>
              <td class="py-3 px-2 text-gray-700 dark:text-gray-300">{{ org.catchment_area || '—' }}</td>
              <td class="py-3 px-2 text-gray-700 dark:text-gray-300">
                <div>{{ org.contact || '—' }}</div>
                <div v-if="org.email" class="text-xs text-gray-500">{{ org.email }}</div>
              </td>
              <td class="py-3 px-2 text-right">
                <div class="inline-flex gap-2">
                  <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-pencil" @click="openEdit(org)">
                    Edit
                  </UButton>
                  <UButton size="xs" color="error" variant="outline" icon="i-lucide-trash-2" @click="remove(org)">
                    Delete
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </UCard>
    </div>

    <UModal v-model:open="isFormOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <template #content>
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ isEdit ? 'Edit center' : 'New center' }}
            </h2>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <UFormField label="Name" required class="w-full">
              <UInput v-model="form.name" placeholder="Masarykův onkologický ústav" class="w-full" />
            </UFormField>
            <UFormField label="Type code" required class="w-full">
              <UInput v-model="form.type_code" placeholder="prov" class="w-full" />
            </UFormField>
            <UFormField label="Address" required class="md:col-span-2 w-full">
              <UInput v-model="form.address" placeholder="Žlutý kopec 7, Brno" class="w-full" />
            </UFormField>
            <UFormField label="Contact" required class="w-full">
              <UInput v-model="form.contact" placeholder="+420 543 131 111" class="w-full" />
            </UFormField>
            <UFormField label="Email" class="w-full">
              <UInput v-model="form.email" type="email" placeholder="info@center.cz" class="w-full" />
            </UFormField>
            <UFormField label="Capacity" help="Beds or annual case load." class="w-full">
              <UInput v-model.number="form.capacity" type="number" min="0" placeholder="120" class="w-full" />
            </UFormField>
            <UFormField label="Region" class="w-full">
              <UInput v-model="form.region" placeholder="Jihomoravský" class="w-full" />
            </UFormField>
            <UFormField label="Catchment area" class="md:col-span-2 w-full">
              <UInput v-model="form.catchment_area" placeholder="Morava a Slezsko" class="w-full" />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton color="neutral" variant="outline" @click="closeForm">Cancel</UButton>
              <UButton color="primary" :disabled="!canSave" :loading="isSaving" @click="save">
                {{ isEdit ? 'Save' : 'Create' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UContainer>
</template>

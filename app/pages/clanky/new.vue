<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { definePageMeta, useRoute, useRouter, useToast } from '#imports'
import { useApiClient } from '~/services/apiClient'
import type { ArticleCreate, ArticleUpdate } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const api = useApiClient()

const editId = computed(() => {
  const raw = route.query.edit
  if (!raw) return null
  const id = Number(raw)
  return Number.isFinite(id) ? id : null
})
const isEdit = computed(() => editId.value !== null)

const form = reactive({
  title: '',
  summary: '',
  body: '## Introduction\n\nWrite the article content in markdown — `## Headings`, `- bullets` and **bold** are rendered.',
  category: '',
  image_url: '',
  author_name: '',
  author_avatar_url: '',
  read_time_minutes: null as number | null
})

const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref<string | null>(null)
const canSave = computed(() => form.title.trim().length > 0 && form.summary.trim().length > 0 && form.body.trim().length > 0)

async function loadForEdit() {
  if (!editId.value) return
  isLoading.value = true
  errorMessage.value = null
  try {
    const article = await api.getArticle(editId.value)
    form.title = article.title
    form.summary = article.summary
    form.body = article.body
    form.category = article.category ?? ''
    form.image_url = article.image_url ?? ''
    form.author_name = article.author_name ?? ''
    form.author_avatar_url = article.author_avatar_url ?? ''
    form.read_time_minutes = article.read_time_minutes ?? null
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Failed to load article.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadForEdit)

function buildPayload(): ArticleCreate {
  return {
    title: form.title.trim(),
    summary: form.summary.trim(),
    body: form.body,
    category: form.category.trim() || null,
    image_url: form.image_url.trim() || null,
    author_name: form.author_name.trim() || null,
    author_avatar_url: form.author_avatar_url.trim() || null,
    read_time_minutes: form.read_time_minutes ?? null
  }
}

async function save() {
  if (!canSave.value) return
  isSaving.value = true
  try {
    if (isEdit.value && editId.value !== null) {
      const payload: ArticleUpdate = buildPayload()
      const updated = await api.updateArticle(editId.value, payload)
      toast.add({ title: 'Saved', description: 'Article was updated.' })
      router.push(`/clanky/${updated.id}`)
    } else {
      const created = await api.createArticle(buildPayload())
      toast.add({ title: 'Created', description: 'Article saved as DRAFT.' })
      router.push(`/clanky/${created.id}`)
    }
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Save failed.' })
  } finally {
    isSaving.value = false
  }
}

const cancel = () => {
  if (isEdit.value && editId.value !== null) {
    router.push(`/clanky/${editId.value}`)
  } else {
    router.push('/clanky')
  }
}
</script>

<template>
  <UContainer class="py-8 md:py-12">
    <div class="max-w-3xl mx-auto">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        size="lg"
        class="mb-6"
        @click="cancel"
      >
        {{ isEdit ? 'Back to article' : 'Back to articles' }}
      </UButton>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ isEdit ? 'Edit article' : 'New article' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        {{ isEdit ? 'Update the article. Publication status is managed from the article detail page.' : 'Articles are created as DRAFT. Publish them from the article detail page.' }}
      </p>

      <div v-if="isLoading" class="py-16 flex justify-center">
        <ULoadingIcon />
      </div>

      <UCard v-else-if="errorMessage" class="border-red-200 dark:border-red-900">
        <p class="text-red-700 dark:text-red-300">{{ errorMessage }}</p>
        <UButton class="mt-4" color="neutral" variant="outline" @click="loadForEdit">Retry</UButton>
      </UCard>

      <UCard v-else>
        <div class="space-y-6">
          <UFormField label="Title" required class="w-full">
            <UInput v-model="form.title" placeholder="Sarcoma red flags" size="lg" class="w-full" />
          </UFormField>

          <UFormField
            label="Summary"
            required
            help="Short description shown in the article list."
            class="w-full"
          >
            <UTextarea v-model="form.summary" :rows="3" placeholder="A two-sentence summary..." class="w-full" />
          </UFormField>

          <UFormField label="Body (markdown)" required class="w-full">
            <UTextarea
              v-model="form.body"
              :rows="14"
              placeholder="## Section&#10;&#10;- one&#10;- two"
              class="w-full font-mono text-sm"
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <UFormField label="Category" class="w-full">
              <UInput v-model="form.category" placeholder="Diagnostika" class="w-full" />
            </UFormField>
            <UFormField label="Read time (minutes)" class="w-full">
              <UInput v-model.number="form.read_time_minutes" type="number" min="0" placeholder="5" class="w-full" />
            </UFormField>
            <UFormField label="Hero image URL" class="w-full">
              <UInput v-model="form.image_url" placeholder="https://..." class="w-full" />
            </UFormField>
            <UFormField label="Author name" class="w-full">
              <UInput v-model="form.author_name" placeholder="MUDr. ..." class="w-full" />
            </UFormField>
            <UFormField label="Author avatar URL" class="md:col-span-2 w-full">
              <UInput v-model="form.author_avatar_url" placeholder="https://..." class="w-full" />
            </UFormField>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <UButton color="neutral" variant="outline" @click="cancel">Cancel</UButton>
            <UButton color="primary" :disabled="!canSave" :loading="isSaving" @click="save">
              {{ isEdit ? 'Save changes' : 'Create article' }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

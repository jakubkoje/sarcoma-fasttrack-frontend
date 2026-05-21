<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApiClient } from '~/services/apiClient'
import { useAuthStore } from '~/stores/auth'
import type { ArticleRead } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})

const api = useApiClient()
const auth = useAuthStore()
const router = useRouter()

const articles = ref<ArticleRead[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const selectedCategory = ref<string>('all')
const searchQuery = ref('')
const statusFilter = ref<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED')

const isEditor = computed(() => auth.role.value === 'coordinator' || auth.role.value === 'admin')

async function load() {
  isLoading.value = true
  errorMessage.value = null
  try {
    articles.value = await api.listArticles()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Failed to load articles.'
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

const categories = computed(() => {
  const cats = new Set<string>(['all'])
  for (const article of articles.value) {
    if (article.category) cats.add(article.category)
  }
  return Array.from(cats)
})

const filteredArticles = computed(() => {
  let filtered = articles.value
  if (statusFilter.value !== 'ALL') {
    filtered = filtered.filter(article => article.status === statusFilter.value)
  }
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    )
  }
  return filtered
})

const formatDate = (value?: string | null) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const statusBadgeColor = (status: ArticleRead['status']): 'primary' | 'neutral' | 'warning' => {
  if (status === 'PUBLISHED') return 'primary'
  if (status === 'DRAFT') return 'warning'
  return 'neutral'
}

const visitArticle = (id: number) => router.push(`/clanky/${id}`)
const openCreate = () => router.push('/clanky/new')
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Educational materials
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Articles and clinical guidance for the diagnosis and treatment of sarcomas.
          </p>
        </div>
        <UButton
          v-if="isEditor"
          color="primary"
          icon="i-lucide-plus"
          size="lg"
          @click="openCreate"
        >
          New article
        </UButton>
      </div>

      <div class="mb-8 space-y-4">
        <div class="max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            size="lg"
            placeholder="Search articles..."
          >
            <template #trailing>
              <UButton
                v-show="searchQuery !== ''"
                color="neutral"
                variant="link"
                icon="i-lucide-x"
                :padded="false"
                @click="searchQuery = ''"
              />
            </template>
          </UInput>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="category in categories"
            :key="category"
            :color="selectedCategory === category ? 'primary' : 'neutral'"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            size="sm"
            @click="selectedCategory = category"
          >
            {{ category === 'all' ? 'All categories' : category }}
          </UButton>
        </div>

        <div v-if="isEditor" class="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
          <span class="text-xs uppercase tracking-wide text-gray-500 self-center mr-2">Status</span>
          <UButton
            v-for="value in (['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'] as const)"
            :key="value"
            :color="statusFilter === value ? 'primary' : 'neutral'"
            :variant="statusFilter === value ? 'solid' : 'ghost'"
            size="xs"
            @click="statusFilter = value"
          >
            {{ value }}
          </UButton>
        </div>
      </div>

      <div v-if="isLoading" class="py-16 flex justify-center">
        <ULoadingIcon />
      </div>

      <UCard v-else-if="errorMessage" class="border-red-200 dark:border-red-900">
        <p class="text-red-700 dark:text-red-300">{{ errorMessage }}</p>
        <UButton class="mt-4" color="neutral" variant="outline" @click="load">Retry</UButton>
      </UCard>

      <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="article in filteredArticles"
          :key="article.id"
          class="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
          @click="visitArticle(article.id)"
        >
          <template #header>
            <div class="flex items-start justify-between gap-3">
              <UBadge v-if="article.category" color="primary" variant="subtle">
                {{ article.category }}
              </UBadge>
              <UBadge :color="statusBadgeColor(article.status)" variant="subtle">
                {{ article.status }}
              </UBadge>
            </div>
          </template>

          <div class="flex flex-col gap-2 flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
              {{ article.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
              {{ article.summary }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <span>{{ formatDate(article.published_at || article.created_at) }}</span>
              <span v-if="article.read_time_minutes">{{ article.read_time_minutes }} min read</span>
            </div>
          </div>
        </UCard>
      </div>

      <UCard v-else class="text-center py-12">
        <UIcon name="i-lucide-file-search" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No articles match these filters</p>
        <p class="text-gray-600 dark:text-gray-300">
          Try clearing the search or status filter.
        </p>
        <UButton
          v-if="isEditor"
          class="mt-6"
          color="primary"
          icon="i-lucide-plus"
          @click="openCreate"
        >
          Create the first article
        </UButton>
      </UCard>
    </div>
  </UContainer>
</template>

<template>
  <UContainer class="py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-2">
          Dashboard
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Quick overview of all sarcoma cases
        </p>
      </div>

      <!-- Main Action Card - Only for doctors and admins -->
      <NuxtLink v-if="userRole === 'doctor' || userRole === 'admin'" to="/sarcoma-form" class="block group">
        <UCard class="mb-8 hover:shadow-2xl transition-all bg-primary-50 dark:bg-gray-800 cursor-pointer">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 dark:bg-gray-800">
            <div class="flex items-center gap-4 flex-1">
              <div class="w-16 h-16 rounded-xl bg-primary-800 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-primary-700 mb-1">
                  New case
                </h2>
                <p class="text-primary-700">
                  Refer a patient with suspected sarcoma to a specialized center
                </p>
              </div>
            </div>
          
          </div>
        </UCard>
      </NuxtLink>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<!-- Pending Cases - Clickable -->
<NuxtLink to="/reports" class="block group">
          <UCard class="h-full hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden bg-primary-50 dark:bg-gray-800">
            <!-- Pulse animation indicator -->
            <div class="absolute -top-2 -right-2 w-4 h-4 bg-primary-500 rounded-full animate-pulse" />
            
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <UBadge color="primary" variant="solid" size="sm">
                    Click here
                  </UBadge>
                </div>
                <p class="text-sm font-semibold text-primary-700 mb-1">Pending cases</p>
                <p class="text-4xl font-bold text-primary-600 mb-2">{{ stats.pending }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  Require assessment
                  <svg class="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>

        <!-- Total Cases -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total cases</p>
              <p class="text-4xl font-bold text-gray-900 dark:text-gray-300">{{ stats.total }}</p>
            </div>
          </div>
        </UCard>

        <!-- Completed Cases -->
        <UCard class="hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Processed</p>
              <p class="text-4xl font-bold text-gray-900 dark:text-gray-300">{{ stats.completed }}</p>
            </div>
          </div>
        </UCard>
      </div>

           <!-- Articles Section - Only for doctors and admins -->
           <div v-if="userRole === 'doctor' || userRole === 'admin'" class="mb-8">
        <UCard>
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-1 flex items-center gap-2">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Expert articles on sarcomas
              </h2>
              <p class="text-gray-600">Current findings in diagnostics and treatment</p>
            </div>
            <NuxtLink to="/clanky">
              <UButton color="primary" variant="outline" trailing-icon="i-lucide-arrow-right">
                All articles
              </UButton>
            </NuxtLink>
          </div>

          <div v-if="articlesLoading" class="py-12 flex justify-center">
            <ULoadingIcon />
          </div>

          <div v-else-if="featuredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NuxtLink
              v-for="article in featuredArticles"
              :key="article.id"
              :to="`/clanky/${article.id}`"
              class="group"
            >
              <UCard class="overflow-hidden hover:shadow-xl transition-all h-full">
                <div v-if="article.image_url" class="relative h-48 overflow-hidden">
                  <img
                    :src="article.image_url"
                    :alt="article.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div v-if="article.category" class="absolute top-3 left-3">
                    <UBadge color="primary" variant="solid" size="sm">{{ article.category }}</UBadge>
                  </div>
                </div>
                <div v-else-if="article.category" class="px-4 pt-4">
                  <UBadge color="primary" variant="solid" size="sm">{{ article.category }}</UBadge>
                </div>

                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 dark:text-gray-300 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {{ article.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {{ article.summary }}
                  </p>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-300">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatArticleDate(article.published_at || article.created_at) }}
                  </div>
                </div>
              </UCard>
            </NuxtLink>
          </div>

          <p v-else class="text-sm text-gray-600 dark:text-gray-300 py-6 text-center">
            No published articles yet.
          </p>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApiClient } from '~/services/apiClient'
import type { ArticleRead, ReportRead } from '~/types/api'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const auth = useAuthStore()
const userRole = computed(() => auth.role.value)
const api = useApiClient()

const PENDING_STATUSES = new Set(['ACTIVE', 'SUBMITTED', 'SENT'])
const PROCESSED_STATUSES = new Set(['DONE'])

const reports = ref<ReportRead[]>([])
const articles = ref<ArticleRead[]>([])
const articlesLoading = ref(false)

const stats = computed(() => ({
  total: reports.value.length,
  pending: reports.value.filter((r) => PENDING_STATUSES.has(r.status)).length,
  completed: reports.value.filter((r) => PROCESSED_STATUSES.has(r.status)).length,
  draft: reports.value.filter((r) => r.status === 'DRAFT').length
}))

const featuredArticles = computed(() => {
  return articles.value
    .filter((a) => a.status === 'PUBLISHED')
    .slice()
    .sort((a, b) => {
      const aDate = new Date(a.published_at || a.created_at).getTime()
      const bDate = new Date(b.published_at || b.created_at).getTime()
      return bDate - aDate
    })
    .slice(0, 3)
})

const formatArticleDate = (value?: string | null) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    reports.value = await api.listReports()
  } catch {
    reports.value = []
  }

  if (userRole.value === 'doctor' || userRole.value === 'admin') {
    articlesLoading.value = true
    try {
      articles.value = await api.listArticles()
    } catch {
      articles.value = []
    } finally {
      articlesLoading.value = false
    }
  }
})
</script>

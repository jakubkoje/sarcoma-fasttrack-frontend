<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { definePageMeta, useRoute, useRouter, useToast } from '#imports'
import { useApiClient } from '~/services/apiClient'
import { useAuthStore } from '~/stores/auth'
import type { ArticleRead, ArticleStatus } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const api = useApiClient()
const auth = useAuthStore()

const articleId = computed(() => Number(route.params.id))
const article = ref<ArticleRead | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const isMutating = ref(false)

const isAdmin = computed(() => auth.role.value === 'admin')
const isCoordinator = computed(() => auth.role.value === 'coordinator')
const canEdit = computed(() => isAdmin.value || isCoordinator.value)

async function load() {
  if (!articleId.value) return
  isLoading.value = true
  errorMessage.value = null
  try {
    article.value = await api.getArticle(articleId.value)
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Failed to load article.'
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

const goBack = () => router.push('/clanky')
const editArticle = () => router.push(`/clanky/new?edit=${articleId.value}`)

async function changeStatus(next: ArticleStatus) {
  if (!article.value) return
  isMutating.value = true
  try {
    article.value = await api.updateArticleStatus(article.value.id, next)
    toast.add({ title: 'Updated', description: `Article is now ${next}.` })
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Status change failed.' })
  } finally {
    isMutating.value = false
  }
}

async function deleteArticle() {
  if (!article.value) return
  if (typeof window !== 'undefined' && !window.confirm('Delete this article? This cannot be undone.')) return
  isMutating.value = true
  try {
    await api.deleteArticle(article.value.id)
    toast.add({ title: 'Deleted', description: 'Article was removed.' })
    router.push('/clanky')
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Delete failed.' })
  } finally {
    isMutating.value = false
  }
}

const formatDate = (value?: string | null) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lightweight markdown → HTML. Covers headers, lists, bold, paragraphs.
const formatContent = (content: string) => {
  if (!content) return ''
  let formatted = content
    .trim()
    .replace(/\n## (.+)/g, '\n<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-6 pb-4 border-b-2 border-primary-200">$1</h2>')
    .replace(/\n### (.+)/g, '\n<h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
    .replace(/\n(\d+)\. (.+)/g, '\n<li class="ml-6 text-gray-700 dark:text-gray-200 leading-relaxed">$2</li>')
    .replace(/\n- (.+)/g, '\n<li class="text-gray-700 dark:text-gray-200 leading-relaxed">$1</li>')
    .replace(/\n\n(.+?)(?=\n\n|$)/g, '\n\n<p class="text-gray-700 dark:text-gray-200 leading-relaxed mb-6 text-lg">$1</p>')
    .replace(/^\n+/, '')
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\n)+/gs, (match) => {
    if (!match.includes('<ul') && !match.includes('<ol')) {
      return `<ul class="space-y-2 my-6 pl-6 list-disc marker:text-primary-600">${match}</ul>`
    }
    return match
  })
  return formatted
}

const statusBadgeColor = (status?: ArticleStatus): 'primary' | 'neutral' | 'warning' => {
  if (status === 'PUBLISHED') return 'primary'
  if (status === 'DRAFT') return 'warning'
  return 'neutral'
}
</script>

<template>
  <UContainer class="py-8 md:py-12">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-left"
          size="lg"
          @click="goBack"
        >
          Back to articles
        </UButton>
      </div>

      <div v-if="isLoading" class="py-16 flex justify-center">
        <ULoadingIcon />
      </div>

      <UCard v-else-if="errorMessage || !article" class="text-center py-12">
        <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Article not found</p>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ errorMessage || 'This article is no longer available.' }}</p>
        <UButton color="primary" @click="goBack">Back to overview</UButton>
      </UCard>

      <article v-else>
        <header class="mb-8">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <UBadge v-if="article.category" color="primary" variant="subtle" size="lg">
              {{ article.category }}
            </UBadge>
            <UBadge :color="statusBadgeColor(article.status)" variant="subtle" size="lg">
              {{ article.status }}
            </UBadge>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {{ article.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-6">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="w-5 h-5" />
              <span class="text-base">{{ formatDate(article.published_at || article.created_at) }}</span>
            </div>
            <div v-if="article.read_time_minutes" class="flex items-center gap-2">
              <UIcon name="i-lucide-clock" class="w-5 h-5" />
              <span class="text-base">{{ article.read_time_minutes }} min read</span>
            </div>
          </div>

          <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed mb-8 font-light">
            {{ article.summary }}
          </p>

          <div v-if="article.author_name" class="flex items-center gap-4 py-6 border-y border-gray-200 dark:border-gray-800">
            <UAvatar
              :src="article.author_avatar_url || undefined"
              :alt="article.author_name"
              size="xl"
            />
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Author</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ article.author_name }}
              </div>
            </div>
          </div>
        </header>

        <div v-if="article.image_url" class="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img :src="article.image_url" :alt="article.title" class="w-full h-auto object-cover" />
        </div>

        <div class="mb-12">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div class="p-8 md:p-12">
              <div class="article-content" v-html="formatContent(article.body)" />
            </div>
          </div>
        </div>

        <UCard v-if="canEdit" class="mb-10 border-2 border-primary-200 dark:border-primary-800">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-settings" class="w-5 h-5 text-primary-600" />
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">Editor actions</h3>
            </div>
          </template>
          <div class="flex flex-wrap gap-3">
            <UButton color="primary" icon="i-lucide-pencil" @click="editArticle" :disabled="isMutating">
              Edit
            </UButton>
            <UButton
              v-if="article.status !== 'PUBLISHED'"
              color="success"
              icon="i-lucide-send"
              :loading="isMutating"
              @click="changeStatus('PUBLISHED')"
            >
              Publish
            </UButton>
            <UButton
              v-if="article.status === 'PUBLISHED'"
              color="warning"
              variant="outline"
              icon="i-lucide-archive"
              :loading="isMutating"
              @click="changeStatus('ARCHIVED')"
            >
              Archive
            </UButton>
            <UButton
              v-if="article.status === 'ARCHIVED'"
              color="neutral"
              variant="outline"
              icon="i-lucide-undo-2"
              :loading="isMutating"
              @click="changeStatus('DRAFT')"
            >
              Back to draft
            </UButton>
            <UButton
              color="error"
              variant="outline"
              icon="i-lucide-trash-2"
              :loading="isMutating"
              @click="deleteArticle"
            >
              Delete
            </UButton>
          </div>
        </UCard>
      </article>
    </div>
  </UContainer>
</template>

<style scoped>
.article-content :deep(h2),
.article-content :deep(h3) {
  scroll-margin-top: 100px;
}
.article-content :deep(p) {
  font-size: 1.125rem;
  line-height: 1.8;
}
.article-content :deep(ul) {
  padding-left: 1.5rem;
}
.article-content :deep(li) {
  padding-left: 0.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.7;
}
</style>

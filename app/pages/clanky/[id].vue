<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})


const route = useRoute()
const router = useRouter()

interface Article {
  id: string
  title: string
  description: string
  date: string
  badge?: {
    label: string
    color: 'primary' | 'neutral'
  }
  image?: string
  authors?: Array<{
    name: string
    avatar?: {
      src: string
    }
  }>
  content?: string
  readTime?: string
}

// Article data (same as in clanky.vue)
const articles: Article[] = [
  {
    id: '0',
    title: 'New treatment options for rare sarcomas in 2024',
    description: 'Overview of the latest therapeutic approaches and clinical trials targeting the treatment of rare types of soft tissue and bone sarcomas.',
    date: '2024-11-15',
    badge: {
      label: 'Treatment',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Jana Nováková, Ph.D.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Jana+Novakova&background=9333ea&color=fff'
        }
      }
    ],
    readTime: '8 min',
    content: `
## Introduction

In recent years, significant progress has been made in the treatment of rare sarcomas. This article provides an overview of the latest therapeutic approaches and ongoing clinical trials.

## Targeted therapy

Targeted treatment represents a revolution in sarcoma therapy. Among the most promising are:

- **Tyrosine kinase inhibitors** - effective in GIST and some other types
- **Imatinib** - first-line choice in advanced GIST
- **Pazopanib** - registered for advanced soft tissue sarcomas

## Immunotherapy

Immunotherapy offers hope for some sarcoma types:

- Checkpoint inhibitors
- Combination regimens with chemotherapy
- Personalized approaches based on tumor-infiltrating lymphocytes

## Clinical trials in the Czech Republic

Several major clinical trials are currently underway in Czech centers, focused on:

1. New chemotherapy combinations
2. Targeted biological treatment
3. Radiotherapy techniques

## Conclusion

The treatment of rare sarcomas is constantly evolving. For optimal care, consultation with a specialized center and consideration of enrollment in a clinical trial are key.
    `
  },
  {
    id: '1',
    title: 'Sarcoma diagnostics: The role of modern imaging',
    description: 'The importance of MRI, CT and PET/CT scans in the diagnosis and staging of sarcomas. Practical tips for primary care physicians when ordering imaging methods.',
    date: '2024-10-28',
    badge: {
      label: 'Diagnostics',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    authors: [
      {
        name: 'Prof. MUDr. Petr Dvořák, CSc.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Petr+Dvorak&background=9333ea&color=fff'
        }
      }
    ],
    readTime: '10 min',
    content: `
## Basic imaging methods

Proper sarcoma diagnostics requires a combination of several imaging methods. Each has its specific indications and benefits.

## Magnetic resonance imaging (MRI)

MRI is the gold standard for:

- **Tumor extent assessment** - excellent soft tissue contrast
- **Relationship to vessels and nerves** - key for surgical planning
- **Local staging** - determining resectability

### Recommended sequences:
- T1-weighted images
- T2-weighted images with fat suppression
- T1-weighted images after contrast administration

## Computed tomography (CT)

CT examination is essential for:

- Assessment of pulmonary metastases
- Staging of bone sarcomas
- Evaluation of calcifications in the tumor

## PET/CT examination

PET/CT with 18F-FDG is useful for:

- Detection of distant metastases
- Treatment response assessment
- Biopsy planning (most active tumor area)

## Practical recommendations

For primary care physicians:

1. **When sarcoma is suspected** - order MRI of the affected area
2. **Before biopsy** - imaging should be complete
3. **For large tumors** (>5 cm) - consider staging chest CT
4. **Specialist consultation** - always before a planned excision

## Conclusion

Proper sarcoma diagnostics requires a multidisciplinary approach and the use of modern imaging methods. Early consultation with a specialized center is key.
    `
  },
  {
    id: '2',
    title: 'Multidisciplinary approach in sarcoma treatment',
    description: 'How oncologists, surgeons, radiologists and pathologists collaborate in the care of sarcoma patients. Experience from Czech centers of excellence.',
    date: '2024-10-10',
    badge: {
      label: 'Care',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Marie Svobodová',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Marie+Svobodova&background=9333ea&color=fff'
        }
      }
    ],
    readTime: '12 min',
    content: `
## The importance of a multidisciplinary team

Sarcoma treatment requires a coordinated approach across multiple specialties. In the Czech Republic, specialized centers operate with multidisciplinary teams (MDT).

## Team composition

A typical sarcoma MDT includes:

- **Surgical oncologist** - specialist in musculoskeletal tumors
- **Clinical oncologist** - systemic therapy and radiotherapy planning
- **Radiologist** - imaging assessment
- **Pathologist** - histological and molecular diagnostics
- **Radiation oncologist** - radiation planning

## Conduct of meetings

Regular MDT meetings address:

1. **New cases** - diagnosis, staging, treatment plan
2. **Patients during treatment** - response evaluation
3. **Complicated cases** - diagnosis review, strategy change

## Care coordination

Key roles are played by:

- **Case manager** - patient care coordinator
- **Primary care physician** - regular patient contact
- **Specialized center** - expertise and technical resources

## Benefits of the MDT approach

Studies show that patients treated in MDT centers have:

- Better overall survival
- Lower risk of local recurrence
- Higher chance of limb preservation

## How to refer a patient

For primary care physicians:

1. **Contact the specialized center** - before any excision
2. **Send complete documentation** - including images
3. **Inform the patient** - about the need for specialized care

## Conclusion

The multidisciplinary approach is the standard of care for sarcoma patients. Collaboration between the primary care physician and the specialized center is key to optimal outcomes.
    `
  }
]

const articleId = route.params.id as string
const article = computed(() => articles.find(a => a.id === articleId) || articles[0])

// Related articles (exclude current)
const relatedArticles = computed(() => 
  articles
    .filter(a => a.id !== articleId && a.badge?.label === article.value.badge?.label)
    .slice(0, 3)
)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.push('/clanky')
}

// Better content formatting function
const formatContent = (content: string) => {
  if (!content) return ''
  
  let formatted = content
    .trim()
    // Convert ## headers to h2
    .replace(/\n## (.+)/g, '<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-300 mt-12 mb-6 pb-4 border-b-2 border-primary-200">$1</h2>')
    // Convert ### headers to h3  
    .replace(/\n### (.+)/g, '<h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-300 mt-8 mb-4">$1</h3>')
    // Convert **bold** text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-300">$1</strong>')
    // Convert numbered lists with bold
    .replace(/\n(\d+)\. \*\*(.+?)\*\* - (.+)/g, '\n<li class="ml-6"><strong class="font-semibold text-gray-900 dark:text-gray-300">$2:</strong> <span class="text-gray-700 dark:text-gray-300">$3</span></li>')
    // Convert bullet points with bold
    .replace(/\n- \*\*(.+?)\*\* - (.+)/g, '\n<li class="ml-0"><strong class="font-semibold text-gray-900 dark:text-gray-300">$1:</strong> <span class="text-gray-700 dark:text-gray-300">$2</span></li>')
    // Convert simple numbered lists
    .replace(/\n(\d+)\. (.+)/g, '\n<li class="ml-6 text-gray-700 dark:text-gray-300 leading-relaxed">$2</li>')
    // Convert simple bullet points
    .replace(/\n- (.+)/g, '\n<li class="ml-0 text-gray-700 dark:text-gray-300 leading-relaxed">$1</li>')
    // Wrap consecutive li elements in ul/ol
    .replace(/(<li[^>]*>[\s\S]*?<\/li>)\n(?!<li)/g, '<ul class="space-y-3 my-6">$1</ul>\n')
    // Convert double newlines to paragraphs
    .replace(/\n\n(.+?)(?=\n\n|$)/g, '\n\n<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg">$1</p>')
    // Clean up any remaining newlines
    .replace(/^\n+/, '')
  
  // Wrap lists that weren't already wrapped
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\n)+/gs, (match) => {
    if (!match.includes('<ul') && !match.includes('<ol')) {
      return `<ul class="space-y-3 my-6 pl-6 list-disc marker:text-primary-600">${match}</ul>`
    }
    return match
  })
  
  return formatted
}
</script>

<template>
  <UContainer class="py-8 md:py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
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

      <!-- Article Header -->
      <article>
        <header class="mb-8">
          <!-- Badge -->
          <div v-if="article.badge" class="mb-4">
            <UBadge 
              :color="article.badge.color" 
              variant="subtle" 
              size="lg"
            >
              {{ article.badge.label }}
            </UBadge>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {{ article.title }}
          </h1>

          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="w-5 h-5" />
              <span class="text-base">{{ formatDate(article.date) }}</span>
            </div>
            <div v-if="article.readTime" class="flex items-center gap-2">
              <UIcon name="i-lucide-clock" class="w-5 h-5" />
              <span class="text-base">{{ article.readTime }} read</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-light">
            {{ article.description }}
          </p>

          <!-- Authors -->
          <div v-if="article.authors && article.authors.length > 0" class="flex items-center gap-4 py-6 border-y border-gray-200">
            <div class="flex items-center gap-4">
              <UAvatar
                v-for="(author, index) in article.authors"
                :key="index"
                :src="author.avatar?.src"
                :alt="author.name"
                size="xl"
              />
              <div>
                <div class="text-sm text-gray-500 mb-1">Author{{ article.authors.length > 1 ? 's' : '' }}</div>
                <div class="text-lg font-semibold text-gray-900">
                  {{ article.authors.map(a => a.name).join(', ') }}
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Featured Image -->
        <div v-if="article.image" class="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <img 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-auto object-cover"
          />
        </div>

        <!-- Article Content -->
        <div class="mb-12">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="p-8 md:p-12">
              <div 
                class="article-content"
                v-html="formatContent(article.content || '')"
              />
            </div>
          </div>
        </div>

        <!-- Key Takeaways -->
        <UCard class="mb-12 bg-primary-50 border-l-4 border-primary-600">
          <div class="flex items-start gap-6">
            <div class="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center shrink-0 shadow-lg">
              <UIcon name="i-lucide-lightbulb" class="w-7 h-7 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                Key takeaways
              </h3>
              <ul class="space-y-3 text-base text-gray-700">
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                  <span class="leading-relaxed">Always consult suspicious findings with a specialized center</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                  <span class="leading-relaxed">Early and correct diagnosis is the key to successful treatment</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                  <span class="leading-relaxed">A multidisciplinary approach improves treatment outcomes</span>
                </li>
              </ul>
            </div>
          </div>
        </UCard>
      </article>

      <!-- Related Articles -->
      <div v-if="relatedArticles.length > 0" class="mt-20 pt-12 border-t border-gray-200">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            Related articles
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="related in relatedArticles"
            :key="related.id"
            :to="`/clanky/${related.id}`"
            class="group"
          >
            <UCard class="h-full hover:shadow-xl transition-all overflow-hidden">
              <div v-if="related.image" class="relative h-40 overflow-hidden mb-4">
                <img 
                  :src="related.image" 
                  :alt="related.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-if="related.badge" class="absolute top-2 left-2">
                  <UBadge :color="related.badge.color" variant="solid" size="sm">
                    {{ related.badge.label }}
                  </UBadge>
                </div>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {{ related.title }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ related.description }}
              </p>
            </UCard>
          </NuxtLink>
        </div>
      </div>

      <!-- Contact CTA -->
      <UCard class="mt-16 bg-primary-50 border-2 border-primary-200">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex items-start gap-6">
            <div class="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0 shadow-lg">
              <UIcon name="i-lucide-mail" class="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                Do you have questions about diagnosis or treatment?
              </h3>
              <p class="text-base text-gray-700 leading-relaxed">
                Contact our specialized center or submit a case for review.
              </p>
            </div>
          </div>
          <NuxtLink to="/sarcoma-form" class="shrink-0">
            <UButton color="primary" size="xl" icon="i-lucide-file-text" class="shadow-lg">
              Submit case
            </UButton>
          </NuxtLink>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<style scoped>
.article-content :deep(h2) {
  scroll-margin-top: 100px;
}

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
  position: relative;
  padding-left: 0.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

.article-content :deep(ul > li)::marker {
  color: rgb(147, 51, 234);
  font-size: 1.2em;
}

.article-content :deep(strong) {
  color: rgb(17, 24, 39);
}

.article-content :deep(h2 + p),
.article-content :deep(h3 + p) {
  margin-top: 1rem;
}

.article-content :deep(ul + h2),
.article-content :deep(ul + h3),
.article-content :deep(p + h2),
.article-content :deep(p + h3) {
  margin-top: 2.5rem;
}
</style>

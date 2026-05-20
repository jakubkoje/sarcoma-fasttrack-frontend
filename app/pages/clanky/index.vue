<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})


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
  to?: string
}

const articles = ref<Article[]>([
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
    to: '/clanky/0'
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
        name: 'Prof. MUDr. Peter Dvorák, CSc.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Peter+Dvorak&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/1'
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
        name: 'MUDr. Mária Slobodová',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Maria+Slobodova&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/2'
  },
  {
    id: '3',
    title: 'Rare cases: Angiosarcoma and its variability',
    description: 'Overview of clinical manifestations, diagnostic pitfalls and therapeutic options for angiosarcoma - one of the rarest types of sarcomas.',
    date: '2024-09-22',
    badge: {
      label: 'Case study',
      color: 'neutral'
    },
    image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Tomáš Prochádzka, Ph.D.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Tomas+Prochadzka&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/3'
  },
  {
    id: '4',
    title: 'Genetic testing in sarcomas: What does it tell us?',
    description: 'Molecular genetic diagnostics of sarcomas and its importance for therapy selection. Overview of the most common mutations and translocations.',
    date: '2024-09-05',
    badge: {
      label: 'Genetics',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    authors: [
      {
        name: 'RNDr. Eva Malá, Ph.D.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Eva+Mala&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/4'
  },
  {
    id: '5',
    title: 'Pediatric sarcomas: Specifics in diagnostics and treatment',
    description: 'How the approach to sarcomas differs in pediatric patients. The most common types, prognostic factors and post-treatment follow-up.',
    date: '2024-08-18',
    badge: {
      label: 'Pediatrics',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Katarína Horáková',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Katarina+Horakova&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/5'
  },
  {
    id: '6',
    title: 'Immunotherapy in sarcomas: Reality and outlook',
    description: 'Current state of knowledge on the use of immunotherapy in sarcoma treatment. Which patients can be treated and what are the results of clinical trials.',
    date: '2024-08-01',
    badge: {
      label: 'Immunotherapy',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80',
    authors: [
      {
        name: 'Prof. MUDr. Martin Kolár, Ph.D.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Martin+Kolar&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/6'
  },
  {
    id: '7',
    title: 'Follow-up care after sarcoma treatment',
    description: 'Recommended follow-up schedule after primary sarcoma treatment. How to detect recurrence early and what to focus on during follow-up.',
    date: '2024-07-15',
    badge: {
      label: 'Follow-up',
      color: 'neutral'
    },
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Lucia Čermáková',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Lucia+Cermakova&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/7'
  },
  {
    id: '8',
    title: 'GIST: Gastrointestinal stromal tumors',
    description: 'Up-to-date information on the diagnosis and treatment of GIST, including the role of targeted therapy with imatinib and other tyrosine kinase inhibitors.',
    date: '2024-06-28',
    badge: {
      label: 'GIST',
      color: 'neutral'
    },
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Robert Novotný, Ph.D.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Robert+Novotny&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/8'
  }
])

const selectedCategory = ref<string>('all')
const searchQuery = ref('')

const categories = computed(() => {
  const cats = new Set<string>(['all'])
  articles.value.forEach(article => {
    if (article.badge) {
      cats.add(article.badge.label)
    }
  })
  return Array.from(cats)
})

const filteredArticles = computed(() => {
  let filtered = articles.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article => 
      article.badge?.label === selectedCategory.value
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const stats = computed(() => ({
  total: articles.value.length,
  lastUpdate: articles.value[0]?.date || new Date().toISOString().split('T')[0]
}))
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-2">
              Educational materials
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Key information and guidelines for the diagnosis and treatment of sarcomas in the Czech Republic
            </p>
          </div>
        </div>
      </div>

        <!-- Key Statistics Card -->
        <UCard class="mb-8 bg-linear-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-900 border-2 border-primary-200 dark:border-gray-800">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-700 mb-1">600</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">New cases per year in the Czech Republic</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-700 mb-1">4-5</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">Cases per 100,000 inhabitants</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-700 mb-1">70+</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">Different sarcoma subtypes</div>
            </div>
          </div>
        </UCard>

        <!-- Clinical Guidelines -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Czech Guidelines -->
          <UCard>
            <template #header>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-gray-300">Czech clinical practice guidelines</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Updated December 17, 2024</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">Soft tissue sarcomas – diagnostics and treatment</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Official clinical practice guideline issued by NIKEZ (Czech National Institute for Healthcare Quality and Excellence)
                </p>
                <a
                  href="https://kdp.uzis.cz/index.php?pg=kdp&id=22"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <span>View full guidelines</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">Key points of the guideline:</h4>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>A multidisciplinary approach is mandatory</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Treatment must take place in specialized centers</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Prefer neoadjuvant therapy for high-risk tumors</span>
                  </li>
                </ul>
              </div>
            </div>
          </UCard>

          <!-- European Guidelines -->
          <UCard>
            <template #header>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-gray-300">ESMO Clinical Practice Guidelines</h3>
                  <p class="text-sm text-gray-600 mt-1 dark:text-gray-300">With participation of Czech centers</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">ESMO–EURACAN–GENTURIS Guidelines 2024</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  European clinical practice guidelines for the diagnosis, treatment and follow-up of sarcomas with participation of Motol University Hospital Prague and Masaryk Memorial Cancer Institute Brno
                </p>
                <a
                  href="https://www.esmo.org/guidelines/guidelines-by-topic/sarcoma-and-gist"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  <span>ESMO Guidelines</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">Topics covered:</h4>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Soft tissue and visceral sarcomas</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Bone sarcomas (including pediatric)</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Gastrointestinal stromal tumors (GIST)</span>
                  </li>
                </ul>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Czech Sarcoma Centers -->
        <UCard>
          <template #header>
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-300">Specialized centers in the Czech Republic</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Reference centers for sarcoma treatment</p>
              </div>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://www.mou.cz/centrum-pro-sarkomy/t1275"
              target="_blank"
              rel="noopener noreferrer"
              class="group"
            >
              <div class="p-4 border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-500 dark:hover:border-gray-800 hover:bg-primary-50 transition-all dark:hover:bg-gray-800">
                <div class="flex items-start gap-4 mb-3">
                  <div class="w-16 h-16 rounded-lg bg-white flex items-center justify-center shrink-0 p-2 border border-gray-100">
                    <img
                      src="/mou-logo.jpg"
                      alt="Masaryk Memorial Cancer Institute logo"
                      class="w-full h-full object-contain"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-700">Masaryk Memorial Cancer Institute</h4>
                      <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Sarcoma Center, Brno</p>
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>Žlutý kopec 7, 656 53 Brno</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            <a
              href="https://www.fnmotol.cz/"
              target="_blank"
              rel="noopener noreferrer"
              class="group"
            >
              <div class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all dark:border-gray-800 dark:hover:border-gray-800 dark:hover:bg-gray-800">
                <div class="flex items-start gap-4 mb-3">
                  <div class="w-16 h-16 rounded-lg bg-white flex items-center justify-center shrink-0 p-2 border border-gray-100">
                    <img
                      src="/fn-motol.jpg"
                      alt="Motol University Hospital logo"
                      class="w-full h-full object-contain"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-700">Motol University Hospital</h4>
                      <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Department of Oncology, Prague</p>
                    <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>V Úvalu 84, 150 06 Praha 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </UCard>
      </div>

      <!-- Info Card -->
      <div class="mt-16 mb-8">
        <UCard class="bg-primary-50 dark:bg-gray-800">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-gray-300 mb-1">
                Sarcoma treatment center
              </h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                These articles are intended primarily for physicians and healthcare professionals.
                For the best care of sarcoma patients, we recommend consultation with
                a specialized center.
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-300 mb-2">
              Expert articles on sarcomas
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Current information and findings on the diagnosis and treatment of rare sarcomas
            </p>
          </div>
          <UBadge color="primary" variant="subtle" size="lg">
            {{ stats.total }} articles
          </UBadge>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="mb-8 space-y-4">
        <!-- Search Box -->
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

        <!-- Category Filter Pills -->
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
      </div>

      <!-- Articles Grid -->
      <div v-if="filteredArticles.length > 0">
        <UBlogPosts :posts="filteredArticles" orientation="horizontal" />
      </div>

      <!-- Empty State -->
      <UEmpty
        v-else
        title="No articles found"
        description="Try changing your search criteria or category filter."
        icon="i-lucide-search"
      >
        <template #actions>
          <UButton
            color="primary"
            @click="() => { searchQuery = ''; selectedCategory = 'all' }"
          >
            Reset filters
          </UButton>
        </template>
      </UEmpty>

      <!-- Resources Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-6">
          Other information sources
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a 
            href="https://hlaspacientu.cz/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="block group h-full"
          >
            <UCard class="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-lg bg-white flex items-center justify-center shrink-0 p-1 group-hover:scale-105 transition-transform">
                  <img
                    src="/hop-logo.png"
                    alt="Voice of Oncology Patients logo"
                    class="w-full h-full object-contain"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-700 transition-colors">Voice of Oncology Patients</h3>
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Support and information for patients and their families</p>
                </div>
              </div>
            </UCard>
          </a>

          <a
            href="https://cancermeeting.cz/"
            target="_blank"
            rel="noopener noreferrer"
            class="block group"
          >
            <UCard class="hover:shadow-lg transition-shadow cursor-pointer">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-blue-700 transition-colors">CACR Meeting 2025</h3>
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Czech Annual Cancer Research Meeting</p>
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>November 24-26, 2025, Olomouc</span>
                  </div>
                </div>
              </div>
            </UCard>
          </a>

          <a
            href="https://www.esmo.org/meeting-calendar/esmo-sarcoma-and-rare-cancers-congress-2025"
            target="_blank"
            rel="noopener noreferrer"
            class="block group h-full"
          >
            <UCard class="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-emerald-700 transition-colors">ESMO Sarcoma Congress</h3>
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">ESMO Sarcoma and Rare Cancers Congress</p>
                  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Annually (March), Lugano, Switzerland</span>
                  </div>
                </div>
              </div>
            </UCard>
          </a>
        </div>
    </div>
  </UContainer>
</template>


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
    title: 'Nové možnosti léčby vzácných sarkomů v roce 2024',
    description: 'Přehled nejnovějších terapeutických přístupů a klinických studií zaměřených na léčbu vzácných typů sarkomů měkkých tkání a kostí.',
    date: '2024-11-15',
    badge: {
      label: 'Léčba',
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
    title: 'Diagnostika sarkomů: Role moderního zobrazení',
    description: 'Význam MRI, CT a PET/CT vyšetření v diagnostice a stagingu sarkomů. Praktické tipy pro primární lékaře při indikaci zobrazovacích metod.',
    date: '2024-10-28',
    badge: {
      label: 'Diagnostika',
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
    to: '/clanky/1'
  },
  {
    id: '2',
    title: 'Multidisciplinární přístup v léčbě sarkomů',
    description: 'Jak probíhá spolupráce onkologů, chirurgů, radiologů a patologů v péči o pacienty se sarkomy. Zkušenosti z českých center excelence.',
    date: '2024-10-10',
    badge: {
      label: 'Péče',
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
    to: '/clanky/2'
  },
  {
    id: '3',
    title: 'Raritní případy: Angiosarkom a jeho variabilita',
    description: 'Přehled klinických projevů, diagnostických nástrah a terapeutických možností u angiosarkomu - jednoho z nejvzácnějších typů sarkomů.',
    date: '2024-09-22',
    badge: {
      label: 'Kazuistika',
      color: 'neutral'
    },
    image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Tomáš Procházka, Ph.D.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Tomas+Prochazka&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/3'
  },
  {
    id: '4',
    title: 'Genetické vyšetření u sarkomů: Co nám říká?',
    description: 'Molekulárně genetická diagnostika sarkomů a její význam pro volbu terapie. Přehled nejčastějších mutací a translokací.',
    date: '2024-09-05',
    badge: {
      label: 'Genetika',
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
    title: 'Pediatrické sarkomy: Specifika v diagnostice a léčbě',
    description: 'Jak se liší přístup k sarkomům u dětských pacientů. Nejčastější typy, prognostické faktory a sledování po léčbě.',
    date: '2024-08-18',
    badge: {
      label: 'Pediatrie',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Kateřina Horáková',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Katerina+Horakova&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/5'
  },
  {
    id: '6',
    title: 'Imunoterapie u sarkomů: Realita a perspektivy',
    description: 'Současný stav poznatků o využití imunoterapie v léčbě sarkomů. Které pacienty lze léčit a jaké jsou výsledky klinických studií.',
    date: '2024-08-01',
    badge: {
      label: 'Imunoterapie',
      color: 'primary'
    },
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80',
    authors: [
      {
        name: 'Prof. MUDr. Martin Kolář, Ph.D.',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Martin+Kolar&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/6'
  },
  {
    id: '7',
    title: 'Následná péče po léčbě sarkomu',
    description: 'Doporučené schéma kontrol po ukončení primární léčby sarkomu. Jak včas rozpoznat recidivu a na co se zaměřit při kontrolách.',
    date: '2024-07-15',
    badge: {
      label: 'Follow-up',
      color: 'neutral'
    },
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    authors: [
      {
        name: 'MUDr. Lucie Čermáková',
        avatar: {
          src: 'https://ui-avatars.com/api/?name=Lucie+Cermakova&background=9333ea&color=fff'
        }
      }
    ],
    to: '/clanky/7'
  },
  {
    id: '8',
    title: 'GIST: Gastrointestinální stromální tumory',
    description: 'Aktuální informace o diagnostice a léčbě GIST včetně role cílené terapie imatinibem a dalšími tyrosinkinázovými inhibitory.',
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
              Edukační materiály
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Klíčové informace a postupy pro diagnostiku a léčbu sarkomů v České republice
            </p>
          </div>
        </div>
      </div>

        <!-- Key Statistics Card -->
        <UCard class="mb-8 bg-linear-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-900 border-2 border-primary-200 dark:border-gray-800">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-700 mb-1">600</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">Nových případů ročně v ČR</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-700 mb-1">4-5</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">Případů na 100 000 obyvatel</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-700 mb-1">70+</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">Různých subtypů sarkomů</div>
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
                  <h3 class="text-lg font-bold text-gray-900 dark:text-gray-300">České klinické doporučené postupy</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Aktualizováno 17. 12. 2024</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">Sarkomy měkkých tkání – diagnostika a léčba</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Oficiální klinický doporučený postup vydaný NIKEZ (Národní institut kvality a excelence zdravotnictví)
                </p>
                <a
                  href="https://kdp.uzis.cz/index.php?pg=kdp&id=22"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <span>Zobrazit kompletní postupy</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">Klíčové body postupu:</h4>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Multidisciplinární přístup je povinný</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Léčba musí probíhat ve specializovaných centrech</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>U rizikových tumorů preferovat neoadjuvantní léčbu</span>
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
                  <p class="text-sm text-gray-600 mt-1 dark:text-gray-300">S účastí českých center</p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">ESMO–EURACAN–GENTURIS Guidelines 2024</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Evropské doporučené postupy pro diagnostiku, léčbu a follow-up sarkomů s účastí FN Motol Praha a MOÚ Brno
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
                <h4 class="font-semibold text-gray-900 dark:text-gray-300 mb-2">Pokryté oblasti:</h4>
                <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Sarkomy měkkých tkání a viscerální sarkomy</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Kostní sarkomy (včetně pediatrických)</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Gastrointestinální stromální tumory (GIST)</span>
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
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-300">Specializovaná centra v ČR</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Referenční pracoviště pro léčbu sarkomů</p>
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
                      alt="Masarykův onkologický ústav logo"
                      class="w-full h-full object-contain"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-700">Masarykův onkologický ústav</h4>
                      <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Centrum pro sarkomy, Brno</p>
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
                      alt="Fakultní nemocnice Motol logo"
                      class="w-full h-full object-contain"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-700">Fakultní nemocnice Motol</h4>
                      <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Onkologická klinika, Praha</p>
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
                Centrum pro léčbu sarkomů
              </h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Tyto články jsou určeny primárně lékařům a zdravotnickým pracovníkům.
                Pro nejlepší péči o pacienty se sarkomy doporučujeme konzultaci se
                specializovaným centrem.
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
              Odborné články o sarkomech
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Aktuální informace a poznatky o diagnostice a léčbě vzácných sarkomů
            </p>
          </div>
          <UBadge color="primary" variant="subtle" size="lg">
            {{ stats.total }} článků
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
            placeholder="Hledat články..."
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
            {{ category === 'all' ? 'Všechny kategorie' : category }}
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
        title="Nenalezeny žádné články"
        description="Zkuste změnit vyhledávací kritéria nebo filtr kategorie."
        icon="i-lucide-search"
      >
        <template #actions>
          <UButton
            color="primary"
            @click="() => { searchQuery = ''; selectedCategory = 'all' }"
          >
            Resetovat filtry
          </UButton>
        </template>
      </UEmpty>

      <!-- Resources Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-6">
          Další zdroje informací
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
                    alt="Hlas onkologických pacientů logo" 
                    class="w-full h-full object-contain"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-300 group-hover:text-primary-700 transition-colors">Hlas onkologických pacientů</h3>
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Podpora a informace pro pacienty a jejich rodiny</p>
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
                    <span>24-26 listopadu 2025, Olomouc</span>
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
                    <span>Každoročně (březen), Lugano, Švýcarsko</span>
                  </div>
                </div>
              </div>
            </UCard>
          </a>
        </div>
    </div>
  </UContainer>
</template>


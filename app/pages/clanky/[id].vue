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
    readTime: '8 min',
    content: `
## Úvod

V posledních letech došlo k významnému pokroku v léčbě vzácných sarkomů. Tento článek poskytuje přehled nejnovějších terapeutických přístupů a probíhajících klinických studií.

## Cílená terapie

Cílená léčba představuje revoluci v terapii sarkomů. Mezi nejslibnější patří:

- **Inhibitory tyrozinkináz** - účinné u GIST a některých dalších typů
- **Imatinib** - první volba u pokročilého GIST
- **Pazopanib** - registrován pro pokročilé měkkotkáňové sarkomy

## Imunoterapie

Imunoterapie přináší naději u některých typů sarkomů:

- Inhibitory kontrolních bodů (checkpoint inhibitors)
- Kombinované režimy s chemoterapií
- Personalizované přístupy založené na tumor-infiltrujících lymfocytech

## Klinické studie v ČR

V současnosti probíhají v českých centrech několik významných klinických studií zaměřených na:

1. Nové kombinace chemoterapeutik
2. Cílená biologická léčba
3. Radioterapeutické techniky

## Závěr

Léčba vzácných sarkomů se neustále vyvíjí. Pro optimální péči je klíčová konzultace se specializovaným centrem a zvážení zařazení pacienta do klinické studie.
    `
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
    readTime: '10 min',
    content: `
## Základní zobrazovací metody

Správná diagnostika sarkomů vyžaduje kombinaci několika zobrazovacích metod. Každá má své specifické indikace a přínos.

## Magnetická rezonance (MRI)

MRI je zlatým standardem pro:

- **Hodnocení rozsahu tumoru** - vynikající kontrast měkkých tkání
- **Vztah k cévám a nervům** - klíčové pro plánování operace
- **Staging lokálního nálezu** - určení resekability

### Doporučené sekvence:
- T1 vážené obrazy
- T2 vážené obrazy s potlačením tuku
- T1 vážené obrazy po aplikaci kontrastu

## Výpočetní tomografie (CT)

CT vyšetření je nezbytné pro:

- Hodnocení plicních metastáz
- Staging kostních sarkomů
- Hodnocení kalcifikací v tumoru

## PET/CT vyšetření

PET/CT s 18F-FDG nachází uplatnění při:

- Detekci vzdálených metastáz
- Hodnocení odpovědi na léčbu
- Plánování biopsie (nejaktivnější oblast tumoru)

## Praktická doporučení

Pro primární lékaře platí:

1. **Při podezření na sarkom** - indikovat MRI postižené oblasti
2. **Před biopsií** - vyšetření by mělo být kompletní
3. **U velkých tumorů** (>5 cm) - zvážit staging CT hrudníku
4. **Konzultace se specialistou** - vždy před plánovanou excizí

## Závěr

Správná diagnostika sarkomů vyžaduje multidisciplinární přístup a využití moderních zobrazovacích metod. Časná konzultace se specializovaným centrem je klíčová.
    `
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
    readTime: '12 min',
    content: `
## Význam multidisciplinárního týmu

Léčba sarkomů vyžaduje koordinovaný přístup více odborností. V České republice fungují specializovaná centra s multidisciplinárními týmy (MDT).

## Složení týmu

Typický MDT pro sarkomy zahrnuje:

- **Chirurg-onkolog** - specialista na nádory pohybového aparátu
- **Klinický onkolog** - systémová léčba a plánování radioterapie
- **Radiolog** - hodnocení zobrazovacích metod
- **Patolog** - histologická a molekulární diagnostika
- **Radioterapeut** - plánování ozařování

## Průběh konzilií

Na pravidelných konziliích se projednávají:

1. **Nové případy** - diagnóza, staging, plán léčby
2. **Pacienti v průběhu léčby** - hodnocení odpovědi
3. **Komplikované případy** - revize diagnózy, změna strategie

## Koordinace péče

Klíčové role hraje:

- **Case manager** - koordinátor péče pro pacienta
- **Primární lékař** - pravidelný kontakt s pacientem
- **Specializované centrum** - expertise a technické zázemí

## Výhody MDT přístupu

Studie ukazují, že pacienti léčení v centrech s MDT mají:

- Lepší celkové přežití
- Nižší riziko lokální recidivy
- Vyšší šanci na zachování končetiny

## Jak referovat pacienta

Pro primární lékaře:

1. **Kontaktovat specializované centrum** - před jakoukoli excizí
2. **Zaslat kompletní dokumentaci** - včetně snímků
3. **Informovat pacienta** - o nutnosti specializované péče

## Závěr

Multidisciplinární přístup je standardem péče o pacienty se sarkomy. Spolupráce primárního lékaře se specializovaným centrem je klíčová pro optimální výsledky.
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
  return date.toLocaleDateString('cs-CZ', { 
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
          Zpět na články
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
              <span class="text-base">{{ article.readTime }} čtení</span>
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
                <div class="text-sm text-gray-500 mb-1">Autor{{ article.authors.length > 1 ? 'i' : '' }}</div>
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
                Klíčové poznatky
              </h3>
              <ul class="space-y-3 text-base text-gray-700">
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                  <span class="leading-relaxed">Vždy konzultujte podezřelé nálezy se specializovaným centrem</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                  <span class="leading-relaxed">Včasná a správná diagnostika je klíčem k úspěšné léčbě</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                  <span class="leading-relaxed">Multidisciplinární přístup zlepšuje výsledky léčby</span>
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
            Související články
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
                Máte dotazy k diagnostice nebo léčbě?
              </h3>
              <p class="text-base text-gray-700 leading-relaxed">
                Kontaktujte naše specializované centrum nebo odešlete případ k posouzení.
              </p>
            </div>
          </div>
          <NuxtLink to="/sarcoma-form" class="shrink-0">
            <UButton color="primary" size="xl" icon="i-lucide-file-text" class="shadow-lg">
              Odeslat případ
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

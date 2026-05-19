<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})


// Chart data
const monthlyTrend = ref([
  { month: 'Leden', cases: 42, consultations: 18, processed: 35 },
  { month: 'Únor', cases: 58, consultations: 24, processed: 48 },
  { month: 'Březen', cases: 67, consultations: 31, processed: 59 },
  { month: 'Duben', cases: 80, consultations: 45, processed: 72 },
  { month: 'Květen', cases: 92, consultations: 52, processed: 85 },
  { month: 'Červen', cases: 105, consultations: 68, processed: 98 }
])

const weeklyData = ref([
  { day: 'Po', cases: 12, consultations: 8 },
  { day: 'Út', cases: 15, consultations: 10 },
  { day: 'St', cases: 18, consultations: 12 },
  { day: 'Čt', cases: 14, consultations: 9 },
  { day: 'Pá', cases: 11, consultations: 7 },
  { day: 'So', cases: 6, consultations: 3 },
  { day: 'Ne', cases: 4, consultations: 2 }
])

const statusDistribution = ref([
  { label: 'Zpracováno', value: 89, color: '#10b981' },
  { label: 'Čeká na zpracování', value: 45, color: '#f59e0b' },
  { label: 'Koncept', value: 23, color: '#6b7280' }
])

const patientTypeDistribution = ref([
  { label: 'Nový pacient', value: 142, color: '#D89FC4' },
  { label: 'Existující pacient', value: 105, color: '#c67aa8' }
])

const timeComparison = ref([
  { metric: 'Konzultace s expertem', before: 28, after: 4 },
  { metric: 'Zpracování žádosti', before: 14, after: 2 },
  { metric: 'První konzultace', before: 21, after: 3 },
  { metric: 'Celková doba', before: 35, after: 5 }
])

const hospitalPerformance = ref([
  { hospital: 'FN Motol', cases: 178, avgTime: 2.8, satisfaction: 100 },
  { hospital: 'FN Brno', cases: 89, avgTime: 3.2, satisfaction: 96 },
  { hospital: 'FN Olomouc', cases: 45, avgTime: 4.1, satisfaction: 92 },
  { hospital: 'Ostatní', cases: 35, avgTime: 4.5, satisfaction: 88 }
])

const ageDistribution = ref([
  { range: '0-20', count: 12 },
  { range: '21-40', count: 45 },
  { range: '41-60', count: 89 },
  { range: '61-80', count: 78 },
  { range: '80+', count: 23 }
])

const detectionStage = ref([
  { stage: 'Velmi brzy (I)', count: 34, color: '#10b981' },
  { stage: 'Brzy (II)', count: 58, color: '#84cc16' },
  { stage: 'Středně (III)', count: 45, color: '#f59e0b' },
  { stage: 'Pozdně (IV)', count: 23, color: '#ef4444' }
])

const responseTimeData = ref([
  { hour: 0, responses: 2 }, { hour: 1, responses: 1 }, { hour: 2, responses: 0 },
  { hour: 3, responses: 0 }, { hour: 4, responses: 1 }, { hour: 5, responses: 2 },
  { hour: 6, responses: 3 }, { hour: 7, responses: 5 }, { hour: 8, responses: 12 },
  { hour: 9, responses: 18 }, { hour: 10, responses: 22 }, { hour: 11, responses: 25 },
  { hour: 12, responses: 28 }, { hour: 13, responses: 24 }, { hour: 14, responses: 26 },
  { hour: 15, responses: 29 }, { hour: 16, responses: 27 }, { hour: 17, responses: 23 },
  { hour: 18, responses: 19 }, { hour: 19, responses: 15 }, { hour: 20, responses: 12 },
  { hour: 21, responses: 8 }, { hour: 22, responses: 5 }, { hour: 23, responses: 3 }
])

// Chart dimensions
const chartWidth = 1000
const chartHeight = 400
const padding = { top: 40, right: 165, bottom: 60, left: 0 }

// Computed values for charts
const maxCases = computed(() => Math.max(...monthlyTrend.value.map(d => d.cases)))
const maxConsultations = computed(() => Math.max(...monthlyTrend.value.map(d => d.consultations)))

const totalStatus = computed(() => statusDistribution.value.reduce((sum, item) => sum + item.value, 0))
const totalPatients = computed(() => patientTypeDistribution.value.reduce((sum, item) => sum + item.value, 0))

// Computed chart dimensions
const chartRight = computed(() => chartWidth - padding.right)
const chartBottom = computed(() => chartHeight - padding.bottom)
const chartWidthInner = computed(() => chartWidth - padding.left - padding.right)
const chartHeightInner = computed(() => chartHeight - padding.top - padding.bottom)

// Animation
const animatedValue = ref(0)
const chartsVisible = ref(false)

onMounted(() => {
  // Animate main value
  const duration = 2000
  const steps = 60
  const increment = 85.7 / steps
  const stepDuration = duration / steps
  
  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= 85.7) {
      animatedValue.value = 85.7
      clearInterval(timer)
    } else {
      animatedValue.value = current
    }
  }, stepDuration)

  // Trigger chart animations
  setTimeout(() => {
    chartsVisible.value = true
  }, 300)
})

// Helper functions for charts
const getX = (index: number, total: number, width: number) => {
  if (total <= 1) return 0
  return (index / (total - 1)) * width
}

const getY = (value: number, max: number, height: number) => {
  if (max === 0) return height
  return height - (value / max) * height
}

const getBarHeight = (value: number, max: number, height: number) => {
  if (max === 0) return 0
  return (value / max) * height
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
    <UContainer class="py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analýza dopadu systému
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-300 mb-4">
          Vizuální analýza efektivity
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Komplexní přehled dat a trendů v systému pro rychlé odesílání pacientů se sarkomy
        </p>
        
        <!-- Main Impact Card -->
        <div class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-br from-primary-500 to-primary-700 text-white border-0 shadow-2xl rounded-lg overflow-hidden">
            <div class="p-8 md:p-12">
              <div class="flex flex-col md:flex-row items-center justify-between gap-8">
                <div class="flex-1 text-center md:text-left">
                  <p class="text-primary-100 text-lg mb-2">Průměrné zkrácení času</p>
                  <div class="flex items-baseline gap-2 justify-center md:justify-start">
                    <span class="text-7xl md:text-8xl font-bold">{{ Math.round(animatedValue) }}%</span>
                    <span class="text-3xl text-primary-200">rychleji</span>
                  </div>
                  <p class="text-primary-100 mt-4 text-lg">
                    Od <span class="font-bold text-white">28 dní</span> na <span class="font-bold text-white">4 dny</span> do konzultace s expertem
                  </p>
                </div>
                <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                  <svg class="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Line Chart: Monthly Trends -->
      <div class="mb-16">
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">Měsíční trendy</h2>
              <p class="text-gray-600 dark:text-gray-300">Vývoj počtu případů, konzultací a zpracovaných žádostí</p>
            </div>
            
            <div class="overflow-x-auto -mx-4 px-4">
              <div class="min-w-[800px]">
                <svg :width="chartWidth" :height="chartHeight" class="w-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                <!-- Grid lines -->
                <defs>
                  <linearGradient id="casesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#D89FC4;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#D89FC4;stop-opacity:0" />
                  </linearGradient>
                  <linearGradient id="consultationsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
                  </linearGradient>
                </defs>
                
                <!-- Y-axis grid -->
                <g v-for="i in 5" :key="i">
                  <line
                    :x1="padding.left"
                    :y1="padding.top + ((i - 1) * chartHeightInner / 4)"
                    :x2="chartRight"
                    :y2="padding.top + ((i - 1) * chartHeightInner / 4)"
                    stroke="#e5e7eb"
                    stroke-width="1"
                  />
                  <text
                    :x="padding.left - 10"
                    :y="padding.top + ((i - 1) * chartHeightInner / 4) + 4"
                    text-anchor="end"
                    class="text-xs fill-gray-500"
                  >
                    {{ Math.round((maxCases / 4) * (5 - i)) }}
                  </text>
                </g>
                
                <!-- Area for cases -->
                <path
                  :d="(() => {
                    const points = monthlyTrend.map((d, i) => {
                      const x = padding.left + getX(i, monthlyTrend.length - 1, chartWidthInner - padding.right)
                      const y = padding.top + getY(d.cases, maxCases, chartHeightInner)
                      return { x, y }
                    })
                    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
                    return `${pathData} L ${points[points.length - 1].x},${chartBottom} L ${padding.left},${chartBottom} Z`
                  })()"
                  fill="url(#casesGradient)"
                  :class="{ 'opacity-0': !chartsVisible }"
                  class="transition-opacity duration-1000"
                />
                
                <!-- Line for cases -->
                <polyline
                  :points="monthlyTrend.map((d, i) => {
                    const x = padding.left + getX(i, monthlyTrend.length - 1, chartWidthInner - padding.right)
                    const y = padding.top + getY(d.cases, maxCases, chartHeightInner)
                    return `${x},${y}`
                  }).join(' ')"
                  fill="none"
                  stroke="#D89FC4"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="{ 'opacity-0': !chartsVisible }"
                  class="transition-opacity duration-1000"
                />
                
                <!-- Line for consultations -->
                <polyline
                  :points="monthlyTrend.map((d, i) => {
                    const x = padding.left + getX(i, monthlyTrend.length - 1, chartWidthInner - padding.right)
                    const y = padding.top + getY(d.consultations, maxCases, chartHeightInner)
                    return `${x},${y}`
                  }).join(' ')"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-dasharray="5,5"
                  :class="{ 'opacity-0': !chartsVisible }"
                  class="transition-opacity duration-1000"
                />
                
                <!-- Data points for cases -->
                <g v-for="(d, i) in monthlyTrend" :key="`case-${i}`">
                  <circle
                    :cx="padding.left + getX(i, monthlyTrend.length - 1, chartWidthInner - padding.right)"
                    :cy="padding.top + getY(d.cases, maxCases, chartHeightInner)"
                    r="5"
                    fill="#D89FC4"
                    stroke="white"
                    stroke-width="2"
                    :class="{ 'opacity-0': !chartsVisible }"
                    class="transition-opacity duration-1000"
                    :style="`transition-delay: ${i * 100}ms`"
                  />
                </g>
                
                <!-- Data points for consultations -->
                <g v-for="(d, i) in monthlyTrend" :key="`consult-${i}`">
                  <circle
                    :cx="padding.left + getX(i, monthlyTrend.length - 1, chartWidthInner - padding.right)"
                    :cy="padding.top + getY(d.consultations, maxCases, chartHeightInner)"
                    r="5"
                    fill="#3b82f6"
                    stroke="white"
                    stroke-width="2"
                    :class="{ 'opacity-0': !chartsVisible }"
                    class="transition-opacity duration-1000"
                    :style="`transition-delay: ${i * 100}ms`"
                  />
                </g>
                
                <!-- X-axis labels -->
                <g v-for="(d, i) in monthlyTrend" :key="`label-${i}`">
                  <text
                    :x="padding.left + getX(i, monthlyTrend.length - 1, chartWidthInner)"
                    :y="chartBottom + 20"
                    text-anchor="middle"
                    class="text-xs fill-gray-600"
                  >
                    {{ d.month.substring(0, 3) }}
                  </text>
                </g>
                
                <!-- Legend -->
                <g transform="translate(0, 40)">
                  <rect x="0" y="0" width="160" height="60" fill="white" stroke="#e5e7eb" rx="4" stroke-width="1" />
                  <line x1="10" y1="20" x2="40" y2="20" stroke="#D89FC4" stroke-width="3" />
                  <text x="50" y="24" class="text-sm fill-gray-700">Případy</text>
                  <line x1="10" y1="45" x2="40" y2="45" stroke="#3b82f6" stroke-width="3" stroke-dasharray="5,5" />
                  <text x="50" y="49" class="text-sm fill-gray-700">Konzultace</text>
                </g>
                </svg>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Bar Chart: Time Comparison -->
      <div class="mb-16">
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">Porovnání časů</h2>
              <p class="text-gray-600 dark:text-gray-300">Před a po zavedení systému (ve dnech)</p>
            </div>
            
            <div class="overflow-x-auto">
              <svg :width="chartWidth" :height="chartHeight" class="w-full" viewBox="0 0 800 400">
                <!-- Grid -->
                <g v-for="i in 8" :key="i">
                  <line
                    :x1="padding.left"
                    :y1="padding.top + ((i - 1) * chartHeightInner / 7)"
                    :x2="chartRight"
                    :y2="padding.top + ((i - 1) * chartHeightInner / 7)"
                    stroke="#e5e7eb"
                    stroke-width="1"
                  />
                </g>
                
                <!-- Bars -->
                <g v-for="(item, index) in timeComparison" :key="index">
                  <g :transform="`translate(${padding.left + (index * chartWidthInner / timeComparison.length) + 40}, 0)`">
                    <!-- Before bar -->
                    <rect
                      :x="0"
                      :y="padding.top + getY(item.before, 35, chartHeightInner)"
                      :width="60"
                      :height="getBarHeight(item.before, 35, chartHeightInner)"
                      fill="#9ca3af"
                      :rx="4"
                      :class="{ 'opacity-0': !chartsVisible }"
                      class="transition-all duration-500"
                      :style="`transition-delay: ${index * 100}ms`"
                    />
                    <!-- After bar -->
                    <rect
                      :x="70"
                      :y="padding.top + getY(item.after, 35, chartHeightInner)"
                      :width="60"
                      :height="getBarHeight(item.after, 35, chartHeightInner)"
                      fill="#D89FC4"
                      :rx="4"
                      :class="{ 'opacity-0': !chartsVisible }"
                      class="transition-all duration-500"
                      :style="`transition-delay: ${index * 100 + 50}ms`"
                    />
                    <!-- Labels -->
                    <text
                      :x="30"
                      :y="padding.top + getY(item.before, 35, chartHeightInner) - 8"
                      text-anchor="middle"
                      class="text-sm fill-gray-700 font-semibold"
                    >
                      {{ item.before }}d
                    </text>
                    <text
                      :x="100"
                      :y="padding.top + getY(item.after, 35, chartHeightInner) - 8"
                      text-anchor="middle"
                      class="text-sm fill-primary-700 font-semibold"
                    >
                      {{ item.after }}d
                    </text>
                    <!-- X-axis label -->
                    <text
                      :x="65"
                      :y="chartBottom + 25"
                      text-anchor="middle"
                      class="text-xs fill-gray-600"
                    >
                      {{ item.metric }}
                    </text>
                  </g>
                </g>
                
                <!-- Y-axis labels -->
                <g v-for="i in 8" :key="i">
                  <text
                    :x="padding.left - 10"
                    :y="padding.top + ((i - 1) * chartHeightInner / 7) + 4"
                    text-anchor="end"
                    class="text-xs fill-gray-500"
                  >
                    {{ Math.round((35 / 7) * (8 - i)) }}
                  </text>
                </g>
                
                <!-- Legend -->
                <g transform="translate(750, 0)">
                  <rect x="0" y="0" width="120" height="60" fill="white" stroke="#e5e7eb" rx="4" stroke-width="1" />
                  <rect x="10" y="15" width="24" height="12" fill="#9ca3af" rx="2" />
                  <text x="40" y="24" class="text-sm fill-gray-700">Před</text>
                  <rect x="10" y="35" width="24" height="12" fill="#D89FC4" rx="2" />
                  <text x="40" y="44" class="text-sm fill-gray-700">Po</text>
                </g>
              </svg>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Pie Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        <!-- Status Distribution Pie Chart -->
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">Rozložení stavů</h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Distribuce případů podle stavu</p>
            </div>
            
            <div class="flex items-center justify-center">
              <svg width="300" height="300" viewBox="0 0 300 300">
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
                  </filter>
                </defs>
                
                <g transform="translate(150, 150)">
                  <g v-for="(item, index) in statusDistribution" :key="index">
                    <path
                      :d="(() => {
                        const startAngle = statusDistribution.slice(0, index).reduce((sum, i) => sum + (i.value / totalStatus) * 360, 0) * Math.PI / 180
                        const endAngle = statusDistribution.slice(0, index + 1).reduce((sum, i) => sum + (i.value / totalStatus) * 360, 0) * Math.PI / 180
                        const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0
                        const x1 = Math.cos(startAngle) * 100
                        const y1 = Math.sin(startAngle) * 100
                        const x2 = Math.cos(endAngle) * 100
                        const y2 = Math.sin(endAngle) * 100
                        return `M 0,0 L ${x1},${y1} A 100,100 0 ${largeArc},1 ${x2},${y2} Z`
                      })()"
                      :fill="item.color"
                      filter="url(#shadow)"
                      :class="{ 'opacity-0': !chartsVisible }"
                      class="transition-opacity duration-500"
                      :style="`transition-delay: ${index * 150}ms`"
                    />
                    <!-- Label -->
                    <text
                      :x="Math.cos((statusDistribution.slice(0, index).reduce((sum, i) => sum + (i.value / totalStatus) * 360, 0) + (item.value / totalStatus) * 180) * Math.PI / 180) * 130"
                      :y="Math.sin((statusDistribution.slice(0, index).reduce((sum, i) => sum + (i.value / totalStatus) * 360, 0) + (item.value / totalStatus) * 180) * Math.PI / 180) * 130"
                      text-anchor="middle"
                      class="text-sm fill-gray-700 font-semibold"
                    >
                      {{ item.value }}
                    </text>
                  </g>
                  
                  <!-- Center circle -->
                  <circle cx="0" cy="0" r="60" fill="white" />
                  <text x="0" y="-5" text-anchor="middle" class="text-2xl font-bold fill-gray-900">{{ totalStatus }}</text>
                  <text x="0" y="15" text-anchor="middle" class="text-xs fill-gray-600">Celkem</text>
                </g>
              </svg>
            </div>
            
            <!-- Legend -->
            <div class="mt-6 space-y-2">
              <div v-for="(item, index) in statusDistribution" :key="index" class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full" :style="`background-color: ${item.color}`"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
                <span class="ml-auto text-sm font-semibold text-gray-900">{{ item.value }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-300">({{ Math.round((item.value / totalStatus) * 100) }}%)</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Patient Type Distribution -->
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">Typ pacienta</h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Rozložení nových a existujících pacientů</p>
            </div>
            
            <div class="flex items-center justify-center">
              <svg width="300" height="300" viewBox="0 0 300 300">
                <defs>
                  <filter id="shadow2">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
                  </filter>
                </defs>
                
                <g transform="translate(150, 150)">
                  <g v-for="(item, index) in patientTypeDistribution" :key="index">
                    <path
                      :d="(() => {
                        const startAngle = patientTypeDistribution.slice(0, index).reduce((sum, i) => sum + (i.value / totalPatients) * 360, 0) * Math.PI / 180
                        const endAngle = patientTypeDistribution.slice(0, index + 1).reduce((sum, i) => sum + (i.value / totalPatients) * 360, 0) * Math.PI / 180
                        const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0
                        const x1 = Math.cos(startAngle) * 100
                        const y1 = Math.sin(startAngle) * 100
                        const x2 = Math.cos(endAngle) * 100
                        const y2 = Math.sin(endAngle) * 100
                        return `M 0,0 L ${x1},${y1} A 100,100 0 ${largeArc},1 ${x2},${y2} Z`
                      })()"
                      :fill="item.color"
                      filter="url(#shadow2)"
                      :class="{ 'opacity-0': !chartsVisible }"
                      class="transition-opacity duration-500"
                      :style="`transition-delay: ${index * 150}ms`"
                    />
                    <!-- Label -->
                    <text
                      :x="Math.cos((patientTypeDistribution.slice(0, index).reduce((sum, i) => sum + (i.value / totalPatients) * 360, 0) + (item.value / totalPatients) * 180) * Math.PI / 180) * 130"
                      :y="Math.sin((patientTypeDistribution.slice(0, index).reduce((sum, i) => sum + (i.value / totalPatients) * 360, 0) + (item.value / totalPatients) * 180) * Math.PI / 180) * 130"
                      text-anchor="middle"
                      class="text-sm fill-white font-semibold"
                    >
                      {{ item.value }}
                    </text>
                  </g>
                  
                  <!-- Center circle -->
                  <circle cx="0" cy="0" r="60" fill="white" />
                  <text x="0" y="-5" text-anchor="middle" class="text-2xl font-bold fill-gray-900">{{ totalPatients }}</text>
                  <text x="0" y="15" text-anchor="middle" class="text-xs fill-gray-600">Pacientů</text>
                </g>
              </svg>
            </div>
            
            <!-- Legend -->
            <div class="mt-6 space-y-2">
              <div v-for="(item, index) in patientTypeDistribution" :key="index" class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full" :style="`background-color: ${item.color}`"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
                <span class="ml-auto text-sm font-semibold text-gray-900 dark:text-gray-300">{{ item.value }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-300">({{ Math.round((item.value / totalPatients) * 100) }}%)</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Weekly Activity Chart -->
      <div class="mb-16">
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">Týdenní aktivita</h2>
              <p class="text-gray-600 dark:text-gray-300">Průměrný počet případů a konzultací podle dne v týdnu</p>
            </div>
            
            <div class="overflow-x-auto">
              <svg :width="chartWidth" :height="chartHeight" class="w-full" viewBox="0 0 800 400">
                <!-- Grid -->
                <g v-for="i in 6" :key="i">
                  <line
                    :x1="padding.left"
                    :y1="padding.top + ((i - 1) * chartHeightInner / 5)"
                    :x2="chartRight"
                    :y2="padding.top + ((i - 1) * chartHeightInner / 5)"
                    stroke="#e5e7eb"
                    stroke-width="1"
                  />
                </g>
                
                <!-- Bars -->
                <g v-for="(item, index) in weeklyData" :key="index">
                  <g :transform="`translate(${padding.left + (index * chartWidthInner / weeklyData.length) + 30}, 0)`">
                    <!-- Cases bar -->
                    <rect
                      :x="0"
                      :y="padding.top + getY(item.cases, 18, chartHeightInner)"
                      :width="40"
                      :height="getBarHeight(item.cases, 18, chartHeightInner)"
                      fill="#D89FC4"
                      :rx="4"
                      :class="{ 'opacity-0': !chartsVisible }"
                      class="transition-all duration-500"
                      :style="`transition-delay: ${index * 100}ms`"
                    />
                    <!-- Consultations bar -->
                    <rect
                      :x="50"
                      :y="padding.top + getY(item.consultations, 18, chartHeightInner)"
                      :width="40"
                      :height="getBarHeight(item.consultations, 18, chartHeightInner)"
                      fill="#3b82f6"
                      :rx="4"
                      :class="{ 'opacity-0': !chartsVisible }"
                      class="transition-all duration-500"
                      :style="`transition-delay: ${index * 100 + 50}ms`"
                    />
                    <!-- Values -->
                    <text
                      :x="20"
                      :y="padding.top + getY(item.cases, 18, chartHeightInner) - 8"
                      text-anchor="middle"
                      class="text-sm fill-gray-700 font-semibold"
                    >
                      {{ item.cases }}
                    </text>
                    <text
                      :x="70"
                      :y="padding.top + getY(item.consultations, 18, chartHeightInner) - 8"
                      text-anchor="middle"
                      class="text-sm fill-blue-700 font-semibold"
                    >
                      {{ item.consultations }}
                    </text>
                    <!-- Day label -->
                    <text
                      :x="45"
                      :y="chartBottom + 20"
                      text-anchor="middle"
                      class="text-sm fill-gray-600 font-medium"
                    >
                      {{ item.day }}
                    </text>
                  </g>
                </g>
                
                <!-- Y-axis labels -->
                <g v-for="i in 6" :key="i">
                  <text
                    :x="padding.left - 10"
                    :y="padding.top + ((i - 1) * chartHeightInner / 5) + 4"
                    text-anchor="end"
                    class="text-xs fill-gray-500"
                  >
                    {{ Math.round((18 / 5) * (6 - i)) }}
                  </text>
                </g>
                
                <!-- Legend -->
                <g transform="translate(750, 40)">
                  <rect x="0" y="0" width="140" height="60" fill="white" stroke="#e5e7eb" rx="4" stroke-width="1" />
                  <rect x="10" y="15" width="24" height="12" fill="#D89FC4" rx="2" />
                  <text x="40" y="24" class="text-sm fill-gray-700">Případy</text>
                  <rect x="10" y="35" width="24" height="12" fill="#3b82f6" rx="2" />
                  <text x="40" y="44" class="text-sm fill-gray-700">Konzultace</text>
                </g>
              </svg>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Hospital Performance & Age Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        <!-- Hospital Performance -->
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">Výkonnost nemocnic</h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Porovnání podle počtu případů a průměrné doby</p>
            </div>
            
            <div class="space-y-4">
              <div v-for="(hospital, index) in hospitalPerformance" :key="index" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ hospital.hospital }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-300">{{ hospital.cases }} případů</span>
                </div>
                <div class="flex gap-2">
                  <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                      :style="`width: ${(hospital.cases / 89) * 100}%`"
                      :class="{ 'opacity-0': !chartsVisible }"
                    ></div>
                  </div>
                  <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 w-16 text-right">{{ hospital.avgTime }} dní</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Spokojenost: {{ hospital.satisfaction }}%
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Age Distribution -->
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">Věkové rozložení</h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Počet případů podle věkových skupin</p>
            </div>
            
            <div class="space-y-3">
              <div v-for="(age, index) in ageDistribution" :key="index" class="flex items-center gap-4">
                <div class="w-16 text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">{{ age.range }}</div>
                <div class="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    :style="`width: ${(age.count / 89) * 100}%`"
                    :class="{ 'opacity-0': !chartsVisible }"
                  >
                    <span class="text-xs font-semibold text-white">{{ age.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Detection Stage & Response Time -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        <!-- Detection Stage -->
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">Stádium detekce</h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Rozložení případů podle stádia při detekci</p>
            </div>
            
            <div class="space-y-4">
              <div v-for="(stage, index) in detectionStage" :key="index" class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" :style="`background-color: ${stage.color}`"></div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ stage.stage }}</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-gray-300">{{ stage.count }}</span>
                </div>
                <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="`width: ${(stage.count / 160) * 100}%; background-color: ${stage.color}`"
                    :class="{ 'opacity-0': !chartsVisible }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Response Time Heatmap -->
        <UCard class="border-0 shadow-lg">
          <div class="p-6 md:p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">Aktivita podle hodin</h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Počet odpovědí a konzultací během dne</p>
            </div>
            
            <div class="overflow-x-auto">
              <svg width="700" height="200" viewBox="0 0 700 200" class="w-full">
                <g v-for="(item, index) in responseTimeData" :key="index">
                  <rect
                    :x="index * 28"
                    :y="200 - (item.responses / 29) * 180"
                    :width="26"
                    :height="(item.responses / 29) * 180"
                    :fill="`rgba(216, 159, 196, ${0.3 + (item.responses / 29) * 0.7})`"
                    stroke="#D89FC4"
                    stroke-width="1"
                    rx="2"
                    :class="{ 'opacity-0': !chartsVisible }"
                    class="transition-opacity duration-300"
                    :style="`transition-delay: ${index * 20}ms`"
                  />
                  <text
                    v-if="index % 4 === 0"
                    :x="index * 28 + 13"
                    :y="195"
                    text-anchor="middle"
                    class="text-xs fill-gray-600"
                  >
                    {{ item.hour }}h
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <UCard class="bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0 shadow-2xl">
          <div class="p-8 md:p-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Data hovoří jasně</h2>
            <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Systém výrazně zkracuje dobu do konzultace s experty a zlepšuje výsledky léčby pacientů se sarkomy
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <UButton
                size="lg"
                color="neutral"
                variant="solid"
                class="bg-white text-primary-700 hover:bg-gray-50"
                @click="navigateTo('/sarcoma-form')"
              >
                Odeslat nový případ
              </UButton>
              <UButton
                size="lg"
                color="neutral"
                variant="outline"
                class="border-white text-white bg-transparent hover:bg-white/10"
                @click="navigateTo('/reports')"
              >
                Zobrazit přehled
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

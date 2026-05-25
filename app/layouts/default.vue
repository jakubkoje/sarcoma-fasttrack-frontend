<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import { publicAsset, useRoute, useRouter } from '#imports'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const { isAuthenticated, logout, role } = useAuthStore()

const items = computed<NavigationMenuItem[]>(() => {
  const userRole = role.value
  const menuItems: NavigationMenuItem[] = []

  // Doctor: sarcoma-form, reports, clanky
  if (userRole === 'doctor' || userRole === 'admin') {
    menuItems.push({
      label: 'New record',
      to: '/sarcoma-form',
      active: route.path.includes('/sarcoma-form')
    })
  }

  // All authenticated users: reports
  if (isAuthenticated.value) {
    menuItems.push({
      label: 'Reports overview',
      to: '/reports',
      active: route.path.includes('/reports')
    })
  }

  // Doctor/specialist/coordinator/admin: educational materials
  if (
    userRole === 'doctor' ||
    userRole === 'specialist' ||
    userRole === 'coordinator' ||
    userRole === 'admin'
  ) {
    menuItems.push({
      label: 'Educational materials',
      to: '/clanky',
      active: route.path.includes('/clanky')
    })
  }

  // Admin: organization management
  if (userRole === 'admin') {
    menuItems.push({
      label: 'Centers',
      to: '/admin/organizations',
      active: route.path.startsWith('/admin/organizations')
    })
  }

  return menuItems
})

interface Notification {
  id: number
  patientName: string
  reportId: number
  message: string
  timestamp: string
  read: boolean
  type: 'status_change' | 'note_added' | 'note_updated'
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    patientName: 'Ján Novák',
    reportId: 1,
    message: 'Note has been updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    read: false,
    type: 'note_updated'
  },
  {
    id: 2,
    patientName: 'Mária Slobodová',
    reportId: 3,
    message: 'A new note has been added',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    type: 'note_added'
  },
  {
    id: 3,
    patientName: 'Peter Dvorák',
    reportId: 4,
    message: 'Report status was changed to "Processed"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    type: 'status_change'
  },
  {
    id: 4,
    patientName: 'Ján Novák',
    reportId: 1,
    message: 'A note was added to the case',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    type: 'note_added'
  }
])

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const isNotificationsOpen = ref(false)

const markAsRead = (notificationId: number) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const goToReport = (reportId: number, notificationId: number) => {
  markAsRead(notificationId)
  isNotificationsOpen.value = false
  router.push('/reports')
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes} min ago`
  } else if (hours < 24) {
    return `${hours} h ago`
  } else {
    return `${days} days ago`
  }
}

const handleLogout = () => {
  logout()
}
</script>

<template>
  <UApp :portal="false">
    <UHeader title="Sarkom FastTrack" :toggle="{ color: 'neutral', variant: 'ghost' }">
      <template #title>
        <NuxtLink :to="isAuthenticated ? '/dashboard' : '/'" class="flex items-center gap-2 lg:gap-3 hover:opacity-80 transition-opacity">
          <img
            :src="publicAsset('sarkom-logo.png')"
            alt="Sarkom FastTrack Logo"
            class="h-8 lg:h-10 w-auto object-contain"
          />
          <div class="hidden sm:block">
            <span class="font-bold text-lg lg:text-xl">Sarkom FastTrack</span>
          </div>
        </NuxtLink>
      </template>

      <UNavigationMenu v-if="isAuthenticated" :items="items" class="hidden lg:flex" />

      <!-- Right slot for authenticated users -->
      <template #right v-if="isAuthenticated">
        <!-- Notifications Bell - Desktop Only -->
        <UPopover v-model:open="isNotificationsOpen" :popper="{ placement: 'bottom-end' }" class="hidden lg:block">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-bell"
            aria-label="Notifications"
            class="relative"
          >
            <template v-if="unreadCount > 0">
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {{ unreadCount }}
              </span>
            </template>
          </UButton>

          <template #content>
            <UCard class="w-96 max-h-[500px] overflow-hidden">
              <!-- Header -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-300">Notifications</h3>
                <UButton
                  v-if="unreadCount > 0"
                  size="xs"
                  color="primary"
                  variant="ghost"
                  @click="markAllAsRead"
                >
                  Mark all as read
                </UButton>
              </div>

              <!-- Notifications List -->
              <div class="space-y-2 max-h-[400px] overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  @click="goToReport(notification.reportId, notification.id)"
                  class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="{ 'bg-primary-50': !notification.read }"
                >
                  <div class="flex items-start gap-3">
                    <!-- Icon -->
                    <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" :class="[
                      notification.type === 'note_added' ? 'bg-blue-100' : '',
                      notification.type === 'note_updated' ? 'bg-yellow-100' : '',
                      notification.type === 'status_change' ? 'bg-green-100' : ''
                    ]">
                      <svg v-if="notification.type === 'note_added'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <svg v-else-if="notification.type === 'note_updated'" class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900 dark:text-gray-300">
                        {{ notification.patientName }}
                      </p>
                      <p class="text-sm text-gray-600 mt-0.5">
                        {{ notification.message }}
                      </p>
                      <p class="text-xs text-gray-400 mt-1">
                        {{ formatTimestamp(notification.timestamp) }}
                      </p>
                    </div>

                    <!-- Unread indicator -->
                    <div v-if="!notification.read" class="shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-1" />
                  </div>
                </div>

                <!-- Empty State -->
                <div v-if="notifications.length === 0" class="text-center py-8">
                  <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p class="text-sm text-gray-500">No notifications</p>
                </div>
              </div>
            </UCard>
          </template>
        </UPopover>

        <UColorModeButton class="hidden lg:flex" />

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-log-out"
          @click="handleLogout"
          aria-label="Log out"
          class="hidden lg:flex"
        >
          Log out
        </UButton>
      </template>

      <!-- Right slot for non-authenticated users -->
      <template #right v-if="!isAuthenticated">
        <div class="flex items-center gap-2">
          <UColorModeButton class="hidden lg:flex" />
          <UButton
            color="neutral"
            variant="ghost"
            @click="router.push('/login')"
            class="hidden lg:flex"
          >
            Log in
          </UButton>
          <UButton
            color="primary"
            @click="router.push('/signup')"
            class="hidden lg:flex"
          >
            Sign up
          </UButton>
        </div>
      </template>

      <!-- Mobile menu for authenticated users -->
      <template #body v-if="isAuthenticated">
        <!-- Mobile Navigation Menu -->
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

        <!-- Mobile Footer -->
        <div class="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6 -mx-2.5 px-2.5">
          <!-- Notifications Summary Card -->
          <div v-if="unreadCount > 0" class="mb-4">
            <UCard
              class="bg-linear-to-r from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 border-primary-200 dark:border-primary-800 cursor-pointer hover:shadow-md transition-shadow"
              @click="router.push('/reports')"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 flex-1">
                  <div class="relative">
                    <div class="w-10 h-10 rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-sm">
                      {{ unreadCount }}
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {{ unreadCount === 1 ? 'New notification' : 'New notifications' }}
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      Check the reports overview
                    </p>
                  </div>
                </div>
                <UButton
                  size="xs"
                  color="primary"
                  variant="soft"
                  @click.stop="markAllAsRead"
                  class="shrink-0"
                >
                  Mark
                </UButton>
              </div>
            </UCard>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2.5">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              block
              class="justify-between"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Change theme
              </span>
              <UColorModeButton />
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-log-out"
              @click="handleLogout"
              size="lg"
              block
            >
              Log out
            </UButton>
          </div>
        </div>
      </template>

      <!-- Mobile menu for non-authenticated users -->
      <template #body v-if="!isAuthenticated">
        <div class="space-y-4 -mx-2.5 px-2.5">
          <!-- Welcome Message -->
          <div class="py-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Welcome to Sarkom FastTrack
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Log in or sign up to access the application
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2.5 pb-4">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              block
              class="justify-between"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Change theme
              </span>
              <UColorModeButton />
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-log-in"
              @click="router.push('/login')"
              size="lg"
              block
            >
              Log in
            </UButton>
            <UButton
              color="primary"
              icon="i-lucide-user-plus"
              @click="router.push('/signup')"
              size="lg"
              block
            >
              Sign up
            </UButton>
          </div>
        </div>
      </template>
    </UHeader>

    <UMain class="overflow-x-hidden">
      <slot />
    </UMain>
  </UApp>
</template>

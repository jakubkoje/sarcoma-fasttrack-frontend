import { computed } from 'vue'
import { navigateTo, useCookie } from '#imports'

export function isAccessTokenFresh(value: string | null | undefined, skewSeconds = 30) {
  if (!value) return false

  const [payload] = value.split('.')
  if (!payload) return false

  try {
    if (typeof globalThis.atob !== 'function') return false
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = globalThis.atob(padded)
    const expiresAt = Number(decoded.split('|')[1])
    return Number.isFinite(expiresAt) && Date.now() / 1000 + skewSeconds < expiresAt
  } catch {
    return false
  }
}

export function useAuthStore() {
  const token = useCookie<string | null>('auth_token', {
    default: () => null,
    sameSite: 'lax'
  })
  const role = useCookie<string | null>('auth_role', {
    default: () => null,
    sameSite: 'lax'
  })

  const validToken = computed(() => isAccessTokenFresh(token.value) ? token.value : null)
  const isAuthenticated = computed(() => !!validToken.value)
  const userRole = computed(() => role.value)

  function setToken(value: string | null) {
    token.value = value
  }

  function setRole(value: string | null) {
    role.value = value
  }

  function clearToken() {
    token.value = null
    role.value = null
  }

  function logout() {
    clearToken()
    navigateTo('/login')
  }

  return {
    token,
    validToken,
    role: userRole,
    isAuthenticated,
    setToken,
    setRole,
    clearToken,
    logout
  }
}

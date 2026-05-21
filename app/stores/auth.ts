export function useAuthStore() {
  const token = useCookie<string | null>('auth_token', {
    default: () => null,
    sameSite: 'lax'
  })
  const role = useCookie<string | null>('auth_role', {
    default: () => null,
    sameSite: 'lax'
  })

  const isAuthenticated = computed(() => !!token.value)
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
    role: userRole,
    isAuthenticated,
    setToken,
    setRole,
    clearToken,
    logout
  }
}

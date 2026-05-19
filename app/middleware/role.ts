import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const { role, isAuthenticated } = useAuthStore()

  // First check if authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Role-based access control
  const userRole = role.value
  const routePath = to.path

  // Define role-based route restrictions (routes that require specific roles)
  const restrictedRoutes: Record<string, string[]> = {
    '/sarcoma-form': ['doctor', 'admin'],
    '/clanky': ['doctor', 'admin'],
    '/analytics': ['specialist', 'admin']
  }

  // Reports and dashboard are accessible to all authenticated users
  const publicRoutes = ['/reports', '/dashboard', '/login']
  
  // Check if this is a public route (accessible to all authenticated users)
  if (publicRoutes.some(route => routePath.startsWith(route))) {
    return
  }

  // Check if route is restricted
  const restrictedRoute = Object.keys(restrictedRoutes).find(route => routePath.startsWith(route))
  
  if (restrictedRoute) {
    const allowedRoles = restrictedRoutes[restrictedRoute]
    
    if (!allowedRoles) {
      return
    }
    
    // Admin can access everything
    if (userRole === 'admin') {
      return
    }
    
    // Check if user's role is allowed
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect based on role
      if (userRole === 'doctor') {
        return navigateTo('/dashboard')
      } else if (userRole === 'specialist') {
        return navigateTo('/analytics')
      } else {
        return navigateTo('/dashboard')
      }
    }
  }
})


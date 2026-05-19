import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated } = useAuthStore()

    // Check if user is authenticated
    if (!isAuthenticated.value) {
        // Redirect to login page
        return navigateTo('/login')
    }
})

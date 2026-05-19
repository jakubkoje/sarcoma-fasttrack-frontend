<script setup lang="ts">
// Redirect root to dashboard
definePageMeta({
  layout: 'default'
})

// Redirect to dashboard on mount
onMounted(() => {
  navigateTo('/dashboard', { replace: true })
})
</script>

<template>
  <div />
</template>

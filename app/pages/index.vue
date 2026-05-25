<script setup lang="ts">
import { onMounted } from 'vue'
import { definePageMeta, navigateTo } from '#imports'

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

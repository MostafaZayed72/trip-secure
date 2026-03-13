<template>
  <div :dir="rtl ? 'rtl' : 'ltr'">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useDark } from '@vueuse/core'

const isDark = useDark()
const rtl = ref(true) // Always RTL as per user request

useHead({
  htmlAttrs: {
    dir: 'rtl',
    lang: 'ar',
    class: computed(() => isDark.value ? 'dark' : '')
  }
})
</script>

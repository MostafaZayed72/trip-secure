<template>
  <div dir="ltr">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useDark } from '@vueuse/core'

const isDark = useDark()

useHead({
  htmlAttrs: {
    dir: 'ltr',
    lang: 'en',
    class: computed(() => isDark.value ? 'dark' : '')
  }
})
</script>

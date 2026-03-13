import { useStorage } from '@vueuse/core'

export default defineNuxtRouteMiddleware((to) => {
  // middleware runs on both server and client. 
  // useStorage will use a dummy storage on server.
  const user = useStorage('user-auth', null)
  
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})

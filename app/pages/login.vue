<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl transition-all hover:shadow-2xl border border-slate-100 dark:border-slate-800">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-primary-900/20 mb-4 transition-transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Trip-Secure</h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">تسجيل الدخول إلى لوحة التحكم</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المستخدم</label>
            <input 
              v-model="form.username"
              id="username" 
              type="text" 
              required 
              dir="ltr"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none" 
              placeholder="admin"
            >
          </div>
          <div>
            <label for="password" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور</label>
            <input 
              v-model="form.password"
              id="password" 
              type="password" 
              required 
              dir="ltr"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none" 
              placeholder="••••••"
            >
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
          {{ error }}
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-primary-200 dark:shadow-none"
          >
            <span v-if="loading">جاري التحميل...</span>
            <span v-else>تسجيل الدخول</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'

const auth = useStorage('user-auth', null)
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (form.username === 'admin' && form.password === '123456') {
    auth.value = { username: 'admin', role: 'admin' }
    router.push('/')
  } else {
    error.value = 'اسم المستخدم أو كلمة المرور غير صحيحة'
  }
  
  loading.value = false
}

definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex">
    <!-- Sidebar (Moved to Left) -->
    <aside 
      class="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed inset-y-0 left-0 h-full z-20 transition-transform duration-300"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="p-6">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-200">
            T
          </div>
          <span class="text-xl font-bold text-slate-900 dark:text-white">TripSecure</span>
        </div>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        <div v-for="section in navSections" :key="section.header">
          <h3 v-if="section.header" class="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {{ section.header }}
          </h3>
          <div class="space-y-1">
            <template v-for="item in section.items" :key="item.path">
              <NuxtLink 
                :to="item.path"
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
                :class="$route.path === item.path ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
              >
                <component :is="item.icon" class="w-5 h-5" :class="$route.path === item.path ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'" />
                <span class="font-bold text-sm">{{ item.name }}</span>
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <!-- Theme Toggle -->
        <button 
          @click="toggleDark()"
          class="flex items-center gap-3 w-full px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group"
        >
          <Sun v-if="isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
          <span class="font-bold">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>

        <!-- Logout -->
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 w-full px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all group"
        >
          <LogOut class="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          <span class="font-bold text-sm">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 lg:ml-64 p-8 min-w-0">
      <!-- Mobile Header -->
      <header class="flex lg:hidden items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span class="font-bold dark:text-white">TripSecure</span>
        </div>
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <Menu class="w-6 h-6 dark:text-white" />
        </button>
      </header>

      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

    <!-- Mobile Backdrop -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-10 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { useStorage, useDark, useToggle } from '@vueuse/core'
import { 
  LayoutDashboard, 
  Route, 
  LogOut, 
  Menu, 
  Sun, 
  Moon,
  Send,
  Folder,
  Mail
} from 'lucide-vue-next'

const sidebarOpen = ref(false)
const auth = useStorage('user-auth', null)
const router = useRouter()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const navSections = [
  {
    header: '',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Trips', path: '/trips', icon: Route },
    ]
  },
  {
    header: 'MANAGE REQUESTS',
    items: [
      { name: 'Heavy Requests', path: '/requests/heavy', icon: Send },
      { name: 'Light Requests', path: '/requests/light', icon: Send },
      { name: 'Pending Approval Requests', path: '/requests/pending-approval', icon: Send },
      { name: 'Pending Late Requests', path: '/requests/pending-late', icon: Send },
      { name: 'Pending First Approval Abnormal Requests', path: '/requests/pending-first-approval-abnormal', icon: Send },
      { name: 'Pending Cancellation', path: '/requests/pending-cancellation', icon: Send },
    ]
  },
  {
    header: 'REQUEST MANAGEMENT',
    items: [
      { name: 'Pending Approval Requests', path: '/management/pending-approval', icon: Folder },
      { name: 'Pending High-Risk Approval Requests', path: '/management/pending-high-risk', icon: Mail },
      { name: 'Pending HSE Approval Requests', path: '/management/pending-hse', icon: Mail },
    ]
  }
]

const handleLogout = () => {
  auth.value = null
  router.push('/login')
}
</script>

<style scoped>
.router-link-active {
  @apply bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-700 rounded-full;
}
</style>

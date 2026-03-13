<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {{ user?.username || 'Admin' }}</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Here is a quick look at today's trip activity</p>
      </div>
      <button 
        @click="showCreateDialog = true"
        class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95 flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Create New Trip
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-4">
          <div :class="`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Trips -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent Trips</h2>
        <NuxtLink to="/trips" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium">View All</NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
              <th class="px-6 py-4 font-bold">Company</th>
              <th class="px-6 py-4 font-bold">Route</th>
              <th class="px-6 py-4 font-bold">Distance</th>
              <th class="px-6 py-4 font-bold">Date</th>
              <th class="px-6 py-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr v-for="trip in recentTrips" :key="trip.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ trip.company }}</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ trip.start }} → {{ trip.end }}</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ trip.distance }} km</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ trip.date }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(trip.status)" class="px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset">
                  {{ getStatusText(trip.status) }}
                </span>
              </td>
            </tr>
            <tr v-if="recentTrips.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-bold">No trips recorded yet</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Trip Dialog -->
    <TripDialog :show="showCreateDialog" @close="showCreateDialog = false" @created="handleTripCreated" />
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { Plus, Route, Truck, Users, Calendar } from 'lucide-vue-next'

const user = useStorage('user-auth', null)
const trips = useStorage('trips-data', [])
const showCreateDialog = ref(false)

const recentTrips = computed(() => {
  return [...trips.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
})

const stats = computed(() => [
  { label: 'Total Trips', value: trips.value.length, icon: Route, color: 'primary' },
  { label: 'Active Trips', value: trips.value.filter(t => t.status === 'active').length, icon: Calendar, color: 'blue' },
  { label: 'Available Vehicles', value: 8, icon: Truck, color: 'sky' },
  { label: 'Drivers', value: 12, icon: Users, color: 'indigo' },
])

const handleTripCreated = () => {
  showCreateDialog.value = false
}

const getStatusText = (status) => {
  const texts = { active: 'Active', completed: 'Completed', pending: 'Pending' }
  return texts[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20',
    completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-600/20',
    pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-amber-600/20'
  }
  return classes[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-600/20'
}
</script>

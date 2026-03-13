<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Trip Log</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage and track all created trips</p>
      </div>
      <button 
        @click="openCreateDialog"
        class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none"
      >
        <Plus class="w-5 h-5" />
        Create Trip
      </button>
    </div>

    <!-- Filter/Search Bar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 transition-colors">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-2.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search for company, route, or driver..." 
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
        >
      </div>
      <div class="flex gap-2">
        <select v-model="filterStatus" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>

    <!-- Trips Table -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-bold border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-4">Company</th>
              <th class="px-6 py-4">Route</th>
              <th class="px-6 py-4">Distance</th>
              <th class="px-6 py-4">Date & Time</th>
              <th class="px-6 py-4">Vehicle</th>
              <th class="px-6 py-4">Driver</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800 font-medium">
            <tr v-for="trip in filteredTrips" :key="trip.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ trip.company }}</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                <div class="flex items-center gap-1">
                  <span>{{ trip.start }}</span>
                  <ArrowRight class="w-3 h-3 text-slate-300 dark:text-slate-600" />
                  <span>{{ trip.end }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ trip.distance }} km</td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-700 dark:text-white">{{ trip.date }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ formatTime(trip.startTime) }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                {{ getCarName(trip) }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                {{ getDriverName(trip) }}
              </td>
              <td class="px-6 py-4">
                <select 
                  :value="trip.status"
                  @change="updateStatus(trip.id, $event.target.value)"
                  class="px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset outline-none transition-all cursor-pointer bg-transparent"
                  :class="getStatusClass(trip.status)"
                >
                  <option value="pending" class="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Pending</option>
                  <option value="active" class="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Active</option>
                  <option value="completed" class="text-slate-900 dark:text-white bg-white dark:bg-slate-800">Completed</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button @click="openEditDialog(trip)" class="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all" title="Edit">
                    <Edit2 class="w-5 h-5" />
                  </button>
                  <button @click="deleteTrip(trip.id)" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTrips.length === 0">
              <td colspan="8" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
                  <Route class="w-12 h-12 mb-2 opacity-20" />
                  <p class="font-bold text-lg">No trips match your search</p>
                  <button @click="resetFilters" class="text-primary-600 dark:text-primary-400 hover:underline">Reset Filters</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Trip Dialog (Shared Create/Edit) -->
    <TripDialog 
      :show="showDialog" 
      :editData="selectedTrip"
      @close="closeDialog" 
      @created="closeDialog"
      @updated="closeDialog"
    />
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { Plus, Search, Trash2, Edit2, ArrowRight, Route } from 'lucide-vue-next'

const trips = useStorage('trips-data', [])
const showDialog = ref(false)
const selectedTrip = ref(null)
const searchQuery = ref('')
const filterStatus = ref('all')

const staticCars = [
  { id: 1, model: 'Toyota Hiace 2023' },
  { id: 2, model: 'Mercedes Sprinter' },
  { id: 3, model: 'Hyundai H1' },
  { id: 4, model: 'Chevrolet Move' },
]

const staticDrivers = [
  { id: 1, name: 'Ahmed Mahmoud' },
  { id: 2, name: 'Mohamed Ali' },
  { id: 3, name: 'Yasser Ibrahim' },
]

const filteredTrips = computed(() => {
  return trips.value.filter(trip => {
    const searchLow = searchQuery.value.toLowerCase()
    const matchesSearch = 
      trip.company.toLowerCase().includes(searchLow) ||
      trip.start.toLowerCase().includes(searchLow) ||
      trip.end.toLowerCase().includes(searchLow) ||
      getDriverName(trip).toLowerCase().includes(searchLow)
    
    const matchesStatus = filterStatus.value === 'all' || trip.status === filterStatus.value
    
    return matchesSearch && matchesStatus
  }).reverse()
})

const openCreateDialog = () => {
  selectedTrip.value = null
  showDialog.value = true
}

const openEditDialog = (trip) => {
  selectedTrip.value = { ...trip }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  selectedTrip.value = null
}

const updateStatus = (id, newStatus) => {
  const index = trips.value.findIndex(t => t.id === id)
  if (index !== -1) {
    trips.value[index].status = newStatus
  }
}

const getCarName = (trip) => {
  if (trip.carId === 'new') return trip.newCar?.model || 'New Vehicle'
  return staticCars.find(c => c.id === trip.carId)?.model || 'Not Specified'
}

const getDriverName = (trip) => {
  if (trip.driverId === 'new') return trip.newDriverName || 'New Driver'
  return staticDrivers.find(d => d.id === trip.driverId)?.name || 'Not Specified'
}

const formatTime = (isoString) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const getStatusText = (status) => {
  const texts = { active: 'Active', completed: 'Completed', pending: 'Pending' }
  return texts[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20 dark:ring-green-400/20',
    completed: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-600/20 dark:ring-blue-400/20',
    pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-amber-600/20 dark:ring-amber-400/20'
  }
  return classes[status] || 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-600/20 dark:ring-slate-400/20'
}

const deleteTrip = (id) => {
  if (confirm('Are you sure you want to delete this trip?')) {
    trips.value = trips.value.filter(t => t.id !== id)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'all'
}
</script>

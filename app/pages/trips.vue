<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">سجل الرحلات</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">إدارة وتتبع جميع الرحلات المنشأة</p>
      </div>
      <button 
        @click="openCreateDialog"
        class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none"
      >
        <Plus class="w-5 h-5" />
        إنشاء رحلة
      </button>
    </div>

    <!-- Filter/Search Bar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 transition-colors">
      <div class="flex-1 relative">
        <Search class="absolute right-3 top-2.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="ابحث عن شركة، مسار، أو سائق..." 
          class="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
        >
      </div>
      <div class="flex gap-2">
        <select v-model="filterStatus" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer">
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="active">نشطة</option>
          <option value="completed">مكتملة</option>
        </select>
      </div>
    </div>

    <!-- Trips Table -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div class="overflow-x-auto">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-bold border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-4">الشركة</th>
              <th class="px-6 py-4">المسار</th>
              <th class="px-6 py-4">المسافة</th>
              <th class="px-6 py-4">التاريخ والوقت</th>
              <th class="px-6 py-4">السيارة</th>
              <th class="px-6 py-4">السائق</th>
              <th class="px-6 py-4">الحالة</th>
              <th class="px-6 py-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800 font-medium">
            <tr v-for="trip in filteredTrips" :key="trip.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">{{ trip.company }}</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                <div class="flex items-center gap-1">
                  <span>{{ trip.start }}</span>
                  <ArrowLeft class="w-3 h-3 text-slate-300 dark:text-slate-600" />
                  <span>{{ trip.end }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ trip.distance }} كم</td>
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
                  <option value="pending" class="text-slate-900 dark:text-white bg-white dark:bg-slate-800">قيد الانتظار</option>
                  <option value="active" class="text-slate-900 dark:text-white bg-white dark:bg-slate-800">نشطة</option>
                  <option value="completed" class="text-slate-900 dark:text-white bg-white dark:bg-slate-800">مكتملة</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button @click="openEditDialog(trip)" class="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all" title="تعديل">
                    <Edit2 class="w-5 h-5" />
                  </button>
                  <button @click="deleteTrip(trip.id)" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="حذف">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTrips.length === 0">
              <td colspan="8" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
                  <Route class="w-12 h-12 mb-2 opacity-20" />
                  <p class="font-bold text-lg">لا توجد رحلات تطابق بحثك</p>
                  <button @click="resetFilters" class="text-primary-600 dark:text-primary-400 hover:underline">إعادة ضبط المرشحات</button>
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
import { Plus, Search, Trash2, Edit2, ArrowLeft, Route } from 'lucide-vue-next'

const trips = useStorage('trips-data', [])
const showDialog = ref(false)
const selectedTrip = ref(null)
const searchQuery = ref('')
const filterStatus = ref('all')

const staticCars = [
  { id: 1, model: 'تويوتا هايس 2023' },
  { id: 2, model: 'مرسيدس سبرينتر' },
  { id: 3, model: 'هيونداي H1' },
  { id: 4, model: 'شيفروليه موف' },
]

const staticDrivers = [
  { id: 1, name: 'أحمد محمود' },
  { id: 2, name: 'محمد علي' },
  { id: 3, name: 'ياسر إبراهيم' },
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
  if (trip.carId === 'new') return trip.newCar?.model || 'سيارة جديدة'
  return staticCars.find(c => c.id === trip.carId)?.model || 'غير محدد'
}

const getDriverName = (trip) => {
  if (trip.driverId === 'new') return trip.newDriverName || 'سائق جديد'
  return staticDrivers.find(d => d.id === trip.driverId)?.name || 'غير محدد'
}

const formatTime = (isoString) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
}

const getStatusText = (status) => {
  const texts = { active: 'نشطة', completed: 'مكتملة', pending: 'قيد الانتظار' }
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
  if (confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
    trips.value = trips.value.filter(t => t.id !== id)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'all'
}
</script>

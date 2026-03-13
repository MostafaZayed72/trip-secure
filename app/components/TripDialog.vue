<template>
  <Transition name="fade-in">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] transition-colors">
        <!-- Header -->
        <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ editData ? 'Edit Trip' : 'Create New Trip' }}</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Step {{ currentStep }} of 5: {{ stepTitles[currentStep-1] }}</p>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X class="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 flex">
          <div 
            class="h-full bg-primary-600 transition-all duration-500 rounded-r-full" 
            :style="{ width: `${(currentStep / 5) * 100}%` }"
          ></div>
        </div>

        <!-- Step Content -->
        <div class="p-8 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-slate-900/30">
          <Transition name="fade-in" mode="out-in">
            <!-- Step 1: Company Name -->
            <div v-if="currentStep === 1" :key="1" class="space-y-4">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Company Name</label>
              <input 
                v-model="form.company"
                type="text" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none font-bold transition-all"
                placeholder="Enter company name..."
              >
            </div>

            <!-- Step 2: Locations -->
            <div v-else-if="currentStep === 2" :key="2" class="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Start Location</label>
                <div class="relative">
                  <MapPin class="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input 
                    v-model="form.start"
                    type="text" 
                    class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="e.g. Cairo"
                  >
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">End Location</label>
                <div class="relative">
                  <Navigation class="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input 
                    v-model="form.end"
                    type="text" 
                    class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="e.g. Alexandria"
                  >
                </div>
              </div>
            </div>

            <!-- Step 3: Distance and Time -->
            <div v-else-if="currentStep === 3" :key="3" class="space-y-6 font-bold">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Distance (km)</label>
                <input 
                  v-model.number="form.distance"
                  type="number" 
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="0"
                >
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                  <input 
                    v-model="form.startTime"
                    type="datetime-local" 
                    dir="ltr"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">End Time</label>
                  <input 
                    v-model="form.endTime"
                    type="datetime-local" 
                    dir="ltr"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                </div>
              </div>
            </div>

            <!-- Step 4: Vehicle selection -->
            <div v-else-if="currentStep === 4" :key="4" class="space-y-6 font-bold">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Select Vehicle</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  v-for="car in staticCars" :key="car.id"
                  @click="form.carId = car.id; form.newCar = null"
                  class="p-4 rounded-xl border-2 text-left transition-all group/car"
                  :class="form.carId === car.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-sm' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
                >
                  <div class="font-bold text-slate-900 dark:text-white group-hover/car:text-primary-600 transition-colors">{{ car.model }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">Plate: {{ car.plate }}</div>
                </button>
                <button 
                   @click="form.carId = 'new'; form.newCar = form.newCar || { model: '', plate: '' }"
                   class="p-4 rounded-xl border-2 border-dashed text-center hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all"
                   :class="form.carId === 'new' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'"
                >
                  <Plus class="w-6 h-6 mx-auto mb-1 text-primary-600" />
                  <div class="font-bold">Add New Vehicle</div>
                </button>
              </div>

              <div v-if="form.carId === 'new'" class="p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-primary-100 dark:border-primary-900/20 space-y-4 shadow-sm">
                <input v-model="form.newCar.model" placeholder="Vehicle Model" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                <input v-model="form.newCar.plate" placeholder="Plate Number" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all">
              </div>
            </div>

            <!-- Step 5: Passenger & Driver -->
            <div v-else-if="currentStep === 5" :key="5" class="space-y-6 font-bold">
              <div class="space-y-4">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Driver</label>
                <select 
                  v-model="form.driverId"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer transition-all"
                >
                  <option value="" disabled>Select a driver...</option>
                  <option v-for="d in staticDrivers" :key="d.id" :value="d.id">{{ d.name }}</option>
                  <option value="new">+ New Driver</option>
                </select>
                <input 
                  v-if="form.driverId === 'new'"
                  v-model="form.newDriverName"
                  placeholder="New Driver Name"
                  class="w-full px-4 py-3 rounded-xl border border-primary-100 dark:border-primary-900/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">Passengers</label>
                <input 
                  v-model="form.passenger"
                  type="text" 
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Passenger name or count..."
                >
              </div>
            </div>
          </Transition>
        </div>

        <!-- Footer Buttons -->
        <div class="p-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors">
          <button 
            v-if="currentStep > 1"
            @click="currentStep--"
            class="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
          >
            Previous
          </button>
          <div v-else></div>

          <button 
            @click="handleNext"
            class="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2"
          >
            {{ currentStep === 5 ? (editData ? 'Save Changes' : 'Complete Trip') : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { X, MapPin, Navigation, Plus } from 'lucide-vue-next'

const props = defineProps(['show', 'editData'])
const emit = defineEmits(['close', 'created', 'updated'])

const currentStep = ref(1)
const trips = useStorage('trips-data', [])

const stepTitles = [
  'Company Name',
  'Start & End Locations',
  'Distance & Timing',
  'Vehicle Selection',
  'Driver & Passengers'
]

const staticCars = [
  { id: 1, model: 'Toyota Hiace 2023', plate: 'ABC 123' },
  { id: 2, model: 'Mercedes Sprinter', plate: 'XYZ 456' },
  { id: 3, model: 'Hyundai H1', plate: 'QRS 789' },
  { id: 4, model: 'Chevrolet Move', plate: 'LMN 012' },
]

const staticDrivers = [
  { id: 1, name: 'Ahmed Mahmoud' },
  { id: 2, name: 'Mohamed Ali' },
  { id: 3, name: 'Yasser Ibrahim' },
]

const form = reactive({
  company: '',
  start: '',
  end: '',
  distance: null,
  startTime: '',
  endTime: '',
  carId: null,
  newCar: null,
  driverId: '',
  newDriverName: '',
  passenger: ''
})

const resetForm = () => {
  currentStep.value = 1
  Object.assign(form, {
    company: '',
    start: '',
    end: '',
    distance: null,
    startTime: '',
    endTime: '',
    carId: null,
    newCar: null,
    driverId: '',
    newDriverName: '',
    passenger: ''
  })
}

const handleNext = () => {
  if (currentStep.value < 5) {
    currentStep.value++
  } else {
    if (props.editData) {
      // Update Mode
      const index = trips.value.findIndex(t => t.id === props.editData.id)
      if (index !== -1) {
        trips.value[index] = { 
          ...trips.value[index], 
          ...form,
          date: new Date(form.startTime || Date.now()).toLocaleDateString('en-US')
        }
        emit('updated', trips.value[index])
      }
    } else {
      // Create Mode
      const newTrip = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString(),
        status: 'pending',
        date: new Date(form.startTime || Date.now()).toLocaleDateString('en-US')
      }
      trips.value.push(newTrip)
      emit('created', newTrip)
    }
    resetForm()
  }
}

watch(() => props.editData, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal)
    currentStep.value = 1
  } else {
    resetForm()
  }
}, { immediate: true })
</script>

<style scoped>
.fade-in-enter-active,
.fade-in-leave-active {
  transition: all 0.2s ease;
}

.fade-in-enter-from {
  opacity: 0;
  transform: scale(0.98) translateY(10px);
}
.fade-in-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(-10px);
}
</style>

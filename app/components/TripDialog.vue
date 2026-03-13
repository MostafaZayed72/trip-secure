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
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ editData ? 'تعديل الرحلة' : 'إنشاء رحلة جديدة' }}</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">الخطوة {{ currentStep }} من 5: {{ stepTitles[currentStep-1] }}</p>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X class="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 flex">
          <div 
            class="h-full bg-primary-600 transition-all duration-500 rounded-l-full" 
            :style="{ width: `${(currentStep / 5) * 100}%` }"
          ></div>
        </div>

        <!-- Step Content -->
        <div class="p-8 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-slate-900/30">
          <Transition name="fade-in" mode="out-in">
            <!-- Step 1: Company Name -->
            <div v-if="currentStep === 1" :key="1" class="space-y-4">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">اسم الشركة</label>
              <input 
                v-model="form.company"
                type="text" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none font-bold transition-all"
                placeholder="أدخل اسم الشركة..."
              >
            </div>

            <!-- Step 2: Locations -->
            <div v-else-if="currentStep === 2" :key="2" class="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">مكان البدء</label>
                <div class="relative">
                  <MapPin class="absolute right-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input 
                    v-model="form.start"
                    type="text" 
                    class="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="مثال: القاهرة"
                  >
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">مكان الوصول</label>
                <div class="relative">
                  <Navigation class="absolute right-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input 
                    v-model="form.end"
                    type="text" 
                    class="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="مثال: الإسكندرية"
                  >
                </div>
              </div>
            </div>

            <!-- Step 3: Distance and Time -->
            <div v-else-if="currentStep === 3" :key="3" class="space-y-6 font-bold">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">المسافة (كم)</label>
                <input 
                  v-model.number="form.distance"
                  type="number" 
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="0"
                >
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2 text-right">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">وقت البدء</label>
                  <input 
                    v-model="form.startTime"
                    type="datetime-local" 
                    dir="ltr"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-right"
                  >
                </div>
                <div class="space-y-2 text-right">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">وقت الانتهاء</label>
                  <input 
                    v-model="form.endTime"
                    type="datetime-local" 
                    dir="ltr"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-right"
                  >
                </div>
              </div>
            </div>

            <!-- Step 4: Vehicle selection -->
            <div v-else-if="currentStep === 4" :key="4" class="space-y-6 font-bold">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">اختر عربية</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  v-for="car in staticCars" :key="car.id"
                  @click="form.carId = car.id; form.newCar = null"
                  class="p-4 rounded-xl border-2 text-right transition-all group/car"
                  :class="form.carId === car.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-sm' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'"
                >
                  <div class="font-bold text-slate-900 dark:text-white group-hover/car:text-primary-600 transition-colors">{{ car.model }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">لوحات: {{ car.plate }}</div>
                </button>
                <button 
                   @click="form.carId = 'new'; form.newCar = form.newCar || { model: '', plate: '' }"
                   class="p-4 rounded-xl border-2 border-dashed text-center hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all"
                   :class="form.carId === 'new' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-800'"
                >
                  <Plus class="w-6 h-6 mx-auto mb-1 text-primary-600" />
                  <div class="font-bold">إضافة عربية جديدة</div>
                </button>
              </div>

              <div v-if="form.carId === 'new'" class="p-5 bg-white dark:bg-slate-800/50 rounded-2xl border border-primary-100 dark:border-primary-900/20 space-y-4 shadow-sm">
                <input v-model="form.newCar.model" placeholder="موديل السيارة" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                <input v-model="form.newCar.plate" placeholder="رقم اللوحة" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all">
              </div>
            </div>

            <!-- Step 5: Passenger & Driver -->
            <div v-else-if="currentStep === 5" :key="5" class="space-y-6 font-bold">
              <div class="space-y-4">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">السائق</label>
                <select 
                  v-model="form.driverId"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer transition-all"
                >
                  <option value="" disabled>اختر سائقاً...</option>
                  <option v-for="d in staticDrivers" :key="d.id" :value="d.id">{{ d.name }}</option>
                  <option value="new">+ سائق جديد</option>
                </select>
                <input 
                  v-if="form.driverId === 'new'"
                  v-model="form.newDriverName"
                  placeholder="اسم السائق الجديد"
                  class="w-full px-4 py-3 rounded-xl border border-primary-100 dark:border-primary-900/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300">الركاب (Passenger)</label>
                <input 
                  v-model="form.passenger"
                  type="text" 
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="اسم الراكب أو عدد الركاب..."
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
            السابق
          </button>
          <div v-else></div>

          <button 
            @click="handleNext"
            class="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2"
          >
            {{ currentStep === 5 ? (editData ? 'حفظ التعديلات' : 'إتمام الرحلة') : 'التالي' }}
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
  'اسم الشركة',
  'مكان البدء والوصول',
  'المسافة والتوقيت',
  'اختيار السيارة',
  'السائق والركاب'
]

const staticCars = [
  { id: 1, model: 'تويوتا هايس 2023', plate: 'أ ب ج 123' },
  { id: 2, model: 'مرسيدس سبرينتر', plate: 'س ص ع 456' },
  { id: 3, model: 'هيونداي H1', plate: 'ق ر ك 789' },
  { id: 4, model: 'شيفروليه موف', plate: 'ن م ل 012' },
]

const staticDrivers = [
  { id: 1, name: 'أحمد محمود' },
  { id: 2, name: 'محمد علي' },
  { id: 3, name: 'ياسر إبراهيم' },
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
          date: new Date(form.startTime || Date.now()).toLocaleDateString('ar-EG')
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
        date: new Date(form.startTime || Date.now()).toLocaleDateString('ar-EG')
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

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">创建学习计划</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <Icon icon="lucide:x" class="w-6 h-6" />
        </button>
      </div>

      <!-- 表单内容 -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- 计划标题 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">计划标题</label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="例如：高考数学冲刺计划"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <!-- 计划描述 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">计划描述</label>
          <textarea
            v-model="formData.description"
            placeholder="描述这个学习计划的目标和内容..."
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            required
          ></textarea>
        </div>

        <!-- 课程数量 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">预计课程数量</label>
          <input
            v-model.number="formData.totalCourses"
            type="number"
            min="1"
            max="100"
            placeholder="20"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <!-- 时间范围 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
            <input
              v-model="formData.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
            <input
              v-model="formData.endDate"
              type="date"
              :min="formData.startDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
        </div>

        <!-- 学习目标 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">学习目标</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="formData.goals"
                type="checkbox"
                value="improve_grades"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">提高成绩</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.goals"
                type="checkbox"
                value="exam_preparation"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">考试准备</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.goals"
                type="checkbox"
                value="skill_development"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">技能提升</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.goals"
                type="checkbox"
                value="knowledge_expansion"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">知识拓展</span>
            </label>
          </div>
        </div>

        <!-- 每日学习时间 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            每日学习时间：{{ formData.dailyHours }}小时
          </label>
          <input
            v-model.number="formData.dailyHours"
            type="range"
            min="0.5"
            max="8"
            step="0.5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5小时</span>
            <span>8小时</span>
          </div>
        </div>

        <!-- 提醒设置 -->
        <div>
          <label class="flex items-center">
            <input
              v-model="formData.enableReminder"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">启用学习提醒</span>
          </label>
          
          <div v-if="formData.enableReminder" class="mt-3 ml-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">提醒时间</label>
            <input
              v-model="formData.reminderTime"
              type="time"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex items-center gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            :disabled="!isFormValid"
          >
            创建计划
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface PlanData {
  title: string
  description: string
  totalCourses: number
  startDate: string
  endDate: string
  goals: string[]
  dailyHours: number
  enableReminder: boolean
  reminderTime: string
}

const emit = defineEmits<{
  close: []
  create: [planData: PlanData]
}>()

const formData = ref({
  title: '',
  description: '',
  totalCourses: 20,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  goals: [] as string[],
  dailyHours: 2,
  enableReminder: true,
  reminderTime: '19:00'
})

const isFormValid = computed(() => {
  return formData.value.title.trim() && 
         formData.value.description.trim() && 
         formData.value.totalCourses > 0 &&
         formData.value.startDate &&
         formData.value.endDate &&
         new Date(formData.value.endDate) > new Date(formData.value.startDate)
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('create', { ...formData.value })
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style> 
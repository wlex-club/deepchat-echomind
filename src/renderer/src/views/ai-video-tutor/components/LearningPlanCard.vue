<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-800 text-lg mb-2">{{ plan.title }}</h4>
        <p class="text-gray-600 text-sm line-clamp-2">{{ plan.description }}</p>
      </div>
      
      <!-- 状态标签 -->
      <span 
        class="px-3 py-1 text-xs rounded-full font-medium"
        :class="statusClass"
      >
        {{ statusText }}
      </span>
    </div>

    <!-- 进度信息 -->
    <div class="mb-4">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="text-gray-600">学习进度</span>
        <span class="font-semibold text-blue-600">
          {{ plan.completedCourses }}/{{ plan.totalCourses }} 课程
        </span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      
      <div class="text-xs text-gray-500 mt-1">
        {{ progressPercentage }}% 完成
      </div>
    </div>

    <!-- 时间信息 -->
    <div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
      <div class="flex items-center gap-1">
        <Icon icon="lucide:calendar" class="w-4 h-4" />
        <span>{{ formatDate(plan.startDate) }} - {{ formatDate(plan.endDate) }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon icon="lucide:clock" class="w-4 h-4" />
        <span>{{ remainingDays }}</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-2">
      <button 
        @click="$emit('start', plan)"
        class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
        :disabled="plan.status === 'completed'"
      >
        {{ plan.status === 'completed' ? '已完成' : '继续学习' }}
      </button>
      
      <button 
        @click="$emit('edit', plan)"
        class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="编辑计划"
      >
        <Icon icon="lucide:edit" class="w-4 h-4" />
      </button>
      
      <button 
        @click="$emit('delete', plan)"
        class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        title="删除计划"
      >
        <Icon icon="lucide:trash" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface LearningPlan {
  id: number
  title: string
  description: string
  totalCourses: number
  completedCourses: number
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'paused'
}

const props = defineProps<{
  plan: LearningPlan
}>()

defineEmits<{
  start: [plan: LearningPlan]
  edit: [plan: LearningPlan]
  delete: [plan: LearningPlan]
}>()

const progressPercentage = computed(() => {
  return Math.round((props.plan.completedCourses / props.plan.totalCourses) * 100)
})

const statusClass = computed(() => {
  switch (props.plan.status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-blue-100 text-blue-700'
    case 'paused':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

const statusText = computed(() => {
  switch (props.plan.status) {
    case 'active':
      return '进行中'
    case 'completed':
      return '已完成'
    case 'paused':
      return '已暂停'
    default:
      return '未知'
  }
})

const remainingDays = computed(() => {
  const endDate = new Date(props.plan.endDate)
  const now = new Date()
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return '已过期'
  if (diffDays === 0) return '今天截止'
  if (diffDays === 1) return '明天截止'
  return `还有${diffDays}天`
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
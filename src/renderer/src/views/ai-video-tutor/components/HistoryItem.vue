<template>
  <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
    <!-- 时间线点 -->
    <div class="flex-shrink-0">
      <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
    </div>

    <!-- 学习信息 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-gray-800 text-sm line-clamp-1">{{ item.title }}</h4>
          <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ item.subject }}</span>
            <span>{{ formatTime(item.watchedAt) }}</span>
            <span>·</span>
            <span>{{ item.duration }}</span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center gap-2 ml-4">
          <button 
            @click="$emit('replay', item)"
            class="text-blue-600 hover:text-blue-700 text-xs font-medium"
            title="重新播放"
          >
            重播
          </button>
          <button 
            @click="$emit('remove', item)"
            class="text-gray-400 hover:text-red-500 transition"
            title="删除记录"
          >
            <Icon icon="lucide:x" class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="mt-2 w-full bg-gray-200 rounded-full h-1">
        <div 
          class="bg-blue-500 h-1 rounded-full transition-all duration-300"
          :style="{ width: `${item.progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface HistoryItem {
  id: number
  title: string
  subject: string
  watchedAt: string
  duration: string
  progress: number
}

defineProps<{
  item: HistoryItem
}>()

defineEmits<{
  replay: [item: HistoryItem]
  remove: [item: HistoryItem]
}>()

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) return '刚刚'
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
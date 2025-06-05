<template>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
    <!-- 视频缩略图 -->
    <div class="relative">
      <img 
        :src="video.thumbnail" 
        :alt="video.title"
        class="w-full h-32 object-cover"
      />
      <!-- 播放按钮 -->
      <div 
        @click="$emit('play', video)"
        class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
          <Icon icon="lucide:play" class="w-6 h-6 text-blue-600" />
        </div>
      </div>
      
      <!-- 取消收藏按钮 -->
      <button 
        @click="$emit('unfavorite', video)"
        class="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition"
        title="取消收藏"
      >
        <Icon icon="lucide:heart" class="w-4 h-4 text-red-500" />
      </button>
    </div>

    <!-- 课程信息 -->
    <div class="p-4">
      <h4 class="font-semibold text-gray-800 line-clamp-2 text-sm mb-2">{{ video.title }}</h4>
      
      <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ video.subject }}</span>
        <span>{{ video.grade }}</span>
        <span>·</span>
        <span>{{ video.duration }}</span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <Icon icon="lucide:star" class="w-4 h-4 text-yellow-500" />
          <span class="text-sm font-medium text-gray-700">{{ video.rating }}</span>
        </div>
        
        <div class="text-xs text-gray-500">
          {{ video.teacher }}
        </div>
      </div>

      <div class="mt-3 text-xs text-gray-400">
        收藏于 {{ formatDate(video.favoriteDate) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Video {
  id: number
  title: string
  subject: string
  grade: string
  thumbnail: string
  rating: number
  duration: string
  favoriteDate: string
  teacher: string
}

defineProps<{
  video: Video
}>()

defineEmits<{
  play: [video: Video]
  unfavorite: [video: Video]
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  return date.toLocaleDateString('zh-CN')
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
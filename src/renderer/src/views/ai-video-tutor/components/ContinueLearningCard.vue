<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
    <div class="flex gap-4">
      <!-- 视频缩略图 -->
      <div class="relative flex-shrink-0">
        <img 
          :src="video.thumbnail" 
          :alt="video.title"
          class="w-32 h-20 rounded-lg object-cover"
        />
        <!-- 进度条覆盖层 -->
        <div class="absolute bottom-0 left-0 right-0 bg-black/50 rounded-b-lg p-1">
          <div class="w-full bg-gray-300 rounded-full h-1">
            <div 
              class="bg-blue-500 h-1 rounded-full transition-all duration-300"
              :style="{ width: `${video.progress}%` }"
            ></div>
          </div>
        </div>
        <!-- 播放图标 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
            <Icon icon="lucide:play" class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <!-- 课程信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-semibold text-gray-800 line-clamp-2 text-sm">{{ video.title }}</h4>
          <button 
            @click="$emit('remove', video)"
            class="text-gray-400 hover:text-red-500 transition p-1"
            title="移除"
          >
            <Icon icon="lucide:x" class="w-4 h-4" />
          </button>
        </div>
        
        <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ video.subject }}</span>
          <span>{{ video.grade }}</span>
          <span>·</span>
          <span>{{ video.lastWatched }}</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-500">
            <span>进度: {{ video.progress }}%</span>
            <span class="mx-2">·</span>
            <span>{{ video.lastPosition }} / {{ video.totalDuration }}</span>
          </div>
          
          <button 
            @click="$emit('continue', video)"
            class="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
          >
            继续学习
          </button>
        </div>
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
  progress: number
  lastPosition: string
  totalDuration: string
  lastWatched: string
}

defineProps<{
  video: Video
}>()

defineEmits<{
  continue: [video: Video]
  remove: [video: Video]
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
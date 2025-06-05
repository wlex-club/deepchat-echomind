<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 flex gap-6 group cursor-pointer">
    <!-- 视频缩略图 -->
    <div class="relative flex-shrink-0">
      <img :src="video.thumbnail" class="w-48 h-32 object-cover rounded-xl" loading="lazy" />
      <div class="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button 
          @click.stop="$emit('play', video)"
          class="bg-white/90 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition"
        >
          <Icon icon="lucide:play" class="w-6 h-6" />
        </button>
      </div>
      
      <!-- 标签 -->
      <div class="absolute top-2 left-2 flex gap-1">
        <span v-if="video.isHot" class="bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs px-2 py-0.5 rounded-full shadow">热门</span>
        <span v-if="video.isNew" class="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full shadow">新课</span>
        <span v-if="video.isPremium" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow">VIP</span>
      </div>
      
      <!-- 时长 -->
      <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {{ video.duration }}
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="flex-1 flex flex-col">
      <!-- 标题和评分 -->
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition line-clamp-2 flex-1 mr-4">
          {{ video.title }}
        </h3>
        <div class="flex items-center gap-1 text-yellow-500 flex-shrink-0">
          <Icon icon="lucide:star" class="w-4 h-4 fill-current" />
          <span class="text-sm font-semibold text-gray-700">{{ video.rating }}</span>
        </div>
      </div>

      <!-- 描述 -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{{ video.description }}</p>

      <!-- 标签和分类 -->
      <div class="flex items-center gap-2 mb-4">
        <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Icon icon="lucide:book" class="w-3 h-3" />
          {{ video.subject }}
        </span>
        <span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Icon icon="lucide:graduation-cap" class="w-3 h-3" />
          {{ video.grade }}
        </span>
        <span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
          {{ video.difficulty }}
        </span>
        <div class="flex gap-1">
          <span v-for="tag in video.tags.slice(0, 2)" :key="tag" 
                class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <Icon icon="lucide:user" class="w-4 h-4" />
            <span>{{ video.teacher }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="lucide:users" class="w-4 h-4" />
            <span>{{ video.students.toLocaleString() }}人学习</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="lucide:calendar" class="w-4 h-4" />
            <span>{{ formatDate(video.publishDate) }}</span>
          </div>
        </div>

        <!-- 价格和操作 -->
        <div class="flex items-center gap-4">
          <!-- 价格 -->
          <div class="text-right">
            <div v-if="video.price === 0" class="text-green-600 font-bold text-lg">免费</div>
            <div v-else class="flex items-center gap-2">
              <span class="text-red-500 font-bold text-lg">¥{{ video.price }}</span>
              <span v-if="video.originalPrice > video.price" class="text-gray-400 line-through text-sm">¥{{ video.originalPrice }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-2">
            <button
              @click.stop="$emit('favorite', video)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              title="收藏"
            >
              <Icon icon="lucide:heart" class="w-5 h-5" />
            </button>
            <button
              @click.stop="$emit('share', video)"
              class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
              title="分享"
            >
              <Icon icon="lucide:share-2" class="w-5 h-5" />
            </button>
            <button
              @click.stop="$emit('play', video)"
              class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition flex items-center gap-2"
            >
              <Icon icon="lucide:play" class="w-4 h-4" />
              立即学习
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Icon } from '@iconify/vue'

interface Video {
  id: number
  title: string
  subject: string
  grade: string
  description: string
  thumbnail: string
  videoUrl: string
  price: number
  originalPrice: number
  difficulty: string
  duration: string
  rating: number
  students: number
  teacher: string
  isHot: boolean
  isPremium: boolean
  isNew: boolean
  tags: string[]
  publishDate: string
}

defineProps<{ video: Video }>()
defineEmits(['play', 'favorite', 'share'])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
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
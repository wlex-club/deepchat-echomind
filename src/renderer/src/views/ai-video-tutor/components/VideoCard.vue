<template>
  <div class="rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition bg-white p-4 flex flex-col relative group cursor-pointer">
    <div class="relative">
      <img :src="video.thumbnail" class="w-full h-40 object-cover rounded-xl" loading="lazy" />
      <div class="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button 
          @click.stop="$emit('play', video)"
          class="bg-white/90 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition"
        >
          <Icon icon="lucide:play" class="w-6 h-6" />
        </button>
      </div>
      <div class="absolute top-2 left-2 flex gap-1">
        <span v-if="video.isHot" class="bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs px-2 py-0.5 rounded-full shadow">热门</span>
        <span v-if="video.isNew" class="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full shadow">新课</span>
        <span v-if="video.isPremium" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow">VIP</span>
      </div>
      <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {{ video.duration }}
      </div>
      <button
        @click.stop="$emit('favorite', video)"
        class="absolute top-2 right-2 p-1.5 bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white rounded-full transition opacity-0 group-hover:opacity-100"
        title="收藏"
      >
        <Icon icon="lucide:heart" class="w-4 h-4" />
      </button>
    </div>
    <div class="flex-1 flex flex-col mt-3">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-bold text-base text-gray-800 group-hover:text-blue-600 transition line-clamp-2 flex-1 mr-2">
          {{ video.title }}
        </h3>
        <div class="flex items-center gap-1 text-yellow-500 flex-shrink-0">
          <Icon icon="lucide:star" class="w-3 h-3 fill-current" />
          <span class="text-xs font-semibold text-gray-600">{{ video.rating }}</span>
        </div>
      </div>
      <div class="flex gap-2 mb-2">
        <span class="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
          <Icon icon="lucide:book" class="w-3 h-3" />{{ video.subject }}
        </span>
        <span class="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
          <Icon icon="lucide:graduation-cap" class="w-3 h-3" />{{ video.grade }}
        </span>
      </div>
      <p class="text-sm text-gray-600 line-clamp-2 flex-1 mb-3">{{ video.description }}</p>
      <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div class="flex items-center gap-1">
          <Icon icon="lucide:user" class="w-3 h-3" />
          <span>{{ video.teacher }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon icon="lucide:users" class="w-3 h-3" />
          <span>{{ video.students.toLocaleString() }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <div v-if="video.price === 0" class="text-green-600 font-bold">免费</div>
          <div v-else class="flex items-center gap-1">
            <span class="text-red-500 font-bold">¥{{ video.price }}</span>
            <span v-if="video.originalPrice > video.price" class="text-gray-400 line-through text-xs">¥{{ video.originalPrice }}</span>
          </div>
        </div>
        <button
          @click.stop="$emit('share', video)"
          class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
          title="分享"
        >
          <Icon icon="lucide:share-2" class="w-4 h-4" />
        </button>
      </div>
      <button 
        class="mt-3 w-full rounded-full py-2 text-sm font-bold shadow bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center gap-2 hover:scale-105 transition" 
        @click.stop="$emit('play', video)"
      >
        <Icon icon="lucide:play" class="w-4 h-4" /> 
        {{ video.price === 0 ? '免费学习' : '立即购买' }}
      </button>
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
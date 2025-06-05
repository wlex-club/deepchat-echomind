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
        <!-- 状态标签 -->
        <div class="absolute top-2 left-2">
          <span 
            class="px-2 py-1 text-xs rounded-full font-medium"
            :class="statusClass"
          >
            {{ statusText }}
          </span>
        </div>
      </div>

      <!-- 课程信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <h4 class="font-semibold text-gray-800 line-clamp-2 text-sm">{{ video.title }}</h4>
          
          <!-- 操作菜单 -->
          <div class="relative">
            <button 
              @click="showMenu = !showMenu"
              class="text-gray-400 hover:text-gray-600 transition p-1"
            >
              <Icon icon="lucide:more-horizontal" class="w-4 h-4" />
            </button>
            
            <!-- 下拉菜单 -->
            <div 
              v-if="showMenu"
              class="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32"
            >
              <button 
                @click="handleEdit"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Icon icon="lucide:edit" class="w-4 h-4" />
                编辑
              </button>
              <button 
                @click="handleViewStats"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Icon icon="lucide:bar-chart" class="w-4 h-4" />
                统计
              </button>
              <button 
                @click="handleShare"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Icon icon="lucide:share" class="w-4 h-4" />
                分享
              </button>
              <hr class="my-1" />
              <button 
                @click="handleDelete"
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Icon icon="lucide:trash" class="w-4 h-4" />
                删除
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ video.subject }}</span>
          <span>{{ video.grade }}</span>
          <span>·</span>
          <span>{{ video.duration }}</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <div class="flex items-center gap-1">
              <Icon icon="lucide:eye" class="w-4 h-4" />
              <span>{{ formatNumber(video.views) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon icon="lucide:heart" class="w-4 h-4" />
              <span>{{ formatNumber(video.likes) }}</span>
            </div>
          </div>
          
          <div class="text-xs text-gray-400">
            {{ formatDate(video.createdDate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Video {
  id: number
  title: string
  subject: string
  grade: string
  thumbnail: string
  views: number
  likes: number
  status: 'published' | 'draft' | 'processing'
  createdDate: string
  duration: string
}

const props = defineProps<{
  video: Video
}>()

const emit = defineEmits<{
  edit: [video: Video]
  delete: [video: Video]
  share: [video: Video]
  'view-stats': [video: Video]
}>()

const showMenu = ref(false)

const statusClass = computed(() => {
  switch (props.video.status) {
    case 'published':
      return 'bg-green-100 text-green-700'
    case 'draft':
      return 'bg-yellow-100 text-yellow-700'
    case 'processing':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

const statusText = computed(() => {
  switch (props.video.status) {
    case 'published':
      return '已发布'
    case 'draft':
      return '草稿'
    case 'processing':
      return '处理中'
    default:
      return '未知'
  }
})

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  return num.toString()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const handleEdit = () => {
  showMenu.value = false
  emit('edit', props.video)
}

const handleDelete = () => {
  showMenu.value = false
  emit('delete', props.video)
}

const handleShare = () => {
  showMenu.value = false
  emit('share', props.video)
}

const handleViewStats = () => {
  showMenu.value = false
  emit('view-stats', props.video)
}

// 点击外部关闭菜单
document.addEventListener('click', (e) => {
  if (showMenu.value && !(e.target as Element).closest('.relative')) {
    showMenu.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
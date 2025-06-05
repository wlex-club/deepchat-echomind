<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 页面头部 -->
    <header class="bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">AI创作工作台</h1>
          <p class="text-gray-600">AI智能+裸眼3D，让创意跃然眼前</p>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 工具网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tool in filteredTools"
          :key="tool.id"
          @click="handleToolClick(tool)"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:scale-105"
          :class="{ 'opacity-50 cursor-not-allowed': tool.status === 'coming-soon' }"
        >
          <!-- 工具图标 -->
          <div class="p-6 text-center">
            <div 
              class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              :class="tool.bgColor"
            >
              <Icon :icon="tool.icon" class="w-8 h-8 text-white" />
            </div>
            
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ tool.name }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ tool.description }}</p>
            
            <!-- 功能特点 -->
            <div class="flex flex-wrap gap-2 justify-center mb-4">
              <span
                v-for="feature in tool.features"
                :key="feature"
                class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {{ feature }}
              </span>
            </div>
            
            <!-- 使用状态 -->
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <Icon icon="lucide:users" class="w-3 h-3" />
                {{ tool.usageCount }}次使用
              </span>
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="tool.status === 'available' 
                  ? 'bg-green-100 text-green-700' 
                  : tool.status === 'beta' 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'"
              >
                {{ getStatusText(tool.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 工具状态类型
type ToolStatus = 'available' | 'beta' | 'coming-soon'

// 工具接口
interface Tool {
  id: string
  name: string
  description: string
  icon: string
  bgColor: string
  category: string
  features: string[]
  usageCount: number
  status: ToolStatus
  route?: string
  requirements?: string
}

// 工具列表
const tools = ref<Tool[]>([
  {
    id: 'ai-image',
    name: 'AI绘图',
    description: '输入描述，秒生成高质量图片',
    icon: 'lucide:image',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    category: 'ai',
    features: ['多风格', '高分辨率', '创意生成'],
    usageCount: 3248,
    status: 'available',
    route: '/ai-video-tutor/ai-image'
  },
  {
    id: 'ai-3d-studio',
    name: 'AI 3D创作',
    description: '智能生成3D模型，支持裸眼3D预览与展示',
    icon: 'lucide:box',
    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    category: '3d',
    features: ['智能生成', '裸眼3D', '实时预览', '多格式导出'],
    usageCount: 2459,
    status: 'available',
    route: '/ai-video-tutor/ai-3d'
  },
  {
    id: 'courseware-generator',
    name: '一键生成课件',
    description: '智能生成精美课件，支持PPT、PDF等多种格式',
    icon: 'lucide:presentation',
    bgColor: 'bg-gradient-to-r from-emerald-500 to-cyan-500',
    category: 'video',
    features: ['多种模板', '自动排版', '一键导出', '智能配色'],
    usageCount: 856,
    status: 'available',
    route: '/ai-video-tutor/courseware-generator'
  },
  // {
  //   id: 'homework-helper',
  //   name: '作业智能助手',
  //   description: '拍照上传作业，获得详细解答过程',
  //   icon: 'lucide:camera',
  //   bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
  //   category: 'study',
  //   features: ['图像识别', '详细解析', '举一反三'],
  //   usageCount: 2156,
  //   status: 'available',
  //   route: '/ai-video-tutor/homework-helper'
  // }
])

// 直接显示所有工具
const filteredTools = computed(() => {
  return tools.value
})

// 获取状态文本
const getStatusText = (status: ToolStatus): string => {
  switch (status) {
    case 'available':
      return '可用'
    case 'beta':
      return '测试版'
    case 'coming-soon':
      return '即将推出'
    default:
      return '未知'
  }
}

// 处理工具点击 - 直接跳转到详情页
const handleToolClick = (tool: Tool) => {
  // 如果工具还未推出，显示提示
  if (tool.status === 'coming-soon') {
    alert('该功能即将推出，敬请期待！')
    return
  }
  
  // 如果有路由，直接跳转
  if (tool.route) {
    router.push(tool.route)
  }
}

// 组件挂载
onMounted(() => {
  console.log('工具页面加载完成')
})
</script>

<style scoped>
/* 确保网格布局在不同屏幕下的响应式 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* 工具卡片hover效果 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 禁用状态的卡片样式 */
.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}

.cursor-not-allowed:hover {
  transform: none !important;
}
</style> 
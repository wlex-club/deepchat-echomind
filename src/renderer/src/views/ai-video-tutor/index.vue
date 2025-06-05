<template>
  <div class="ai-video-tutor-app">
    <!-- 顶部导航栏 -->
    <Header 
      :activeTab="headerActiveTab" 
      @update:tab="handleTabChange"
      @go-home="handleGoHome"
    />
    
    <!-- 主内容区域 -->
    <main class="flex-1 overflow-hidden">
      <Suspense>
        <template #default>
          <KeepAlive>
            <component :is="currentComponent" />
          </KeepAlive>
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-screen">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p class="text-gray-600">加载中...</p>
            </div>
          </div>
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import VideoDiscover from './VideoDiscover.vue'
import VideoTools from './VideoTools.vue'
import MyVideoTutor from './MyVideoTutor.vue'

// 定义有效的标签页类型
type TabType = 'discover' | 'my-videos' | 'tools'

const { t } = useI18n()
const title = useTitle()

// 响应式状态 - 默认设置为'discover'以确保发现按钮高亮
const activeTab = ref<TabType>('discover')

// 计算Header组件期望的activeTab值
const headerActiveTab = computed(() => {
  switch (activeTab.value) {
    case 'my-videos':
      return 'mine'
    case 'tools':
      return 'tools'
    case 'discover':
    default:
      return 'discover'
  }
})

// 计算当前要显示的组件
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'my-videos':
      return MyVideoTutor
    case 'tools':
      return VideoTools
    case 'discover':
    default:
      return VideoDiscover
  }
})

// 标签页变化处理
const handleTabChange = (tab: string): void => {
  console.log('Tab change requested:', tab)
  
  // Header组件使用的按钮key映射
  let mappedTab: TabType = 'discover'
  
  switch (tab) {
    case 'discover':
      mappedTab = 'discover'
      break
    case 'mine':
      mappedTab = 'my-videos'
      break
    case 'tools':
      mappedTab = 'tools'
      break
    default:
      mappedTab = 'discover'
      break
  }
  
  // 如果点击的是当前活动标签，不做任何处理
  if (mappedTab === activeTab.value) {
    return
  }
  
  activeTab.value = mappedTab
}

// 返回主页处理
const handleGoHome = (): void => {
  console.log('Go home requested')
  activeTab.value = 'discover'
}

// 组件挂载时初始化
onMounted(() => {
  console.log('AI Video Tutor component mounted')
  title.value = t('routes.discovery')
})
</script>

<style scoped>
.ai-video-tutor-app {
  @apply flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50;
}

/* 加载动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 确保组件切换的平滑过渡 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* 防止内容溢出 */
main {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}
</style> 
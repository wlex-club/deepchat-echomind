<template>
  <nav class="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100/50 transition-all duration-300">
    <!-- 左侧品牌区域 -->
    <div class="flex items-center gap-4">
      <!-- Logo -->
      <div 
        class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2.5 shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-300 hover:shadow-xl hover:from-blue-600 hover:to-purple-700 group"
        @click="$emit('go-home')"
        role="button"
        tabindex="0"
        aria-label="回到首页"
        @keydown.enter="$emit('go-home')"
        @keydown.space.prevent="$emit('go-home')"
      >
        <Icon icon="lucide:play-circle" class="text-white w-6 h-6 transition-transform duration-300 group-hover:rotate-180" />
      </div>
      
      <!-- 品牌名称 -->
      <div class="flex flex-col">
        <span
          class="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wide"
          @click="$emit('go-home')"
          role="button"
          tabindex="0"
          aria-label="AI视频讲堂首页"
          @keydown.enter="$emit('go-home')"
          @keydown.space.prevent="$emit('go-home')"
        >
          AI视频讲堂
        </span>
        <span class="text-xs text-gray-500 font-medium">智能教育新体验</span>
      </div>
      
      <!-- 导航按钮 -->
      <div class="hidden md:flex items-center gap-2 ml-6">
        <button
          v-for="btn in topNavButtons"
          :key="btn.key"
          @click="onTopNavClick(btn.key)"
          :class="[
            'px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative overflow-hidden group',
            activeTab === btn.key
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 hover:scale-105'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-lg border border-blue-200 hover:border-blue-400 hover:scale-105 hover:text-blue-700'
          ]"
          :aria-label="`切换到${btn.label}页面`"
        >
          <!-- 图标和文字 -->
          <div class="relative z-10 flex items-center">
            <Icon 
              :icon="btn.icon" 
              class="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" 
            />
            <span class="transition-all duration-300 group-hover:tracking-wide">{{ btn.label }}</span>
          </div>
          
          <!-- 底部光条效果 -->
          <div 
            class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"
            :class="{ 'w-full left-0': activeTab === btn.key }"
          ></div>
        </button>
      </div>
    </div>

    <!-- 右侧功能区域 -->
    <div class="flex items-center gap-3">
      <!-- 搜索框 -->
      <div class="relative group">
        <Icon 
          icon="lucide:search" 
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none group-focus-within:text-blue-500 transition-all duration-300 group-hover:scale-110" 
        />
        <input
          v-model="search"
          placeholder="搜索视频/知识点..."
          class="pl-10 pr-4 py-2.5 w-48 md:w-64 lg:w-72 rounded-full shadow-md border border-blue-200 bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-gray-400 hover:shadow-xl focus:bg-white hover:border-blue-300 hover:bg-white"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
          @keydown.enter="handleSearchSubmit"
        />
        
        <!-- 搜索建议下拉 -->
        <Transition name="search-suggestions">
          <div 
            v-if="isSearchFocused && search.trim() && searchSuggestions.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto"
          >
            <div 
              v-for="(suggestion, index) in searchSuggestions" 
              :key="index"
              class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 flex items-center gap-3 hover:shadow-sm hover:scale-[1.02] transform"
              @click="selectSearchSuggestion(suggestion)"
            >
              <Icon :icon="suggestion.icon" class="w-4 h-4 text-blue-500 transition-transform duration-200 hover:scale-110" />
              <div class="flex-1">
                <div class="font-medium text-gray-800 transition-colors duration-200 hover:text-blue-600">{{ suggestion.title }}</div>
                <div class="text-xs text-gray-500">{{ suggestion.category }}</div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

        <!-- 通知按钮 -->
        <button
          class="relative p-2.5 rounded-full bg-white/80 hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:scale-110 group"
          @click="toggleNotifications"
          :aria-label="showNotifications ? '关闭通知' : '查看通知'"
        >
          <Icon icon="lucide:bell" class="w-5 h-5 text-gray-600 hover:text-blue-600 transition-all duration-300 group-hover:animate-bounce" />
          <span 
            v-if="unreadNotifications > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold transition-all duration-300"
          >
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </span>
        </button>

        <!-- 移动端菜单按钮 -->
        <button
          class="md:hidden p-2.5 rounded-full bg-white/80 hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          @click="toggleMobileMenu"
          :aria-label="showMobileMenu ? '关闭菜单' : '打开菜单'"
        >
          <Icon 
            :icon="showMobileMenu ? 'lucide:x' : 'lucide:menu'" 
            class="w-5 h-5 text-gray-600 transition-all duration-200"
          />
        </button>
    </div>

    <!-- 移动端导航菜单 -->
    <Transition name="mobile-menu">
      <div 
        v-if="showMobileMenu"
        class="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg md:hidden"
      >
        <div class="px-6 py-4 space-y-2">
          <button
            v-for="btn in topNavButtons"
            :key="btn.key"
            @click="onMobileNavClick(btn.key)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
              activeTab === btn.key
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
            ]"
          >
            <Icon :icon="btn.icon" class="w-5 h-5" />
            {{ btn.label }}
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

// 类型定义
interface SearchSuggestion {
  title: string
  category: string
  icon: string
}

interface NavButton {
  key: string
  label: string
  icon: string
}

// Props 和 Emits
defineProps<{ activeTab: string }>()
const emit = defineEmits(['go-home', 'update:tab', 'update:search', 'update:lang'])

// 响应式数据
const search = ref('')
const lang = ref('zh')
const isSearchFocused = ref(false)
const showNotifications = ref(false)
const showMobileMenu = ref(false)
const unreadNotifications = ref(3)

// 导航按钮配置
const topNavButtons: NavButton[] = [
  { key: 'discover', label: '发现', icon: 'lucide:compass' },
  { key: 'mine', label: '我的讲堂', icon: 'lucide:video' },
  { key: 'tools', label: '工具', icon: 'lucide:wrench' }
]

// 搜索建议
const searchSuggestions = computed((): SearchSuggestion[] => {
  if (!search.value.trim()) return []
  
  const suggestions: SearchSuggestion[] = [
    { title: 'SAT数学解题技巧', category: '数学', icon: 'lucide:calculator' },
    { title: 'AP物理实验', category: '物理', icon: 'lucide:zap' },
    { title: '英语语法精讲', category: '语言', icon: 'lucide:book-open' },
    { title: '编程基础入门', category: '计算机', icon: 'lucide:code' },
    { title: '化学反应原理', category: '化学', icon: 'lucide:flask-conical' }
  ]
  
  return suggestions.filter(s => 
    s.title.toLowerCase().includes(search.value.toLowerCase()) ||
    s.category.toLowerCase().includes(search.value.toLowerCase())
  ).slice(0, 5)
})

// 方法
function onTopNavClick(key: string) {
  emit('update:tab', key)
}

function onMobileNavClick(key: string) {
  emit('update:tab', key)
  showMobileMenu.value = false
}

function handleSearchSubmit() {
  if (search.value.trim()) {
    emit('update:search', search.value.trim())
    isSearchFocused.value = false
  }
}

function selectSearchSuggestion(suggestion: SearchSuggestion) {
  search.value = suggestion.title
  emit('update:search', suggestion.title)
  isSearchFocused.value = false
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showMobileMenu.value = false
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
  showNotifications.value = false
}

function handleClickOutside(event: Event) {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showNotifications.value = false
    isSearchFocused.value = false
  }
}

// 监听器
watch(search, (val) => {
  emit('update:search', val)
})

watch(lang, (val) => {
  emit('update:lang', val)
})

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 搜索建议动画 */
.search-suggestions-enter-active,
.search-suggestions-leave-active {
  transition: all 0.2s ease;
}

.search-suggestions-enter-from,
.search-suggestions-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 用户菜单动画 */
.user-menu-enter-active,
.user-menu-leave-active {
  transition: all 0.2s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* 移动端菜单动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 焦点样式 */
button:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 响应式隐藏 */
@media (max-width: 768px) {
  .hidden-mobile {
    display: none;
  }
}
</style> 
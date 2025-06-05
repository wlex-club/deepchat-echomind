<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 页面头部 -->
    <header class="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {{ userInfo.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">{{ userInfo.name }}的讲堂</h1>
              <p class="text-gray-600">{{ userInfo.title }} · 已学习{{ userStats.totalDays }}天</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- 学习等级 -->
            <div class="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
              <Icon icon="lucide:crown" class="w-5 h-5" />
              <span class="font-semibold">{{ userInfo.level }}</span>
            </div>
            
            <!-- 学习积分 -->
            <div class="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
              <Icon icon="lucide:coins" class="w-5 h-5" />
              <span class="font-semibold">{{ userStats.totalPoints }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 学习统计卡片 -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:play-circle" class="w-6 h-6 text-blue-600" />
            </div>
            <span class="text-sm text-gray-500">本周</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">{{ userStats.weeklyHours }}小时</div>
          <div class="text-sm text-gray-600">学习时长</div>
          <div class="mt-2 text-xs text-green-600">+{{ userStats.weeklyGrowth }}% 较上周</div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:check-circle" class="w-6 h-6 text-green-600" />
            </div>
            <span class="text-sm text-gray-500">总计</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">{{ userStats.completedCourses }}</div>
          <div class="text-sm text-gray-600">已完成课程</div>
          <div class="mt-2 text-xs text-blue-600">{{ userStats.completionRate }}% 完成率</div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:heart" class="w-6 h-6 text-purple-600" />
            </div>
            <span class="text-sm text-gray-500">收藏</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">{{ userStats.favoriteCount }}</div>
          <div class="text-sm text-gray-600">收藏课程</div>
          <div class="mt-2 text-xs text-purple-600">{{ userStats.newFavorites }}个新增</div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:trophy" class="w-6 h-6 text-orange-600" />
            </div>
            <span class="text-sm text-gray-500">成就</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mb-1">{{ userStats.achievements }}</div>
          <div class="text-sm text-gray-600">获得成就</div>
          <div class="mt-2 text-xs text-orange-600">{{ userStats.recentAchievements }}个新获得</div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 pb-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧内容 -->
        <div class="flex-1">
          <!-- 标签导航 -->
          <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              class="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition"
              :class="activeTab === tab.key 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'"
            >
              <Icon :icon="tab.icon" class="w-4 h-4" />
              <span>{{ tab.name }}</span>
              <span v-if="tab.count" class="text-xs opacity-75">({{ tab.count }})</span>
            </button>
          </div>

          <!-- 内容区域 -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <!-- 继续学习 -->
            <div v-if="activeTab === 'continue'" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">继续学习</h3>
                <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">查看全部</button>
              </div>
              
              <div class="text-center py-12">
                <Icon icon="lucide:play-circle" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 class="text-lg font-semibold text-gray-600 mb-2">暂无进行中的课程</h4>
                <p class="text-gray-500 mb-6">开始学习新课程，在这里查看学习进度</p>
                <button @click="handleGoToDiscover" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                  发现课程
                </button>
              </div>
            </div>

            <!-- 收藏的课程 -->
            <div v-else-if="activeTab === 'favorites'" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">收藏的课程</h3>
                <div class="flex items-center gap-2">
                  <select v-model="favoritesSort" class="border border-gray-200 rounded-lg px-3 py-1 text-sm">
                    <option value="recent">最近收藏</option>
                    <option value="name">按名称</option>
                    <option value="rating">按评分</option>
                  </select>
                </div>
              </div>
              
              <div class="text-center py-12">
                <Icon icon="lucide:heart" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 class="text-lg font-semibold text-gray-600 mb-2">暂无收藏课程</h4>
                <p class="text-gray-500 mb-6">收藏感兴趣的课程，方便随时学习</p>
                <button @click="handleGoToDiscover" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                  发现课程
                </button>
              </div>
            </div>

            <!-- 我创建的课程 -->
            <div v-else-if="activeTab === 'created'" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">我创建的课程</h3>
                <button 
                  @click="handleCreateNew"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <Icon icon="lucide:plus" class="w-4 h-4" />
                  创建新课程
                </button>
              </div>
              
              <div class="text-center py-12">
                <Icon icon="lucide:video" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 class="text-lg font-semibold text-gray-600 mb-2">暂无创建的课程</h4>
                <p class="text-gray-500 mb-6">使用AI创建个性化教学视频，分享你的知识</p>
                <button @click="handleCreateNew" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                  创建第一个课程
                </button>
              </div>
            </div>

            <!-- 学习历史 -->
            <div v-else-if="activeTab === 'history'" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">学习历史</h3>
                <div class="flex items-center gap-2">
                  <select v-model="historyFilter" class="border border-gray-200 rounded-lg px-3 py-1 text-sm">
                    <option value="all">全部</option>
                    <option value="today">今天</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                  </select>
                  <button @click="clearHistory" class="text-red-600 hover:text-red-700 text-sm">清空历史</button>
                </div>
              </div>
              
              <div class="text-center py-12">
                <Icon icon="lucide:clock" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 class="text-lg font-semibold text-gray-600 mb-2">暂无学习历史</h4>
                <p class="text-gray-500">开始学习课程，这里会记录你的学习轨迹</p>
              </div>
            </div>

            <!-- 学习计划 -->
            <div v-else-if="activeTab === 'plans'" class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">学习计划</h3>
                <button 
                  @click="showCreatePlan = true"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <Icon icon="lucide:plus" class="w-4 h-4" />
                  创建计划
                </button>
              </div>
              
              <div class="text-center py-12">
                <Icon icon="lucide:calendar" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 class="text-lg font-semibold text-gray-600 mb-2">暂无学习计划</h4>
                <p class="text-gray-500 mb-6">制定学习计划，让学习更有条理</p>
                <button @click="showCreatePlan = true" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                  创建学习计划
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <aside class="w-80">
          <!-- 学习进度 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">本周学习进度</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">目标：20小时</span>
                <span class="font-semibold text-blue-600">{{ userStats.weeklyHours }}/20小时</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((userStats.weeklyHours / 20) * 100, 100)}%` }"
                ></div>
              </div>
              <div class="text-xs text-gray-500">
                还需学习 {{ Math.max(20 - userStats.weeklyHours, 0) }} 小时完成本周目标
              </div>
            </div>
          </div>

          <!-- 最近成就 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">最近成就</h3>
            <div class="space-y-3">
              <div v-for="achievement in recentAchievements" :key="achievement.id" 
                   class="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Icon :icon="achievement.icon" class="w-5 h-5 text-yellow-600" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-800 text-sm">{{ achievement.title }}</div>
                  <div class="text-xs text-gray-500">{{ achievement.date }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 推荐课程 -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">为你推荐</h3>
            <div class="space-y-4">
              <div v-for="recommendation in recommendations" :key="recommendation.id"
                   class="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                   @click="handlePlay(recommendation)">
                <img :src="recommendation.thumbnail" class="w-16 h-12 rounded-lg object-cover" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm text-gray-800 line-clamp-2">{{ recommendation.title }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ recommendation.subject }} · {{ recommendation.duration }}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- 创建学习计划提示 -->
    <div v-if="showCreatePlan" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showCreatePlan = false">
      <div class="bg-white rounded-2xl p-6 max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">创建学习计划</h3>
        <p class="text-gray-600 mb-6">学习计划功能正在开发中，敬请期待！</p>
        <div class="flex justify-end gap-3">
          <button @click="showCreatePlan = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户信息
const userInfo = ref({
  name: '张同学',
  title: '高中生',
  level: 'VIP学者',
  avatar: ''
})

// 用户统计数据
const userStats = ref({
  totalDays: 156,
  totalPoints: 2580,
  weeklyHours: 12.5,
  weeklyGrowth: 15,
  completedCourses: 28,
  completionRate: 85,
  favoriteCount: 15,
  newFavorites: 3,
  achievements: 12,
  recentAchievements: 2
})

// 标签页
const tabs = [
  { key: 'continue', name: '继续学习', icon: 'lucide:play-circle', count: 0 },
  { key: 'favorites', name: '收藏课程', icon: 'lucide:heart', count: 0 },
  { key: 'created', name: '我的创作', icon: 'lucide:video', count: 0 },
  { key: 'history', name: '学习历史', icon: 'lucide:clock', count: 0 },
  { key: 'plans', name: '学习计划', icon: 'lucide:calendar', count: 0 }
]

const activeTab = ref(tabs[0].key)

// 筛选和排序
const favoritesSort = ref('recent')
const historyFilter = ref('all')
const showCreatePlan = ref(false)

// 最近成就
const recentAchievements = ref([
  {
    id: 1,
    title: '学习达人',
    icon: 'lucide:trophy',
    date: '2天前'
  },
  {
    id: 2,
    title: '连续学习7天',
    icon: 'lucide:calendar-check',
    date: '1周前'
  }
])

// 推荐课程
const recommendations = ref([
  {
    id: 9,
    title: '高中化学：有机化合物',
    subject: '化学',
    duration: '40分钟',
    thumbnail: 'https://img.youtube.com/vi/xyz789/0.jpg'
  },
  {
    id: 10,
    title: '英语语法：虚拟语气',
    subject: '英语',
    duration: '30分钟',
    thumbnail: 'https://img.youtube.com/vi/def456/0.jpg'
  }
])

// 定义推荐视频类型
interface RecommendationVideo {
  id: number
  title: string
  subject: string
  duration: string
  thumbnail: string
}

// 方法
const handleGoToDiscover = () => {
  router.push('/ai-video-tutor')
}

const handleCreateNew = () => {
  console.log('创建新课程')
  router.push('/ai-video-tutor')
}

const handlePlay = (video: RecommendationVideo) => {
  console.log('播放视频:', video)
}

const clearHistory = () => {
  if (confirm('确定要清空所有学习历史吗？')) {
    console.log('历史已清空')
  }
}

// 生命周期
onMounted(() => {
  console.log('我的讲堂页面已加载')
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
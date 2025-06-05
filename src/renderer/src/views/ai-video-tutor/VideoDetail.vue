<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 返回按钮 -->
    <div class="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-blue-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <button 
          @click="handleGoBack"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium rounded-lg border border-blue-200/50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Icon icon="lucide:arrow-left" class="w-4 h-4" />
          <span>返回</span>
        </button>
      </div>
    </div>

    <!-- 视频详情内容 -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容区域 -->
        <div class="lg:col-span-2">
          <!-- Tabs导航 -->
          <div class="bg-white rounded-t-2xl shadow-lg overflow-hidden">
            <div class="flex border-b border-gray-200">
              <button
                @click="activeTab = 'video'"
                :class="[
                  'flex-1 px-6 py-4 text-center font-medium transition-all duration-200',
                  activeTab === 'video' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                <Icon icon="lucide:play" class="w-5 h-5 inline mr-2" />
                视频
              </button>
              <button
                @click="activeTab = 'practice'"
                :class="[
                  'flex-1 px-6 py-4 text-center font-medium transition-all duration-200',
                  activeTab === 'practice' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                ]"
              >
                <Icon icon="lucide:brain" class="w-5 h-5 inline mr-2" />
                测试
              </button>
            </div>
          </div>

          <!-- 视频Tab内容 -->
          <div v-if="activeTab === 'video'" class="bg-white rounded-b-2xl shadow-lg overflow-hidden mb-6">
            <div class="aspect-video bg-gray-900 relative">
              <div 
                v-if="!videoLoaded"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="text-center text-white">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>加载视频中...</p>
                </div>
              </div>
              
              <!-- HTML5 视频播放器 -->
              <video
                v-show="videoLoaded"
                ref="videoPlayer"
                class="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg"
                @loadeddata="handleVideoLoaded"
                @timeupdate="handleTimeUpdate"
                @ended="handleVideoEnded"
                @play="handleVideoPlay"
                @pause="handleVideoPause"
                @error="handleVideoError"
              >
                <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
                您的浏览器不支持视频播放。
              </video>
              
              <!-- 视频信息覆盖层 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6" :class="{ 'opacity-0': showControls }">
                <h1 class="text-2xl font-bold text-white mb-2">{{ videoInfo.title }}</h1>
                <div class="flex items-center gap-4 text-white/80 text-sm">
                  <span>{{ videoInfo.duration }}</span>
                  <span>{{ videoInfo.subject }}</span>
                  <span>{{ videoInfo.level }}</span>
                  <span>{{ videoInfo.createdAt }}</span>
                </div>
              </div>
            </div>

            <!-- 视频描述和详情 -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-800">课程描述</h2>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleFavorite"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
                    :class="isFavorited 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'"
                  >
                    <Icon :icon="isFavorited ? 'lucide:heart-solid' : 'lucide:heart'" class="w-4 h-4" />
                    {{ isFavorited ? '已收藏' : '收藏' }}
                  </button>
                  <button 
                    @click="shareVideo"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <Icon icon="lucide:share-2" class="w-4 h-4" />
                    分享
                  </button>
                  <button 
                    @click="downloadVideo"
                    class="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 hover:text-green-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <Icon icon="lucide:download" class="w-4 h-4" />
                    下载
                  </button>
                </div>
              </div>
              
              <div class="prose prose-blue max-w-none">
                <p class="text-gray-600 leading-relaxed">{{ videoInfo.description }}</p>
              </div>

              <!-- 知识点标签 -->
              <div class="mt-6">
                <h3 class="text-lg font-medium text-gray-800 mb-3">涵盖知识点</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in videoInfo.tags" 
                    :key="tag"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 章节列表 -->
              <div class="mt-6">
                <h3 class="text-lg font-medium text-gray-800 mb-3">课程章节</h3>
                <div class="space-y-3">
                  <div 
                    v-for="(chapter, index) in videoInfo.chapters" 
                    :key="index"
                    class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                    @click="jumpToChapter(chapter)"
                  >
                    <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-800">{{ chapter.title }}</h4>
                      <p class="text-sm text-gray-500">{{ chapter.duration }}</p>
                    </div>
                    <Icon icon="lucide:play-circle" class="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 练习Tab内容 -->
          <div v-if="activeTab === 'practice'" class="bg-white rounded-b-2xl shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-800">相关练习</h2>
              <span class="text-sm text-gray-500">{{ practiceQuestions.length }} 道题目</span>
            </div>
            
            <div v-if="currentQuestion" class="space-y-6">
              <div class="flex items-center justify-between mb-6">
                <span class="text-sm text-gray-500">题目 {{ currentQuestionIndex + 1 }} / {{ practiceQuestions.length }}</span>
                <button 
                  @click="resetPractice"
                  class="text-gray-400 hover:text-gray-600"
                  title="重新开始"
                >
                  <Icon icon="lucide:rotate-ccw" class="w-6 h-6" />
                </button>
              </div>
              
              <div class="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">{{ currentQuestion.question }}</h4>
                <div class="space-y-3">
                  <label 
                    v-for="(option, index) in currentQuestion.options" 
                    :key="index"
                    class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white transition"
                    :class="{ 'bg-blue-50 border border-blue-200': selectedAnswer === index }"
                  >
                    <input 
                      type="radio" 
                      :value="index" 
                      v-model="selectedAnswer"
                      class="text-blue-500 w-4 h-4"
                    />
                    <span class="text-gray-700">{{ option }}</span>
                  </label>
                </div>
              </div>
              
              <div class="flex justify-between">
                <button 
                  @click="previousQuestion"
                  :disabled="currentQuestionIndex === 0"
                  class="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium"
                >
                  上一题
                </button>
                <button 
                  @click="nextQuestion"
                  :disabled="selectedAnswer === null"
                  class="px-6 py-3 bg-purple-500 text-white rounded-lg disabled:opacity-50 hover:bg-purple-600 transition font-medium"
                >
                  {{ currentQuestionIndex === practiceQuestions.length - 1 ? '完成' : '下一题' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 讨论区 -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800">讨论区</h2>
              <span class="text-sm text-gray-500">{{ comments.length }} 条讨论</span>
            </div>
            
            <!-- 发表评论 -->
            <div class="mb-6">
              <textarea
                v-model="newComment"
                placeholder="分享你的学习心得或提出问题..."
                class="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none resize-none h-24"
              ></textarea>
              <div class="flex justify-end mt-2">
                <button 
                  @click="postComment"
                  :disabled="!newComment.trim()"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition"
                >
                  发表
                </button>
              </div>
            </div>
            
            <!-- 评论列表 -->
            <div class="space-y-4">
              <div 
                v-for="comment in comments" 
                :key="comment.id"
                class="flex gap-3 p-4 border border-gray-100 rounded-lg"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ comment.author.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-gray-800">{{ comment.author }}</span>
                    <span class="text-xs text-gray-500">{{ formatCommentTime(comment.createdAt) }}</span>
                  </div>
                  <p class="text-gray-700">{{ comment.content }}</p>
                  <div class="flex items-center gap-4 mt-2">
                    <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition">
                      <Icon icon="lucide:thumbs-up" class="w-4 h-4" />
                      {{ comment.likes }}
                    </button>
                    <button class="text-sm text-gray-500 hover:text-blue-500 transition">
                      回复
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-1">
          <!-- AI学习助手对话 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Icon icon="lucide:bot" class="w-5 h-5 text-purple-500" />
                AI学习助手
              </h3>
              <button 
                @click="clearChat"
                class="text-gray-400 hover:text-gray-600 transition"
                title="清空对话"
              >
                <Icon icon="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
            
            <!-- 对话区域 -->
            <div class="h-80 border border-gray-200 rounded-lg mb-4 overflow-hidden flex flex-col">
              <!-- 消息列表 -->
              <div class="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                <div v-if="chatMessages.length === 0" class="text-center text-gray-500 mt-8">
                  <Icon icon="lucide:message-circle" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p class="text-sm">向AI助手提问视频相关问题</p>
                  <p class="text-xs text-gray-400 mt-1">例如：解释一下有机化合物的分类</p>
                </div>
                
                <div 
                  v-for="message in chatMessages" 
                  :key="message.id"
                  class="flex"
                  :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
                >
                  <div 
                    class="max-w-[80%] rounded-lg p-3 text-sm"
                    :class="message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 shadow-sm border'"
                  >
                    <div v-if="message.role === 'assistant'" class="flex items-center gap-2 mb-1">
                      <Icon icon="lucide:bot" class="w-4 h-4 text-purple-500" />
                      <span class="text-xs font-medium text-purple-600">AI助手</span>
                    </div>
                    <div class="whitespace-pre-wrap">{{ message.content }}</div>
                    <div class="text-xs opacity-70 mt-1">
                      {{ formatMessageTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
                
                <!-- AI思考中指示器 -->
                <div v-if="isAiThinking" class="flex justify-start">
                  <div class="bg-white text-gray-700 shadow-sm border rounded-lg p-3 text-sm">
                    <div class="flex items-center gap-2 mb-1">
                      <Icon icon="lucide:bot" class="w-4 h-4 text-purple-500" />
                      <span class="text-xs font-medium text-purple-600">AI助手</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                      </div>
                      <span class="text-xs text-gray-500">正在思考...</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 输入框 -->
              <div class="border-t border-gray-200 p-3 bg-white">
                <div class="flex gap-2">
                  <input
                    v-model="chatInput"
                    @keydown.enter="sendMessage"
                    placeholder="询问视频相关问题..."
                    class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 outline-none text-sm"
                    :disabled="isAiThinking"
                  />
                  <button 
                    @click="sendMessage"
                    :disabled="!chatInput.trim() || isAiThinking"
                    class="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon="lucide:send" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 快捷问题 -->
            <div class="space-y-2">
              <p class="text-xs text-gray-500 mb-2">常见问题：</p>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="quickQuestion in quickQuestions" 
                  :key="quickQuestion"
                  @click="sendQuickQuestion(quickQuestion)"
                  class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs hover:bg-purple-100 transition"
                >
                  {{ quickQuestion }}
                </button>
              </div>
            </div>
          </div>

          <!-- 学习统计 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">学习统计</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">观看次数</span>
                <span class="font-semibold text-blue-600">{{ videoInfo.viewCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">收藏数量</span>
                <span class="font-semibold text-red-500">{{ videoInfo.favoriteCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">完成率</span>
                <span class="font-semibold text-green-600">{{ videoInfo.completionRate }}%</span>
              </div>
            </div>
          </div>

          <!-- 学习进度 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">学习进度</h3>
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-600">进度</span>
                <span class="font-medium">{{ Math.round(learningProgress) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${learningProgress}%` }"
                ></div>
              </div>
            </div>
            <button 
              @click="continueWatch"
              class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              {{ learningProgress > 0 ? '继续学习' : '开始学习' }}
            </button>
          </div>

          <!-- 相关推荐 -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">相关推荐</h3>
            <div class="space-y-4">
              <div 
                v-for="recommendation in recommendations" 
                :key="recommendation.id"
                class="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                @click="goToVideo(recommendation.id)"
              >
                <img 
                  :src="recommendation.thumbnail" 
                  class="w-20 h-14 rounded-lg object-cover"
                  :alt="recommendation.title"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                    {{ recommendation.title }}
                  </h4>
                  <div class="text-xs text-gray-500">
                    {{ recommendation.subject }} · {{ recommendation.duration }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

interface VideoInfo {
  id: string
  title: string
  description: string
  duration: string
  subject: string
  level: string
  createdAt: string
  tags: string[]
  chapters: Chapter[]
  viewCount: number
  favoriteCount: number
  completionRate: number
  videoUrl: string
  videoUrlWebm: string
}

interface Chapter {
  title: string
  duration: string
  timestamp: number
}

interface Recommendation {
  id: string
  title: string
  subject: string
  duration: string
  thumbnail: string
}

interface PracticeQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: Date
  likes: number
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const route = useRoute()
const router = useRouter()

// 响应式数据
const videoLoaded = ref(false)
const isFavorited = ref(false)
const learningProgress = ref(0)
const showControls = ref(false)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const activeTab = ref<'video' | 'practice'>('video')

// 新增学习功能数据
const newComment = ref('')
const comments = ref<Comment[]>([
  {
    id: '1',
    author: '李同学',
    content: '这个视频讲解得很清楚，特别是分子结构的部分，帮助我理解了有机化合物的空间构型。',
    createdAt: new Date(Date.now() - 3600000),
    likes: 5
  },
  {
    id: '2',
    author: '王老师',
    content: '建议大家在学习时结合分子模型来理解，这样更直观。',
    createdAt: new Date(Date.now() - 7200000),
    likes: 8
  }
])

// 练习题数据
const practiceQuestions = ref<PracticeQuestion[]>([
  {
    id: '1',
    question: '下列哪个是有机化合物的基本特征？',
    options: ['含有碳元素', '分子量大', '易溶于水', '导电性强'],
    correctAnswer: 0,
    explanation: '有机化合物的基本特征是含有碳元素，通常还含有氢元素。'
  },
  {
    id: '2',
    question: '甲烷分子的空间构型是？',
    options: ['直线型', '平面型', '四面体型', '八面体型'],
    correctAnswer: 2,
    explanation: '甲烷分子中碳原子采用sp3杂化，形成四面体结构。'
  }
])

const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const currentQuestion = computed(() => 
  practiceQuestions.value[currentQuestionIndex.value] || null
)

// AI对话功能数据
const chatMessages = ref<ChatMessage[]>([])
const chatInput = ref('')
const isAiThinking = ref(false)
const quickQuestions = ref([
  '这个知识点的关键在哪里？',
  '能举个例子说明吗？',
  '有什么学习技巧？',
  '相关的练习题有哪些？'
])

// 获取视频ID
const videoId = computed(() => route.params.id as string)

// 视频信息（模拟数据，实际应从API获取）
const videoInfo = ref<VideoInfo>({
  id: '',
  title: '',
  description: '',
  duration: '',
  subject: '',
  level: '',
  createdAt: '',
  tags: [],
  chapters: [],
  viewCount: 0,
  favoriteCount: 0,
  completionRate: 0,
  videoUrl: '',
  videoUrlWebm: ''
})

// 推荐视频
const recommendations = ref<Recommendation[]>([
  {
    id: '123456',
    title: '高中数学：三角函数详解',
    subject: '数学',
    duration: '35分钟',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&auto=format'
  },
  {
    id: '789012',
    title: '物理实验：牛顿定律验证',
    subject: '物理',
    duration: '28分钟',
    thumbnail: 'https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=400&h=300&fit=crop&auto=format'
  }
])

// 方法
const handleGoBack = () => {
  router.go(-1)
}

const playVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.play()
  }
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  console.log('收藏状态:', isFavorited.value)
}

const shareVideo = () => {
  console.log('分享视频:', videoId.value)
  // 实现分享功能
}

const downloadVideo = () => {
  console.log('下载视频:', videoId.value)
  // 实现下载功能
  if (videoPlayer.value && videoPlayer.value.src) {
    const link = document.createElement('a')
    link.href = videoPlayer.value.src
    link.download = `${videoInfo.value.title}.mp4`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const jumpToChapter = (chapter: Chapter) => {
  console.log('跳转到章节:', chapter.title, '时间:', chapter.timestamp)
  // 视频播放器跳转到指定时间
}

const continueWatch = () => {
  console.log('继续观看视频')
  playVideo()
}

const goToVideo = (id: string) => {
  router.push(`/ai-video-tutor/video/${id}`)
}

const resetPractice = () => {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = null
  }
}

const nextQuestion = () => {
  if (selectedAnswer.value !== null) {
    if (currentQuestionIndex.value < practiceQuestions.value.length - 1) {
      currentQuestionIndex.value++
      selectedAnswer.value = null
    } else {
      // 完成所有题目
      console.log('练习完成!')
      resetPractice()
    }
  }
}

const postComment = () => {
  if (newComment.value.trim()) {
    const comment: Comment = {
      id: Date.now().toString(),
      author: '当前用户', // 实际应该从用户信息获取
      content: newComment.value.trim(),
      createdAt: new Date(),
      likes: 0
    }
    comments.value.unshift(comment)
    newComment.value = ''
  }
}

const formatCommentTime = (date: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) return '刚刚'
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 30) return `${diffDays}天前`
  return date.toLocaleDateString()
}

// AI对话功能方法
const clearChat = () => {
  chatMessages.value = []
}

const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const sendMessage = async () => {
  if (!chatInput.value.trim() || isAiThinking.value) return
  
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: chatInput.value.trim(),
    timestamp: new Date()
  }
  
  chatMessages.value.push(userMessage)
  const question = chatInput.value.trim()
  chatInput.value = ''
  
  // 显示AI思考状态
  isAiThinking.value = true
  
  try {
    // 模拟AI回复（实际应该调用AI API）
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiResponse = generateAiResponse(question)
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    }
    
    chatMessages.value.push(assistantMessage)
  } catch (error) {
    console.error('AI回复失败:', error)
    const errorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant', 
      content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
      timestamp: new Date()
    }
    chatMessages.value.push(errorMessage)
  } finally {
    isAiThinking.value = false
  }
}

const sendQuickQuestion = (question: string) => {
  chatInput.value = question
  sendMessage()
}

const generateAiResponse = (question: string): string => {
  // 模拟AI回复逻辑（实际应该调用真实的AI API）
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('分类') || lowerQuestion.includes('类型')) {
    return `关于有机化合物的分类，主要有以下几种方式：

1. **按官能团分类**：
   - 烷烃（只含C-C和C-H键）
   - 烯烃（含C=C双键）
   - 炔烃（含C≡C三键）
   - 芳香化合物（含苯环）
   - 醇类（含-OH羟基）
   - 醛类（含-CHO醛基）
   - 酮类（含C=O羰基）

2. **按碳架结构分类**：
   - 链状化合物（直链、支链）
   - 环状化合物（脂环、芳环）

这种分类方法有助于理解化合物的性质和反应规律。您想了解哪一类化合物的具体性质呢？`
  }
  
  if (lowerQuestion.includes('关键') || lowerQuestion.includes('重点')) {
    return `学习有机化合物的关键要点：

🔍 **核心概念**：
- 碳原子的成键特点（四价、成链、成环）
- 官能团决定化合物性质
- 同分异构现象的理解

📚 **学习方法**：
- 先理解结构，再学习性质
- 多做分子式和结构式的转换练习
- 关注官能团的特征反应

💡 **记忆技巧**：
- 用分子模型辅助理解空间结构
- 总结官能团的通用反应规律
- 多练习命名规则

需要我详细解释某个具体知识点吗？`
  }
  
  if (lowerQuestion.includes('例子') || lowerQuestion.includes('举例')) {
    return `让我举几个典型的有机化合物例子：

🧪 **简单例子**：
- **甲烷 CH₄**：最简单的烷烃，天然气主成分
- **乙醇 C₂H₅OH**：酒精，含羟基(-OH)的醇类
- **乙酸 CH₃COOH**：醋酸，含羧基(-COOH)的有机酸

⚗️ **日常应用**：
- **葡萄糖 C₆H₁₂O₆**：人体重要的能量来源
- **蛋白质**：由氨基酸组成的生物大分子
- **塑料**：聚乙烯、聚丙烯等高分子化合物

这些例子展现了有机化合物在生活中的广泛应用。您想了解哪个化合物的详细结构和性质？`
  }
  
  if (lowerQuestion.includes('技巧') || lowerQuestion.includes('方法')) {
    return `有机化学的学习技巧：

🎯 **理解为主**：
- 重视概念理解，不要死记硬背
- 理解官能团与性质的关系
- 掌握反应机理而非单纯记忆反应

🛠️ **实用方法**：
- 制作官能团性质对照表
- 练习结构式书写和命名
- 多做同分异构体的分析

📖 **复习策略**：
- 建立知识网络图
- 定期回顾典型反应
- 结合实验现象理解理论

💪 **提高技能**：
- 多练习推断题
- 关注有机合成路线
- 了解工业应用实例

坚持练习，循序渐进！有具体困难可以随时问我。`
  }
  
  // 默认回复
  return `感谢您的提问！关于"${question}"这个问题，我建议您：

1. 回顾视频中相关的章节内容
2. 查看课程笔记和重点总结  
3. 尝试相关的练习题巩固理解
4. 如果还有疑问，可以更具体地描述您的困惑点

我会根据视频内容为您提供针对性的解答。您可以问得更具体一些，比如某个化学反应的机理、命名规则的应用等。`
}

// 视频播放器功能
const handleVideoLoaded = () => {
  console.log('视频加载完成')
  videoLoaded.value = true
}

const handleTimeUpdate = () => {
  if (videoPlayer.value) {
    const progress = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100
    learningProgress.value = progress
  }
}

const handleVideoEnded = () => {
  console.log('视频播放结束')
  learningProgress.value = 100
}

const handleVideoPlay = () => {
  console.log('视频开始播放')
  showControls.value = true
}

const handleVideoPause = () => {
  console.log('视频暂停播放')
  showControls.value = false
}

const handleVideoError = () => {
  console.error('视频加载失败')
  videoLoaded.value = false
}

// 加载视频数据
const loadVideoData = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    videoInfo.value = {
      id: videoId.value,
      title: 'AI生成视频：高中化学有机化合物详解',
      description: '本视频通过AI智能生成，详细讲解了高中化学中有机化合物的基本概念、分类方法、命名规则以及重要的化学性质。适合高中生系统学习有机化学基础知识。',
      duration: '42分钟',
      subject: '化学',
      level: '高中',
      createdAt: '2024-01-15',
      tags: ['有机化合物', '化学键', '分子结构', '命名规则', '化学性质'],
      chapters: [
        { title: '有机化合物概述', duration: '8分钟', timestamp: 0 },
        { title: '有机化合物的分类', duration: '12分钟', timestamp: 480 },
        { title: '命名规则详解', duration: '15分钟', timestamp: 1200 },
        { title: '重要化学性质', duration: '7分钟', timestamp: 2100 }
      ],
      viewCount: 1247,
      favoriteCount: 89,
      completionRate: 92,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoUrlWebm: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm'
    }
    
    // 模拟学习进度
    learningProgress.value = Math.random() * 100
    
    videoLoaded.value = true
  } catch (error) {
    console.error('加载视频数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  console.log('视频详情页加载，视频ID:', videoId.value)
  loadVideoData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}
</style> 
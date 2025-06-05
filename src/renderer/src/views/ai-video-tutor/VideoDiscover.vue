<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 主横幅区域 -->
    <section class="relative py-20 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-4xl mx-auto text-center px-4">
        <h1 class="text-5xl font-bold text-gray-800 mb-6 leading-tight">
          {{ t('aiVideoTutor.askAnything') }}<br>
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {{ t('aiVideoTutor.learnVisually') }}
          </span>
        </h1>
        
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {{ t('aiVideoTutor.description') }}
        </p>

        <!-- 用户统计卡片 -->
        <div v-if="userStats.totalVideos > 0" class="mb-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div class="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-3">
            <div class="text-xl font-bold">{{ userStats.totalVideos }}</div>
            <div class="text-xs opacity-90">{{ t('aiVideoTutor.totalVideos') }}</div>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-3">
            <div class="text-xl font-bold">{{ userStats.studyTime }}h</div>
            <div class="text-xs opacity-90">{{ t('aiVideoTutor.studyTime') }}</div>
          </div>
          <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-3">
            <div class="text-xl font-bold">{{ userStats.streak }}</div>
            <div class="text-xs opacity-90">{{ t('aiVideoTutor.streak') }}</div>
          </div>
        </div>

        <!-- 教育层级选择 -->
        <div class="mb-6 flex flex-wrap justify-center gap-2">
          <button
            v-for="level in educationLevels"
            :key="level.key"
            @click="selectedLevel = level.key"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedLevel === level.key
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
            ]"
          >
            <Icon :icon="level.icon" class="w-4 h-4 inline mr-1" />
            {{ level.label }}
          </button>
        </div>

        <!-- 图片预览区域 -->
        <div v-if="uploadedImage" class="mb-6 relative">
          <div class="relative inline-block">
            <img 
              :src="uploadedImage.preview" 
              :alt="uploadedImage.name"
              class="max-w-xs max-h-48 rounded-lg shadow-lg border-2 border-purple-200"
            />
            <button
              @click="removeImage"
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
              :aria-label="t('aiVideoTutor.removeImage')"
            >
              <Icon icon="lucide:x" class="w-4 h-4" />
            </button>
          </div>
          <p class="text-sm text-gray-600 mt-2">{{ uploadedImage.name }}</p>
        </div>

        <!-- 主要输入区域 -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 mb-8 max-w-3xl mx-auto suggestion-container">
          <div class="flex flex-col gap-4">
            <!-- 文本输入 -->
            <div class="relative">
              <textarea
                v-model="userQuestion"
                :placeholder="uploadedImage ? t('aiVideoTutor.imageQuestionPlaceholder') : t('aiVideoTutor.questionPlaceholder')"
                class="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none h-32 text-lg"
                @input="handleInputChange"
              ></textarea>
              
              <!-- 智能建议下拉 -->
              <div v-if="showSuggestions && suggestions.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div 
                  v-for="(suggestion, index) in suggestions" 
                  :key="index"
                  class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  @click="selectSuggestion(suggestion)"
                >
                  <div class="flex items-center gap-3">
                    <Icon icon="lucide:lightbulb" class="w-4 h-4 text-yellow-500" />
                    <span class="text-gray-700">{{ suggestion }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 功能按钮组 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button @click="triggerImageUpload" class="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition">
                  <Icon icon="lucide:image" class="w-5 h-5" />
                  {{ t('aiVideoTutor.uploadImage') }}
                </button>
                <button @click="handleVoiceInput" class="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition">
                  <Icon icon="lucide:mic" class="w-5 h-5" />
                  {{ t('aiVideoTutor.voiceInput') }}
                </button>
                <button @click="showMyVideos = !showMyVideos" class="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-green-500 transition">
                  <Icon icon="lucide:video" class="w-5 h-5" />
                  {{ t('aiVideoTutor.myVideos') }}
                </button>
              </div>
              
              <button 
                @click="generateVideo"
                :disabled="(!userQuestion.trim() && !uploadedImage) || isGenerating"
                class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon v-if="isGenerating" icon="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
                {{ isGenerating ? t('aiVideoTutor.generating') : (uploadedImage ? t('aiVideoTutor.createFromImage') : t('aiVideoTutor.createVideo')) }}
              </button>
            </div>
          </div>
        </div>

        <!-- 隐藏的文件输入 -->
        <input 
          ref="imageInput" 
          type="file" 
          accept="image/*" 
          class="hidden" 
          @change="handleImageSelected"
        />

        <!-- 我的视频历史 -->
        <div v-if="showMyVideos && recentVideos.length > 0" class="w-full max-w-4xl mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">{{ t('aiVideoTutor.myVideos') }}</h3>
            <button
              @click="showMyVideos = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <Icon icon="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="video in recentVideos" 
              :key="video.id"
              class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
              @click="playVideo(video)"
            >
              <div class="aspect-video bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                <Icon icon="lucide:play" class="w-12 h-12 text-white" />
              </div>
              <div class="p-4">
                <h4 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ video.title }}</h4>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>{{ video.duration }}</span>
                  <span>{{ formatDate(video.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 支持的主题 -->
        <div class="mb-16">
          <h3 class="text-2xl font-semibold text-gray-800 mb-8">{{ t('aiVideoTutor.supportedTopics') }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div v-for="topic in supportedTopics" :key="topic.key" 
                 class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer group">
              <div class="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   :class="topic.bgColor">
                <Icon :icon="topic.icon" class="w-6 h-6 text-white" />
              </div>
              <h4 class="font-semibold text-gray-800 mb-2">{{ topic.name }}</h4>
              <p class="text-sm text-gray-600">{{ topic.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI教育代理介绍 -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-gray-800 mb-6">
          {{ t('aiVideoTutor.worldFirstAI') }}
        </h2>
        <p class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          {{ t('aiVideoTutor.clearAIExplanation') }}
        </p>

        <!-- 功能特性 -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:graduation-cap" class="w-8 h-8 text-green-600" />
            </div>
            <h4 class="text-xl font-semibold text-gray-800 mb-2">{{ t('aiVideoTutor.professionalVideos') }}</h4>
            <p class="text-gray-600">{{ t('aiVideoTutor.professionalVideosDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:user" class="w-8 h-8 text-blue-600" />
            </div>
            <h4 class="text-xl font-semibold text-gray-800 mb-2">{{ t('aiVideoTutor.customizedAI') }}</h4>
            <p class="text-gray-600">{{ t('aiVideoTutor.customizedAIDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:clock" class="w-8 h-8 text-purple-600" />
            </div>
            <h4 class="text-xl font-semibold text-gray-800 mb-2">{{ t('aiVideoTutor.support247') }}</h4>
            <p class="text-gray-600">{{ t('aiVideoTutor.support247Desc') }}</p>
          </div>
        </div>

        <!-- 示例视频展示 -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
          <h3 class="text-2xl font-semibold mb-4">{{ t('aiVideoTutor.personalizedVideos') }}</h3>
          <div class="grid md:grid-cols-3 gap-6 mt-8">
            <div class="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div class="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                <Icon icon="lucide:play" class="w-12 h-12 text-white" />
              </div>
              <p class="text-sm">{{ t('aiVideoTutor.mathExample') }}</p>
            </div>
            <div class="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div class="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                <Icon icon="lucide:play" class="w-12 h-12 text-white" />
              </div>
              <p class="text-sm">{{ t('aiVideoTutor.physicsExample') }}</p>
            </div>
            <div class="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div class="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                <Icon icon="lucide:play" class="w-12 h-12 text-white" />
              </div>
              <p class="text-sm">{{ t('aiVideoTutor.englishExample') }}</p>
            </div>
          </div>
          
          <div class="mt-8">
            <h4 class="text-xl font-semibold mb-4">{{ t('aiVideoTutor.tenMinutesDaily') }}</h4>
            <p class="mb-6">{{ t('aiVideoTutor.tenMinutesDailyDesc') }}</p>
            <button class="group relative bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-200">
              <!-- 背景渐变效果 -->
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- 文字和图标 -->
              <div class="relative flex items-center justify-center gap-2">
                <Icon icon="lucide:play" class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-white" />
                <span class="transition-all duration-300 group-hover:tracking-wide group-hover:text-white">{{ t('aiVideoTutor.viewVideos') }}</span>
              </div>
              
              <!-- 底部光条效果 -->
              <div class="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-white to-white opacity-80 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 生成进度模态框 -->
    <div v-if="isGenerating" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <!-- 背景动画粒子 -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        <div class="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60 animation-delay-1000"></div>
        <div class="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-50 animation-delay-2000"></div>
        <div class="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-80 animation-delay-3000"></div>
      </div>
      
      <div class="relative bg-gradient-to-br from-white to-blue-50/80 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl backdrop-blur-lg border border-white/20">
        <!-- 装饰性背景元素 -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
        <div class="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div class="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-pink-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
        
        <div class="relative text-center">
          <!-- 主loading图标 -->
          <div class="relative w-20 h-20 mx-auto mb-6">
            <!-- 外圈旋转环 -->
            <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
            
            <!-- 内圈渐变背景 -->
            <div class="absolute inset-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
              <!-- 中心图标 -->
              <Icon icon="lucide:bot" class="w-8 h-8 text-transparent bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text animate-pulse" />
            </div>
            
            <!-- 脉冲环效果 -->
            <div class="absolute inset-0 border-2 border-blue-300 rounded-full animate-ping opacity-30"></div>
          </div>
          
          <!-- 标题和描述 -->
          <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {{ t('aiVideoTutor.generatingVideo') }}
          </h3>
          <p class="text-gray-600 mb-8 text-lg">{{ t('aiVideoTutor.generatingVideoDesc') }}</p>
          
          <!-- 增强的进度条 -->
          <div class="relative w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden shadow-inner">
            <!-- 背景光效 -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-50"></div>
          
          <!-- 进度条 -->
            <div 
              class="relative h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
              :style="{ width: `${generationProgress}%` }"
            >
              <!-- 进度条内部光效 -->
              <div class="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
              <div class="absolute top-0 right-0 w-6 h-full bg-white/40 blur-sm rounded-full animate-pulse"></div>
            </div>
            
            <!-- 进度百分比 -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow-lg">
              {{ generationProgress }}%
            </div>
          </div>
          
          <!-- 当前阶段指示器 -->
          <div class="flex items-center justify-center gap-3 text-sm text-gray-600 bg-white/50 rounded-2xl p-4 backdrop-blur-sm border border-white/30">
            <div v-if="generationStage === 'analyzing'" class="flex items-center gap-2 animate-bounce">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Icon icon="lucide:brain" class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium">{{ t('aiVideoTutor.analyzing') }}</span>
            </div>
            <div v-else-if="generationStage === 'planning'" class="flex items-center gap-2 animate-bounce">
              <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Icon icon="lucide:map" class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium">{{ t('aiVideoTutor.planning') }}</span>
            </div>
            <div v-else-if="generationStage === 'generating'" class="flex items-center gap-2 animate-bounce">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Icon icon="lucide:video" class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium">{{ t('aiVideoTutor.generatingContent') }}</span>
            </div>
            <div v-else-if="generationStage === 'finalizing'" class="flex items-center gap-2 animate-bounce">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Icon icon="lucide:check" class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium">{{ t('aiVideoTutor.finalizing') }}</span>
            </div>
          </div>
          
          <!-- 取消按钮 -->
          <button 
            @click="cancelGeneration"
            class="mt-6 px-6 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 rounded-lg"
          >
            取消生成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from 'vue-router'

// 类型定义
interface UploadedImage {
  file: File
  name: string
  preview: string
  size: number
  type: string
}

interface VideoHistory {
  id: string
  title: string
  duration: string
  createdAt: Date
  subject: string
}

interface UserStats {
  totalVideos: number
  studyTime: number
  streak: number
}

const { t } = useI18n()
const { toast } = useToast()
const router = useRouter()

// AI视频生成相关状态
const userQuestion = ref('')
const isGenerating = ref(false)
const generationProgress = ref(0)
const generationStage = ref<'analyzing' | 'planning' | 'generating' | 'finalizing'>('analyzing')

// 新增功能状态
const uploadedImage = ref<UploadedImage | null>(null)
const selectedLevel = ref('k12')
const showMyVideos = ref(false)
const showSuggestions = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)

// 教育层级配置
const educationLevels = [
  { key: 'k12', label: t('aiVideoTutor.k12'), icon: 'lucide:graduation-cap' },
  { key: 'college', label: t('aiVideoTutor.college'), icon: 'lucide:school' },
  { key: 'university', label: t('aiVideoTutor.university'), icon: 'lucide:university' },
  { key: 'graduate', label: t('aiVideoTutor.graduate'), icon: 'lucide:brain' }
]

// 用户统计数据
const userStats = ref<UserStats>({
  totalVideos: 12,
  studyTime: 8.5,
  streak: 5
})

// 最近视频历史
const recentVideos = ref<VideoHistory[]>([
  {
    id: '1',
    title: t('aiVideoTutor.sampleVideo1'),
    duration: '8:32',
    createdAt: new Date(Date.now() - 86400000),
    subject: 'math'
  },
  {
    id: '2', 
    title: t('aiVideoTutor.sampleVideo2'),
    duration: '12:15',
    createdAt: new Date(Date.now() - 172800000),
    subject: 'physics'
  },
  {
    id: '3',
    title: t('aiVideoTutor.sampleVideo3'),
    duration: '6:48',
    createdAt: new Date(Date.now() - 259200000),
    subject: 'chemistry'
  }
])

// 支持的学习主题
const supportedTopics = ref([
  {
    key: 'gaokao-math',
    name: t('aiVideoTutor.gaoKaoMath'),
    description: t('aiVideoTutor.gaoKaoMathDesc'),
    icon: 'lucide:calculator',
    bgColor: 'bg-blue-500'
  },
  {
    key: 'kaoyan-math', 
    name: t('aiVideoTutor.kaoYanMath'),
    description: t('aiVideoTutor.kaoYanMathDesc'),
    icon: 'lucide:trending-up',
    bgColor: 'bg-green-500'
  },
  {
    key: 'stem',
    name: t('aiVideoTutor.stemScience'),
    description: t('aiVideoTutor.stemScienceDesc'),
    icon: 'lucide:atom',
    bgColor: 'bg-purple-500'
  },
  {
    key: 'language',
    name: t('aiVideoTutor.languageLearning'),
    description: t('aiVideoTutor.languageLearningDesc'),
    icon: 'lucide:message-circle',
    bgColor: 'bg-orange-500'
  }
])

// 智能建议
const suggestions = computed(() => {
  if (!userQuestion.value.trim()) return []
  
  const query = userQuestion.value.toLowerCase()
  const levelSuggestions = {
    k12: [
      t('aiVideoTutor.suggestion.k12Math'),
      t('aiVideoTutor.suggestion.k12Physics'),
      t('aiVideoTutor.suggestion.k12Chemistry')
    ],
    college: [
      t('aiVideoTutor.suggestion.collegeProgramming'),
      t('aiVideoTutor.suggestion.collegeBusiness'),
      t('aiVideoTutor.suggestion.collegeDesign')
    ],
    university: [
      t('aiVideoTutor.suggestion.universityMath'),
      t('aiVideoTutor.suggestion.universityPhysics'),
      t('aiVideoTutor.suggestion.universityCS')
    ],
    graduate: [
      t('aiVideoTutor.suggestion.graduateML'),
      t('aiVideoTutor.suggestion.graduateMedicine'),
      t('aiVideoTutor.suggestion.graduateLaw')
    ]
  }
  
  const currentSuggestions = levelSuggestions[selectedLevel.value as keyof typeof levelSuggestions] || []
  
  return currentSuggestions.filter(s => 
    s.toLowerCase().includes(query) || 
    query.split('').some(char => s.includes(char))
  ).slice(0, 3)
})

// 图片上传处理
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelected = (file: File) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx?.drawImage(img, 0, 0)
    
    // 这里可以添加OCR识别逻辑
    // 模拟OCR结果
    const mockOcrResult = '这是一道关于二次函数的数学题，请分析其图像特征和性质。'
    userQuestion.value = mockOcrResult
    
      toast({
      title: t('aiVideoTutor.autoFillSuccess'),
      description: t('aiVideoTutor.autoFillSuccessDesc'),
        variant: 'default',
      })
    }
  
  img.src = URL.createObjectURL(file)
}

const removeImage = () => {
  uploadedImage.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// 语音输入处理
const handleVoiceInput = () => {
  // 检查浏览器支持
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    toast({
      title: t('aiVideoTutor.voiceNotSupported'),
      description: t('aiVideoTutor.voiceNotSupportedDesc'),
      variant: 'destructive',
    })
    return
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  
  recognition.lang = 'zh-CN'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onstart = () => {
    toast({
      title: t('aiVideoTutor.voiceStarted'),
      description: t('aiVideoTutor.voiceStartedDesc'),
      variant: 'default',
    })
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    userQuestion.value = uploadedImage.value 
      ? t('aiVideoTutor.imageQuestionTemplate', { question: transcript })
      : transcript
      
    toast({
      title: t('aiVideoTutor.voiceSuccess'),
      description: t('aiVideoTutor.voiceSuccessDesc', { text: transcript }),
      variant: 'default',
    })
  }

  recognition.onerror = () => {
    toast({
      title: t('aiVideoTutor.voiceError'),
      description: t('aiVideoTutor.voiceErrorDesc'),
      variant: 'destructive',
    })
  }

  recognition.start()
}

// 建议选择
const selectSuggestion = (suggestion: string) => {
  userQuestion.value = suggestion
  showSuggestions.value = false
}

// 输入变化处理
const handleInputChange = () => {
  showSuggestions.value = userQuestion.value.trim().length > 0
}

// 视频历史相关
const playVideo = (video: VideoHistory) => {
  toast({
    title: t('aiVideoTutor.playingVideo'),
    description: video.title,
    variant: 'default',
  })
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return t('aiVideoTutor.yesterday')
  if (diffDays < 7) return t('aiVideoTutor.daysAgo', { days: diffDays })
  return date.toLocaleDateString()
}

// AI视频生成功能
const generateVideo = async () => {
  if ((!userQuestion.value.trim() && !uploadedImage.value) || isGenerating.value) return
  
  isGenerating.value = true
  generationProgress.value = 0
  generationStage.value = 'analyzing'
  
  try {
    // 模拟AI生成过程
    const stages = ['analyzing', 'planning', 'generating', 'finalizing'] as const
    
    for (let i = 0; i < stages.length; i++) {
      generationStage.value = stages[i]
      
      // 模拟每个阶段的进度
      const stageProgress = 25 * (i + 1)
      const startProgress = 25 * i
      
      for (let progress = startProgress; progress <= stageProgress; progress += 2) {
        generationProgress.value = progress
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    // 生成完成
    setTimeout(() => {
      isGenerating.value = false
      
      // 模拟外部API返回的视频URL（实际应该从API获取）
      const mockVideoUrl = 'https://videotutor.io/video-detail/516915153524375552'
      
      // 添加到历史记录
      const newVideo: VideoHistory = {
        id: Date.now().toString(),
        title: userQuestion.value || t('aiVideoTutor.imageAnalysisVideo'),
        duration: '10:24',
        createdAt: new Date(),
        subject: 'general'
      }
      recentVideos.value.unshift(newVideo)
      
      // 更新统计
      userStats.value.totalVideos++
      userStats.value.studyTime += 0.2
      
      toast({
        title: t('aiVideoTutor.videoCreated'),
        description: userQuestion.value || t('aiVideoTutor.imageAnalysisCompleted'),
        variant: 'default',
      })
      
      // 处理外部视频URL跳转
      handleVideoCreated(mockVideoUrl)
      
      // 清空输入
      userQuestion.value = ''
      uploadedImage.value = null
    }, 500)
    
  } catch (error) {
    console.error('视频生成失败:', error)
    isGenerating.value = false
    toast({
      title: t('aiVideoTutor.videoGenerationFailed'),
      description: t('aiVideoTutor.videoGenerationFailedDesc'),
      variant: 'destructive',
    })
  }
}

// 取消生成
const cancelGeneration = () => {
  isGenerating.value = false
  generationProgress.value = 0
  generationStage.value = 'analyzing'
  
  toast({
    title: '已取消生成',
    description: '视频生成已被用户取消',
    variant: 'default',
  })
}

// 键盘快捷键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'Enter') {
    generateVideo()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  
  // 点击外部关闭建议
  document.addEventListener('click', (e) => {
    const target = e.target as Element
    if (!target.closest('.suggestion-container')) {
      showSuggestions.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// 处理视频创建成功后的跳转
const handleVideoCreated = (videoUrl: string) => {
  console.log('视频创建成功，URL:', videoUrl)
  
  // 从URL中提取视频ID
  const videoIdMatch = videoUrl.match(/\/video-detail\/(\d+)/)
  if (videoIdMatch && videoIdMatch[1]) {
    const videoId = videoIdMatch[1]
    console.log('提取到视频ID:', videoId)
    
    // 跳转到内部视频详情页
    router.push(`/ai-video-tutor/video/${videoId}`)
  } else {
    console.error('无法从URL中提取视频ID:', videoUrl)
  }
}
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Loading动画延迟样式 */
.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 自定义进度条动画 */
@keyframes progress-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 玻璃态效果 */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

/* 悬浮动画 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 脉冲缩放动画 */
@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-pulse-scale {
  animation: pulse-scale 2s ease-in-out infinite;
}
</style> 
<template>
  <div class="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 头部标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🚀 AI智能课件生成器
        </h1>
        <p class="text-gray-600 text-lg">
          一键生成专业课件，AI驱动的智能教学设计
        </p>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：输入配置 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 基础信息卡片 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon icon="lucide:file-text" class="w-5 h-5 text-blue-500" />
              基础信息
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">课件标题</label>
                <input
                  v-model="config.title"
                  type="text"
                  placeholder="请输入课件标题"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">课程内容</label>
                <textarea
                  v-model="config.content"
                  rows="4"
                  placeholder="请输入或粘贴课程内容、教学大纲等..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200 resize-none"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">目标学段</label>
                  <select 
                    v-model="config.targetAudience"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200"
                  >
                    <option value="">选择学段</option>
                    <option value="elementary">小学</option>
                    <option value="middle">初中</option>
                    <option value="high">高中</option>
                    <option value="college">大学</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">学科分类</label>
                  <select 
                    v-model="config.subject"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200"
                  >
                    <option value="">选择学科</option>
                    <option value="math">数学</option>
                    <option value="physics">物理</option>
                    <option value="chemistry">化学</option>
                    <option value="biology">生物</option>
                    <option value="language">语文</option>
                    <option value="english">英语</option>
                    <option value="history">历史</option>
                    <option value="geography">地理</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- AI增强功能 -->
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <Icon icon="lucide:sparkles" class="w-5 h-5 text-purple-500" />
              AI增强功能
            </h3>
            
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  v-model="config.autoImages" 
                  type="checkbox" 
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm">自动生成配图</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  v-model="config.smartOutline" 
                  type="checkbox" 
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm">智能大纲优化</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  v-model="config.includeExercises" 
                  type="checkbox" 
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm">自动生成练习题</span>
              </label>
              
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  v-model="config.adaptiveContent" 
                  type="checkbox" 
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm">自适应内容难度</span>
              </label>
            </div>
          </div>

          <!-- 一键生成按钮 -->
          <button
            @click="generateCourseware"
            :disabled="!canGenerate || isGenerating"
            class="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <span v-if="!isGenerating" class="flex items-center justify-center gap-2">
              <Icon icon="lucide:zap" class="w-5 h-5" />
              一键生成课件
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Icon icon="lucide:loader" class="w-5 h-5 animate-spin" />
              {{ generationStage }}
            </span>
          </button>
        </div>

        <!-- 右侧：生成过程和结果 -->
        <div class="lg:col-span-2">
          <!-- 生成过程 -->
          <div v-if="isGenerating" class="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:sparkles" class="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">AI正在为您生成课件</h3>
              <p class="text-gray-600">{{ generationStage }}</p>
            </div>
            
            <!-- 进度条 -->
            <div class="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                class="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${generationProgress}%` }"
              ></div>
            </div>
            
            <!-- 生成步骤 -->
            <div class="grid grid-cols-2 gap-4">
              <div 
                v-for="(step, index) in generationSteps" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-lg"
                :class="step.completed ? 'bg-green-50 border border-green-200' : step.active ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  :class="step.completed ? 'bg-green-500 text-white' : step.active ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'"
                >
                  <Icon v-if="step.completed" icon="lucide:check" class="w-4 h-4" />
                  <Icon v-else-if="step.active" icon="lucide:loader" class="w-4 h-4 animate-spin" />
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="text-sm" :class="step.completed ? 'text-green-700' : step.active ? 'text-blue-700' : 'text-gray-600'">
                  {{ step.title }}
                </span>
              </div>
            </div>
          </div>

          <!-- 生成结果 -->
          <div v-else-if="generatedCourseware" class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-800">生成完成 🎉</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">质量评分:</span>
                <div class="flex items-center gap-1">
                  <div class="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      class="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000"
                      :style="{ width: `${contentQuality}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-semibold text-green-600">{{ contentQuality }}%</span>
                </div>
              </div>
            </div>
            
            <!-- 课件预览 -->
            <div class="space-y-4 mb-6">
              <div 
                v-for="(slide, index) in generatedCourseware.slides" 
                :key="index"
                class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                @click="previewSlide(index)"
              >
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-800 mb-1">{{ slide.title }}</h4>
                    <p class="text-sm text-gray-600 line-clamp-2">{{ slide.content }}</p>
                  </div>
                  <Icon icon="lucide:eye" class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex gap-3">
              <button 
                @click="downloadCourseware"
                class="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon icon="lucide:download" class="w-4 h-4" />
                下载课件
              </button>
              
              <button 
                @click="editCourseware"
                class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon icon="lucide:edit" class="w-4 h-4" />
                编辑课件
              </button>
              
              <button 
                @click="shareCourseware"
                class="py-3 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon icon="lucide:share" class="w-4 h-4" />
                分享
              </button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-white/20 text-center">
            <div class="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="lucide:presentation" class="w-12 h-12 text-blue-500" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">开始创建您的智能课件</h3>
            <p class="text-gray-600 mb-6">填写左侧信息，AI将为您生成专业的教学课件</p>
            
            <!-- 功能特色 -->
            <div class="grid grid-cols-2 gap-4 text-left">
              <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Icon icon="lucide:brain" class="w-5 h-5 text-blue-500" />
                <span class="text-sm text-blue-700">AI智能分析</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Icon icon="lucide:image" class="w-5 h-5 text-purple-500" />
                <span class="text-sm text-purple-700">自动配图</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Icon icon="lucide:layout" class="w-5 h-5 text-green-500" />
                <span class="text-sm text-green-700">智能排版</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Icon icon="lucide:target" class="w-5 h-5 text-orange-500" />
                <span class="text-sm text-orange-700">自适应难度</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

// 配置接口
interface CoursewareConfig {
  title: string
  content: string
  targetAudience: string
  subject: string
  autoImages: boolean
  smartOutline: boolean
  includeExercises: boolean
  adaptiveContent: boolean
}

// 生成的课件接口
interface GeneratedCourseware {
  title: string
  targetAudience: string
  subject: string
  slides: Array<{
    title: string
    content: string
    type: string
  }>
}

// 响应式数据
const config = ref<CoursewareConfig>({
  title: '',
  content: '',
  targetAudience: '',
  subject: '',
  autoImages: true,
  smartOutline: true,
  includeExercises: false,
  adaptiveContent: true
})

const isGenerating = ref(false)
const generationProgress = ref(0)
const generationStage = ref('')
const generatedCourseware = ref<GeneratedCourseware | null>(null)
const contentQuality = ref(92)

// 生成步骤
const generationSteps = ref([
  { title: 'AI内容分析', completed: false, active: false },
  { title: '智能大纲生成', completed: false, active: false },
  { title: '详细内容填充', completed: false, active: false },
  { title: '自动配图生成', completed: false, active: false },
  { title: '排版设计优化', completed: false, active: false },
  { title: '质量检测完善', completed: false, active: false }
])

// 计算属性
const canGenerate = computed(() => {
  return config.value.title.trim() && 
         config.value.content.trim() &&
         config.value.targetAudience &&
         config.value.subject
})

// 生成课件方法
const generateCourseware = async () => {
  if (!canGenerate.value || isGenerating.value) return
  
  isGenerating.value = true
  generationProgress.value = 0
  
  // 重置步骤状态
  generationSteps.value.forEach(step => {
    step.completed = false
    step.active = false
  })
  
  try {
    // 步骤1: AI内容分析
    generationSteps.value[0].active = true
    generationStage.value = '🤖 AI正在分析课程内容...'
    await simulateStep(15)
    generationSteps.value[0].completed = true
    generationSteps.value[0].active = false
    
    // 步骤2: 智能大纲生成
    generationSteps.value[1].active = true
    generationStage.value = '📋 智能生成课件大纲...'
    await simulateStep(30)
    generationSteps.value[1].completed = true
    generationSteps.value[1].active = false
    
    // 步骤3: 详细内容填充
    generationSteps.value[2].active = true
    generationStage.value = '✨ AI填充详细内容...'
    await simulateStep(50)
    generationSteps.value[2].completed = true
    generationSteps.value[2].active = false
    
    // 步骤4: 自动配图生成
    if (config.value.autoImages) {
      generationSteps.value[3].active = true
      generationStage.value = '🖼️ 自动生成精美配图...'
      await simulateStep(70)
      generationSteps.value[3].completed = true
      generationSteps.value[3].active = false
    } else {
      generationSteps.value[3].completed = true
    }
    
    // 步骤5: 排版设计优化
    generationSteps.value[4].active = true
    generationStage.value = '🎨 优化排版设计...'
    await simulateStep(85)
    generationSteps.value[4].completed = true
    generationSteps.value[4].active = false
    
    // 步骤6: 质量检测完善
    generationSteps.value[5].active = true
    generationStage.value = '🔍 质量检测与完善...'
    await simulateStep(100)
    generationSteps.value[5].completed = true
    generationSteps.value[5].active = false
    
    generationStage.value = '✅ 课件生成完成！'
    
    // 生成模拟课件
    generatedCourseware.value = {
      title: config.value.title,
      targetAudience: config.value.targetAudience,
      subject: config.value.subject,
      slides: generateSmartSlides()
    }
    
  } catch (error) {
    console.error('生成课件失败:', error)
    generationStage.value = '❌ 生成失败，请重试'
  } finally {
    setTimeout(() => {
      isGenerating.value = false
    }, 1000)
  }
}

// 模拟生成步骤
const simulateStep = async (targetProgress: number) => {
  const currentProgress = generationProgress.value
  const step = (targetProgress - currentProgress) / 20
  
  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => setTimeout(resolve, 50))
    generationProgress.value = Math.min(targetProgress, currentProgress + step * (i + 1))
  }
}

// 生成智能幻灯片
const generateSmartSlides = () => {
  const baseSlides = [
    { title: '课程导入', content: `欢迎来到《${config.value.title}》课程！\n本节课我们将深入学习相关知识点，通过理论讲解和实践练习，帮助大家掌握核心概念。`, type: 'introduction' },
    { title: '学习目标', content: '通过本节课的学习，您将能够：\n• 理解核心概念和基本原理\n• 掌握实际应用方法\n• 完成相关练习和思考', type: 'objectives' },
    { title: '知识回顾', content: '让我们先回顾一下相关的基础知识：\n• 之前学过的相关概念\n• 本节课需要用到的前置知识\n• 知识点之间的内在联系', type: 'review' }
  ]
  
  // 根据学科添加专门的幻灯片
  if (config.value.subject === 'math') {
    baseSlides.push(
      { title: '概念讲解', content: '核心数学概念的定义和性质：\n• 基本定义和数学表达\n• 重要性质和特点\n• 与其他概念的关系', type: 'concepts' },
      { title: '公式推导', content: '重要公式的推导过程：\n• 推导的逻辑思路\n• 每一步的数学依据\n• 公式的适用条件', type: 'formulas' },
      { title: '例题讲解', content: '典型例题的详细解析：\n• 题目分析和解题思路\n• 完整的解题过程\n• 易错点和注意事项', type: 'examples' }
    )
  } else if (config.value.subject === 'physics') {
    baseSlides.push(
      { title: '物理原理', content: '核心物理原理的阐述：\n• 物理现象的本质\n• 原理的数学表达\n• 实际应用场景', type: 'principles' },
      { title: '实验验证', content: '通过实验验证理论：\n• 实验设计和方法\n• 数据采集和分析\n• 结论与理论的对比', type: 'experiments' }
    )
  }
  
  // 添加练习和总结
  if (config.value.includeExercises) {
    baseSlides.push(
      { title: '课堂练习', content: '巩固练习题目：\n• 基础练习题\n• 提高训练题\n• 综合应用题', type: 'practice' }
    )
  }
  
  baseSlides.push(
    { title: '课堂总结', content: '本节课重点总结：\n• 核心知识点回顾\n• 重要方法和技巧\n• 下节课预告', type: 'summary' }
  )
  
  return baseSlides
}

// 操作方法
const previewSlide = (index: number) => {
  console.log('预览幻灯片:', index)
  // 实现幻灯片预览功能
}

const downloadCourseware = () => {
  console.log('下载课件')
  // 实现下载功能
}

const editCourseware = () => {
  console.log('编辑课件')
  // 跳转到编辑页面
}

const shareCourseware = () => {
  console.log('分享课件')
  // 实现分享功能
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 
 
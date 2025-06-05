<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900 overflow-hidden">
    <!-- 左侧生成器面板 - 添加美化效果 -->
    <div class="w-80 bg-white/90 border-r border-gray-200 shadow-xl overflow-y-auto">
      <div class="p-4 space-y-4">
        <!-- 页面头部区域 -->
        <div class="space-y-6">
    <!-- 返回按钮 -->
          <div class="flex justify-start">
        <button 
          @click="handleGoBack"
              class="inline-flex items-center gap-2 px-3 py-2 bg-white/60 hover:bg-white/80 text-blue-600 hover:text-blue-700 font-medium rounded-lg border border-blue-200/30 hover:border-blue-300/50 transition-all duration-200 shadow-sm hover:shadow-md group backdrop-blur-sm"
        >
              <Icon icon="lucide:arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span class="text-sm">{{ t('aiVideoTutor.courseware.backToTools') }}</span>
        </button>
    </div>

          <!-- 标题区域 -->
          <div class="text-center space-y-3">
            <!-- 图标 -->
            <div class="relative inline-block">
              <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 animate-float">
            <Icon icon="lucide:presentation" class="w-10 h-10 text-white" />
          </div>
              <!-- 装饰性光点 -->
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
              <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping delay-1000"></div>
        </div>
            
            <!-- 标题文字 -->
            <div class="space-y-2">
              <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {{ t('aiVideoTutor.courseware.title') }}
              </h1>
              <p class="text-slate-600 text-sm font-medium">
                <span class="inline-flex items-center gap-1">
                  <Icon icon="lucide:book-open" class="w-3 h-3 text-emerald-500" />
                  {{ t('aiVideoTutor.courseware.description') }}
                  <Icon icon="lucide:sparkles" class="w-3 h-3 text-cyan-500" />
                </span>
              </p>
      </div>
            
            <!-- 状态标签 -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/50 rounded-full text-xs font-medium text-emerald-700">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>课件生成器已就绪</span>
            </div>
          </div>
        </div>

        <!-- 新增：对话式快速创建区域 - 学习文多多的极简输入理念 -->
        <div class="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-4 border border-emerald-200 shadow-sm mb-4">
          <div class="text-center space-y-2">
            <div class="w-10 h-10 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
              <Icon icon="lucide:zap" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800">💬 快速创建</h2>
              <p class="text-xs text-gray-600">一句话描述您的需求</p>
            </div>
          </div>
          
          <!-- 快速输入框 -->
          <div class="mt-3 space-y-3">
            <div class="relative">
              <textarea
                v-model="quickInput"
                @keyup.enter.ctrl="quickGenerate"
                placeholder="💡 例：高中数学三角函数课件"
                class="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all duration-200 resize-none text-sm"
                rows="2"
              ></textarea>
              <div class="absolute bottom-1 right-2 text-xs text-gray-400">
                Ctrl+Enter
              </div>
            </div>
            
            <!-- 智能建议标签 -->
            <div class="flex flex-wrap gap-1">
              <button
                v-for="suggestion in quickSuggestions.slice(0, 4)"
                :key="suggestion"
                @click="applyQuickSuggestion(suggestion)"
                class="px-2 py-1 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 hover:text-emerald-800 transition-all duration-200"
              >
                {{ suggestion }}
              </button>
            </div>
            
            <button
              @click="quickGenerate"
              :disabled="!quickInput.trim()"
              class="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm"
            >
              <Icon icon="lucide:sparkles" class="w-3 h-3" />
              <span>{{ quickInput.trim() ? '快速生成' : '请输入需求' }}</span>
            </button>
          </div>
        </div>

        <!-- 或者分割线 -->
        <div class="relative my-3">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="px-2 bg-white text-gray-400">或详细配置</span>
          </div>
        </div>

        <!-- 原有的基本信息配置 - 保持现有功能 -->
        <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div 
            @click="isBasicConfigExpanded = !isBasicConfigExpanded"
            class="flex items-center justify-between cursor-pointer group mb-2"
          >
            <h2 class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Icon icon="lucide:settings-2" class="w-4 h-4 text-emerald-500" />
              详细配置
            </h2>
            <button class="p-1 rounded-lg hover:bg-gray-50 transition-all duration-200">
              <Icon 
                :icon="isBasicConfigExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                class="w-4 h-4 text-gray-500 transition-transform duration-200"
              />
            </button>
          </div>

          <transition 
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="isBasicConfigExpanded" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">课件标题</label>
                <input
                  v-model="coursewareConfig.title"
                  type="text"
                  placeholder="三角函数的性质与应用"
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all duration-200 text-sm"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">课程内容</label>
                <textarea
                  v-model="coursewareConfig.content"
                  rows="2"
                  placeholder="描述课件的主要内容和知识点..."
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all duration-200 resize-none text-sm"
                ></textarea>
              </div>
              
            <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">教学对象</label>
                  <select
                    v-model="coursewareConfig.targetAudience"
                    class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all duration-200 text-sm"
                  >
                    <option value="">选择</option>
                    <option value="elementary">小学</option>
                    <option value="middle">初中</option>
                    <option value="high">高中</option>
                    <option value="college">大学</option>
                    <option value="adult">成人</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">学科分类</label>
                  <select
                    v-model="coursewareConfig.subject"
                    class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none transition-all duration-200 text-sm"
                  >
                    <option value="">选择</option>
                    <option value="math">数学</option>
                    <option value="physics">物理</option>
                    <option value="chemistry">化学</option>
                    <option value="biology">生物</option>
                    <option value="language">语文</option>
                    <option value="english">英语</option>
                    <option value="history">历史</option>
                    <option value="geography">地理</option>
                    <option value="computer">计算机</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- 模板选择 -->
        <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
          <div 
            @click="isTemplatesExpanded = !isTemplatesExpanded"
            class="flex items-center justify-between cursor-pointer group mb-4"
          >
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Icon icon="lucide:palette" class="w-5 h-5 text-emerald-500" />
              选择模板风格
            </h2>
            <button class="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group-hover:scale-110">
              <Icon 
                :icon="isTemplatesExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': !isTemplatesExpanded }"
              />
            </button>
          </div>
          
          <transition 
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="isTemplatesExpanded" class="grid grid-cols-1 gap-3">
              <div
                v-for="template in templates"
                :key="template.id"
                @click="selectTemplate(template)"
                class="relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg group"
                :class="coursewareConfig.template === template.id 
                  ? 'border-emerald-400 bg-emerald-50 transform scale-105' 
                  : 'border-gray-200 hover:border-emerald-300 bg-white hover:transform hover:scale-105'"
              >
                <!-- 选中状态指示器 -->
                <div 
                  v-if="coursewareConfig.template === template.id"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce"
                >
                  <Icon icon="lucide:check" class="w-3 h-3 text-white" />
                </div>
                
                <!-- 模板预览 -->
                <div class="relative overflow-hidden rounded-lg mb-3">
                  <div class="w-full h-20 group-hover:scale-110 transition-transform duration-300" :class="template.preview">
                    <!-- 添加模板图标 -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <Icon :icon="template.icon" class="w-8 h-8 text-white/80" />
                    </div>
                    <!-- 添加装饰元素 -->
                    <div class="absolute top-2 right-2 w-3 h-3 bg-white/20 rounded-full"></div>
                    <div class="absolute bottom-2 left-2 w-2 h-2 bg-white/30 rounded-full"></div>
                  </div>
                  
                  <!-- 悬停效果 -->
                  <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <span class="text-white font-medium text-sm">预览模板</span>
                  </div>
                </div>
                
                <!-- 模板信息 -->
                <div class="space-y-1">
                  <h3 class="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    {{ template.name }}
                    <span v-if="template.featured" class="px-2 py-0.5 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs rounded-full">推荐</span>
                  </h3>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ template.description }}</p>
                  
                  <!-- 适用学科标签 -->
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span 
                      v-for="subject in template.subjects" 
                      :key="subject"
                      class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {{ subject }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- 自定义模板选项 -->
              <div
                @click="openCustomTemplateDialog"
                class="p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/30 group"
              >
                <div class="text-center space-y-2">
                  <Icon icon="lucide:plus" class="w-8 h-8 text-gray-400 group-hover:text-emerald-500 mx-auto" />
                  <h3 class="font-medium text-gray-600 group-hover:text-emerald-600">自定义模板</h3>
                  <p class="text-xs text-gray-500">创建专属模板风格</p>
                </div>
              </div>
            </div>
          </transition>
          
          <!-- 收起时显示当前选中的模板 -->
          <div v-if="!isTemplatesExpanded && selectedTemplate" class="mt-2">
            <div class="p-3 border-2 border-emerald-400 bg-emerald-50 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-12 h-8 rounded-lg relative overflow-hidden" :class="selectedTemplate.preview">
                  <Icon :icon="selectedTemplate.icon" class="absolute inset-0 w-full h-full text-white/60" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-800 text-sm">{{ selectedTemplate.name }}</h3>
                  <p class="text-xs text-gray-500">{{ selectedTemplate.description }}</p>
                </div>
                <button 
                  @click="isTemplatesExpanded = true"
                  class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  更换
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 智能大纲预览 -->
        <div v-if="showOutlinePreview" class="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Icon icon="lucide:list-tree" class="w-5 h-5 text-emerald-500" />
              智能大纲预览
            </h2>
            <button 
              @click="regenerateOutline"
              class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors duration-200"
            >
              重新生成
            </button>
          </div>
          
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="(item, index) in previewOutline"
              :key="index"
              class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
            >
              <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-medium">
                {{ index + 1 }}
              </div>
              <span class="text-sm text-gray-700">{{ item.title }}</span>
              <div class="ml-auto">
                <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{{ item.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon icon="lucide:settings" class="w-5 h-5 text-emerald-500" />
              高级设置
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">包含目录页</label>
                  <p class="text-xs text-gray-500">自动生成课件目录</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="coursewareConfig.includeToc"
                    type="checkbox"
                    class="sr-only"
                  />
                  <div class="w-11 h-6 bg-gray-200 rounded-full relative transition-colors duration-200"
                       :class="coursewareConfig.includeToc ? 'bg-emerald-500' : 'bg-gray-200'">
                    <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                         :class="coursewareConfig.includeToc ? 'transform translate-x-5' : ''"></div>
                  </div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">添加练习题</label>
                  <p class="text-xs text-gray-500">在课件末尾添加相关练习</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="coursewareConfig.includeExercises"
                    type="checkbox"
                    class="sr-only"
                  />
                  <div class="w-11 h-6 bg-gray-200 rounded-full relative transition-colors duration-200"
                       :class="coursewareConfig.includeExercises ? 'bg-emerald-500' : 'bg-gray-200'">
                    <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                         :class="coursewareConfig.includeExercises ? 'transform translate-x-5' : ''"></div>
                  </div>
                </label>
              </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">自动配图</label>
                <p class="text-xs text-gray-500">AI自动为幻灯片生成相关图片</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="coursewareConfig.autoImages"
                  type="checkbox"
                  class="sr-only"
                />
                <div class="w-11 h-6 bg-gray-200 rounded-full relative transition-colors duration-200"
                     :class="coursewareConfig.autoImages ? 'bg-emerald-500' : 'bg-gray-200'">
                  <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                       :class="coursewareConfig.autoImages ? 'transform translate-x-5' : ''"></div>
                </div>
              </label>
            </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
              <div class="grid grid-cols-1 gap-2">
                  <button
                    v-for="format in exportFormats"
                    :key="format.id"
                    @click="coursewareConfig.exportFormat = format.id"
                  class="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    :class="coursewareConfig.exportFormat === format.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white/90 border border-gray-200/50'"
                  >
                  <Icon :icon="format.icon" class="w-4 h-4" />
                    {{ format.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="space-y-4">
          <!-- 智能建议 -->
          <div v-if="smartSuggestions.length > 0" class="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-3">
              <Icon icon="lucide:lightbulb" class="w-4 h-4 text-blue-500" />
              <span class="text-sm font-medium text-blue-700">智能建议</span>
            </div>
            <div class="space-y-2">
              <div
                v-for="(suggestion, index) in smartSuggestions"
                :key="index"
                class="flex items-center gap-2 text-sm text-blue-600"
              >
                <Icon icon="lucide:check-circle" class="w-3 h-3" />
                <span>{{ suggestion }}</span>
              </div>
            </div>
          </div>

          <!-- 新增：文多多风格的智能功能区 -->
          <div v-if="(coursewareConfig.content.trim() || quickInput.trim())" class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-2">
              <Icon icon="lucide:brain" class="w-3 h-3 text-purple-500" />
              <span class="text-xs font-medium text-purple-700">AI助手</span>
            </div>
            <div class="grid grid-cols-2 gap-1">
              <button
                @click="smartExpand"
                :disabled="isProcessing"
                class="px-2 py-1 bg-white hover:bg-purple-50 border border-purple-200 rounded-md text-xs text-purple-700 hover:text-purple-800 transition-all duration-200 flex items-center justify-center gap-1"
              >
                <Icon icon="lucide:expand" class="w-3 h-3" />
                扩写
              </button>
              <button
                @click="smartSummarize"
                :disabled="isProcessing"
                class="px-2 py-1 bg-white hover:bg-purple-50 border border-purple-200 rounded-md text-xs text-purple-700 hover:text-purple-800 transition-all duration-200 flex items-center justify-center gap-1"
              >
                <Icon icon="lucide:minimize-2" class="w-3 h-3" />
                总结
              </button>
              <button
                @click="smartOptimize"
                :disabled="isProcessing"
                class="px-2 py-1 bg-white hover:bg-purple-50 border border-purple-200 rounded-md text-xs text-purple-700 hover:text-purple-800 transition-all duration-200 flex items-center justify-center gap-1"
              >
                <Icon icon="lucide:wand-2" class="w-3 h-3" />
                润色
              </button>
              <button
                @click="generateImages"
                :disabled="isProcessing"
                class="px-2 py-1 bg-white hover:bg-purple-50 border border-purple-200 rounded-md text-xs text-purple-700 hover:text-purple-800 transition-all duration-200 flex items-center justify-center gap-1"
              >
                <Icon icon="lucide:image" class="w-3 h-3" />
                配图
              </button>
            </div>
            
            <!-- 处理状态指示 -->
            <div v-if="isProcessing" class="mt-2 flex items-center gap-2 text-xs text-purple-600">
              <div class="w-3 h-3 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              <span>{{ processingStatus }}</span>
            </div>
          </div>
          
          <!-- 生成按钮 -->
          <button
            @click="generateCourseware"
            :disabled="!canGenerate || isGenerating"
            class="w-full relative overflow-hidden"
          >
            <div 
              class="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3"
              :class="canGenerate && !isGenerating 
                ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
            >
              <!-- 按钮内容 -->
              <div v-if="!isGenerating" class="flex items-center gap-3">
                <Icon icon="lucide:wand-2" class="w-6 h-6" />
                <span>{{ canGenerate ? '一键生成课件' : '请完善课件信息' }}</span>
                <Icon icon="lucide:arrow-right" class="w-5 h-5" />
              </div>
              
              <!-- 生成中状态 -->
              <div v-else class="flex items-center gap-3">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>正在生成课件...</span>
              </div>
              
              <!-- 动态背景效果 -->
              <div v-if="canGenerate && !isGenerating" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </button>
          
          <!-- 快速模板按钮 -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="applyQuickTemplate('math')"
              class="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-200"
            >
              <Icon icon="lucide:calculator" class="w-4 h-4 inline mr-2" />
              数学模板
            </button>
            <button
              @click="applyQuickTemplate('science')"
              class="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-200"
            >
              <Icon icon="lucide:microscope" class="w-4 h-4 inline mr-2" />
              科学模板
            </button>
          </div>
        </div>

        <!-- 课件大纲编辑 -->
        <div v-if="generatedCourseware" class="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
          <div 
            @click="isOutlineExpanded = !isOutlineExpanded"
            class="flex items-center justify-between cursor-pointer group mb-4"
          >
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Icon icon="lucide:list" class="w-5 h-5 text-emerald-500" />
              课件大纲 ({{ generatedCourseware.slides.length }}页)
            </h2>
            <button class="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group-hover:scale-110">
              <Icon 
                :icon="isOutlineExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': !isOutlineExpanded }"
              />
          </button>
        </div>

          <transition 
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="isOutlineExpanded" class="space-y-2 max-h-80 overflow-y-auto">
              <div
                v-for="(slide, index) in generatedCourseware.slides"
                :key="index"
                class="group relative"
              >
                <!-- 编辑模式 -->
                <div v-if="editingOutlineIndex === index" class="p-3 bg-emerald-50/80 border-2 border-emerald-300 rounded-xl">
                  <input
                    v-model="slide.title"
                    @keyup.enter="saveOutlineEdit()"
                    @keyup.escape="cancelOutlineEdit()"
                    class="w-full px-2 py-1 text-sm font-medium bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="输入标题..."
                  />
                  <div class="flex items-center justify-end gap-2 mt-2">
                    <button
                      @click="saveOutlineEdit()"
                      class="px-2 py-1 bg-emerald-500 text-white text-xs rounded-md hover:bg-emerald-600 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      @click="cancelOutlineEdit()"
                      class="px-2 py-1 bg-gray-400 text-white text-xs rounded-md hover:bg-gray-500 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>

                <!-- 预览模式 -->
                <div v-else class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
                     @click="jumpToSlide(index)">
                  <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-md group-hover:scale-110 transition-transform duration-200">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-800 text-sm truncate">{{ slide.title }}</h4>
                    <p class="text-xs text-gray-500 truncate">{{ slide.content.substring(0, 30) }}...</p>
                  </div>
                  
                  <!-- 操作按钮 -->
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                    <button
                      @click.stop="startOutlineEdit(index)"
                      class="p-1 hover:bg-emerald-50 text-emerald-600 rounded-md transition-colors duration-200"
                      title="编辑标题"
                    >
                      <Icon icon="lucide:edit-2" class="w-3 h-3" />
                    </button>
                    <button
                      @click.stop="moveSlideUpInOutline(index)"
                      :disabled="index === 0"
                      class="p-1 hover:bg-blue-50 text-blue-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="上移"
                    >
                      <Icon icon="lucide:chevron-up" class="w-3 h-3" />
                    </button>
                    <button
                      @click.stop="moveSlideDownInOutline(index)"
                      :disabled="index === generatedCourseware.slides.length - 1"
                      class="p-1 hover:bg-blue-50 text-blue-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="下移"
                    >
                      <Icon icon="lucide:chevron-down" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- 收起时显示摘要 -->
          <div v-if="!isOutlineExpanded" class="mt-2">
            <div class="p-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <Icon icon="lucide:file-text" class="w-4 h-4" />
                <span>{{ generatedCourseware.slides.length }}个章节</span>
                <span>·</span>
                <span>{{ generatedCourseware.slides[0]?.title }}...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近生成的课件 - 移到左侧面板 -->
        <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-lg">
          <div 
            @click="isRecentExpanded = !isRecentExpanded"
            class="flex items-center justify-between cursor-pointer group mb-4"
          >
              <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Icon icon="lucide:history" class="w-5 h-5 text-emerald-500" />
              最近生成
              </h2>
            <button class="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 group-hover:scale-110">
              <Icon 
                :icon="isRecentExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': !isRecentExpanded }"
              />
            </button>
            </div>
            
          <transition 
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="isRecentExpanded" class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="recent in recentCourseware"
                :key="recent.id"
                class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer group"
                @click="loadRecentCourseware(recent)"
              >
                <div class="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200" :class="recent.template">
                  <Icon icon="lucide:file-text" class="w-5 h-5 text-white" />
              </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-800 text-sm truncate">{{ recent.title }}</h4>
                  <p class="text-xs text-gray-500">{{ recent.createdAt }} · {{ recent.slides }}页</p>
                </div>
                <Icon icon="lucide:chevron-right" class="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </transition>

          <!-- 收起时显示最近一个 -->
          <div v-if="!isRecentExpanded && recentCourseware.length > 0" class="mt-2">
            <div class="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="w-8 h-8 rounded-md flex items-center justify-center" :class="recentCourseware[0].template">
                <Icon icon="lucide:file-text" class="w-4 h-4 text-white" />
                </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-800 text-xs truncate">{{ recentCourseware[0].title }}</h4>
                <p class="text-xs text-gray-500">{{ recentCourseware[0].createdAt }}</p>
              </div>
              <span class="text-xs text-gray-400">+{{ recentCourseware.length - 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧主要内容区域 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 顶部工具栏 - 现代化设计 -->
      <div class="h-20 bg-white border-b border-gray-200 shadow-lg">
        <div class="h-full flex items-center justify-between px-8">
          <!-- 左侧：状态信息 -->
          <div class="flex items-center">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-sm font-medium text-slate-700">
                {{ generatedCourseware ? '课件已生成' : '等待生成课件' }}
              </span>
            </div>
          </div>
          
          <!-- 右侧：工具按钮组 -->
          <div class="flex items-center gap-3">
            <!-- AI优化助手 -->
            <div v-if="generatedCourseware" class="flex items-center gap-1 bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-purple-200/50">
              <button
                @click="analyzeContent"
                class="h-10 px-4 rounded-xl hover:bg-purple-100 hover:scale-105 transition-all duration-200 group text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-2"
              >
                <Icon icon="lucide:brain" class="w-4 h-4" />
                AI优化
              </button>
              <div class="h-6 w-px bg-purple-200"></div>
              <div class="px-3 py-2 text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <span class="text-purple-700 font-medium">质量评分: {{ contentQuality }}分</span>
                </div>
              </div>
            </div>

            <!-- 主要工具按钮 -->
            <div class="flex items-center gap-1 bg-white rounded-2xl p-1 shadow-lg">
              <button
                v-if="generatedCourseware"
                @click="downloadCourseware"
                class="h-10 px-4 rounded-xl hover:bg-green-50 hover:scale-105 transition-all duration-200 group text-sm font-medium text-slate-600 hover:text-green-600 flex items-center gap-2"
              >
                <Icon icon="lucide:download" class="w-4 h-4" />
                下载
              </button>
              <button
                v-if="generatedCourseware"
                @click="editCourseware"
                class="h-10 px-4 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 group text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"
              >
                <Icon icon="lucide:edit" class="w-4 h-4" />
                编辑
              </button>
              <button
                v-if="generatedCourseware"
                @click="shareCourseware"
                class="h-10 px-4 rounded-xl hover:bg-purple-50 hover:scale-105 transition-all duration-200 group text-sm font-medium text-slate-600 hover:text-purple-600 flex items-center gap-2"
              >
                <Icon icon="lucide:share-2" class="w-4 h-4" />
                分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 - 添加渐变背景和改进视觉效果 -->
      <div class="flex-1 relative min-h-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <!-- 添加装饰性背景元素 -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-20 left-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-20 right-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <!-- 预览内容区域 -->
        <div class="w-full h-full relative">
          <!-- 生成状态覆盖层 - 美化设计 -->
          <div v-if="isGenerating" class="absolute inset-0 flex items-center justify-center bg-white/95 z-50">
            <div class="text-center space-y-8 max-w-md px-8">
              <!-- 改进的loading动画 -->
              <div class="relative">
                <div class="w-32 h-32 mx-auto relative">
                  <!-- 外圈旋转动画 -->
                  <div class="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                  <div class="absolute inset-0 border-4 border-transparent border-t-emerald-500 border-r-cyan-500 rounded-full animate-spin"></div>
                  <div class="absolute inset-2 border-2 border-transparent border-t-cyan-500 border-r-blue-500 rounded-full animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
                  
                  <!-- 中心图标 -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon icon="lucide:presentation" class="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                  
                  <!-- 进度指示器 -->
                  <div class="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-bounce">
                    {{ Math.ceil(generationProgress / 25) }}
                  </div>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="space-y-2">
                  <h3 class="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    AI正在创造中
                  </h3>
                  <p class="text-slate-600 font-medium">请稍候，魔法正在发生...</p>
                </div>
                
                <div class="space-y-4">
                  <!-- 美化的进度条 -->
                  <div class="relative">
                    <div class="w-80 h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        class="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                    :style="{ width: `${generationProgress}%` }"
                      >
                        <div class="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-600 font-medium">{{ generationStage }}</span>
                    <span class="text-slate-800 font-bold">{{ generationProgress }}%</span>
                  </div>
                </div>
                
                <button 
                  @click="isGenerating = false"
                  class="text-sm bg-white hover:bg-gray-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 px-4 py-2 rounded-xl"
                >
                  <Icon icon="lucide:x" class="w-4 h-4 mr-2 inline" />
                  取消生成
                </button>
              </div>
            </div>
              </div>
              
              <!-- 预览内容 -->
          <div v-if="generatedCourseware && !isGenerating" class="h-full p-8 overflow-y-auto">
            <div class="max-w-4xl mx-auto space-y-6">
              <!-- 课件标题卡片 -->
              <div class="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div class="border border-gray-200 rounded-2xl p-6 bg-gradient-to-r from-emerald-50 to-cyan-50">
                  <h3 class="text-2xl font-bold text-gray-800 mb-4">{{ generatedCourseware.title }}</h3>
                  <div class="flex items-center gap-6 text-sm text-gray-600">
                    <span class="flex items-center gap-2">
                      <Icon icon="lucide:users" class="w-4 h-4" />
                      {{ getAudienceText(generatedCourseware.targetAudience) }}
                    </span>
                    <span class="flex items-center gap-2">
                      <Icon icon="lucide:book" class="w-4 h-4" />
                      {{ getSubjectText(generatedCourseware.subject) }}
                    </span>
                    <span class="flex items-center gap-2">
                      <Icon icon="lucide:file" class="w-4 h-4" />
                      {{ generatedCourseware.slides.length }} 页
                    </span>
                  </div>
                </div>
                
                <div class="mt-6 space-y-4">
                  <div
                    v-for="(slide, index) in generatedCourseware.slides"
                    :key="index"
                    class="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group relative"
                  >
                    <!-- 编辑模式 -->
                    <div v-if="editingSlideIndex === index" class="space-y-4">
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                          <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        {{ index + 1 }}
                      </div>
                          <span class="text-sm text-gray-500">编辑模式</span>
                      </div>
                        <div class="flex items-center gap-2">
                          <button
                            @click="saveSlideEdit(index)"
                            class="px-3 py-1 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                          >
                            保存
                          </button>
                          <button
                            @click="cancelSlideEdit()"
                            class="px-3 py-1 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors duration-200"
                          >
                            取消
                          </button>
                    </div>
                  </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">幻灯片标题</label>
                        <input
                          v-model="slide.title"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all duration-200"
                        />
                </div>
                
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">内容</label>
                        <textarea
                          v-model="slide.content"
                          rows="4"
                          class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all duration-200 resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <!-- 预览模式 -->
                    <div v-else class="flex items-start gap-4">
                      <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 mb-2">{{ slide.title }}</h4>
                        <p class="text-sm text-gray-600 leading-relaxed">{{ slide.content }}</p>
                      </div>
                      
                      <!-- 编辑按钮 -->
                      <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                          @click="startSlideEdit(index)"
                          class="p-2 bg-white/80 hover:bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-all duration-200"
                  >
                          <Icon icon="lucide:edit-2" class="w-4 h-4" />
                  </button>
                      </div>
                    </div>

                    <!-- 幻灯片操作工具栏 -->
                    <div v-if="editingSlideIndex !== index" class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div class="flex items-center gap-1 bg-white rounded-lg p-1 shadow-lg border border-gray-200">
                  <button
                          @click="moveSlideUp(index)"
                          :disabled="index === 0"
                          class="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="上移"
                        >
                          <Icon icon="lucide:chevron-up" class="w-3 h-3" />
                  </button>
                  <button
                          @click="moveSlideDown(index)"
                          :disabled="index === generatedCourseware.slides.length - 1"
                          class="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="下移"
                        >
                          <Icon icon="lucide:chevron-down" class="w-3 h-3" />
                        </button>
                        <button
                          @click="duplicateSlide(index)"
                          class="p-1.5 hover:bg-green-50 text-green-600 rounded-md transition-colors duration-200"
                          title="复制"
                        >
                          <Icon icon="lucide:copy" class="w-3 h-3" />
                        </button>
                        <button
                          @click="deleteSlide(index)"
                          class="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors duration-200"
                          title="删除"
                        >
                          <Icon icon="lucide:trash-2" class="w-3 h-3" />
                  </button>
                </div>
              </div>
                  </div>

                  <!-- 添加新幻灯片按钮 -->
                  <button
                    @click="addNewSlide()"
                    class="w-full p-6 border-2 border-dashed border-emerald-300 rounded-2xl text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-200 group"
                  >
                    <div class="flex items-center justify-center gap-3">
                      <Icon icon="lucide:plus" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span class="font-medium">添加新幻灯片</span>
                    </div>
                  </button>
            </div>
          </div>


            </div>
          </div>

          <!-- 空状态显示 - 美化设计 -->
          <div v-if="!generatedCourseware && !isGenerating" class="absolute inset-0 flex items-center justify-center">
            <div class="text-center space-y-8 max-w-lg px-8">
              <!-- 美化的空状态图标 -->
              <div class="relative">
                <div class="w-40 h-40 mx-auto bg-gradient-to-br from-slate-50 to-blue-50 border-4 border-slate-100 rounded-3xl flex items-center justify-center shadow-xl">
                  <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon icon="lucide:presentation" class="w-10 h-10 text-white" />
                  </div>
                </div>
                <!-- 装饰性光点 -->
                <div class="absolute top-4 right-4 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                <div class="absolute bottom-4 left-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
                <div class="absolute top-1/2 left-0 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-2000"></div>
              </div>
              
              <div class="space-y-6">
              <div class="space-y-3">
                <h3 class="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  开始创建课件
                </h3>
                <p class="text-slate-600 text-lg leading-relaxed">
                  在左侧输入课程信息，让AI为您生成精美的课件
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { t } = useI18n()

// 课件配置接口
interface CoursewareConfig {
  title: string
  content: string
  targetAudience: string
  subject: string
  template: string
  includeToc: boolean
  includeExercises: boolean
  exportFormat: string
  autoImages: boolean
}

// 生成的课件接口
interface GeneratedCourseware {
  title: string
  targetAudience: string
  subject: string
  slides: Array<{
    title: string
    content: string
  }>
}

// 最近课件接口
interface RecentCourseware {
  id: string
  title: string
  createdAt: string
  slides: number
  template: string
}

// 响应式数据
const coursewareConfig = ref<CoursewareConfig>({
  title: '',
  content: '',
  targetAudience: '',
  subject: '',
  template: 'modern',
  includeToc: true,
  includeExercises: false,
  exportFormat: 'pptx',
  autoImages: false
})

const isGenerating = ref(false)
const generationProgress = ref(0)
const generationStage = ref('')
const generatedCourseware = ref<GeneratedCourseware | null>(null)
const isTemplatesExpanded = ref(true)
const isRecentExpanded = ref(true)
const isEditing = ref(false)
const editingSlideIndex = ref(-1)
const isOutlineExpanded = ref(true)
const editingOutlineIndex = ref(-1)
// const currentSlideIndex = ref(0)  // 预留，可用于未来PPT导航功能
// const isFullscreen = ref(false)   // 预留，可用于未来全屏功能
const contentQuality = ref(85)
const aiSuggestions = ref<string[]>([])
const isAnalyzing = ref(false)
const showOutlinePreview = ref(false)
const previewOutline = ref<Array<{title: string, type: string}>>([])
const smartSuggestions = ref<string[]>([])
const selectedTemplate = computed(() => templates.find(t => t.id === coursewareConfig.value.template))

// 新增：对话式创建相关状态
const quickInput = ref('')
const isBasicConfigExpanded = ref(false)
const quickSuggestions = ref([
  '高中数学课件',
  '初中物理实验',
  '小学语文古诗',
  '大学英语语法',
  '化学元素周期表',
  '生物细胞结构',
  '历史重大事件',
  '地理气候知识'
])

// 新增：AI智能助手相关状态
const isProcessing = ref(false)
const processingStatus = ref('')

// 模板配置 - 增强版本
const templates = [
  {
    id: 'modern',
    name: '现代简约',
    description: '简洁大方，适合各类学科',
    preview: 'bg-gradient-to-br from-blue-400 to-purple-500',
    icon: 'lucide:layout-grid',
    subjects: ['通用', '科技'],
    featured: true
  },
  {
    id: 'academic',
    name: '学术风格',
    description: '专业严谨，适合理科教学',
    preview: 'bg-gradient-to-br from-gray-600 to-blue-600',
    icon: 'lucide:graduation-cap',
    subjects: ['数学', '物理', '化学']
  },
  {
    id: 'creative',
    name: '创意活泼',
    description: '色彩丰富，适合文科艺术',
    preview: 'bg-gradient-to-br from-pink-400 to-orange-400',
    icon: 'lucide:palette',
    subjects: ['艺术', '语文', '英语']
  },
  {
    id: 'nature',
    name: '自然清新',
    description: '绿色主题，适合生物地理',
    preview: 'bg-gradient-to-br from-green-400 to-emerald-500',
    icon: 'lucide:leaf',
    subjects: ['生物', '地理', '环境']
  },
  {
    id: 'business',
    name: '商务专业',
    description: '商务风格，适合商科管理',
    preview: 'bg-gradient-to-br from-slate-600 to-gray-800',
    icon: 'lucide:briefcase',
    subjects: ['商科', '管理', '经济']
  },
  {
    id: 'tech',
    name: '科技未来',
    description: '科技感设计，适合计算机课程',
    preview: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    icon: 'lucide:cpu',
    subjects: ['计算机', '编程', 'AI']
  }
]

// 计算属性

// 导出格式
const exportFormats = [
  { id: 'pptx', name: 'PowerPoint', icon: 'lucide:presentation' },
  { id: 'pdf', name: 'PDF', icon: 'lucide:file-text' },
  { id: 'html', name: 'HTML', icon: 'lucide:globe' }
]

// 最近的课件
const recentCourseware = ref([
  {
    id: '1',
    title: '二次函数的图像与性质',
    createdAt: '2小时前',
    slides: 15,
    template: 'bg-gradient-to-br from-blue-400 to-purple-500'
  },
  {
    id: '2', 
    title: '有机化合物的分类',
    createdAt: '昨天',
    slides: 12,
    template: 'bg-gradient-to-br from-green-400 to-emerald-500'
  },
  {
    id: '3',
    title: '英语时态语法总结',
    createdAt: '3天前',
    slides: 18,
    template: 'bg-gradient-to-br from-pink-400 to-orange-400'
  }
])

// 计算属性
const canGenerate = computed(() => {
  return coursewareConfig.value.title.trim() && 
         coursewareConfig.value.content.trim() &&
         coursewareConfig.value.targetAudience &&
         coursewareConfig.value.subject
})

// 模板接口
interface Template {
  id: string
  name: string
  description: string
  preview: string
  icon: string
  subjects: string[]
  featured?: boolean
}

// 新增方法
const selectTemplate = (template: Template) => {
  coursewareConfig.value.template = template.id
  // 生成智能建议
  generateSmartSuggestions(template)
  // 自动生成大纲预览
  generateOutlinePreview()
}

const generateSmartSuggestions = (template: Template) => {
  const suggestions = []
  
  if (template.id === 'academic') {
    suggestions.push('建议添加更多数据图表和公式')
    suggestions.push('推荐使用结构化的逻辑框架')
  } else if (template.id === 'creative') {
    suggestions.push('可以添加更多视觉元素和动画')
    suggestions.push('建议使用故事性的内容结构')
  } else if (template.id === 'nature') {
    suggestions.push('适合添加实验演示和案例')
    suggestions.push('推荐使用循序渐进的教学方式')
  }
  
  smartSuggestions.value = suggestions
}

const generateOutlinePreview = async () => {
  if (!coursewareConfig.value.content.trim()) return
  
  showOutlinePreview.value = true
  
  // 根据学科和内容生成智能大纲
  const outline = []
  const subject = coursewareConfig.value.subject
  
  if (subject === 'math') {
    outline.push(
      { title: '知识回顾与引入', type: 'introduction' },
      { title: '核心概念讲解', type: 'concepts' },
      { title: '公式推导过程', type: 'formulas' },
      { title: '典型例题分析', type: 'examples' },
      { title: '练习与应用', type: 'practice' },
      { title: '总结与拓展', type: 'summary' }
    )
  } else if (subject === 'physics') {
    outline.push(
      { title: '物理现象观察', type: 'observation' },
      { title: '原理分析讲解', type: 'principles' },
      { title: '公式应用示例', type: 'application' },
      { title: '实验验证过程', type: 'experiment' },
      { title: '课堂小结', type: 'summary' }
    )
  } else {
    outline.push(
      { title: '课程导入', type: 'introduction' },
      { title: '知识讲解', type: 'content' },
      { title: '实例分析', type: 'examples' },
      { title: '互动练习', type: 'practice' },
      { title: '课程总结', type: 'summary' }
    )
  }
  
  previewOutline.value = outline
}

const regenerateOutline = () => {
  generateOutlinePreview()
}

const openCustomTemplateDialog = () => {
  // 打开自定义模板对话框
  console.log('打开自定义模板对话框')
}

const applyQuickTemplate = (type: string) => {
  if (type === 'math') {
    coursewareConfig.value.subject = 'math'
    coursewareConfig.value.template = 'academic'
    coursewareConfig.value.title = coursewareConfig.value.title || '数学课程'
    coursewareConfig.value.content = coursewareConfig.value.content || '本课程将讲解重要的数学概念、公式推导和应用实例...'
  } else if (type === 'science') {
    coursewareConfig.value.subject = 'physics'
    coursewareConfig.value.template = 'nature'
    coursewareConfig.value.title = coursewareConfig.value.title || '科学实验课'
    coursewareConfig.value.content = coursewareConfig.value.content || '通过实验观察和原理分析，深入理解科学现象...'
  }
  
  generateOutlinePreview()
  generateSmartSuggestions(templates.find(t => t.id === coursewareConfig.value.template))
}

// 监听内容变化，自动生成建议
watch(() => coursewareConfig.value.content, (newContent) => {
  if (newContent.length > 50) {
    generateOutlinePreview()
  }
})

// 新增：对话式创建方法 - 学习文多多AiPPT的极简交互
const quickGenerate = async () => {
  if (!quickInput.value.trim()) return
  
  // 使用AI解析用户的自然语言输入
  const parsedConfig = await parseNaturalLanguageInput(quickInput.value)
  
  // 自动填充配置
  Object.assign(coursewareConfig.value, parsedConfig)
  
  // 展开详细配置供用户查看和调整
  isBasicConfigExpanded.value = true
  
  // 自动生成大纲预览
  await generateOutlinePreview()
  
  // 显示解析结果提示
  smartSuggestions.value = [
    `已解析：${parsedConfig.subject || '通用'}学科`,
    `目标：${parsedConfig.targetAudience || '通用'}教育`,
    `已生成${previewOutline.value.length}个章节大纲`
  ]
  
  // 提示用户可以直接生成或进一步调整
  showNotification('✨ 已为您智能解析需求，可直接生成或进一步调整配置')
}

const applyQuickSuggestion = (suggestion: string) => {
  quickInput.value = `我要制作一个${suggestion}，请帮我生成包含核心知识点、重点难点和实例分析的课件`
}

// AI自然语言解析方法
const parseNaturalLanguageInput = async (input: string): Promise<Partial<CoursewareConfig>> => {
  const config: Partial<CoursewareConfig> = {}
  
  // 关键词匹配学科
  const subjectKeywords = {
    math: ['数学', '函数', '几何', '代数', '微积分', '统计'],
    physics: ['物理', '力学', '电磁', '光学', '热学', '原子'],
    chemistry: ['化学', '元素', '分子', '反应', '有机', '无机'],
    biology: ['生物', '细胞', '基因', '遗传', '进化', '生态'],
    language: ['语文', '古诗', '文言文', '作文', '阅读', '文学'],
    english: ['英语', '语法', '词汇', '听力', '口语', '写作'],
    history: ['历史', '朝代', '事件', '人物', '战争', '文明'],
    geography: ['地理', '气候', '地形', '人口', '城市', '资源']
  }
  
  // 关键词匹配教学对象
  const audienceKeywords = {
    elementary: ['小学', '幼儿', '儿童'],
    middle: ['初中', '初一', '初二', '初三'],
    high: ['高中', '高一', '高二', '高三'],
    college: ['大学', '本科', '研究生'],
    adult: ['成人', '职业', '培训']
  }
  
  // 解析学科
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => input.includes(keyword))) {
      config.subject = subject
      break
    }
  }
  
  // 解析教学对象
  for (const [audience, keywords] of Object.entries(audienceKeywords)) {
    if (keywords.some(keyword => input.includes(keyword))) {
      config.targetAudience = audience
      break
    }
  }
  
  // 提取标题（取第一个主题词）
  const titleMatch = input.match(/关于(.+?)的|(.+?)课件|(.+?)教学/)
  if (titleMatch) {
    config.title = (titleMatch[1] || titleMatch[2] || titleMatch[3]).trim()
  }
  
  // 内容就是用户的原始输入
  config.content = input
  
  // 根据学科选择合适的模板
  const templateMap: Record<string, string> = {
    math: 'academic',
    physics: 'academic', 
    chemistry: 'nature',
    biology: 'nature',
    language: 'creative',
    english: 'creative',
    history: 'creative',
    geography: 'nature'
  }
  config.template = templateMap[config.subject || ''] || 'modern'
  
  return config
}

// 通知方法
const showNotification = (message: string) => {
  // 这里可以集成项目的通知系统
  console.log('通知:', message)
}

// 新增：AI智能助手方法 - 学习文多多的智能功能
const smartExpand = async () => {
  if (!coursewareConfig.value.content.trim()) return
  
  isProcessing.value = true
  processingStatus.value = '正在智能扩写内容...'
  
  try {
    // 模拟AI扩写过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const originalContent = coursewareConfig.value.content
    const expandedContent = await expandContent(originalContent)
    
    coursewareConfig.value.content = expandedContent
    showNotification('✨ 内容扩写完成，已为您丰富课件内容')
    
    // 重新生成大纲预览
    await generateOutlinePreview()
    
  } catch (error) {
    console.error('扩写失败:', error)
    showNotification('❌ 扩写失败，请重试')
  } finally {
    isProcessing.value = false
    processingStatus.value = ''
  }
}

const smartSummarize = async () => {
  if (!coursewareConfig.value.content.trim()) return
  
  isProcessing.value = true
  processingStatus.value = '正在智能总结内容...'
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const originalContent = coursewareConfig.value.content
    const summarizedContent = await summarizeContent(originalContent)
    
    coursewareConfig.value.content = summarizedContent
    showNotification('✨ 内容总结完成，已为您提炼核心要点')
    
    await generateOutlinePreview()
    
  } catch (error) {
    console.error('总结失败:', error)
    showNotification('❌ 总结失败，请重试')
  } finally {
    isProcessing.value = false
    processingStatus.value = ''
  }
}

const smartOptimize = async () => {
  if (!coursewareConfig.value.content.trim()) return
  
  isProcessing.value = true
  processingStatus.value = '正在优化语言表达...'
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1800))
    
    const originalContent = coursewareConfig.value.content
    const optimizedContent = await optimizeLanguage(originalContent)
    
    coursewareConfig.value.content = optimizedContent
    showNotification('✨ 语言润色完成，表达更加生动清晰')
    
  } catch (error) {
    console.error('润色失败:', error)
    showNotification('❌ 润色失败，请重试')
  } finally {
    isProcessing.value = false
    processingStatus.value = ''
  }
}

const generateImages = async () => {
  if (!coursewareConfig.value.content.trim()) return
  
  isProcessing.value = true
  processingStatus.value = '正在生成配图方案...'
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // 自动开启配图功能
    coursewareConfig.value.autoImages = true
    
    showNotification('✨ 配图方案已生成，将在课件生成时自动添加')
    
  } catch (error) {
    console.error('配图生成失败:', error)
    showNotification('❌ 配图生成失败，请重试')
  } finally {
    isProcessing.value = false
    processingStatus.value = ''
  }
}

// AI内容处理辅助方法
const expandContent = async (content: string): Promise<string> => {
  // 模拟AI扩写逻辑
  const expansions = [
    '\n\n【详细解析】\n这个概念在实际教学中的重要性不容忽视，需要通过具体例子来帮助学生理解。',
    '\n\n【拓展思考】\n我们可以从多个角度来分析这个问题，包括理论基础、实际应用和相关案例。',
    '\n\n【教学建议】\n在讲解过程中，建议采用循序渐进的方式，先介绍基础概念，再深入到具体应用。'
  ]
  
  return content + expansions.join('')
}

const summarizeContent = async (content: string): Promise<string> => {
  // 模拟AI总结逻辑
  const sentences = content.split(/[。！？.]/).filter(s => s.trim())
  const keyPoints = sentences.slice(0, Math.ceil(sentences.length / 2))
  return keyPoints.join('。') + '。'
}

const optimizeLanguage = async (content: string): Promise<string> => {
  // 模拟AI语言优化逻辑
  return content
    .replace(/这个/g, '该')
    .replace(/很/g, '非常')
    .replace(/的话/g, '')
    .replace(/然后/g, '接下来')
    + '\n\n【语言优化完成】内容表达更加规范、生动。'
}

// 方法
const handleGoBack = () => {
  router.push('/ai-video-tutor/tools')
}

const generateCourseware = async () => {
  if (!canGenerate.value || isGenerating.value) return
  
  isGenerating.value = true
  generationProgress.value = 0
  
  try {
    // 阶段1: AI分析课程内容
    generationStage.value = '🤖 AI分析课程内容...'
    generationProgress.value = 10
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const contentAnalysis = await analyzeContentWithAI(coursewareConfig.value.content)
    
    // 阶段2: 智能生成课件大纲
    generationStage.value = '📋 智能生成课件大纲...'
    generationProgress.value = 30
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const outlineStructure = await generateOutlineWithAI(contentAnalysis)
    
    // 阶段3: AI填充详细内容
    generationStage.value = '✨ AI填充详细内容...'
    generationProgress.value = 60
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const detailedSlides = await generateSlidesContentWithAI(outlineStructure)
    
    // 阶段4: 自动图像配对
    if (coursewareConfig.value.autoImages) {
      generationStage.value = '🖼️ 自动生成配图...'
      generationProgress.value = 80
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await generateImagesForSlides(detailedSlides)
    }
    
    // 阶段5: 优化排版设计
    generationStage.value = '🎨 优化排版设计...'
    generationProgress.value = 95
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const optimizedSlides = await optimizeSlideDesign(detailedSlides)
    
    // 完成生成
    generationProgress.value = 100
    generationStage.value = '✅ 课件生成完成！'
    
    // 生成智能课件结构
    generatedCourseware.value = {
      title: coursewareConfig.value.title,
      targetAudience: coursewareConfig.value.targetAudience,
      subject: coursewareConfig.value.subject,
      slides: optimizedSlides
    }
    
    // 生成质量评估
    await analyzeContent()
    
  } catch (error) {
    console.error('生成课件失败:', error)
    generationStage.value = '❌ 生成失败，请重试'
  } finally {
    setTimeout(() => {
      isGenerating.value = false
    }, 1000)
  }
}

// 类型定义
interface ContentAnalysis {
  keyPoints: string[]
  difficulty: 'low' | 'medium' | 'high'
  structure: {
    hasDefinitions: boolean
    hasExamples: boolean
    hasFormulas: boolean
    hasSteps: boolean
  }
  concepts: string[]
}

interface OutlineSection {
  title: string
  type: string
}

// AI内容分析函数
const analyzeContentWithAI = async (content: string): Promise<ContentAnalysis> => {
  // 模拟AI分析过程 - 实际应调用AI API
  return {
    keyPoints: extractKeyPoints(content),
    difficulty: assessDifficulty(content),
    structure: analyzeStructure(content),
    concepts: identifyConcepts(content)
  }
}

// AI大纲生成函数
const generateOutlineWithAI = async (analysis: ContentAnalysis): Promise<OutlineSection[]> => {
  // 基于内容分析生成智能大纲
  const baseStructure: OutlineSection[] = [
    { title: '课程导入', type: 'introduction' },
    { title: '知识回顾', type: 'review' },
    { title: '新知讲解', type: 'content' },
    { title: '例题演示', type: 'examples' },
    { title: '练习巩固', type: 'practice' },
    { title: '课堂小结', type: 'summary' }
  ]
  
  // 根据学科和难度调整结构，考虑分析结果
  const adjustedStructure = adaptStructureToSubject(baseStructure, coursewareConfig.value.subject)
  
  // 根据内容分析结果进一步优化
  if (analysis.difficulty === 'high') {
    adjustedStructure.splice(1, 0, { title: '前置知识', type: 'prerequisites' })
  }
  
  return adjustedStructure
}

// AI幻灯片内容生成
const generateSlidesContentWithAI = async (outline: OutlineSection[]) => {
  return outline.map((section, index) => {
    const content = generateSectionContent(section, coursewareConfig.value)
    return {
      title: section.title,
      content: content,
      type: section.type,
      index: index + 1
    }
  })
}

// 辅助函数
const extractKeyPoints = (content: string) => {
  // 提取关键知识点
  const sentences = content.split(/[。！？.]/).filter(s => s.trim())
  return sentences.slice(0, 5) // 返回前5个要点
}

const assessDifficulty = (content: string): 'low' | 'medium' | 'high' => {
  // 评估内容难度
  const complexTerms = ['微积分', '量子', '基因', '算法', '矩阵'].filter(term => 
    content.includes(term)
  )
  return complexTerms.length > 2 ? 'high' : complexTerms.length > 0 ? 'medium' : 'low'
}

const analyzeStructure = (content: string) => {
  // 分析内容结构
  return {
    hasDefinitions: content.includes('定义') || content.includes('概念'),
    hasExamples: content.includes('例如') || content.includes('比如'),
    hasFormulas: /[+\-*/=]/.test(content),
    hasSteps: content.includes('步骤') || content.includes('方法')
  }
}

const identifyConcepts = (content: string): string[] => {
  // 识别核心概念
  const conceptKeywords = ['原理', '定理', '公式', '规律', '性质', '特点']
  return conceptKeywords.filter(keyword => content.includes(keyword))
}

const adaptStructureToSubject = (baseStructure: OutlineSection[], subject: string): OutlineSection[] => {
  // 根据学科调整课件结构
  const subjectAdaptations: Record<string, OutlineSection[]> = {
    math: [
      { title: '课程导入', type: 'introduction' },
      { title: '知识回顾', type: 'review' },
      { title: '概念讲解', type: 'concepts' },
      { title: '公式推导', type: 'formulas' },
      { title: '例题讲解', type: 'examples' },
      { title: '练习巩固', type: 'practice' },
      { title: '课堂小结', type: 'summary' }
    ],
    physics: [
      { title: '物理情境', type: 'context' },
      { title: '现象观察', type: 'observation' },
      { title: '原理分析', type: 'principles' },
      { title: '公式应用', type: 'application' },
      { title: '实验验证', type: 'experiment' },
      { title: '总结规律', type: 'summary' }
    ],
    language: [
      { title: '导入新课', type: 'introduction' },
      { title: '文本朗读', type: 'reading' },
      { title: '词句理解', type: 'comprehension' },
      { title: '段落分析', type: 'analysis' },
      { title: '写作技巧', type: 'writing' },
      { title: '课堂总结', type: 'summary' }
    ]
  }
  
  return subjectAdaptations[subject] || baseStructure
}

const generateSectionContent = (section: OutlineSection, config: CoursewareConfig): string => {
  // 根据章节类型生成具体内容
  const contentTemplates = {
    introduction: `欢迎来到《${config.title}》课程！\n本节课我们将学习：\n• 核心概念和基本原理\n• 实际应用和案例分析\n• 练习题目和思考问题`,
    review: `让我们回顾一下相关的基础知识：\n• 之前学过的相关概念\n• 本节课需要用到的前置知识\n• 知识点之间的联系`,
    content: `核心内容讲解：\n• 主要概念的定义和特点\n• 重要原理的分析和解释\n• 知识点的深入理解`,
    examples: `通过具体例子来理解：\n• 典型例题的分析\n• 解题思路和方法\n• 常见错误的避免`,
    practice: `课堂练习：\n• 基础练习题\n• 提高题目\n• 思考题和拓展`,
    summary: `本节课总结：\n• 重点知识回顾\n• 学习要点梳理\n• 下节课预告`
  }
  
  return contentTemplates[section.type as keyof typeof contentTemplates] || `${section.title}的相关内容`
}

// 幻灯片相关类型
interface SlideData {
  title: string
  content: string
  type: string
  index: number
  imageUrl?: string
  layout?: string
  fontSizes?: Record<string, string>
  colors?: Record<string, string>
  animations?: string[]
}

// 自动图像生成（集成AI图像生成API）
const generateImagesForSlides = async (slides: SlideData[]): Promise<void> => {
  for (const slide of slides) {
    if (shouldGenerateImage(slide)) {
      const imagePrompt = generateImagePrompt(slide, coursewareConfig.value.subject)
      // 这里可以调用AI图像生成API
      slide.imageUrl = await callImageGenerationAPI(imagePrompt)
    }
  }
}

const shouldGenerateImage = (slide: SlideData): boolean => {
  // 判断是否需要生成图像
  const imageKeywords = ['图表', '示意图', '流程图', '实验', '例子', '原理']
  return imageKeywords.some(keyword => slide.content.includes(keyword))
}

const generateImagePrompt = (slide: SlideData, subject: string): string => {
  // 生成图像描述提示词
  return `${subject}教学插图，${slide.title}，简洁清晰的教育风格`
}

const callImageGenerationAPI = async (prompt: string): Promise<string> => {
  // 调用图像生成API（如DALL-E、Midjourney等）
  // 这里返回生成的图像URL
  console.log('生成图像提示词:', prompt)
  return `https://example.com/generated-image-${Date.now()}.png`
}

// 幻灯片设计优化
const optimizeSlideDesign = async (slides: SlideData[]): Promise<SlideData[]> => {
  return slides.map(slide => ({
    ...slide,
    layout: determineOptimalLayout(slide),
    fontSizes: calculateOptimalFontSizes(slide),
    colors: selectAppropriateColors(coursewareConfig.value.template),
    animations: suggestAnimations(slide.type)
  }))
}

const determineOptimalLayout = (slide: SlideData): string => {
  const contentLength = slide.content.length
  if (contentLength > 500) return 'two-column'
  if (slide.imageUrl) return 'image-text'
  return 'single-column'
}

const calculateOptimalFontSizes = (slide: SlideData): Record<string, string> => {
  return {
    title: slide.title.length > 20 ? '24px' : '28px',
    content: '16px',
    subtitle: '18px'
  }
}

const selectAppropriateColors = (template: string): Record<string, string> => {
  const colorSchemes: Record<string, Record<string, string>> = {
    modern: { primary: '#3B82F6', secondary: '#8B5CF6', accent: '#10B981' },
    academic: { primary: '#374151', secondary: '#1F2937', accent: '#3B82F6' },
    creative: { primary: '#F59E0B', secondary: '#EF4444', accent: '#8B5CF6' },
    nature: { primary: '#10B981', secondary: '#059669', accent: '#065F46' }
  }
  return colorSchemes[template] || colorSchemes.modern
}

const suggestAnimations = (slideType: string): string[] => {
  const animationMap: Record<string, string[]> = {
    introduction: ['fadeIn', 'slideFromLeft'],
    content: ['fadeIn', 'slideFromBottom'],
    examples: ['zoomIn', 'highlight'],
    summary: ['fadeIn', 'slideFromRight']
  }
  return animationMap[slideType] || ['fadeIn']
}

const downloadCourseware = () => {
  console.log('下载课件:', coursewareConfig.value.exportFormat)
  // 实现下载逻辑
}

const editCourseware = () => {
  console.log('编辑课件')
  // 实现编辑逻辑
}

const shareCourseware = () => {
  console.log('分享课件')
  // 实现分享逻辑
}

const loadRecentCourseware = (recent: RecentCourseware) => {
  console.log('加载最近的课件:', recent.title)
  // 实现加载逻辑
}

const getAudienceText = (audience: string) => {
  const map: Record<string, string> = {
    elementary: '小学',
    middle: '初中',
    high: '高中',
    college: '大学',
    adult: '成人教育'
  }
  return map[audience] || audience
}

const getSubjectText = (subject: string) => {
  const map: Record<string, string> = {
    math: '数学',
    physics: '物理',
    chemistry: '化学',
    biology: '生物',
    language: '语文',
    english: '英语',
    history: '历史',
    geography: '地理',
    computer: '计算机',
    other: '其他'
  }
  return map[subject] || subject
}

// 编辑功能方法
const startSlideEdit = (index: number) => {
  editingSlideIndex.value = index
  isEditing.value = true
}

const saveSlideEdit = (index: number) => {
  editingSlideIndex.value = -1
  isEditing.value = false
  console.log('保存幻灯片:', index)
  // 这里可以添加保存到服务器的逻辑
}

const cancelSlideEdit = () => {
  editingSlideIndex.value = -1
  isEditing.value = false
  // 可以在这里恢复原始内容
}

const moveSlideUp = (index: number) => {
  if (index > 0 && generatedCourseware.value) {
    const slides = generatedCourseware.value.slides
    const temp = slides[index]
    slides[index] = slides[index - 1]
    slides[index - 1] = temp
  }
}

const moveSlideDown = (index: number) => {
  if (generatedCourseware.value && index < generatedCourseware.value.slides.length - 1) {
    const slides = generatedCourseware.value.slides
    const temp = slides[index]
    slides[index] = slides[index + 1]
    slides[index + 1] = temp
  }
}

const duplicateSlide = (index: number) => {
  if (generatedCourseware.value) {
    const slideToClone = generatedCourseware.value.slides[index]
    const newSlide = {
      title: slideToClone.title + ' (副本)',
      content: slideToClone.content
    }
    generatedCourseware.value.slides.splice(index + 1, 0, newSlide)
  }
}

const deleteSlide = (index: number) => {
  if (generatedCourseware.value && generatedCourseware.value.slides.length > 1) {
    generatedCourseware.value.slides.splice(index, 1)
  }
}

const addNewSlide = () => {
  if (generatedCourseware.value) {
    const newSlide = {
      title: '新幻灯片',
      content: '请输入幻灯片内容...'
    }
    generatedCourseware.value.slides.push(newSlide)
    // 自动进入编辑模式
    setTimeout(() => {
      startSlideEdit(generatedCourseware.value!.slides.length - 1)
    }, 100)
  }
}

// 大纲编辑功能方法
const startOutlineEdit = (index: number) => {
  editingOutlineIndex.value = index
}

const saveOutlineEdit = () => {
  editingOutlineIndex.value = -1
}

const cancelOutlineEdit = () => {
  editingOutlineIndex.value = -1
}

const jumpToSlide = (index: number) => {
  // 滚动到对应的幻灯片
  const slideElement = document.querySelector(`[data-slide-index="${index}"]`)
  if (slideElement) {
    slideElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const moveSlideUpInOutline = (index: number) => {
  moveSlideUp(index)
}

const moveSlideDownInOutline = (index: number) => {
  moveSlideDown(index)
}

// AI内容优化方法
const analyzeContent = async () => {
  if (!generatedCourseware.value) return
  
  isAnalyzing.value = true
  try {
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成优化建议
    aiSuggestions.value = [
      '建议在第2页添加更多实例说明',
      '第4页内容密度较高，建议分成两页',
      '建议在结论部分添加总结图表'
    ]
    
    // 更新质量评分
    contentQuality.value = Math.min(95, contentQuality.value + Math.floor(Math.random() * 10))
    
    console.log('AI分析完成，建议：', aiSuggestions.value)
  } finally {
    isAnalyzing.value = false
  }
}

// PPT导航方法（预留，可用于未来功能扩展）
// const previousSlide = () => {
//   if (currentSlideIndex.value > 0) {
//     currentSlideIndex.value--
//   }
// }

// const nextSlide = () => {
//   if (generatedCourseware.value && currentSlideIndex.value < generatedCourseware.value.slides.length - 1) {
//     currentSlideIndex.value++
//   }
// }

// const toggleFullscreen = () => {
//   isFullscreen.value = !isFullscreen.value
// }

// const getSlideTemplateClass = (template: string) => {
//   const templateClasses = {
//     'modern': 'bg-gradient-to-br from-blue-50 to-purple-50',
//     'academic': 'bg-gradient-to-br from-gray-50 to-blue-50',
//     'creative': 'bg-gradient-to-br from-pink-50 to-orange-50',
//     'nature': 'bg-gradient-to-br from-green-50 to-emerald-50'
//   }
//   return templateClasses[template as keyof typeof templateClasses] || templateClasses.modern
// }

// 生命周期
onMounted(() => {
  console.log('课件生成器页面加载完成')
})
</script>

<style scoped>
/* 滚动条样式 */
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

/* 自定义开关样式 */
input[type="checkbox"]:checked + div {
  background-color: #10b981;
}

/* 平滑过渡 */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style> 
import './assets/main.css'
import { addCollection } from '@iconify/vue'
import lucideIcons from '@iconify-json/lucide/icons.json'
import vscodeIcons from '@iconify-json/vscode-icons/icons.json'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import locales from './i18n'
import 'katex/dist/katex.min.css'
import { initToolbar } from '@stagewise/toolbar'

const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  legacy: false,
  messages: locales
})
// 添加整个图标集合到本地
addCollection(lucideIcons)
addCollection(vscodeIcons)
const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

// 集成 stagewise toolbar，仅在开发环境下启用
const stagewiseConfig = {
  plugins: [
    {
      name: 'example-plugin',
      description: 'Adds additional context for your components',
      shortInfoForPrompt: () => {
        return 'Context information about the selected element'
      },
      mcp: null,
      actions: [
        {
          name: 'Example Action',
          description: 'Demonstrates a custom action',
          execute: () => {
            window.alert('This is a custom action!')
          }
        }
      ]
    }
  ]
}

function setupStagewise(): void {
  if (import.meta.env.MODE === 'development') {
    initToolbar(stagewiseConfig)
  }
}

setupStagewise()

app.mount('#app')

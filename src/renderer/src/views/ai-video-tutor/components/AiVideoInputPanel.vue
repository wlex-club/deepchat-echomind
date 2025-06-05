<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 bg-card p-4 rounded-lg shadow">
    <textarea v-model="text" placeholder="请输入讲解内容或知识点…" class="textarea" rows="4" required />
    <!-- 可扩展：图片上传、参数设置等 -->
    <button class="btn btn-primary" :disabled="loading">{{ loading ? '生成中…' : '生成视频' }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
const emit = defineEmits(['generate'])
const props = defineProps<{ loading: boolean }>()

const text = ref('')
const onSubmit = () => {
  emit('generate', { text: text.value, params: {} })
}
</script> 
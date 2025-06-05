<template>
  <div class="bg-card p-4 rounded-lg shadow flex flex-col items-center">
    <video v-if="videoUrl" :src="videoUrl" controls class="w-full max-w-xl rounded" />
    <div v-else class="text-muted">请先生成视频</div>
    <div v-if="loading" class="text-primary mt-2">视频生成中…</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{ videoUrl: string; loading: boolean }>()
</script> 
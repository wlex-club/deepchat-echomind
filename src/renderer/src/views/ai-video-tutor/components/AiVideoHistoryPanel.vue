<template>
  <div class="bg-card p-4 rounded-lg shadow">
    <h3 class="font-bold mb-2">历史记录</h3>
    <ul>
      <li v-for="url in history" :key="url">
        <a href="#" @click.prevent="$emit('select', url)" class="text-blue-500 hover:underline">查看视频</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
defineProps<{ history: string[] }>()
defineEmits(['select'])
</script> 
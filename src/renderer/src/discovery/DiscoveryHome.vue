<template>
  <div class="discovery-home">
    <h1>发现新功能</h1>
    <div class="features-list">
      <!-- 这里将来插入新功能卡片组件 -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTitle } from '@vueuse/core'
const { t } = useI18n()
const title = useTitle()
title.value = t('routes.discovery')
</script>

<style scoped>
.discovery-home {
  padding: 2rem;
}
.features-list {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
</style> 
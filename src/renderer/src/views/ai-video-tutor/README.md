# AI 视频讲堂（AI Video Tutor）

本目录为 AI 视频讲堂业务线主目录，承载 AI 视频生成、讲解、个性化教学等相关页面与组件。

## 目录结构建议
- `components/` 业务专属组件
- `composables/` 复用逻辑
- `api/` 相关接口
- `store/` 状态管理
- `types/` 类型定义
- `assets/` 静态资源
- `utils/` 工具函数

## 约定
- 仅放置 AI 视频讲堂相关内容，通用内容请放到 shared/components/composables 等目录
- 入口页面为 `index.vue`
- 迁移/新建组件时请补充注释和文档 
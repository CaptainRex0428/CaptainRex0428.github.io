---
name: development-workflow
description: 开发协作规范 - 如何高效与我协作
type: user
---

# 开发协作规范

## 沟通偏好
- 回复尽量简洁，不需要每个操作都汇报
- 完成一个阶段性目标后通知用户即可
- 遇到不确定的方向再问用户

## 开发流程
1. 复杂任务先规划（Plan），小任务直接动手
2. 单个 PR/commit 聚焦一个功能，不做混合改动
3. git commit 前先确认变更范围

## 当前优先级（按顺序）
1. 详情页基础设施（Post.astro + 内容集合配置 + Badge 组件）
2. 动态分类页（/works/[category] / /blog/[category]）
3. 英文版子页面（/en/about / /en/works / /en/blog）
4. 移动端 hamburger 菜单
5. MediaViewer 组件
6. 后续功能按需增加

## 代码风格
- 默认不写注释，好的命名即文档
- 不做过度抽象，相同逻辑出现三次再提炼
- 优先 Edit，不轻易 Write/Replace All
- 新文件先 Read 再 Edit（即使是空文件也要 Read）
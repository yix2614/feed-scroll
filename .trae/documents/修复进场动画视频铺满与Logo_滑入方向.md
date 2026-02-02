## 现状确认
- 进场视频卡片在 TikTokDownloadPage.tsx 中通过 aspectRatio='49/106' 与 width='80%' 锁定比例
- Logo 仅在 isOpening 结束后渲染，并有延迟入场
- 底部下载卡片使用 initial y:100 的向上滑入动画

## 修改目标
- 进场视频铺满其容器，不锁定固定比例
- Logo 在开场阶段可见（不被隐藏或延迟过多）
- 所有元素统一向上滑入动画

## 实施步骤
1. 调整主视频容器动画：移除/放宽 aspectRatio 和固定宽度，改为撑满父容器的宽高布局。
2. 调整 Logo 显示逻辑：允许在 opening 阶段显示，并设置与整体一致的向上滑入动画节奏。
3. 统一 slide-in 动画：检查其他 motion 元素的 initial/animate y 值，统一为从下往上进入。
4. 运行开发预览验证进场效果、Logo 可见性与统一的滑入方向。

确认后我将直接修改 TikTokDownloadPage.tsx 并验证效果。
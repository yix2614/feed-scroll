## 问题定位
用户反馈尽管已将环境光视频容器的 `opacity` 设为 0，但 Glow 效果依然存在。这通常有以下几种可能：
1. **阴影残留**：`video-card` 容器本身可能有大范围的 `box-shadow`。
2. **样式覆盖**：`slide-up-in` 动画或其他 Tailwind 类可能在动画结束时重置了 `opacity`。
3. **高光残留**：玻璃拟态的高光层（Highlight）可能被误认为是 Glow。
4. **组件未更新**：DevTools 缓存或 HMR 问题。

## 检查方向
1. 检查 `video-card-shrink` 容器的 `shadow-[0_40px_100px_rgba(0,0,0,0.95)]`，这个阴影非常大，可能被误认为是 glow。
2. 检查 `slide-up-in` 动画的 keyframes，确认它是否会强制把 `opacity` 改回 1。
3. 检查内部玻璃层 `box-shadow` 设置。

## 修复方案
- 移除或减弱 `video-card` 的大阴影。
- 确认 `slide-up-in` 动画逻辑，防止其覆盖 `opacity-0`。
- 彻底隐藏/移除环境光视频 DOM 结构，而不仅仅是改 opacity。

## 验证
- 移除环境光视频 DOM。
- 调整/移除容器大阴影。
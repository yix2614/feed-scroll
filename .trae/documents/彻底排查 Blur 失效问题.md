## 问题诊断
用户反馈 `Blur Radius` 调节无效，且可能显示为 0px。这通常意味着参数传递链路中断，或 React 状态更新未触发重新渲染。

## 检查方向
1. **参数传递**：确认 `App.tsx` 中的 state 是否正确传给了 `TikTokDownloadPage`。
2. **样式应用**：确认 `TikTokDownloadPage.tsx` 中 `style={{ backdropFilter: ... }}` 是否真的接收到了新值。
3. **优先级冲突**：是否存在 Tailwind 类名（如 `backdrop-blur-xl`）或其他样式覆盖了内联样式。
4. **组件重渲染**：确认 `params` 变化时，子组件是否触发了更新。

## 修复计划
1. 移除可能冲突的 Tailwind 类名（如有）。
2. 在 `TikTokDownloadPage` 中添加 `console.log` 打印接收到的 `blur` 值，排查数据流。
3. 如果是 React 闭包陷阱或 Memo 问题，简化参数传递，直接使用 props。

## 执行操作
- 先移除可能存在的冲突样式。
- 添加调试日志确认数值流向。
- 确保 `style` 属性直接绑定 `liquidGlassParams.blur`。
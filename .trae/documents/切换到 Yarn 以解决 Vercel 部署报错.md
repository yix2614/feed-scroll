## 问题定位
即使重新生成了 `package-lock.json`，Vercel 依然报 `npm error Exit handler never called!`。
这通常意味着 `npm` 本身在 Vercel 的 Node 环境中出现了崩溃，可能与内存限制或特定版本的 npm bug 有关。

## 替代方案：切换到 Yarn 或 Pnpm
既然 npm 在这个环境下不稳定，最直接的解决方案是切换包管理器。
Vercel 对 `yarn` 和 `pnpm` 的支持通常更稳定。

## 执行步骤
1. 删除 `package-lock.json`（避免 Vercel 仍尝试用 npm）。
2. 生成 `yarn.lock`（通过运行 `yarn install`）。
3. 提交 `yarn.lock` 并推送到远程。
4. Vercel 会检测到 `yarn.lock` 并自动改用 Yarn 进行构建。

## 验证
- 本地 `yarn install` 成功。
- 推送后 Vercel 构建日志应显示 `Using yarn`。
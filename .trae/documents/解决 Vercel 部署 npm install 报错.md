## 问题定位
用户在 Vercel 部署时遇到 `npm error Exit handler never called!`，这通常是 npm 版本冲突或内存溢出导致的。常见原因包括：
1. `package-lock.json` 与 CI 环境的 npm 版本不兼容。
2. Vercel 的 Node.js 版本设置过旧或过新。
3. 依赖安装过程中的并发问题。

## 修复方案
1. **清理本地依赖锁**：删除 `package-lock.json` 和 `node_modules`，重新生成一份兼容的锁文件。
2. **强制使用 pnpm/yarn**（可选）：npm 有时在 CI 上不稳定，切换到 pnpm 通常能解决此类怪异报错。
3. **检查 package.json 引擎声明**：明确指定 node/npm 版本。

## 执行步骤
1. 删除 `package-lock.json` 和 `node_modules`。
2. 重新运行 `npm install` 生成新的 lockfile。
3. 提交更新后的 lockfile。
4. 如果还是不行，建议切换到 pnpm。

## 验证
- 本地重新安装无误。
- 再次 push 后观察部署结果（需用户反馈）。
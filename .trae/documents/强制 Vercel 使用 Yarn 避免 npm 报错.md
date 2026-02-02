## 问题定位
用户建议直接通过配置文件指定 `installCommand` 为 `pnpm install`。这是一个非常有效且明确的方法，可以绕过 Vercel 的自动检测逻辑，强制使用指定的包管理器。
鉴于之前 npm 报错且 yarn 未生效，改用 **pnpm** 并显式配置是最佳选择。

## 修复方案
1. **添加 `vercel.json`**：明确配置 `installCommand` 为 `pnpm install`。
2. **切换到 pnpm**：
   - 删除 `yarn.lock` 和 `node_modules`。
   - 生成 `pnpm-lock.yaml`。
3. **提交更改**：推送到远程，触发 Vercel 重新构建。

## 执行步骤
1. 创建 `vercel.json` 文件。
2. 清理旧锁文件和依赖。
3. 运行 `pnpm install` 生成新锁文件。
4. 提交并推送。
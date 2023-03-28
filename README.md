koharu-2048

### 项目脚手架

- 格式化部分用 prettier
- git提交时通过 husky 自动格式化
  - 请先执行 pnpm prepare 安装 git hook
- 部署通过 github action 自动部署
- 打包和开发使用vite，用 vite-pwa 实现 sw 缓存和 pwa 应用

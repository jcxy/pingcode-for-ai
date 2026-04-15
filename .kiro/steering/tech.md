# 技术栈

## 语言与运行时

- TypeScript 5.4+，目标 ES2022
- Node.js 18+
- ESM 模块（`"type": "module"`）

## 核心依赖

| 库 | 用途 |
|---|------|
| `commander` | CLI 框架 |
| `dotenv` | 加载 `.env` 配置文件 |

## 开发依赖

| 库 | 用途 |
|---|------|
| `typescript` | TypeScript 编译器 |
| `vitest` | 测试运行器 |
| `fast-check` | 属性测试库 |

## 构建系统

- `tsc` 编译到 `dist/` 目录
- 包名：`@cvtoolman/pingcode-cli`
- CLI 入口：`dist/cli/index.js`（bin: `pingcode-cli`）

## 环境配置

- 全局配置：`~/.pingcode/config.json`（首次使用时交互式引导创建）
- 全局令牌：`~/.pingcode/token.json`
- 项目级 `.env` 文件可覆盖全局配置（优先级更高）

## 常用命令

```bash
# 编译
npm run build

# 运行全部测试
npm test

# 类型检查
npm run lint

# 使用 CLI（开发时）
node dist/cli/index.js --help

# 全局安装后
pingcode-cli --help
pingcode-cli auth login
pingcode-cli auth status
pingcode-cli auth config
pingcode-cli work-item list --project-ids <id>
pingcode-cli user me
pingcode-cli wiki space-list
pingcode-cli sprint list --project-id <id>
pingcode-cli project list
```

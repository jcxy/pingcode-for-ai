# 技术栈

## 语言与运行时

- TypeScript 5.4+，目标 ES2022
- Node.js 18+
- ESM 模块（`"type": "module"`）

## 核心依赖

| 库 | 用途 |
|---|------|
| `@modelcontextprotocol/sdk` | MCP Server SDK |
| `commander` | CLI 框架 |
| `dotenv` | 加载 `.env` 配置文件 |
| `zod` | 数据校验 |

## 开发依赖

| 库 | 用途 |
|---|------|
| `typescript` | TypeScript 编译器 |
| `vitest` | 测试运行器 |
| `fast-check` | 属性测试库 |

## 构建系统

- `tsc` 编译到 `dist/` 目录
- 包名：`pingcode-for-ai`，版本 `0.1.0`
- CLI 入口：`dist/cli/index.js`（bin: `pingcode-for-ai`）
- MCP Server 入口：`dist/server/index.js`

## 环境配置

- 项目根目录的 `.env` 文件（从 `.env.example` 复制）
- 必填变量：`PINGCODE_API_ROOT`、`PINGCODE_CLIENT_ID`、`PINGCODE_CLIENT_SECRET`
- 可选变量：`PINGCODE_ORG_ID`、`PINGCODE_PRODUCT_ID`
- 令牌缓存：`.pingcode_token.json`（自动管理，已加入 gitignore）

## 常用命令

```bash
# 编译
npm run build

# 运行全部测试
npm test

# 类型检查
npm run lint

# 启动 MCP Server
npm run start:server

# 使用 CLI
node dist/cli/index.js --help
# 或 npm link 后：
pingcode-for-ai --help
pingcode-for-ai work-item list --project-ids <id>
pingcode-for-ai user me
pingcode-for-ai wiki space-list
pingcode-for-ai sprint list --project-id <id>
pingcode-for-ai project list
pingcode-for-ai project get <id>
pingcode-for-ai work-item comment-list <id>
```

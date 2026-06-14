# PingCode CLI

通过命令行操作 PingCode 项目管理平台，配合 Skill 文件为 AI 编程工具提供项目管理能力。

## 功能特性

- **认证管理** — 支持客户端凭证模式和授权码模式两种认证方式，首次使用自动引导配置
- **工作项管理** — 查看、创建、搜索工作项，添加评论
- **迭代管理** — 查看、创建、更新迭代（Sprint）
- **需求管理** — 查看需求列表、搜索需求、获取需求详情
- **Wiki 管理** — 查看/创建 Wiki 空间和页面
- **项目管理** — 查看项目信息、项目成员列表
- **用户查询** — 查看个人信息、搜索企业用户
- **AI Skill 集成** — 提供 SKILL.md 供 AI 编程工具调用
- **双重使用方式** — 既可以作为 CLI 命令行工具使用，也可以作为 Node.js SDK 在代码中调用

## 安装

```bash
npm install -g @cvtoolman/pingcode-cli
```

要求 Node.js >= 18.0.0。

## 快速开始

### 1. 首次认证

直接运行 `pingcode-cli`（不带任何参数）会进入交互式引导流程：

```bash
pingcode-cli
```

也可以使用 `auth` 命令：

```bash
# 交互式登录
pingcode-cli auth login

# 查看认证状态
pingcode-cli auth status

# 查看配置
pingcode-cli auth config
```

### 2. 认证模式说明

| 模式 | 适用场景 | 说明 |
|------|---------|------|
| **客户端凭证模式** | 企业级 API 调用、批量操作 | 使用 Client ID / Secret 直接获取令牌（推荐） |
| **授权码模式** | 需要用户级权限的操作 | 通过浏览器授权获取用户级令牌，支持访问 `/v1/myself` 等接口 |

> 注意：部分接口（如 `/v1/myself`）仅支持用户级令牌，客户端凭证模式无法访问。

### 3. 常用命令

```bash
# 用户
pingcode-cli user me                    # 查看当前用户信息
pingcode-cli user search <关键词>       # 搜索用户

# 项目
pingcode-cli project list               # 获取项目列表
pingcode-cli project members <id>       # 获取项目成员

# 工作项
pingcode-cli work-item list             # 获取工作项列表
pingcode-cli work-item get <id>         # 获取工作项详情
pingcode-cli work-item create           # 创建工作项
pingcode-cli work-item search <关键词>   # 搜索工作项
pingcode-cli work-item comment-list <id> # 查看工作项评论
pingcode-cli work-item comment-add <id> --content "评论内容" # 添加评论

# 迭代
pingcode-cli sprint list --project-id <id>  # 获取迭代列表
pingcode-cli sprint get <id>                 # 获取迭代详情

# 需求
pingcode-cli requirement list             # 获取需求列表
pingcode-cli requirement get <id>         # 获取需求详情
pingcode-cli requirement search <关键词>   # 搜索需求

# Wiki
pingcode-cli wiki space-list             # 获取 Wiki 空间列表
pingcode-cli wiki page-list --space-id <id>  # 获取页面列表
pingcode-cli wiki page-create --space-id <id> --name "标题" --content "内容"  # 创建页面
```

多数命令支持 `--format json` 参数输出 JSON 格式，便于脚本解析和组合使用。

## 配置

### 方式一：交互式配置（推荐）

首次运行 CLI 时自动引导配置，凭证信息保存在全局配置中。

### 方式二：环境变量

在项目目录创建 `.env` 文件（参考 `.env.example`）：

```env
PINGCODE_API_ROOT=https://open.pingcode.com
PINGCODE_AUTH_MODE=client

# 客户端凭证模式
PINGCODE_CLIENT_ID=your_client_id
PINGCODE_CLIENT_SECRET=your_client_secret

# 授权码模式
PINGCODE_USER_CLIENT_ID=your_user_client_id
PINGCODE_USER_CLIENT_SECRET=your_user_client_secret

# 可选
PINGCODE_ORG_ID=your_org_id
PINGCODE_PRODUCT_ID=your_product_id
```

### 配置优先级

项目级 `.env` 文件优先级高于全局配置（`~/.pingcode/config.json`）。

### 全局配置文件位置

- 配置文件：`~/.pingcode/config.json`
- 令牌文件：`~/.pingcode/token.json`

```bash
# 修改 API 地址
pingcode-cli auth config --set-api-root <url>

# 重置所有配置
pingcode-cli auth config --reset

# 清除认证信息（保留配置）
pingcode-cli auth logout
```

## 作为 SDK 使用

除了 CLI 方式，你也可以在 Node.js 代码中直接使用 PingCode Client：

```typescript
import { PingCodeClient } from '@cvtoolman/pingcode-cli';

// 客户端凭证模式
const client = new PingCodeClient({
  apiRoot: 'https://open.pingcode.com',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  authMode: 'client',
});

// 初始化子 API（延迟加载）
await client.initSubApis();

// 获取项目列表
const projects = await client.listProjects();

// 获取工作项
const workItems = await client.workItems.listWorkItems({ projectIds: 'project-id' });

// 搜索工作项
const results = await client.workItems.searchWorkItems('关键词');

// 获取迭代
const sprints = await client.sprints.listSprints({ projectId: 'project-id' });

// Wiki 操作
const spaces = await client.wiki.listSpaces();
const pages = await client.wiki.listPages('space-id');
```

也可以使用环境变量配置，无需传入参数：

```typescript
// 从 .env 或环境变量读取配置
import { PingCodeClient } from '@cvtoolman/pingcode-cli';

const client = new PingCodeClient();
await client.initSubApis();

// 直接使用
const myself = await client.myself.get();
```

## AI Skill 集成

本项目提供 `skills/pingcode/SKILL.md`，可供 AI 编程工具（如 Cursor、Claude Code 等）读取后直接调用 `pingcode-cli` 命令，让 AI 拥有项目管理能力。

典型场景：

- AI 查看你的工作项和迭代信息
- AI 为需求编写技术方案并发布到 Wiki
- AI 评论工作项并 @mention 团队成员
- AI 搜索需求并读取详情到本地

详见 [skills/pingcode/SKILL.md](skills/pingcode/SKILL.md) 和 [skills/pingcode/references/](skills/pingcode/references/) 目录。

## 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/pingcode-cli.git
cd pingcode-cli

# 安装依赖
npm install

# 编译
npm run build

# 类型检查
npm run lint

# 运行测试
npm test
```

### 项目结构

```
src/
├── cli/                    # CLI 命令行入口
│   ├── index.ts            # CLI 主入口
│   ├── setup.ts            # 首次使用引导 & 授权检查
│   ├── config-store.ts     # 全局配置管理
│   ├── client.ts           # CLI 中的 Client 获取逻辑
│   ├── output.ts           # 输出格式化（JSON/表格/键值）
│   └── commands/           # 各子命令实现
│       ├── auth.ts         # 认证管理命令
│       ├── user.ts         # 用户查询命令
│       ├── work-item.ts    # 工作项管理命令
│       ├── sprint.ts       # 迭代管理命令
│       ├── wiki.ts         # Wiki 管理命令
│       ├── project.ts      # 项目管理命令
│       └── requirement.ts  # 需求管理命令
├── client/                 # API Client SDK
│   ├── index.ts            # SDK 导出入口
│   ├── client.ts           # 主客户端（HTTP 请求、延迟加载子 API）
│   ├── auth.ts             # OAuth 认证管理器
│   ├── token-store.ts      # 令牌持久化
│   ├── errors.ts           # 错误类定义
│   ├── types.ts            # 公共类型定义
│   └── api/                # 各子 API 实现
│       ├── stories.ts      # 需求 API
│       ├── work-items.ts   # 工作项 API
│       ├── sprints.ts      # 迭代 API
│       ├── wiki.ts         # Wiki API
│       ├── myself.ts       # 个人信息 API
│       ├── comments.ts     # 评论 API
│       └── deliverables.ts # 交付目标 API
skills/                     # AI Skill 定义
└── pingcode/
    ├── SKILL.md            # Skill 主描述文件
    └── references/         # 各模块命令参考
```

### 技术栈

- **语言**：TypeScript (ES2022, Node16 模块)
- **CLI 框架**：Commander.js
- **HTTP 客户端**：原生 `fetch`（Node.js 18+ 内置）
- **环境变量**：dotenv
- **测试框架**：Vitest
- **构建工具**：tsc (TypeScript 编译器)

## License

MIT

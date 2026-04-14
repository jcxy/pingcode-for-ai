# 项目结构

```
pingcode-for-ai/
├── src/
│   ├── client/              # TypeScript API 客户端库
│   │   ├── client.ts        # PingCodeClient - 主入口，HTTP 方法，延迟加载子 API
│   │   ├── auth.ts          # PingCodeAuth - OAuth 令牌管理（客户端凭证 + 授权码）
│   │   ├── errors.ts        # 自定义异常（AuthenticationError 等）
│   │   ├── types.ts         # 类型定义
│   │   ├── token-store.ts   # 令牌持久化
│   │   ├── index.ts         # 导出入口
│   │   └── api/             # 子 API 模块
│   │       ├── stories.ts   # StoriesAPI - 产品需求管理
│   │       ├── work-items.ts # WorkItemsAPI - 工作项增删改查 + 搜索
│   │       ├── sprints.ts   # SprintsAPI - 迭代管理
│   │       ├── deliverables.ts # DeliverablesAPI - 交付目标管理
│   │       ├── wiki.ts      # WikiAPI - Wiki 空间和页面
│   │       ├── myself.ts    # MyselfAPI - 当前用户信息
│   │       └── comments.ts  # CommentsAPI - 工作项评论
│   ├── server/              # MCP Server
│   │   ├── index.ts         # 入口，注册所有工具
│   │   ├── format.ts        # 格式化工具
│   │   └── tools/           # MCP 工具注册（按模块拆分）
│   └── cli/                 # CLI 工具
│       ├── index.ts         # Commander 入口
│       ├── client.ts        # 单例客户端访问器
│       ├── output.ts        # 输出格式化
│       └── commands/        # 命令模块（auth, project, sprint, user, wiki, work-item）
├── skills/                  # AI 编程工具 Skill 文件
│   └── pingcode/
│       ├── SKILL.md         # 主入口，模块路由 + 复合场景
│       └── references/      # 按模块拆分的详细命令参考
├── tests/                   # vitest 测试
├── pingcodeDocs/            # PingCode API 文档本地副本（中文）
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
└── .env.example             # 环境变量模板
```

## 架构模式

- **客户端库**（`src/client/`）：`PingCodeClient` 是核心类。子 API 模块通过 `initSubApis()` 预加载，通过 getter 同步访问。每个子 API 接收父客户端实例，调用 `this.client.get()` 等方法。
- **MCP Server**（`src/server/`）：使用 `@modelcontextprotocol/sdk`，通过 `server.tool()` 注册工具。每个工具模块通过 `registerXxxTools()` 函数注册。
- **CLI**（`src/cli/`）：Commander 命令组在 `index.ts` 中注册。每个命令模块从 `cli/client.ts` 导入 `getClient()`。
- **测试**：vitest，使用 mock 验证参数传递。
- **认证**：双模式 OAuth。令牌持久化到 `.pingcode_token.json`。

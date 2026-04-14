# 实现计划：PingCode TypeScript 迁移

## 概述

将 PingCode MCP Python 项目完整迁移为独立 TypeScript 项目 `pingcode-for-ai`。按照自底向上的顺序实现：先搭建项目基础设施，再实现核心客户端库（异常 → 令牌存储 → 认证 → HTTP 客户端 → 子 API 模块），然后实现 MCP Server 和 CLI 工具，最后集成联调。

## 任务

- [x] 1. 项目初始化与构建配置
  - 在 `d:\projects\pingcode-for-ai` 根目录创建 `package.json`，项目名 `pingcode-for-ai`，配置入口文件、依赖（`@modelcontextprotocol/sdk`、`commander`、`zod`、`dotenv`）和开发依赖（`typescript`、`vitest`、`fast-check`、`@types/node`）
  - 创建 `tsconfig.json`，target 为 ES2022，module 为 Node16，启用 strict 模式和声明文件生成，outDir 为 `dist/`，rootDir 为 `src/`
  - 创建 `vitest.config.ts`，配置 TypeScript 源文件直接测试
  - 在 `package.json` 中定义 `build`、`test`、`lint` 脚本
  - 创建 `.gitignore`（排除 `node_modules/`、`dist/`、`.env`、`.pingcode_token.json`）
  - 创建 `.env.example`（包含 `PINGCODE_API_ROOT`、`PINGCODE_AUTH_MODE`、`PINGCODE_CLIENT_ID`、`PINGCODE_CLIENT_SECRET`、`PINGCODE_USER_CLIENT_ID`、`PINGCODE_USER_CLIENT_SECRET`）
  - 创建 `src/` 目录结构：`src/client/`、`src/client/api/`、`src/server/`、`src/server/tools/`、`src/cli/`、`src/cli/commands/`、`tests/`
  - _需求: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 2. 自定义异常体系与公共类型
  - [x] 2.1 实现异常类（`src/client/errors.ts`）
    - 定义 `PingCodeError` 继承 `Error`，包含 `message` 属性
    - 定义 `AuthenticationError` 继承 `PingCodeError`
    - 定义 `ApiError` 继承 `PingCodeError`，包含 `statusCode`、`details` 属性
    - _需求: 10.1, 10.2, 10.3_

  - [x] 2.2 定义公共类型（`src/client/types.ts`）
    - 定义 `PaginatedResponse<T>`、`PaginationParams`、`ResponseFormat`、`TokenData`、`TokenResponse` 等接口
    - 定义各子 API 的参数类型接口（`ListWorkItemsOptions`、`CreateWorkItemOptions`、`UpdateWorkItemOptions`、`ListStoriesOptions`、`CreateSprintOptions`、`CreateDeliverableOptions`、`CreatePageOptions` 等）
    - _需求: 2.1, 5.1, 5.3, 5.4, 6.1, 6.2, 7.1, 8.2, 13.6_

  - [x] 2.3 编写异常体系单元测试（`tests/client/errors.test.ts`）
    - 验证继承关系：`AuthenticationError instanceof PingCodeError`、`ApiError instanceof PingCodeError`
    - 验证 `ApiError` 的 `statusCode` 和 `details` 属性
    - _需求: 10.1, 10.2, 10.3_

- [ ] 3. 令牌存储模块
  - [x] 3.1 实现 TokenStore（`src/client/token-store.ts`）
    - 实现 `load()` 方法从 JSON 文件读取令牌数据
    - 实现 `save()` 方法将令牌数据写入 JSON 文件
    - 实现 `clear()` 方法删除令牌文件
    - _需求: 3.4_

  - [ ]* 3.2 编写 TokenStore 单元测试（`tests/client/token-store.test.ts`）
    - 测试文件不存在时 `load()` 返回 `null`
    - 测试 `save()` 后 `load()` 能正确读取
    - 测试 `clear()` 后 `load()` 返回 `null`
    - _需求: 3.4_

  - [ ]* 3.3 编写令牌持久化往返属性测试
    - **属性 4: 令牌持久化往返**
    - 使用 fast-check 生成随机 TokenData，验证 save 后 load 返回等价对象
    - **验证: 需求 3.4**

- [ ] 4. OAuth 认证模块
  - [x] 4.1 实现 PingCodeAuth（`src/client/auth.ts`）
    - 根据 `PINGCODE_AUTH_MODE` 环境变量自动选择认证模式（client/user）
    - 实现 `getClientToken()` 方法（client_credentials 模式）
    - 实现 `getUserToken(code)` 方法（authorization_code 模式）
    - 实现 `refreshUserToken()` 方法（refresh_token 刷新）
    - 实现 `getToken()` 方法，自动选择认证方式，令牌过期时自动刷新（距过期不足 1 天）
    - 实现 `getHeaders()` 方法，返回带 `Authorization: Bearer <token>` 和 `Content-Type: application/json` 的请求头
    - 实现 `getAuthorizeUrl()` 方法，生成授权码获取链接
    - 实现 `isTokenValid` getter，检查令牌是否有效
    - 凭据缺失时抛出包含配置指引的错误信息
    - 从文件加载令牌时，auth_mode 不匹配则忽略缓存
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 4.2 编写 PingCodeAuth 单元测试（`tests/client/auth.test.ts`）
    - 测试 client 模式获取令牌（mock fetch）
    - 测试 user 模式获取令牌（mock fetch）
    - 测试令牌刷新流程
    - 测试凭据缺失时的错误信息
    - 测试 auth_mode 不匹配时忽略缓存令牌
    - _需求: 3.1, 3.2, 3.3, 3.5, 3.8, 15.3_

  - [ ]* 4.3 编写令牌过期判断属性测试
    - **属性 5: 令牌过期判断**
    - 使用 fast-check 生成随机时间戳，验证距 expires_at 不足 86400 秒时 isTokenValid 返回 false
    - **验证: 需求 3.6**

  - [ ]* 4.4 编写授权 URL 构造属性测试
    - **属性 6: 授权 URL 构造**
    - 使用 fast-check 生成随机 clientId 和 apiRoot，验证 URL 包含正确的 response_type 和 client_id 参数
    - **验证: 需求 3.7**

- [x] 5. 检查点 — 确保基础模块测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [ ] 6. PingCodeClient 核心类
  - [x] 6.1 实现 PingCodeClient（`src/client/client.ts`）
    - 实现 `get`、`post`、`put`、`patch`、`delete` 五个 HTTP 方法，使用原生 `fetch` API
    - 通过 getter 属性延迟加载子 API 模块（stories、workItems、sprints、deliverables、wiki、myself、comments）
    - 从环境变量或构造函数参数读取配置（apiRoot、orgId、productId 等）
    - 每次请求前通过 PingCodeAuth 获取有效令牌，设置请求头
    - 401/403 响应抛出 `AuthenticationError`，其他错误抛出 `ApiError`
    - 所有请求设置 30 秒超时（AbortController）
    - 实现顶层便捷方法：`listProducts`、`getProduct`、`listProjects`、`getProject`、`getProjectProperties`、`listProjectMembers`、`listEnterpriseUsers`、`getUser`
    - 所有分页方法默认 pageIndex 为 0、pageSize 为 30，pageSize 上限 100
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [x] 6.2 创建客户端导出入口（`src/client/index.ts`）
    - 导出 PingCodeClient、PingCodeAuth、TokenStore、异常类和所有类型
    - _需求: 2.2_

  - [ ]* 6.3 编写 PingCodeClient 单元测试（`tests/client/client.test.ts`）
    - 测试 HTTP 方法（mock fetch）：URL 拼接、请求头、参数传递
    - 测试 401/403 响应抛出 AuthenticationError
    - 测试其他错误响应抛出 ApiError
    - 测试延迟加载子 API 模块
    - 测试 30 秒超时配置
    - 测试顶层便捷方法的端点路径
    - _需求: 2.1, 2.4, 2.5, 2.6, 2.7, 15.2, 15.5_

  - [ ]* 6.4 编写 HTTP 请求构造正确性属性测试
    - **属性 2: HTTP 请求构造正确性**
    - 使用 fast-check 生成随机端点和参数，mock fetch 验证 URL、method、headers、body
    - **验证: 需求 2.1, 2.4**

  - [ ]* 6.5 编写非认证错误状态码分类属性测试
    - **属性 3: 非认证错误状态码分类**
    - 使用 fast-check 生成随机非 2xx 非 401/403 状态码，验证抛出 PingCodeError 而非 AuthenticationError
    - **验证: 需求 2.6**

  - [ ]* 6.6 编写分页参数上限约束属性测试（`tests/shared/pagination.test.ts`）
    - **属性 9: 分页参数上限约束**
    - 使用 fast-check 生成随机 pageSize（0-1000），验证传递给 API 的 page_size ≤ 100
    - **验证: 需求 13.6**

- [ ] 7. 子 API 模块 — 需求管理与工作项管理
  - [x] 7.1 实现 StoriesAPI（`src/client/api/stories.ts`）
    - 实现 `listStories`、`getStory`、`searchStories`、`getStoryTypes`、`getStoryStatuses`、`getStoryPriorities` 方法
    - 未提供 productId 且客户端未配置默认 productId 时抛出参数缺失错误
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 7.2 实现 WorkItemsAPI（`src/client/api/work-items.ts`）
    - 实现 `listWorkItems`、`getWorkItem`、`createWorkItem`、`updateWorkItem`、`deleteWorkItem`、`searchWorkItems` 方法
    - 实现 `getWorkItemTypes`、`getWorkItemPriorities`、`getWorkItemStatuses` 方法
    - 实现 `listWorkItemTags`、`addWorkItemTag`、`removeWorkItemTag` 方法
    - 实现 `getWorkItemRelationTypes` 方法
    - 实现评论子 API：`listWorkItemComments`、`addWorkItemComment`、`updateWorkItemComment`、`deleteWorkItemComment`
    - _需求: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 14.1, 14.2, 14.3, 14.4_

  - [ ]* 7.3 编写 StoriesAPI 单元测试（`tests/client/api/stories.test.ts`）
    - mock client HTTP 方法，验证端点路径和参数传递
    - 测试 productId 缺失时的错误
    - _需求: 4.1, 4.2, 4.4, 4.5, 15.4_

  - [ ]* 7.4 编写 WorkItemsAPI 单元测试（`tests/client/api/work-items.test.ts`）
    - mock client HTTP 方法，验证所有方法的端点路径和参数传递
    - 包含评论子 API 的测试
    - _需求: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 14.1, 14.2, 14.3, 14.4, 15.4_

  - [ ]* 7.5 编写子 API 端点路由正确性属性测试（Stories + WorkItems 部分）
    - **属性 1: 子 API 端点路由正确性（Stories + WorkItems）**
    - 使用 fast-check 生成随机 ID，验证调用的端点路径匹配设计文档中的 API 端点映射表
    - **验证: 需求 4.1, 4.2, 4.4, 5.1, 5.2, 5.5, 5.6, 5.7, 14.1, 14.2, 14.3, 14.4, 15.6**

  - [ ]* 7.6 编写变更操作请求体构造属性测试（WorkItems 部分）
    - **属性 7: 变更操作请求体构造（WorkItems）**
    - 使用 fast-check 生成随机参数对象，验证请求体不含 undefined 字段且必填字段始终存在
    - **验证: 需求 5.3, 5.4**

- [ ] 8. 子 API 模块 — 迭代、交付目标、Wiki、个人信息、评论
  - [x] 8.1 实现 SprintsAPI（`src/client/api/sprints.ts`）
    - 实现 `listSprints`、`createSprint`、`updateSprint`、`getSprint`、`deleteSprint` 方法
    - _需求: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 8.2 实现 DeliverablesAPI（`src/client/api/deliverables.ts`）
    - 实现 `createDeliverable`、`updateDeliverable`、`deleteDeliverable`、`listDeliverables` 方法
    - _需求: 7.1, 7.2, 7.3, 7.4_

  - [x] 8.3 实现 WikiAPI（`src/client/api/wiki.ts`）
    - 实现空间管理：`listSpaces`、`getSpace`、`createSpace`、`updateSpace`、`deleteSpace`
    - 实现页面管理：`createPage`、`getPage`、`getPageContent`、`updatePageContent`、`getPageVersions`、`getSpacePages`
    - 实现成员管理：`addSpaceMember`、`updateSpaceMember`、`removeSpaceMember`、`getSpaceMembers`
    - _需求: 8.1, 8.2, 8.3_

  - [x] 8.4 实现 MyselfAPI（`src/client/api/myself.ts`）
    - 实现 `getMyself` 方法
    - _需求: 9.1_

  - [x] 8.5 实现 CommentsAPI（`src/client/api/comments.ts`）
    - 实现 `listComments`、`createComment` 方法
    - _需求: 9.2, 9.3_

  - [ ]* 8.6 编写 SprintsAPI、DeliverablesAPI、WikiAPI、MyselfAPI、CommentsAPI 单元测试
    - 分别在 `tests/client/api/` 下创建对应测试文件
    - mock client HTTP 方法，验证端点路径和参数传递
    - _需求: 6.1, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 15.4_

  - [ ]* 8.7 编写子 API 端点路由正确性属性测试（Sprints + Deliverables + Wiki + Myself + Comments 部分）
    - **属性 1: 子 API 端点路由正确性（其余模块）**
    - 使用 fast-check 生成随机 ID，验证调用的端点路径匹配设计文档中的 API 端点映射表
    - **验证: 需求 6.1, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 9.2, 9.3, 13.1, 13.2, 13.3, 13.4, 13.5, 15.6**

  - [ ]* 8.8 编写变更操作请求体构造属性测试（Sprints + Deliverables 部分）
    - **属性 7: 变更操作请求体构造（Sprints + Deliverables）**
    - 使用 fast-check 生成随机参数对象，验证请求体不含 undefined 字段且必填字段始终存在
    - **验证: 需求 6.2, 6.3, 7.1, 7.2**

- [x] 9. 检查点 — 确保客户端库所有测试通过
  - 确保所有测试通过，如有问题请询问用户。

- [ ] 10. MCP Server
  - [x] 10.1 实现响应格式化模块（`src/server/format.ts`）
    - 实现 `formatResponse()` 函数，支持 JSON 和 Markdown 两种输出格式
    - 实现 `formatErrorMessage()` 函数，根据错误类型返回包含可操作建议的错误消息
    - _需求: 11.5, 11.6_

  - [x] 10.2 实现 MCP Server 入口和工具注册（`src/server/index.ts` + `src/server/tools/*.ts`）
    - 使用 `@modelcontextprotocol/sdk` 创建 Server 实例，通过 stdio 传输运行
    - 启动时初始化 PingCodeClient 实例
    - 注册 `pingcode_ping` 健康检查工具
    - 按领域分组注册约 35 个工具函数（product、project、story、work-item、sprint、deliverable、wiki、user、comment），每个工具使用 Zod schema 定义输入参数
    - 工具函数执行失败时捕获异常并返回格式化错误信息
    - _需求: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

  - [ ]* 10.3 编写响应格式化单元测试（`tests/server/format.test.ts`）
    - 测试 JSON 格式返回原始数据
    - 测试 Markdown 格式返回字符串
    - 测试错误格式化各类型（认证失败、权限不足、资源不存在、服务器错误）
    - _需求: 11.5, 11.6_

  - [ ]* 10.4 编写响应格式化一致性属性测试
    - **属性 8: 响应格式化一致性**
    - 使用 fast-check 生成随机数据对象和格式选项，验证 JSON 返回对象、Markdown 返回字符串
    - **验证: 需求 11.5**

- [ ] 11. CLI 工具
  - [x] 11.1 实现 CLI 基础设施（`src/cli/index.ts`、`src/cli/client.ts`、`src/cli/output.ts`）
    - 使用 Commander 创建 `pingcode-for-ai` 命令入口
    - 实现单例 PingCodeClient 访问器
    - 实现输出格式化（支持 `--format json` 全局选项，默认人类可读格式）
    - 实现 `version` 命令
    - _需求: 12.1, 12.8, 12.9_

  - [x] 11.2 实现 auth 命令组（`src/cli/commands/auth.ts`）
    - 实现 `login` 子命令（支持 `--mode` 和 `--code` 参数）
    - 实现 `status` 子命令
    - 实现 `logout` 子命令
    - _需求: 12.2_

  - [x] 11.3 实现 user、work-item、sprint、wiki、project 命令组
    - `src/cli/commands/user.ts`：`me` 子命令
    - `src/cli/commands/work-item.ts`：`list`、`get`、`create`、`update`、`delete`、`search`、`comment-list`、`comment-add` 子命令
    - `src/cli/commands/sprint.ts`：`list`、`get`、`create`、`update`、`delete` 子命令
    - `src/cli/commands/wiki.ts`：`space-list`、`space-get`、`space-create`、`page-get`、`page-create`、`page-update` 子命令
    - `src/cli/commands/project.ts`：`list`、`get`、`members` 子命令
    - _需求: 12.3, 12.4, 12.5, 12.6, 12.7_

  - [x] 11.4 配置 CLI 入口（`package.json` 的 `bin` 字段）
    - 配置 `pingcode-for-ai` 命令指向编译后的 CLI 入口
    - _需求: 12.1_

- [x] 12. 检查点 — 确保所有测试通过
  - 运行 `npm test`，确保所有测试通过，如有问题请询问用户。

## 说明

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 交付
- 每个任务引用了具体的需求编号，确保需求可追溯
- 检查点任务用于阶段性验证，确保增量开发的正确性
- 属性测试验证设计文档中定义的 9 个正确性属性
- 单元测试验证具体场景和边界条件

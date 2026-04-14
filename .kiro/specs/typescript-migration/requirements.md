# 需求文档：PingCode Python 项目迁移至 TypeScript

## 简介

将现有 Python PingCode MCP 项目完整迁移为 TypeScript 独立项目（`pingcode-for-ai`），部署在 `d:\projects\pingcode-for-ai` 目录下。新项目为独立 git 仓库，包含三大核心模块：PingCode API 客户端库、MCP Server、CLI 工具。技术栈从 Python 生态全面切换至 Node.js/TypeScript 生态，保持功能对等。

## 术语表

- **PingCodeClient**：PingCode API 客户端主类，封装 HTTP 请求方法和子 API 模块的延迟加载
- **Sub_API_Module**：子 API 模块（如 StoriesAPI、WorkItemsAPI），每个模块封装一组相关的 PingCode REST API 端点
- **MCP_Server**：基于 Model Context Protocol 的服务端，注册工具函数供 AI 助手调用
- **CLI_Tool**：基于 Commander 的命令行工具，提供终端操作 PingCode 的能力
- **OAuth_Auth**：PingCode OAuth 认证管理器，支持客户端凭证模式和授权码模式
- **Token_Store**：令牌持久化存储，将访问令牌和刷新令牌保存到 JSON 文件
- **Zod_Schema**：使用 Zod 库定义的运行时类型校验模式，替代 Python 的 Pydantic

## 需求

### 需求 1：项目初始化与构建配置

**用户故事：** 作为开发者，我希望新项目有完整的 TypeScript 构建配置和依赖管理，以便能够编译、测试和发布项目。

#### 验收标准

1. THE Build_System SHALL 在 `d:\projects\pingcode-for-ai` 根目录生成 `package.json`，包含项目名称 `pingcode-for-ai`、入口文件配置和所有必要依赖
2. THE Build_System SHALL 配置 TypeScript 编译器（`tsconfig.json`），目标为 ES2022，模块系统为 Node16，启用严格模式和声明文件生成
3. THE Build_System SHALL 配置 Vitest 作为测试框架，支持 TypeScript 源文件的直接测试
4. THE Build_System SHALL 在 `package.json` 中定义 `build`、`test`、`lint` 脚本命令
5. THE Build_System SHALL 配置 `.gitignore` 排除 `node_modules/`、`dist/`、`.env`、`.pingcode_token.json` 等文件
6. THE Build_System SHALL 配置 `.env.example` 文件，包含与 Python 项目相同的环境变量模板（`PINGCODE_API_ROOT`、`PINGCODE_AUTH_MODE`、`PINGCODE_CLIENT_ID`、`PINGCODE_CLIENT_SECRET`、`PINGCODE_USER_CLIENT_ID`、`PINGCODE_USER_CLIENT_SECRET`）
7. THE Build_System SHALL 采用单包结构（非 monorepo），所有源码位于 `src/` 目录下

### 需求 2：PingCode API 客户端库核心架构

**用户故事：** 作为开发者，我希望有一个类型安全的 PingCode API 客户端库，以便能够通过 TypeScript 调用 PingCode Open API。

#### 验收标准

1. THE PingCodeClient SHALL 提供 `get`、`post`、`put`、`patch`、`delete` 五个 HTTP 方法，使用 Node.js 18+ 原生 `fetch` API 发起请求
2. THE PingCodeClient SHALL 通过 getter 属性延迟加载子 API 模块（stories、workItems、sprints、deliverables、wiki、myself、comments），每个子 API 模块接收父客户端实例
3. THE PingCodeClient SHALL 从环境变量或构造函数参数读取 `apiRoot`、`orgId`、`productId` 等配置
4. THE PingCodeClient SHALL 在每次请求前通过 OAuth_Auth 获取有效的访问令牌，并设置 `Authorization: Bearer <token>` 和 `Content-Type: application/json` 请求头
5. WHEN HTTP 响应状态码为 401 或 403 时，THE PingCodeClient SHALL 抛出 `AuthenticationError`，包含可操作的错误提示信息
6. WHEN HTTP 响应状态码表示其他错误时，THE PingCodeClient SHALL 抛出 `PingCodeError`，包含状态码、错误消息和响应体详情
7. THE PingCodeClient SHALL 为所有请求设置 30 秒超时

### 需求 3：OAuth 认证模块

**用户故事：** 作为开发者，我希望认证模块支持客户端凭证和授权码两种 OAuth 模式，以便在不同场景下灵活使用。

#### 验收标准

1. THE OAuth_Auth SHALL 根据 `PINGCODE_AUTH_MODE` 环境变量（`client` 或 `user`）自动选择认证模式
2. WHEN 认证模式为 `client` 时，THE OAuth_Auth SHALL 使用 `PINGCODE_CLIENT_ID` 和 `PINGCODE_CLIENT_SECRET` 通过 `grant_type=client_credentials` 获取访问令牌
3. WHEN 认证模式为 `user` 时，THE OAuth_Auth SHALL 使用 `PINGCODE_USER_CLIENT_ID` 和 `PINGCODE_USER_CLIENT_SECRET` 通过授权码流程获取访问令牌
4. THE OAuth_Auth SHALL 将令牌信息（access_token、refresh_token、expires_at、auth_mode）持久化到 `.pingcode_token.json` 文件
5. WHEN 从文件加载令牌时，IF 文件中的 `auth_mode` 与当前模式不匹配，THEN THE OAuth_Auth SHALL 忽略缓存令牌
6. WHEN 令牌距过期不足 1 天时，THE OAuth_Auth SHALL 自动刷新令牌（user 模式使用 refresh_token，client 模式重新获取）
7. THE OAuth_Auth SHALL 提供 `getAuthorizeUrl()` 方法，生成授权码获取链接
8. IF 必要的凭据（client_id 或 client_secret）缺失，THEN THE OAuth_Auth SHALL 抛出包含配置指引的错误信息

### 需求 4：子 API 模块 — 需求管理（Stories）

**用户故事：** 作为开发者，我希望通过客户端库管理 PingCode 产品需求，以便进行需求的查询和搜索。

#### 验收标准

1. THE StoriesAPI SHALL 提供 `listStories` 方法，支持按 `productId`、`storyType`、`statusId`、`priority`、`query` 筛选，支持分页参数（`pageIndex` 从 0 开始，`pageSize` 最大 100）
2. THE StoriesAPI SHALL 提供 `getStory` 方法，通过 `storyId` 和可选的 `productId` 获取单个需求详情
3. THE StoriesAPI SHALL 提供 `searchStories` 方法，作为 `listStories` 的便捷封装，接受 `keyword` 参数
4. THE StoriesAPI SHALL 提供 `getStoryTypes`、`getStoryStatuses`、`getStoryPriorities` 方法，获取需求的类型、状态和优先级列表
5. WHEN 未提供 `productId` 且客户端未配置默认 `productId` 时，THE StoriesAPI SHALL 抛出明确的参数缺失错误

### 需求 5：子 API 模块 — 工作项管理（WorkItems）

**用户故事：** 作为开发者，我希望通过客户端库对工作项进行完整的增删改查操作，以便管理项目中的任务、缺陷等。

#### 验收标准

1. THE WorkItemsAPI SHALL 提供 `listWorkItems` 方法，支持按 `projectIds`、`identifier`、`assigneeIds`、`priorityIds`、`sprintIds`、`participantId`、`keywords` 筛选，支持分页
2. THE WorkItemsAPI SHALL 提供 `getWorkItem` 方法，通过 `workItemId` 获取单个工作项详情
3. THE WorkItemsAPI SHALL 提供 `createWorkItem` 方法，必填参数为 `projectId`、`title`、`typeId`，可选参数包括 `description`、`assigneeId`、`stateId`、`priorityId`、`parentId`、`sprintId`、`startAt`、`endAt`、`properties`
4. THE WorkItemsAPI SHALL 提供 `updateWorkItem` 方法，支持更新 `title`、`description`、`assigneeId`、`stateId`、`priorityId`、`parentId`、`startAt`、`endAt`、`properties`、`phaseId`、`storyPoints`、`estimatedWorkload`、`remainingWorkload`
5. THE WorkItemsAPI SHALL 提供 `deleteWorkItem` 方法，通过 `workItemId` 删除工作项
6. THE WorkItemsAPI SHALL 提供 `getWorkItemTypes`、`getWorkItemPriorities`、`getWorkItemStatuses` 方法，获取工作项的类型、优先级和状态列表
7. THE WorkItemsAPI SHALL 提供 `listWorkItemTags`、`addWorkItemTag`、`removeWorkItemTag` 方法，管理工作项标签
8. THE WorkItemsAPI SHALL 提供 `getWorkItemRelationTypes` 方法，获取工作项关系类型列表
9. THE WorkItemsAPI SHALL 提供 `searchWorkItems` 方法，作为 `listWorkItems` 的便捷封装

### 需求 6：子 API 模块 — 迭代管理（Sprints）

**用户故事：** 作为开发者，我希望通过客户端库管理项目迭代，以便进行迭代的创建、更新和查询。

#### 验收标准

1. THE SprintsAPI SHALL 提供 `listSprints` 方法，支持按 `projectId`、`name`、`status`、`createdBetween`、`updatedBetween` 筛选，支持分页
2. THE SprintsAPI SHALL 提供 `createSprint` 方法，必填参数为 `projectId`、`name`、`startAt`、`endAt`、`assigneeId`
3. THE SprintsAPI SHALL 提供 `updateSprint` 方法，支持更新迭代的名称、时间、负责人、描述、状态和分类
4. THE SprintsAPI SHALL 提供 `getSprint` 方法，通过 `projectId` 和 `sprintId` 获取迭代详情
5. THE SprintsAPI SHALL 提供 `deleteSprint` 方法，通过 `projectId` 和 `sprintId` 删除迭代

### 需求 7：子 API 模块 — 交付目标管理（Deliverables）

**用户故事：** 作为开发者，我希望通过客户端库管理工作项的交付目标，以便跟踪交付物。

#### 验收标准

1. THE DeliverablesAPI SHALL 提供 `createDeliverable` 方法，必填参数为 `workItemId`、`name`、`contentType`、`content`
2. THE DeliverablesAPI SHALL 提供 `updateDeliverable` 方法，通过 `deliverableId` 更新交付目标的名称、类型和内容
3. THE DeliverablesAPI SHALL 提供 `deleteDeliverable` 方法，通过 `deliverableId` 删除交付目标
4. THE DeliverablesAPI SHALL 提供 `listDeliverables` 方法，通过 `workItemId` 获取交付目标列表，支持分页

### 需求 8：子 API 模块 — 知识管理（Wiki）

**用户故事：** 作为开发者，我希望通过客户端库管理 Wiki 空间和页面，以便进行知识库的读写操作。

#### 验收标准

1. THE WikiAPI SHALL 提供空间管理方法：`listSpaces`（支持关键字搜索）、`getSpace`、`createSpace`（必填 `name`、`identifier`）、`updateSpace`、`deleteSpace`
2. THE WikiAPI SHALL 提供页面管理方法：`createPage`（必填 `spaceId`、`name`、`content`）、`getPage`、`getPageContent`、`updatePageContent`、`getPageVersions`、`getSpacePages`（支持分页）
3. THE WikiAPI SHALL 提供空间成员管理方法：`addSpaceMember`、`updateSpaceMember`、`removeSpaceMember`、`getSpaceMembers`

### 需求 9：子 API 模块 — 个人信息与评论（Myself、Comments）

**用户故事：** 作为开发者，我希望能获取当前用户信息和管理评论，以便支持用户上下文操作。

#### 验收标准

1. THE MyselfAPI SHALL 提供 `getMyself` 方法，获取当前登录用户信息
2. THE CommentsAPI SHALL 提供 `listComments` 方法，支持按 `principalType`、`principalId`、`reviewId` 筛选，支持分页
3. THE CommentsAPI SHALL 提供 `createComment` 方法，必填参数为 `principalType`、`content`，可选参数包括 `principalId`、`reviewId`、`createdAt`、`createdBy`

### 需求 10：自定义异常体系

**用户故事：** 作为开发者，我希望有结构化的异常类型，以便在调用 API 时能精确捕获和处理不同类型的错误。

#### 验收标准

1. THE Exception_System SHALL 定义 `PingCodeError` 基础异常类，继承自 `Error`，包含 `message` 属性
2. THE Exception_System SHALL 定义 `AuthenticationError` 异常类，继承自 `PingCodeError`，用于认证失败场景
3. THE Exception_System SHALL 定义 `ApiError` 异常类，继承自 `PingCodeError`，包含 `statusCode`、`details` 属性，用于 API 请求失败场景

### 需求 11：MCP Server

**用户故事：** 作为 AI 助手用户，我希望通过 MCP 协议调用 PingCode 工具函数，以便 AI 能读写项目管理数据。

#### 验收标准

1. THE MCP_Server SHALL 使用 `@modelcontextprotocol/sdk` 注册所有工具函数，功能与 Python 版本的约 35 个工具函数一一对应
2. THE MCP_Server SHALL 为每个工具函数提供 Zod_Schema 定义的输入参数校验
3. THE MCP_Server SHALL 在启动时初始化 PingCodeClient 实例，所有工具函数共享该实例
4. THE MCP_Server SHALL 提供 `pingcode_ping` 工具用于健康检查
5. THE MCP_Server SHALL 提供响应格式化功能，支持 JSON 和 Markdown 两种输出格式
6. THE MCP_Server SHALL 提供统一的错误格式化功能，根据错误类型（认证失败、权限不足、资源不存在、服务器错误）返回包含可操作建议的错误消息
7. THE MCP_Server SHALL 通过 stdio 传输方式运行
8. WHEN 工具函数执行失败时，THE MCP_Server SHALL 捕获异常并返回格式化的错误信息，包含上下文和排查建议

### 需求 12：CLI 工具

**用户故事：** 作为开发者，我希望通过命令行工具直接操作 PingCode，以便在终端中快速查询和管理项目数据。

#### 验收标准

1. THE CLI_Tool SHALL 使用 Commander 框架，提供 `pingcode-for-ai` 命令入口
2. THE CLI_Tool SHALL 提供 `auth` 命令组，包含 `login`（支持 `--mode` 和 `--code` 参数）、`status`、`logout` 子命令
3. THE CLI_Tool SHALL 提供 `user` 命令组，包含 `me`（获取当前用户）子命令
4. THE CLI_Tool SHALL 提供 `work-item` 命令组，包含 `list`、`get`、`create`、`update`、`delete`、`search`、`comment-list`、`comment-add` 子命令
5. THE CLI_Tool SHALL 提供 `sprint` 命令组，包含 `list`、`get`、`create`、`update`、`delete` 子命令
6. THE CLI_Tool SHALL 提供 `wiki` 命令组，包含 `space-list`、`space-get`、`space-create`、`page-get`、`page-create`、`page-update` 子命令
7. THE CLI_Tool SHALL 提供 `project` 命令组，包含 `list`、`get`、`members` 子命令
8. THE CLI_Tool SHALL 支持 `--format json` 全局选项，默认输出为人类可读的表格或文本格式
9. THE CLI_Tool SHALL 提供 `version` 命令，显示当前版本号

### 需求 13：客户端库直接方法

**用户故事：** 作为开发者，我希望 PingCodeClient 直接提供常用的顶层 API 方法，以便无需通过子模块即可调用。

#### 验收标准

1. THE PingCodeClient SHALL 直接提供 `listProducts` 和 `getProduct` 方法，调用 `/v1/scm/products` 端点
2. THE PingCodeClient SHALL 直接提供 `listProjects` 和 `getProject` 方法，调用 `/v1/project/projects` 端点
3. THE PingCodeClient SHALL 直接提供 `getProjectProperties` 方法，获取项目属性列表
4. THE PingCodeClient SHALL 直接提供 `listProjectMembers` 方法，获取项目成员列表，支持分页
5. THE PingCodeClient SHALL 直接提供 `listEnterpriseUsers` 和 `getUser` 方法，调用 `/v1/directory/users` 端点
6. THE PingCodeClient SHALL 所有分页方法默认 `pageIndex` 为 0、`pageSize` 为 30，`pageSize` 上限为 100

### 需求 14：工作项评论子 API

**用户故事：** 作为开发者，我希望通过客户端库管理工作项评论，以便在工作项上进行讨论。

#### 验收标准

1. THE WorkItemsAPI SHALL 提供 `listWorkItemComments` 方法，通过 `workItemId` 获取评论列表，支持分页
2. THE WorkItemsAPI SHALL 提供 `addWorkItemComment` 方法，必填参数为 `workItemId`、`content`，可选参数 `parentId` 用于回复
3. THE WorkItemsAPI SHALL 提供 `updateWorkItemComment` 方法，通过 `workItemId`、`commentId`、`content` 更新评论
4. THE WorkItemsAPI SHALL 提供 `deleteWorkItemComment` 方法，通过 `workItemId`、`commentId` 删除评论

### 需求 15：测试覆盖

**用户故事：** 作为开发者，我希望项目有完善的单元测试，以便确保迁移后的功能正确性。

#### 验收标准

1. THE Test_Suite SHALL 使用 Vitest 框架编写测试，通过 mock `fetch` 函数验证 HTTP 请求参数的正确性，不发起实际 API 请求
2. THE Test_Suite SHALL 为 PingCodeClient 的每个 HTTP 方法（get、post、put、patch、delete）编写测试，验证 URL 拼接、请求头设置和参数传递
3. THE Test_Suite SHALL 为 OAuth_Auth 编写测试，覆盖客户端凭证模式获取令牌、授权码模式获取令牌、令牌刷新、令牌文件读写、模式不匹配时忽略缓存等场景
4. THE Test_Suite SHALL 为每个子 API 模块编写测试，验证方法调用时传递给 PingCodeClient 的端点路径和参数正确
5. THE Test_Suite SHALL 为异常处理编写测试，验证 401/403 响应抛出 `AuthenticationError`，其他错误响应抛出 `PingCodeError`
6. FOR ALL 子 API 模块的方法调用，THE Test_Suite SHALL 验证 mock 的 HTTP 方法被调用时的端点路径与 PingCode Open API 文档一致（往返属性）
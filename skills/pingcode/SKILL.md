---
name: pingcode
description: 通过 CLI 操作 PingCode 项目管理平台。当用户提到工作项、迭代、需求、Wiki、项目管理、任务分配、评论工作项、技术方案等 PingCode 相关操作时使用此 skill。涵盖工作项增删改查、迭代管理、Wiki 页面管理、项目信息查询、用户查询、评论等全部功能。
---

# PingCode CLI Skill

通过 `pingcode-for-ai` CLI 命令操作 PingCode 项目管理平台。

## 前置条件

- CLI 已安装（在项目根目录执行 `npm run build && npm link`）
- `.env` 已配置 `PINGCODE_API_ROOT`、`PINGCODE_CLIENT_ID`、`PINGCODE_CLIENT_SECRET`
- 已认证（`pingcode-for-ai auth login`）

## 模块总览

根据用户意图选择对应模块，读取 reference 文件获取详细命令：

| 用户意图 | 模块 | Reference 文件 |
|---------|------|---------------|
| 查看/创建/搜索工作项、查看我的任务 | 工作项 | `references/work-item.md` |
| 查看/管理迭代 | 迭代 | `references/sprint.md` |
| 查看/创建 Wiki 页面、写技术方案 | Wiki | `references/wiki.md` |
| 查看项目信息、项目成员 | 项目 | `references/project.md` |
| 查看用户信息、查找用户 | 用户 | `references/user.md` |
| 认证登录、检查令牌状态 | 认证 | `references/auth.md` |

## 使用方式

1. 根据用户意图确定涉及的模块
2. 读取对应的 reference 文件获取详细的 CLI 命令和参数
3. 按步骤执行 CLI 命令完成任务

多数命令支持 `--format json` 参数输出 JSON 格式，便于解析和组合使用。

## 常见复合场景

### 查看我的任务

涉及模块：用户 + 项目 + 迭代 + 工作项

1. `pingcode-for-ai user me` → 获取当前用户 ID
2. `pingcode-for-ai project list` → 获取项目列表
3. `pingcode-for-ai sprint list --project-id <id> --status in_progress` → 获取进行中的迭代
4. `pingcode-for-ai work-item list --project-ids <id> --assignee-ids <user-id>` → 获取我的工作项

### 为需求写技术方案并发布到 Wiki

涉及模块：工作项 + Wiki

1. `pingcode-for-ai work-item get <id> --format json` → 获取需求详情
2. 根据需求内容生成技术方案
3. `pingcode-for-ai wiki space-list --format json` → 列出 Wiki 空间
4. `pingcode-for-ai wiki page-create --space-id <id> --name "技术方案：<标题>" --content "<内容>"` → 创建页面

### 评论工作项并 @mention 某人

涉及模块：工作项 + 用户

1. `pingcode-for-ai work-item get <id> --format json` → 确认工作项存在
2. `pingcode-for-ai user me --format json` → 查找目标用户 ID
3. `pingcode-for-ai work-item comment-add <id> --content "请 <at user-id>显示名称</at> 确认需求"` → 发送评论

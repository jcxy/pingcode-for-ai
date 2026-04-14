# 产品概述

PingCode for AI 是一个 TypeScript 项目，通过 MCP（Model Context Protocol）协议和 CLI 工具将 AI 编程工具（Kiro、Claude Desktop 等）与 PingCode 项目管理平台连接起来。

## 核心功能

- 将 PingCode Open API 封装为 MCP 工具，让 AI 助手可以读写项目数据（工作项、迭代、Wiki 页面、需求、交付目标等）
- 提供 TypeScript 客户端库，封装 PingCode REST API，支持 OAuth 认证
- 包含基于 Commander 的 CLI 工具（`pingcode-for-ai`），可在终端直接操作 PingCode
- 提供 MCP Server（`src/server/index.ts`），注册工具供 AI 调用

## 语言规范

项目使用简体中文。所有面向用户的字符串、文档字符串、注释和文档均使用中文编写。添加或修改代码时请遵循此规范。

## 核心概念

- **PingCode**：项目管理 SaaS 平台（类似 Jira）。核心实体：项目、工作项、迭代、需求、交付目标、Wiki 空间/页面。
- **MCP（Model Context Protocol）**：让 AI 工具调用服务端工具的协议。本项目实现了一个 MCP Server。
- **OAuth 认证**：支持客户端凭证模式和授权码模式两种认证流程。令牌缓存在 `.pingcode_token.json` 中。

## API 参考文档

PingCode API 文档存放在 `pingcodeDocs/` 目录下，实现新的 API 端点时请参考这些文档。

## AI 编程工具接入方式

本项目为 AI 编程工具提供两种接入 PingCode 的方式：

### 1. CLI + Skill（推荐）

AI 编程工具通过读取 Skill 文件（`skills/pingcode/SKILL.md`）获取结构化执行步骤，按步骤调用 CLI 命令（`pingcode-for-ai xxx`）完成任务。

### 2. MCP

AI 编程工具通过 MCP 协议直接调用 MCP Server 注册的工具函数。适用于 Claude Desktop 等原生支持 MCP 协议的工具。

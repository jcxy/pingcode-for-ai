# 产品概述

PingCode CLI 是一个 TypeScript 项目，通过 CLI + Skill 的方式将 AI 编程工具（Kiro、Cursor、Windsurf、Claude Code 等）与 PingCode 项目管理平台连接起来。

## 核心功能

- 提供 `pingcode-cli` 命令行工具，可在终端直接操作 PingCode（工作项、迭代、Wiki、项目、用户等）
- 提供 TypeScript 客户端库，封装 PingCode REST API，支持 OAuth 认证
- 配合 Skill 文件（`skills/pingcode/SKILL.md`），让 AI 编程工具通过读取 Skill 获取结构化步骤，调用 CLI 命令完成任务

## 接入方式

AI 编程工具通过读取 Skill 文件获取结构化执行步骤，按步骤调用 CLI 命令（`pingcode-cli xxx`）完成任务。

**优势：**
- Token 消耗少：CLI 返回精简的文本或 JSON
- 可组合：Skill 文件可编排多个 CLI 命令构建复杂工作流
- 易调试：CLI 命令可在终端直接运行验证

## 语言规范

项目使用简体中文。所有面向用户的字符串、注释和文档均使用中文编写。

## 核心概念

- **PingCode**：项目管理 SaaS 平台（类似 Jira）。核心实体：项目、工作项、迭代、需求、交付目标、Wiki 空间/页面。
- **OAuth 认证**：支持客户端凭证模式和授权码模式。令牌缓存在 `~/.pingcode/token.json`。
- **全局配置**：存储在 `~/.pingcode/config.json`，首次使用时交互式引导配置。

## API 参考文档

PingCode API 文档存放在 `pingcodeDocs/` 目录下，实现新的 API 端点时请参考这些文档。

#!/usr/bin/env node
/**
 * PingCode MCP Server 入口
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PingCodeClient } from '../client/index.js';
import { registerProductTools } from './tools/product-tools.js';
import { registerProjectTools } from './tools/project-tools.js';
import { registerStoryTools } from './tools/story-tools.js';
import { registerWorkItemTools } from './tools/work-item-tools.js';
import { registerSprintTools } from './tools/sprint-tools.js';
import { registerDeliverableTools } from './tools/deliverable-tools.js';
import { registerWikiTools } from './tools/wiki-tools.js';
import { registerUserTools } from './tools/user-tools.js';
import { registerCommentTools } from './tools/comment-tools.js';
import { z } from 'zod';

const server = new McpServer({ name: 'PingCode MCP Server', version: '0.1.0' });
let client: PingCodeClient;

function ensureClient(): PingCodeClient {
  if (!client) throw new Error('PingCode 客户端未初始化');
  return client;
}

// 健康检查
server.tool('pingcode_ping', '检查服务是否运行', {}, async () => ({
  content: [{ type: 'text', text: 'Pong! PingCode MCP Server is running' }],
}));

// 注册所有工具
registerProductTools(server, ensureClient);
registerProjectTools(server, ensureClient);
registerStoryTools(server, ensureClient);
registerWorkItemTools(server, ensureClient);
registerSprintTools(server, ensureClient);
registerDeliverableTools(server, ensureClient);
registerWikiTools(server, ensureClient);
registerUserTools(server, ensureClient);
registerCommentTools(server, ensureClient);

async function main() {
  try {
    client = new PingCodeClient();
    await client.initSubApis();
    console.error('PingCode 客户端初始化成功');
  } catch (e: any) {
    console.error(`PingCode 客户端初始化失败: ${e.message}`);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);

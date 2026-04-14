import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerUserTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_enterprise_users', '获取企业成员列表', {
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().listEnterpriseUsers(params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取企业成员列表') }], isError: true }; }
  });

  server.tool('pingcode_get_user', '获取用户详情', {
    user_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().getUser(params.user_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取用户详情') }], isError: true }; }
  });

  server.tool('pingcode_get_myself', '获取当前登录用户信息', {
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().myself.getMyself();
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取当前用户信息') }], isError: true }; }
  });
}

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerSprintTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_sprints', '获取迭代列表', {
    project_id: z.string(),
    name: z.string().optional(),
    status: z.string().optional(),
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().sprints.listSprints({
        projectId: params.project_id, name: params.name, status: params.status,
        pageIndex: params.page_index, pageSize: params.page_size,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取迭代列表') }], isError: true }; }
  });

  server.tool('pingcode_create_sprint', '创建迭代', {
    project_id: z.string(), name: z.string(), start_at: z.number(), end_at: z.number(),
    assignee_id: z.string(), description: z.string().optional(), status: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().sprints.createSprint({
        projectId: params.project_id, name: params.name, startAt: params.start_at,
        endAt: params.end_at, assigneeId: params.assignee_id, description: params.description, status: params.status,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '创建迭代') }], isError: true }; }
  });

  server.tool('pingcode_update_sprint', '更新迭代', {
    project_id: z.string(), sprint_id: z.string(), name: z.string().optional(),
    start_at: z.number().optional(), end_at: z.number().optional(), assignee_id: z.string().optional(),
    description: z.string().optional(), status: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().sprints.updateSprint(params.project_id, params.sprint_id, {
        name: params.name, startAt: params.start_at, endAt: params.end_at,
        assigneeId: params.assignee_id, description: params.description, status: params.status,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '更新迭代') }], isError: true }; }
  });

  server.tool('pingcode_delete_sprint', '删除迭代', {
    project_id: z.string(), sprint_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().sprints.deleteSprint(params.project_id, params.sprint_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '删除迭代') }], isError: true }; }
  });
}

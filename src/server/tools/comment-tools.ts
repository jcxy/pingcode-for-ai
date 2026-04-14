import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerCommentTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_work_item_comments', '获取工作项评论列表', {
    work_item_id: z.string(),
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.listWorkItemComments(params.work_item_id, params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项评论列表') }], isError: true }; }
  });

  server.tool('pingcode_add_work_item_comment', '添加工作项评论', {
    work_item_id: z.string(), content: z.string(), parent_id: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.addWorkItemComment(params.work_item_id, params.content, params.parent_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '添加工作项评论') }], isError: true }; }
  });

  server.tool('pingcode_update_work_item_comment', '更新工作项评论', {
    work_item_id: z.string(), comment_id: z.string(), content: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.updateWorkItemComment(params.work_item_id, params.comment_id, params.content);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '更新工作项评论') }], isError: true }; }
  });

  server.tool('pingcode_delete_work_item_comment', '删除工作项评论', {
    work_item_id: z.string(), comment_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.deleteWorkItemComment(params.work_item_id, params.comment_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '删除工作项评论') }], isError: true }; }
  });
}

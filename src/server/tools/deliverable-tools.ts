import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerDeliverableTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_deliverables', '获取交付目标列表', {
    work_item_id: z.string(), page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().deliverables.listDeliverables(params.work_item_id, params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取交付目标列表') }], isError: true }; }
  });

  server.tool('pingcode_create_deliverable', '创建交付目标', {
    work_item_id: z.string(), name: z.string(), content_type: z.string(), content: z.record(z.any()),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().deliverables.createDeliverable({
        workItemId: params.work_item_id, name: params.name, contentType: params.content_type, content: params.content,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '创建交付目标') }], isError: true }; }
  });

  server.tool('pingcode_update_deliverable', '更新交付目标', {
    deliverable_id: z.string(), work_item_id: z.string().optional(), name: z.string().optional(),
    content_type: z.string().optional(), content: z.record(z.any()).optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().deliverables.updateDeliverable(params.deliverable_id, {
        workItemId: params.work_item_id, name: params.name, contentType: params.content_type, content: params.content,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '更新交付目标') }], isError: true }; }
  });

  server.tool('pingcode_delete_deliverable', '删除交付目标', {
    deliverable_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().deliverables.deleteDeliverable(params.deliverable_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '删除交付目标') }], isError: true }; }
  });
}

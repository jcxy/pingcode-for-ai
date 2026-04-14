import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerStoryTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_stories', '获取需求列表', {
    product_id: z.string().optional(),
    story_type: z.string().optional(),
    status_id: z.string().optional(),
    priority: z.string().optional(),
    query: z.string().optional(),
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().stories.listStories({
        productId: params.product_id, storyType: params.story_type,
        statusId: params.status_id, priority: params.priority,
        query: params.query, pageIndex: params.page_index, pageSize: params.page_size,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取需求列表') }], isError: true }; }
  });

  server.tool('pingcode_get_story', '获取单个需求详情', {
    story_id: z.string(),
    product_id: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().stories.getStory(params.story_id, params.product_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取需求详情') }], isError: true }; }
  });

  server.tool('pingcode_search_stories', '搜索需求', {
    keyword: z.string(),
    product_id: z.string().optional(),
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().stories.searchStories(params.keyword, params.product_id, params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '搜索需求') }], isError: true }; }
  });
}

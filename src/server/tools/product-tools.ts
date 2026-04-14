import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerProductTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_products', '获取产品列表', {
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().listProducts(params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取产品列表') }], isError: true }; }
  });

  server.tool('pingcode_get_product', '获取单个产品详情', {
    product_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().getProduct(params.product_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取产品详情') }], isError: true }; }
  });
}

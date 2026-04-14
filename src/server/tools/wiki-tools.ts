import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerWikiTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_spaces', '获取 Wiki 空间列表', {
    keywords: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.listSpaces(params.keywords);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取空间列表') }], isError: true }; }
  });

  server.tool('pingcode_get_space', '获取空间详情', {
    space_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.getSpace(params.space_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取空间详情') }], isError: true }; }
  });

  server.tool('pingcode_create_space', '创建 Wiki 空间', {
    name: z.string(), identifier: z.string(), description: z.string().optional(),
    visibility: z.string().default('private'),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.createSpace({ name: params.name, identifier: params.identifier, description: params.description, visibility: params.visibility });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '创建空间') }], isError: true }; }
  });

  server.tool('pingcode_update_space', '更新空间信息', {
    space_id: z.string(), name: z.string().optional(), description: z.string().optional(), visibility: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.updateSpace(params.space_id, { name: params.name, description: params.description, visibility: params.visibility });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '更新空间') }], isError: true }; }
  });

  server.tool('pingcode_delete_space', '删除空间', {
    space_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.deleteSpace(params.space_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '删除空间') }], isError: true }; }
  });

  server.tool('pingcode_get_space_pages', '获取空间下的页面列表', {
    space_id: z.string(), page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.getSpacePages(params.space_id, params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取页面列表') }], isError: true }; }
  });

  server.tool('pingcode_create_page', '创建 Wiki 页面', {
    space_id: z.string(), name: z.string(), content: z.string(),
    format_type: z.string().default('text'), parent_id: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.createPage({ spaceId: params.space_id, name: params.name, content: params.content, formatType: params.format_type, parentId: params.parent_id });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '创建页面') }], isError: true }; }
  });

  server.tool('pingcode_get_page', '获取页面详情', {
    page_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.getPage(params.page_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取页面详情') }], isError: true }; }
  });

  server.tool('pingcode_get_page_content', '获取页面内容', {
    page_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.getPageContent(params.page_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取页面内容') }], isError: true }; }
  });

  server.tool('pingcode_update_page_content', '更新页面内容', {
    page_id: z.string(), content: z.string(), format_type: z.string().default('text'),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.updatePageContent(params.page_id, params.content, params.format_type);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '更新页面内容') }], isError: true }; }
  });

  server.tool('pingcode_get_page_versions', '获取页面版本列表', {
    page_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.getPageVersions(params.page_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取页面版本列表') }], isError: true }; }
  });

  // 空间成员
  server.tool('pingcode_add_space_member', '添加空间成员', {
    space_id: z.string(), user_id: z.string(), role: z.string().default('member'),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.addSpaceMember(params.space_id, params.user_id, params.role);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '添加空间成员') }], isError: true }; }
  });

  server.tool('pingcode_get_space_members', '获取空间成员列表', {
    space_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.getSpaceMembers(params.space_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取空间成员列表') }], isError: true }; }
  });

  server.tool('pingcode_remove_space_member', '移除空间成员', {
    space_id: z.string(), member_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().wiki.removeSpaceMember(params.space_id, params.member_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '移除空间成员') }], isError: true }; }
  });
}

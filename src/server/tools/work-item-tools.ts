import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PingCodeClient } from '../../client/index.js';
import { z } from 'zod';
import { formatResponse, formatErrorMessage } from '../format.js';

export function registerWorkItemTools(server: McpServer, getClient: () => PingCodeClient) {
  server.tool('pingcode_list_work_items', '获取工作项列表', {
    project_ids: z.string().optional(), keywords: z.string().optional(),
    assignee_ids: z.string().optional(), priority_ids: z.string().optional(),
    sprint_ids: z.string().optional(),
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.listWorkItems({
        projectIds: params.project_ids, keywords: params.keywords,
        assigneeIds: params.assignee_ids, priorityIds: params.priority_ids,
        sprintIds: params.sprint_ids, pageIndex: params.page_index, pageSize: params.page_size,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项列表') }], isError: true }; }
  });

  server.tool('pingcode_get_work_item', '获取单个工作项详情', {
    work_item_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.getWorkItem(params.work_item_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项详情') }], isError: true }; }
  });

  server.tool('pingcode_create_work_item', '创建工作项', {
    project_id: z.string(), title: z.string(), type_id: z.string(),
    description: z.string().optional(), assignee_id: z.string().optional(),
    state_id: z.string().optional(), priority_id: z.string().optional(),
    parent_id: z.string().optional(), sprint_id: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.createWorkItem({
        projectId: params.project_id, title: params.title, typeId: params.type_id,
        description: params.description, assigneeId: params.assignee_id,
        stateId: params.state_id, priorityId: params.priority_id,
        parentId: params.parent_id, sprintId: params.sprint_id,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '创建工作项') }], isError: true }; }
  });

  server.tool('pingcode_update_work_item', '更新工作项', {
    work_item_id: z.string(), title: z.string().optional(), description: z.string().optional(),
    assignee_id: z.string().optional(), state_id: z.string().optional(), priority_id: z.string().optional(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.updateWorkItem(params.work_item_id, {
        title: params.title, description: params.description,
        assigneeId: params.assignee_id, stateId: params.state_id, priorityId: params.priority_id,
      });
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '更新工作项') }], isError: true }; }
  });

  server.tool('pingcode_delete_work_item', '删除工作项', {
    work_item_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.deleteWorkItem(params.work_item_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '删除工作项') }], isError: true }; }
  });

  server.tool('pingcode_search_work_items', '搜索工作项', {
    keyword: z.string(), project_ids: z.string().optional(),
    page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.searchWorkItems(params.keyword, params.project_ids, params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '搜索工作项') }], isError: true }; }
  });

  server.tool('pingcode_get_work_item_types', '获取工作项类型列表', {
    project_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.getWorkItemTypes(params.project_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项类型列表') }], isError: true }; }
  });

  server.tool('pingcode_get_work_item_statuses', '获取工作项状态列表', {
    project_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.getWorkItemStatuses(params.project_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项状态列表') }], isError: true }; }
  });

  server.tool('pingcode_get_work_item_priorities', '获取工作项优先级列表', {
    project_id: z.string(), response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.getWorkItemPriorities(params.project_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项优先级列表') }], isError: true }; }
  });

  server.tool('pingcode_list_work_item_tags', '获取工作项标签列表', {
    work_item_id: z.string(), page_index: z.number().int().min(0).default(0),
    page_size: z.number().int().min(1).max(100).default(30),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.listWorkItemTags(params.work_item_id, params.page_index, params.page_size);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项标签列表') }], isError: true }; }
  });

  server.tool('pingcode_add_work_item_tag', '添加标签到工作项', {
    work_item_id: z.string(), tag_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.addWorkItemTag(params.work_item_id, params.tag_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '添加标签到工作项') }], isError: true }; }
  });

  server.tool('pingcode_remove_work_item_tag', '从工作项移除标签', {
    work_item_id: z.string(), tag_id: z.string(),
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.removeWorkItemTag(params.work_item_id, params.tag_id);
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '从工作项移除标签') }], isError: true }; }
  });

  server.tool('pingcode_get_work_item_relation_types', '获取工作项关系类型列表', {
    response_format: z.enum(['json', 'markdown']).default('markdown'),
  }, async (params) => {
    try {
      const data = await getClient().workItems.getWorkItemRelationTypes();
      return { content: [{ type: 'text', text: String(formatResponse(data, params.response_format)) }] };
    } catch (e) { return { content: [{ type: 'text', text: formatErrorMessage(e, '获取工作项关系类型列表') }], isError: true }; }
  });
}

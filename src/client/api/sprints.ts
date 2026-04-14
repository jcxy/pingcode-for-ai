/**
 * PingCode 迭代（Sprint）相关 API
 */

import type { PingCodeClient } from '../client.js';
import type { ListSprintsOptions, CreateSprintOptions, UpdateSprintOptions, PaginatedResponse } from '../types.js';

export class SprintsAPI {
  constructor(private client: PingCodeClient) {}

  async listSprints(options: ListSprintsOptions): Promise<PaginatedResponse> {
    const params: Record<string, any> = {
      page_index: options.pageIndex ?? 0,
      page_size: Math.min(options.pageSize ?? 30, 100),
    };
    if (options.name) params.name = options.name;
    if (options.status) params.status = options.status;
    if (options.createdBetween) params.created_between = options.createdBetween;
    if (options.updatedBetween) params.updated_between = options.updatedBetween;
    return this.client.get(`/v1/project/projects/${options.projectId}/sprints`, params);
  }

  async getSprint(projectId: string, sprintId: string): Promise<any> {
    return this.client.get(`/v1/project/projects/${projectId}/sprints/${sprintId}`);
  }

  async createSprint(options: CreateSprintOptions): Promise<any> {
    const data: Record<string, any> = {
      name: options.name,
      start_at: options.startAt,
      end_at: options.endAt,
      assignee_id: options.assigneeId,
    };
    if (options.description !== undefined) data.description = options.description;
    if (options.status !== undefined) data.status = options.status;
    if (options.categoryIds !== undefined) data.category_ids = options.categoryIds;
    return this.client.post(`/v1/project/projects/${options.projectId}/sprints`, data);
  }

  async updateSprint(projectId: string, sprintId: string, options: UpdateSprintOptions): Promise<any> {
    const data: Record<string, any> = {};
    if (options.name !== undefined) data.name = options.name;
    if (options.startAt !== undefined) data.start_at = options.startAt;
    if (options.endAt !== undefined) data.end_at = options.endAt;
    if (options.assigneeId !== undefined) data.assignee_id = options.assigneeId;
    if (options.description !== undefined) data.description = options.description;
    if (options.status !== undefined) data.status = options.status;
    if (options.categoryIds !== undefined) data.category_ids = options.categoryIds;
    return this.client.patch(`/v1/project/projects/${projectId}/sprints/${sprintId}`, data);
  }

  async deleteSprint(projectId: string, sprintId: string): Promise<any> {
    return this.client.delete(`/v1/project/projects/${projectId}/sprints/${sprintId}`);
  }
}

/**
 * PingCode 需求（Story）相关 API
 */

import type { PingCodeClient } from '../client.js';
import type { ListStoriesOptions, PaginatedResponse } from '../types.js';

export class StoriesAPI {
  constructor(private client: PingCodeClient) {}

  private resolveProductId(productId?: string): string {
    const pid = productId || this.client.productId;
    if (!pid) throw new Error('必须提供 productId');
    return pid;
  }

  async listStories(options: ListStoriesOptions = {}): Promise<PaginatedResponse> {
    const pid = this.resolveProductId(options.productId);
    const params: Record<string, any> = {
      page_index: options.pageIndex ?? 0,
      page_size: Math.min(options.pageSize ?? 30, 100),
    };
    if (options.storyType) params.type_id = options.storyType;
    if (options.statusId) params.status_id = options.statusId;
    if (options.priority) params.priority = options.priority;
    if (options.query) params.query = options.query;
    return this.client.get(`/v1/scm/products/${pid}/stories`, params);
  }

  async getStory(storyId: string, productId?: string): Promise<any> {
    const pid = this.resolveProductId(productId);
    return this.client.get(`/v1/scm/products/${pid}/stories/${storyId}`);
  }

  async searchStories(keyword: string, productId?: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.listStories({ productId, query: keyword, pageIndex, pageSize });
  }

  async getStoryTypes(productId?: string): Promise<any[]> {
    const pid = this.resolveProductId(productId);
    const result = await this.client.get(`/v1/scm/products/${pid}/story_types`);
    return result.values ?? [];
  }

  async getStoryStatuses(productId?: string): Promise<any[]> {
    const pid = this.resolveProductId(productId);
    const result = await this.client.get(`/v1/scm/products/${pid}/story_statuses`);
    return result.values ?? [];
  }

  async getStoryPriorities(productId?: string): Promise<any[]> {
    const pid = this.resolveProductId(productId);
    const result = await this.client.get(`/v1/scm/products/${pid}/story_priorities`);
    return result.values ?? [];
  }
}

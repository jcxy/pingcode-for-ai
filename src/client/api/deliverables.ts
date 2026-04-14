/**
 * PingCode 交付目标（Deliverables）相关 API
 */

import type { PingCodeClient } from '../client.js';
import type { CreateDeliverableOptions, UpdateDeliverableOptions, PaginatedResponse } from '../types.js';

export class DeliverablesAPI {
  constructor(private client: PingCodeClient) {}

  async createDeliverable(options: CreateDeliverableOptions): Promise<any> {
    return this.client.post('/v1/project/deliverables', {
      work_item_id: options.workItemId,
      name: options.name,
      content_type: options.contentType,
      content: options.content,
    });
  }

  async updateDeliverable(deliverableId: string, options: UpdateDeliverableOptions): Promise<any> {
    const data: Record<string, any> = {};
    if (options.workItemId) data.work_item_id = options.workItemId;
    if (options.name) data.name = options.name;
    if (options.contentType) data.content_type = options.contentType;
    if (options.content) data.content = options.content;
    return this.client.patch(`/v1/project/deliverables/${deliverableId}`, data);
  }

  async deleteDeliverable(deliverableId: string): Promise<any> {
    return this.client.delete(`/v1/project/deliverables/${deliverableId}`);
  }

  async listDeliverables(workItemId: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.client.get(`/v1/project/work_items/${workItemId}/deliverables`, {
      page_index: pageIndex, page_size: Math.min(pageSize, 100),
    });
  }
}

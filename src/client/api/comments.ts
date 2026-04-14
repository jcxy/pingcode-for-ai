/**
 * PingCode 评论相关 API
 */

import type { PingCodeClient } from '../client.js';
import type { CreateCommentOptions, PaginatedResponse } from '../types.js';

export class CommentsAPI {
  constructor(private client: PingCodeClient) {}

  async listComments(principalType: string, principalId?: string, reviewId?: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    const params: Record<string, any> = {
      principal_type: principalType,
      page_index: pageIndex,
      page_size: Math.min(pageSize, 100),
    };
    if (principalId) params.principal_id = principalId;
    if (reviewId) params.review_id = reviewId;
    return this.client.get('/v1/comments', params);
  }

  async createComment(options: CreateCommentOptions): Promise<any> {
    const data: Record<string, any> = {
      principal_type: options.principalType,
      content: options.content,
    };
    if (options.principalId) data.principal_id = options.principalId;
    if (options.reviewId) data.review_id = options.reviewId;
    if (options.createdAt) data.created_at = options.createdAt;
    if (options.createdBy) data.created_by = options.createdBy;
    return this.client.post('/v1/comments', data);
  }
}

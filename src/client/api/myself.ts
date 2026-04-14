/**
 * PingCode 个人信息相关 API
 */

import type { PingCodeClient } from '../client.js';

export class MyselfAPI {
  constructor(private client: PingCodeClient) {}

  async getMyself(): Promise<any> {
    return this.client.get('/v1/myself');
  }
}

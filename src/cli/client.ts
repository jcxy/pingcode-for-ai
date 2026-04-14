/**
 * CLI 单例 PingCodeClient 访问器
 */

import { PingCodeClient } from '../client/index.js';

let _client: PingCodeClient | null = null;

export async function getClient(): Promise<PingCodeClient> {
  if (!_client) {
    _client = new PingCodeClient();
    await _client.initSubApis();
  }
  return _client;
}

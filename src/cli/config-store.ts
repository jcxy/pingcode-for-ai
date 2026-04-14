/**
 * 全局配置管理器
 *
 * 配置文件存储在 ~/.pingcode/config.json
 * 用于存储 API 地址、客户端凭证等信息，让用户无需手动编辑 .env
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface GlobalConfig {
  apiRoot?: string;
  authMode?: 'client' | 'user';
  clientId?: string;
  clientSecret?: string;
  userClientId?: string;
  userClientSecret?: string;
  orgId?: string;
  productId?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.pingcode');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function loadGlobalConfig(): GlobalConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return {};
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveGlobalConfig(config: GlobalConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getGlobalConfigPath(): string {
  return CONFIG_FILE;
}

/**
 * 将全局配置注入到 process.env 中（仅填充未设置的变量）
 * 优先级：环境变量 / .env > 全局配置
 */
export function applyGlobalConfigToEnv(): void {
  const config = loadGlobalConfig();

  // 设置全局 token 文件路径（如果未指定）
  if (!process.env.PINGCODE_TOKEN_FILE) {
    process.env.PINGCODE_TOKEN_FILE = path.join(CONFIG_DIR, 'token.json');
  }

  const mapping: [keyof GlobalConfig, string][] = [
    ['apiRoot', 'PINGCODE_API_ROOT'],
    ['authMode', 'PINGCODE_AUTH_MODE'],
    ['clientId', 'PINGCODE_CLIENT_ID'],
    ['clientSecret', 'PINGCODE_CLIENT_SECRET'],
    ['userClientId', 'PINGCODE_USER_CLIENT_ID'],
    ['userClientSecret', 'PINGCODE_USER_CLIENT_SECRET'],
    ['orgId', 'PINGCODE_ORG_ID'],
    ['productId', 'PINGCODE_PRODUCT_ID'],
  ];
  for (const [key, envKey] of mapping) {
    if (config[key] && !process.env[envKey]) {
      process.env[envKey] = config[key] as string;
    }
  }
}

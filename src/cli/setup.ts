/**
 * 首次使用引导 & 授权检查
 *
 * 在 CLI 启动时检查是否已完成配置和授权，
 * 未完成则交互式引导用户完成。
 */

import readline from 'node:readline';
import path from 'node:path';
import os from 'node:os';
import { PingCodeAuth, TokenStore } from '../client/index.js';
import { loadGlobalConfig, saveGlobalConfig, getGlobalConfigPath } from './config-store.js';

const GLOBAL_TOKEN_FILE = path.join(os.homedir(), '.pingcode', 'token.json');

export function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * 选择菜单：让用户输入数字选择
 */
async function promptChoice(question: string, choices: string[]): Promise<number> {
  console.log(question);
  choices.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  const answer = await prompt('\n请输入选项编号: ');
  const num = parseInt(answer, 10);
  if (isNaN(num) || num < 1 || num > choices.length) {
    console.log('无效选项，请重新选择\n');
    return promptChoice(question, choices);
  }
  return num;
}

/**
 * 检查是否有有效的令牌
 * 会同时验证令牌的 auth_mode 与当前配置的 authMode 是否匹配
 */
function hasValidToken(): boolean {
  const store = new TokenStore(GLOBAL_TOKEN_FILE);
  const data = store.load();
  if (!data || !data.access_token) return false;
  // 检查是否过期（提前 1 天判定为过期）
  if (data.expires_at && Date.now() / 1000 >= data.expires_at - 86400) return false;
  // 检查 auth_mode 是否与当前配置匹配（与 PingCodeAuth._loadTokens 逻辑一致）
  const config = loadGlobalConfig();
  const currentMode = config.authMode || (process.env.PINGCODE_AUTH_MODE as string) || 'client';
  if (data.auth_mode && data.auth_mode !== currentMode) return false;
  return true;
}

/**
 * 检查是否有凭证配置（全局配置或环境变量）
 */
function hasCredentials(): { hasClient: boolean; hasUser: boolean } {
  const config = loadGlobalConfig();
  return {
    hasClient: !!(config.clientId || process.env.PINGCODE_CLIENT_ID),
    hasUser: !!(config.userClientId || process.env.PINGCODE_USER_CLIENT_ID),
  };
}

/**
 * 引导用户配置 API 地址（如果尚未配置）
 */
async function ensureApiRoot(): Promise<void> {
  const config = loadGlobalConfig();
  if (config.apiRoot || process.env.PINGCODE_API_ROOT) return;

  console.log('');
  const apiRoot = await prompt('请输入 PingCode API 地址 (直接回车使用默认 https://open.pingcode.com): ');
  if (apiRoot) {
    config.apiRoot = apiRoot;
    saveGlobalConfig(config);
    process.env.PINGCODE_API_ROOT = apiRoot;
  }
}

/**
 * 客户端凭证模式引导
 */
async function setupClientCredentials(): Promise<void> {
  const config = loadGlobalConfig();

  if (!config.clientId && !process.env.PINGCODE_CLIENT_ID) {
    console.log('\n请输入客户端凭证信息：\n');
    const clientId = await prompt('Client ID: ');
    const clientSecret = await prompt('Client Secret: ');
    if (!clientId || !clientSecret) {
      console.error('Client ID 和 Client Secret 不能为空');
      process.exit(1);
    }
    config.authMode = 'client';
    config.clientId = clientId;
    config.clientSecret = clientSecret;
    saveGlobalConfig(config);
    process.env.PINGCODE_CLIENT_ID = clientId;
    process.env.PINGCODE_CLIENT_SECRET = clientSecret;
    console.log(`\n配置已保存到 ${getGlobalConfigPath()}`);
  }

  console.log('\n正在获取令牌...');
  const auth = new PingCodeAuth({ authMode: 'client', tokenFile: GLOBAL_TOKEN_FILE });
  await auth.getClientToken();
  console.log('客户端令牌获取成功 ✓\n');
}

/**
 * 授权码模式引导
 */
async function setupAuthorizationCode(): Promise<void> {
  const config = loadGlobalConfig();

  if (!config.userClientId && !process.env.PINGCODE_USER_CLIENT_ID) {
    console.log('\n请输入授权码模式的凭证信息：\n');
    const userClientId = await prompt('User Client ID: ');
    const userClientSecret = await prompt('User Client Secret: ');
    if (!userClientId || !userClientSecret) {
      console.error('Client ID 和 Client Secret 不能为空');
      process.exit(1);
    }
    config.authMode = 'user';
    config.userClientId = userClientId;
    config.userClientSecret = userClientSecret;
    saveGlobalConfig(config);
    process.env.PINGCODE_USER_CLIENT_ID = userClientId;
    process.env.PINGCODE_USER_CLIENT_SECRET = userClientSecret;
    console.log(`\n配置已保存到 ${getGlobalConfigPath()}`);
  }

  const auth = new PingCodeAuth({ authMode: 'user', tokenFile: GLOBAL_TOKEN_FILE });
  const url = auth.getAuthorizeUrl();
  console.log(`\n请在浏览器中打开以下链接完成授权：\n  ${url}\n`);
  const code = await prompt('请输入授权码: ');
  if (!code) {
    console.error('授权码不能为空');
    process.exit(1);
  }
  await auth.getUserToken(code);
  console.log('用户令牌获取成功 ✓\n');
}

/**
 * CLI 启动时的授权检查入口
 *
 * 如果已有有效令牌，直接跳过。
 * 否则引导用户选择认证模式并完成授权。
 */
export async function ensureAuthorized(): Promise<void> {
  if (hasValidToken()) return;

  console.log('╔══════════════════════════════════════╗');
  console.log('║     欢迎使用 PingCode CLI 工具       ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('\n检测到尚未授权，需要先完成认证配置。\n');

  // 先确保 API 地址已配置
  await ensureApiRoot();

  // 让用户选择认证模式
  const choice = await promptChoice('请选择认证方式：', [
    '客户端凭证模式 — 使用 Client ID / Secret 直接获取令牌（推荐）',
    '授权码模式 — 通过浏览器授权获取用户级令牌',
  ]);

  if (choice === 1) {
    await setupClientCredentials();
  } else {
    await setupAuthorizationCode();
  }
}

/**
 * 交互式引导入口（用户直接输入 pingcode-cli 不带参数时调用）
 *
 * 与 ensureAuthorized 不同：
 * - 始终显示欢迎信息和当前配置状态
 * - 已配置的项跳过，未配置的项引导配置
 * - 已有有效令牌时提示当前状态，询问是否重新配置
 */
export async function interactiveSetup(): Promise<void> {
  console.log('╔══════════════════════════════════════╗');
  console.log('║     欢迎使用 PingCode CLI 工具       ║');
  console.log('╚══════════════════════════════════════╝');

  const config = loadGlobalConfig();
  const tokenValid = hasValidToken();
  const creds = hasCredentials();

  // 显示当前配置状态
  console.log('\n当前配置状态：');
  const apiRoot = config.apiRoot || process.env.PINGCODE_API_ROOT;
  console.log(`  API 地址:   ${apiRoot ? `${apiRoot} ✓` : '未配置'}`);
  console.log(`  客户端凭证: ${creds.hasClient ? '已配置 ✓' : '未配置'}`);
  console.log(`  用户凭证:   ${creds.hasUser ? '已配置 ✓' : '未配置'}`);
  console.log(`  认证令牌:   ${tokenValid ? '有效 ✓' : '无效或未获取'}`);

  // 如果已经完全配置好，询问是否重新配置
  if (tokenValid) {
    console.log('\n当前认证状态正常，可以直接使用 CLI 命令。');
    console.log('运行 pingcode-cli --help 查看可用命令。\n');
    const answer = await prompt('是否要重新配置？(y/N): ');
    if (answer.toLowerCase() !== 'y') {
      return;
    }
    console.log('');
  } else {
    console.log('');
  }

  // 引导 API 地址配置（已配置则跳过）
  await ensureApiRoot();

  // 选择认证方式
  const choice = await promptChoice('请选择认证方式：', [
    '客户端凭证模式 — 使用 Client ID / Secret 直接获取令牌（推荐）',
    '授权码模式 — 通过浏览器授权获取用户级令牌',
  ]);

  if (choice === 1) {
    await setupClientCredentials();
  } else {
    await setupAuthorizationCode();
  }

  console.log('配置完成！运行 pingcode-cli --help 查看可用命令。');
}

export { GLOBAL_TOKEN_FILE };

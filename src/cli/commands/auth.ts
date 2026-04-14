import { Command } from 'commander';
import readline from 'node:readline';
import path from 'node:path';
import os from 'node:os';
import { PingCodeAuth, TokenStore } from '../../client/index.js';
import { loadGlobalConfig, saveGlobalConfig, getGlobalConfigPath } from '../config-store.js';

const GLOBAL_TOKEN_FILE = path.join(os.homedir(), '.pingcode', 'token.json');

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export const authCommand = new Command('auth').description('认证管理');

authCommand
  .command('login')
  .description('登录 PingCode')
  .option('--mode <mode>', '认证模式 (client/user)', 'client')
  .option('--code <code>', '授权码（user 模式）')
  .action(async (opts) => {
    try {
      const config = loadGlobalConfig();

      if (opts.mode === 'user') {
        // 授权码模式：检查 userClientId / userClientSecret
        if (!config.userClientId && !process.env.PINGCODE_USER_CLIENT_ID) {
          console.log('首次使用授权码模式，需要配置凭证信息：\n');
          const apiRoot = await prompt(`PingCode API 地址 (${config.apiRoot || 'https://open.pingcode.com'}): `);
          const userClientId = await prompt('User Client ID: ');
          const userClientSecret = await prompt('User Client Secret: ');
          if (!userClientId || !userClientSecret) {
            console.error('Client ID 和 Client Secret 不能为空');
            process.exit(1);
          }
          if (apiRoot) config.apiRoot = apiRoot;
          config.authMode = 'user';
          config.userClientId = userClientId;
          config.userClientSecret = userClientSecret;
          saveGlobalConfig(config);
          console.log(`\n配置已保存到 ${getGlobalConfigPath()}\n`);
          // 注入到环境变量
          process.env.PINGCODE_USER_CLIENT_ID = userClientId;
          process.env.PINGCODE_USER_CLIENT_SECRET = userClientSecret;
          if (apiRoot) process.env.PINGCODE_API_ROOT = apiRoot;
        }

        const auth = new PingCodeAuth({ authMode: 'user', tokenFile: GLOBAL_TOKEN_FILE });
        if (!opts.code) {
          const url = auth.getAuthorizeUrl();
          console.log(`请在浏览器中打开以下链接完成授权：\n  ${url}\n\n获取授权码后运行：\n  pingcode-for-ai auth login --mode user --code <授权码>`);
          return;
        }
        await auth.getUserToken(opts.code);
        console.log('用户令牌获取成功');
      } else {
        // 客户端凭证模式：检查 clientId / clientSecret
        if (!config.clientId && !process.env.PINGCODE_CLIENT_ID) {
          console.log('首次使用，需要配置 PingCode 凭证信息：\n');
          const apiRoot = await prompt(`PingCode API 地址 (${config.apiRoot || 'https://open.pingcode.com'}): `);
          const clientId = await prompt('Client ID: ');
          const clientSecret = await prompt('Client Secret: ');
          if (!clientId || !clientSecret) {
            console.error('Client ID 和 Client Secret 不能为空');
            process.exit(1);
          }
          if (apiRoot) config.apiRoot = apiRoot;
          config.authMode = 'client';
          config.clientId = clientId;
          config.clientSecret = clientSecret;
          saveGlobalConfig(config);
          console.log(`\n配置已保存到 ${getGlobalConfigPath()}\n`);
          // 注入到环境变量
          process.env.PINGCODE_CLIENT_ID = clientId;
          process.env.PINGCODE_CLIENT_SECRET = clientSecret;
          if (apiRoot) process.env.PINGCODE_API_ROOT = apiRoot;
        }

        const auth = new PingCodeAuth({ authMode: 'client', tokenFile: GLOBAL_TOKEN_FILE });
        await auth.getClientToken();
        console.log('客户端令牌获取成功');
      }
    } catch (e: any) { console.error(`登录失败: ${e.message}`); process.exit(1); }
  });

authCommand
  .command('status')
  .description('查看认证状态')
  .action(() => {
    const store = new TokenStore(GLOBAL_TOKEN_FILE);
    const data = store.load();
    if (!data) { console.log('未找到令牌文件'); return; }
    console.log(`认证模式: ${data.auth_mode}`);
    console.log(`令牌: ${data.access_token.slice(0, 10)}...`);
    if (data.expires_at) console.log(`过期时间: ${new Date(data.expires_at * 1000).toLocaleString()}`);
  });

authCommand
  .command('logout')
  .description('清除认证信息')
  .action(() => {
    const store = new TokenStore(GLOBAL_TOKEN_FILE);
    store.clear();
    console.log('已清除认证信息');
  });

authCommand
  .command('config')
  .description('查看或重置配置')
  .option('--reset', '重置全局配置')
  .action((opts) => {
    if (opts.reset) {
      saveGlobalConfig({});
      console.log('全局配置已重置');
      return;
    }
    const config = loadGlobalConfig();
    const configPath = getGlobalConfigPath();
    if (Object.keys(config).length === 0) {
      console.log(`未找到全局配置（${configPath}）`);
      console.log('运行 pingcode-for-ai auth login 会自动引导配置');
      return;
    }
    console.log(`配置文件: ${configPath}\n`);
    console.log(`API 地址: ${config.apiRoot || '(默认) https://open.pingcode.com'}`);
    console.log(`认证模式: ${config.authMode || '(未设置)'}`);
    if (config.clientId) console.log(`Client ID: ${config.clientId.slice(0, 8)}...`);
    if (config.userClientId) console.log(`User Client ID: ${config.userClientId.slice(0, 8)}...`);
  });

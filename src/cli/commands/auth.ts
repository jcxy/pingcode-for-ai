import { Command } from 'commander';
import { PingCodeAuth, TokenStore } from '../../client/index.js';
import { loadGlobalConfig, saveGlobalConfig, getGlobalConfigPath } from '../config-store.js';
import { ensureAuthorized, prompt, GLOBAL_TOKEN_FILE } from '../setup.js';

export const authCommand = new Command('auth').description('认证管理');

authCommand
  .command('login')
  .description('登录 PingCode（交互式引导）')
  .option('--mode <mode>', '认证模式 (client/user)')
  .option('--code <code>', '授权码（user 模式直接传入）')
  .action(async (opts) => {
    try {
      // 如果指定了 --mode 和 --code，走快捷路径（适合脚本调用）
      if (opts.mode === 'user' && opts.code) {
        const auth = new PingCodeAuth({ authMode: 'user', tokenFile: GLOBAL_TOKEN_FILE });
        await auth.getUserToken(opts.code);
        console.log('用户令牌获取成功 ✓');
        return;
      }

      // 否则走交互式引导
      await ensureAuthorized();
    } catch (e: any) { console.error(`登录失败: ${e.message}`); process.exit(1); }
  });

authCommand
  .command('status')
  .description('查看认证状态')
  .action(() => {
    const config = loadGlobalConfig();
    const store = new TokenStore(GLOBAL_TOKEN_FILE);
    const data = store.load();

    console.log(`配置文件: ${getGlobalConfigPath()}`);
    console.log(`API 地址: ${config.apiRoot || 'https://open.pingcode.com'}`);
    console.log('');

    if (!data) {
      console.log('认证状态: 未登录');
      console.log('\n运行 pingcode-cli auth login 进行登录');
      return;
    }
    console.log(`认证模式: ${data.auth_mode === 'client' ? '客户端凭证' : '授权码'}`);
    console.log(`令牌: ${data.access_token.slice(0, 10)}...`);
    if (data.expires_at) {
      const expDate = new Date(data.expires_at * 1000);
      const isExpired = Date.now() / 1000 >= data.expires_at - 86400;
      console.log(`过期时间: ${expDate.toLocaleString()}${isExpired ? ' (已过期)' : ''}`);
    }
  });

authCommand
  .command('logout')
  .description('清除认证信息（保留配置）')
  .action(() => {
    const store = new TokenStore(GLOBAL_TOKEN_FILE);
    store.clear();
    console.log('已清除认证信息');
    console.log('配置信息已保留，运行 pingcode-cli auth login 可重新登录');
  });

authCommand
  .command('config')
  .description('查看或修改配置')
  .option('--reset', '重置全局配置（清除所有凭证和设置）')
  .option('--set-api-root <url>', '修改 API 地址')
  .action(async (opts) => {
    if (opts.reset) {
      const answer = await prompt('确认重置全局配置？这将清除所有凭证信息 (y/N): ');
      if (answer.toLowerCase() !== 'y') {
        console.log('已取消');
        return;
      }
      saveGlobalConfig({});
      const store = new TokenStore(GLOBAL_TOKEN_FILE);
      store.clear();
      console.log('全局配置和令牌已重置');
      return;
    }

    if (opts.setApiRoot) {
      const config = loadGlobalConfig();
      config.apiRoot = opts.setApiRoot.replace(/\/+$/, '');
      saveGlobalConfig(config);
      console.log(`API 地址已更新为: ${config.apiRoot}`);
      return;
    }

    // 默认：显示当前配置
    const config = loadGlobalConfig();
    const configPath = getGlobalConfigPath();
    if (Object.keys(config).length === 0) {
      console.log(`未找到全局配置（${configPath}）`);
      console.log('运行 pingcode-cli auth login 会自动引导配置');
      return;
    }
    console.log(`配置文件: ${configPath}\n`);
    console.log(`API 地址: ${config.apiRoot || '(默认) https://open.pingcode.com'}`);
    console.log(`认证模式: ${config.authMode === 'client' ? '客户端凭证' : config.authMode === 'user' ? '授权码' : '(未设置)'}`);
    if (config.clientId) console.log(`Client ID: ${config.clientId.slice(0, 8)}...`);
    if (config.clientSecret) console.log(`Client Secret: ${'*'.repeat(16)}`);
    if (config.userClientId) console.log(`User Client ID: ${config.userClientId.slice(0, 8)}...`);
    if (config.userClientSecret) console.log(`User Client Secret: ${'*'.repeat(16)}`);
    console.log('\n可用操作:');
    console.log('  pingcode-cli auth config --set-api-root <url>  修改 API 地址');
    console.log('  pingcode-cli auth config --reset               重置所有配置');
  });

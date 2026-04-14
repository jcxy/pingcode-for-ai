import { Command } from 'commander';
import { PingCodeAuth, TokenStore } from '../../client/index.js';

export const authCommand = new Command('auth').description('认证管理');

authCommand
  .command('login')
  .description('登录 PingCode')
  .option('--mode <mode>', '认证模式 (client/user)', 'client')
  .option('--code <code>', '授权码（user 模式）')
  .action(async (opts) => {
    try {
      const auth = new PingCodeAuth({ authMode: opts.mode });
      if (opts.mode === 'user') {
        if (!opts.code) {
          const url = auth.getAuthorizeUrl();
          console.log(`请在浏览器中打开以下链接完成授权：\n  ${url}\n\n获取授权码后运行：\n  pingcode-for-ai auth login --mode user --code <授权码>`);
          return;
        }
        await auth.getUserToken(opts.code);
        console.log('用户令牌获取成功');
      } else {
        await auth.getClientToken();
        console.log('客户端令牌获取成功');
      }
    } catch (e: any) { console.error(`登录失败: ${e.message}`); process.exit(1); }
  });

authCommand
  .command('status')
  .description('查看认证状态')
  .action(() => {
    const store = new TokenStore(process.env.PINGCODE_TOKEN_FILE || '.pingcode_token.json');
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
    const store = new TokenStore(process.env.PINGCODE_TOKEN_FILE || '.pingcode_token.json');
    store.clear();
    console.log('已清除认证信息');
  });

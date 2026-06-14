import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printKeyValue } from '../output.js';
import { AuthenticationError } from '../../client/errors.js';

export const userCommand = new Command('user').description('用户管理');

userCommand
  .command('me')
  .description('获取当前用户信息')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      // /v1/myself 端点需要用户令牌，客户端凭证（企业令牌）不支持此接口
      if (client.auth.authMode === 'client') {
        console.error('该命令需要用户级令牌（授权码模式），当前使用的是客户端凭证模式（企业令牌）。');
        console.error('请使用授权码模式登录以获取用户令牌：');
        console.error('  1. 运行 pingcode-cli auth login，选择「授权码模式」');
        console.error('  2. 或设置环境变量 PINGCODE_AUTH_MODE=user');
        process.exit(1);
      }
      const data = await client.myself.getMyself();
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

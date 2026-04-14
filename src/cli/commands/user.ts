import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printKeyValue } from '../output.js';

export const userCommand = new Command('user').description('用户管理');

userCommand
  .command('me')
  .description('获取当前用户信息')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.myself.getMyself();
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

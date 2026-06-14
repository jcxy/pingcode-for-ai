import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printTable, printKeyValue } from '../output.js';

export const requirementCommand = new Command('requirement').description('需求管理');

requirementCommand
  .command('list')
  .description('获取需求列表')
  .option('--product-id <id>', '产品 ID')
  .option('--story-type <id>', '需求类型 ID')
  .option('--status-id <id>', '状态 ID')
  .option('--priority <p>', '优先级')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.stories.listStories({
        productId: opts.productId,
        storyType: opts.storyType,
        statusId: opts.statusId,
        priority: opts.priority,
        pageIndex: Number(opts.pageIndex),
        pageSize: Number(opts.pageSize),
      });
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

requirementCommand
  .command('get <id>')
  .description('获取需求详情')
  .option('--product-id <id>', '产品 ID')
  .option('--format <format>', '输出格式', 'text')
  .action(async (id, opts) => {
    try {
      const client = await getClient();
      const data = await client.stories.getStory(id, opts.productId);
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

requirementCommand
  .command('search <keyword>')
  .description('搜索需求')
  .option('--product-id <id>', '产品 ID')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (keyword, opts) => {
    try {
      const client = await getClient();
      const data = await client.stories.searchStories(keyword, opts.productId, Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

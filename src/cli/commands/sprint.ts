import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printTable, printKeyValue } from '../output.js';

export const sprintCommand = new Command('sprint').description('迭代管理');

sprintCommand
  .command('list')
  .description('获取迭代列表')
  .requiredOption('--project-id <id>', '项目 ID')
  .option('--name <name>', '迭代名称')
  .option('--status <status>', '状态')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.sprints.listSprints({
        projectId: opts.projectId, name: opts.name, status: opts.status,
        pageIndex: Number(opts.pageIndex), pageSize: Number(opts.pageSize),
      });
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

sprintCommand
  .command('get <sprint-id>')
  .description('获取迭代详情')
  .requiredOption('--project-id <id>', '项目 ID')
  .option('--format <format>', '输出格式', 'text')
  .action(async (sprintId, opts) => {
    try {
      const client = await getClient();
      const data = await client.sprints.getSprint(opts.projectId, sprintId);
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

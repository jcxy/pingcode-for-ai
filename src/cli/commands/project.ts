import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printTable, printKeyValue } from '../output.js';

export const projectCommand = new Command('project').description('项目管理');

projectCommand
  .command('list')
  .description('获取项目列表')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.listProjects(Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

projectCommand
  .command('get <id>')
  .description('获取项目详情')
  .option('--format <format>', '输出格式', 'text')
  .action(async (id, opts) => {
    try {
      const client = await getClient();
      const data = await client.getProject(id);
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

projectCommand
  .command('members <project-id>')
  .description('获取项目成员列表')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (projectId, opts) => {
    try {
      const client = await getClient();
      const data = await client.listProjectMembers(projectId, Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

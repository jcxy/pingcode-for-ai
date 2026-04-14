#!/usr/bin/env node
/**
 * PingCode CLI 入口
 */

import { Command } from 'commander';
import { applyGlobalConfigToEnv } from './config-store.js';
import { authCommand } from './commands/auth.js';
import { userCommand } from './commands/user.js';
import { workItemCommand } from './commands/work-item.js';
import { sprintCommand } from './commands/sprint.js';
import { wikiCommand } from './commands/wiki.js';
import { projectCommand } from './commands/project.js';

// 将全局配置（~/.pingcode/config.json）注入环境变量
// 优先级：环境变量 / .env > 全局配置
applyGlobalConfigToEnv();

const program = new Command('pingcode-for-ai')
  .description('PingCode CLI - 命令行操作 PingCode')
  .version('0.1.0');

program.addCommand(authCommand);
program.addCommand(userCommand);
program.addCommand(workItemCommand);
program.addCommand(sprintCommand);
program.addCommand(wikiCommand);
program.addCommand(projectCommand);

program.parse();

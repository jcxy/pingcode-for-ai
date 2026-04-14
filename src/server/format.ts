/**
 * 响应格式化工具
 */

import type { ResponseFormat } from '../client/types.js';

export function formatResponse(data: any, format: ResponseFormat = 'markdown', includeMetadata = true): any {
  if (format === 'json') {
    return typeof data === 'object' && data !== null ? data : { data };
  }

  // Markdown 格式
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    if ('items' in data && Array.isArray(data.items)) {
      const items = data.items as Record<string, any>[];
      if (!items.length) return '无数据';
      const headers = Object.keys(items[0]);
      if (!headers.length) return '无数据';

      let md = '| ' + headers.join(' | ') + ' |\n';
      md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
      for (const item of items.slice(0, 20)) {
        const row = headers.map(h => {
          let v = String(item[h] ?? '');
          if (v.length > 50) v = v.slice(0, 47) + '...';
          return v;
        });
        md += '| ' + row.join(' | ') + ' |\n';
      }
      if (includeMetadata && 'total' in data) {
        md += `\n**共 ${data.total} 条记录**`;
        if (data.has_more) md += ` (还有更多，请使用 offset=${data.next_offset ?? 0} 继续获取)`;
      }
      return md;
    }
    // 单个对象
    return Object.entries(data)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => `- **${k}**: ${v}`)
      .join('\n');
  }

  if (Array.isArray(data)) {
    return data.length ? data.map(item => `- ${item}`).join('\n') : '无数据';
  }

  return String(data);
}

export function formatErrorMessage(error: Error | unknown, context: string): string {
  const msg = error instanceof Error ? error.message : String(error);

  if (msg.includes('未初始化') || msg.includes('未认证'))
    return `${context}失败: ${msg}\n\n请检查：\n1. PINGCODE_API_ROOT 环境变量是否正确\n2. access_token 是否有效\n3. 网络连接是否正常`;
  if (msg.includes('401') || msg.includes('认证失败'))
    return `${context}失败: 认证失败\n\n请检查：\n1. access_token 是否过期\n2. 重新运行授权流程获取新 token`;
  if (msg.includes('403') || msg.includes('权限'))
    return `${context}失败: 权限不足\n\n请检查：\n1. 当前用户是否有操作权限\n2. API 密钥是否具有相应权限`;
  if (msg.includes('404') || msg.includes('不存在'))
    return `${context}失败: 资源不存在\n\n请检查：\n1. 提供的 ID 是否正确\n2. 资源是否已被删除`;
  if (msg.includes('500') || msg.includes('服务器错误'))
    return `${context}失败: 服务器错误\n\n请稍后重试，如问题持续请联系 PingCode 支持`;

  return `${context}失败: ${msg}`;
}

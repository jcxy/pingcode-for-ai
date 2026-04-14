/**
 * CLI 输出格式化工具
 */

export function printJson(data: any): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(items: Record<string, any>[], columns?: string[]): void {
  if (!items.length) { console.log('无数据'); return; }
  const cols = columns || Object.keys(items[0]);
  const widths = cols.map(c => Math.max(c.length, ...items.map(i => String(i[c] ?? '').length)));

  const header = cols.map((c, i) => c.padEnd(widths[i])).join('  ');
  const sep = cols.map((_, i) => '-'.repeat(widths[i])).join('  ');
  console.log(header);
  console.log(sep);
  for (const item of items) {
    const row = cols.map((c, i) => String(item[c] ?? '').padEnd(widths[i])).join('  ');
    console.log(row);
  }
}

export function printKeyValue(data: Record<string, any>): void {
  for (const [k, v] of Object.entries(data)) {
    if (v !== null && v !== undefined) console.log(`${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
  }
}

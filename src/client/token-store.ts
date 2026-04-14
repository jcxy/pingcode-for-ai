/**
 * 令牌持久化存储
 */

import fs from 'node:fs';
import path from 'node:path';
import type { TokenData } from './types.js';

export class TokenStore {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  load(): TokenData | null {
    try {
      if (!fs.existsSync(this.filePath)) return null;
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw) as TokenData;
    } catch {
      return null;
    }
  }

  save(data: TokenData): void {
    const dir = path.dirname(path.resolve(this.filePath));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  clear(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        fs.unlinkSync(this.filePath);
      }
    } catch {
      // ignore
    }
  }
}

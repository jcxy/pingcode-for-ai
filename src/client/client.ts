/**
 * PingCode API 主客户端
 */

import 'dotenv/config';
import { PingCodeAuth } from './auth.js';
import { AuthenticationError, ApiError } from './errors.js';
import type { PingCodeClientOptions, PaginatedResponse } from './types.js';

export class PingCodeClient {
  readonly apiRoot: string;
  readonly orgId?: string;
  readonly productId?: string;
  readonly auth: PingCodeAuth;

  private _stories?: any;
  private _workItems?: any;
  private _sprints?: any;
  private _deliverables?: any;
  private _wiki?: any;
  private _myself?: any;
  private _comments?: any;

  constructor(options: PingCodeClientOptions = {}) {
    this.apiRoot = (options.apiRoot || process.env.PINGCODE_API_ROOT || 'https://open.pingcode.com').replace(/\/+$/, '');
    this.orgId = options.orgId || process.env.PINGCODE_ORG_ID;
    this.productId = options.productId || process.env.PINGCODE_PRODUCT_ID;
    this.auth = new PingCodeAuth({
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      apiRoot: this.apiRoot,
      code: options.code,
      refreshToken: options.refreshToken,
      authMode: options.authMode,
    });
  }

  // ============== 延迟加载子 API ==============
  // 子 API 在首次访问时通过动态 import 加载并缓存
  // 使用 any 类型避免循环依赖，实际类型在 index.ts 中导出

  private async _lazyLoad<T>(field: string, modulePath: string, className: string): Promise<T> {
    if ((this as any)[field]) return (this as any)[field];
    const mod = await import(modulePath);
    (this as any)[field] = new mod[className](this);
    return (this as any)[field];
  }

  // 同步 getter 使用缓存实例（需先调用对应 init 方法或直接使用 async 版本）
  // 为了保持与 Python 版本的 API 兼容性，提供同步 getter
  // 子 API 模块会在 initSubApis() 中预加载

  private _subApisLoaded = false;

  async initSubApis(): Promise<void> {
    if (this._subApisLoaded) return;
    const [stories, workItems, sprints, deliverables, wiki, myself, comments] = await Promise.all([
      import('./api/stories.js'),
      import('./api/work-items.js'),
      import('./api/sprints.js'),
      import('./api/deliverables.js'),
      import('./api/wiki.js'),
      import('./api/myself.js'),
      import('./api/comments.js'),
    ]);
    this._stories = new stories.StoriesAPI(this);
    this._workItems = new workItems.WorkItemsAPI(this);
    this._sprints = new sprints.SprintsAPI(this);
    this._deliverables = new deliverables.DeliverablesAPI(this);
    this._wiki = new wiki.WikiAPI(this);
    this._myself = new myself.MyselfAPI(this);
    this._comments = new comments.CommentsAPI(this);
    this._subApisLoaded = true;
  }

  get stories() { return this._stories!; }
  get workItems() { return this._workItems!; }
  get sprints() { return this._sprints!; }
  get deliverables() { return this._deliverables!; }
  get wiki() { return this._wiki!; }
  get myself() { return this._myself!; }
  get comments() { return this._comments!; }

  // ============== HTTP 方法 ==============

  private async _request<T = any>(method: string, endpoint: string, params?: Record<string, any>, jsonData?: Record<string, any>): Promise<T> {
    let url = `${this.apiRoot}${endpoint}`;
    if (params && Object.keys(params).length > 0) {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) qs.append(k, String(v));
      }
      url += `?${qs.toString()}`;
    }

    const headers = await this.auth.getHeaders();
    const init: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(30000),
    };
    if (jsonData && ['POST', 'PUT', 'PATCH'].includes(method)) {
      init.body = JSON.stringify(jsonData);
    }

    let res: Response;
    try {
      res = await fetch(url, init);
    } catch (err: any) {
      throw new ApiError(`网络请求失败: ${err.message}`, 0);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      if (res.status === 401 || res.status === 403) {
        const lower = text.toLowerCase();
        if (lower.includes('token') || lower.includes('unauthorized') || lower.includes('forbidden')) {
          throw new AuthenticationError(
            '认证失败：访问令牌无效或已过期\n\n请尝试以下步骤：\n1. 运行 \'pingcode-for-ai auth status\' 检查当前认证状态\n2. 运行 \'pingcode-for-ai auth login --mode client\' 重新获取企业令牌\n3. 或运行 \'pingcode-for-ai auth login --mode user\' 使用授权码模式登录'
          );
        }
      }
      throw new ApiError(`API 请求失败: HTTP ${res.status}`, res.status, text);
    }

    return res.json() as Promise<T>;
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this._request<T>('GET', endpoint, params);
  }

  async post<T = any>(endpoint: string, jsonData?: Record<string, any>): Promise<T> {
    return this._request<T>('POST', endpoint, undefined, jsonData);
  }

  async put<T = any>(endpoint: string, jsonData?: Record<string, any>): Promise<T> {
    return this._request<T>('PUT', endpoint, undefined, jsonData);
  }

  async patch<T = any>(endpoint: string, jsonData?: Record<string, any>): Promise<T> {
    return this._request<T>('PATCH', endpoint, undefined, jsonData);
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this._request<T>('DELETE', endpoint);
  }

  // ============== 顶层便捷方法 ==============

  private _clampPageSize(pageSize: number): number {
    return Math.min(pageSize, 100);
  }

  async listProducts(pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.get('/v1/scm/products', { page_index: pageIndex, page_size: this._clampPageSize(pageSize) });
  }

  async getProduct(productId: string): Promise<any> {
    return this.get(`/v1/scm/products/${productId}`);
  }

  async listProjects(pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.get('/v1/project/projects', { page_index: pageIndex, page_size: this._clampPageSize(pageSize) });
  }

  async getProject(projectId: string): Promise<any> {
    return this.get(`/v1/project/projects/${projectId}`);
  }

  async getProjectProperties(projectId: string): Promise<any> {
    return this.get(`/v1/project/projects/${projectId}/project_properties`);
  }

  async listProjectMembers(projectId: string, pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.get(`/v1/project/projects/${projectId}/members`, { page_index: pageIndex, page_size: this._clampPageSize(pageSize) });
  }

  async listEnterpriseUsers(pageIndex = 0, pageSize = 30): Promise<PaginatedResponse> {
    return this.get('/v1/directory/users', { page_index: pageIndex, page_size: this._clampPageSize(pageSize) });
  }

  async getUser(userId: string): Promise<any> {
    return this.get(`/v1/directory/users/${userId}`);
  }
}

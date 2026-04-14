# 认证模块

## 登录

```bash
pingcode-for-ai auth login [--mode <mode>] [--code <授权码>]
```

| 参数 | 说明 |
|------|------|
| `--mode <mode>` | 认证模式：`client`（默认）或 `user` |
| `--code <code>` | 授权码（user 模式必填） |

- `client` 模式：客户端凭证模式，直接获取令牌
- `user` 模式：授权码模式，需要 `--code` 参数

授权码模式步骤：
1. 运行 `pingcode-for-ai auth login --mode user`，获取授权链接
2. 在浏览器中打开链接并授权
3. 从回调 URL 中复制 code 参数
4. 运行 `pingcode-for-ai auth login --mode user --code <授权码>`

## 查看认证状态

```bash
pingcode-for-ai auth status
```

显示：认证模式、令牌摘要、过期时间。

## 登出

```bash
pingcode-for-ai auth logout
```

清除本地令牌文件。

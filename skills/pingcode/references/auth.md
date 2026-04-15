# 认证模块

## 登录

```bash
pingcode-cli auth login
```

首次运行会交互式引导：选择认证模式、输入凭证、自动获取令牌。

也可以直接指定模式：

```bash
pingcode-cli auth login --mode client
pingcode-cli auth login --mode user --code <授权码>
```

| 参数 | 说明 |
|------|------|
| `--mode <mode>` | 认证模式：`client`（默认）或 `user` |
| `--code <code>` | 授权码（user 模式） |

## 查看认证状态

```bash
pingcode-cli auth status
```

显示：API 地址、认证模式、令牌摘要、过期时间。

## 登出

```bash
pingcode-cli auth logout
```

清除令牌，保留配置信息。

## 查看/修改配置

```bash
pingcode-cli auth config                        # 查看当前配置
pingcode-cli auth config --set-api-root <url>   # 修改 API 地址
pingcode-cli auth config --reset                # 重置所有配置
```

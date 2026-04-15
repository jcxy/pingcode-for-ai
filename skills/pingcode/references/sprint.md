# 迭代模块

## 列出迭代

```bash
pingcode-cli sprint list --project-id <id> [选项]
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--project-id <id>` | 是 | 项目 ID |
| `--name <name>` | 否 | 迭代名称筛选 |
| `--status <状态>` | 否 | 状态筛选：`pending`、`in_progress`、`completed` |
| `--page-index <n>` | 否 | 页码，从 0 开始 |
| `--page-size <n>` | 否 | 每页数量，默认 30 |
| `--format json` | 否 | JSON 格式输出 |

## 获取迭代详情

```bash
pingcode-cli sprint get <sprint_id> --project-id <id> [--format json]
```

返回：ID、名称、状态、开始时间、结束时间、负责人、描述。

# PatchV1ProjectProject_propertiesProperty_id

## 基本信息

- **方法**: `PATCH`
- **路径**: `/v1/project/project_properties/{property_id}`
- **版本**: 1.0.0

## 权限要求

- 企业令牌/用户令牌

## 参数

### 路径参数

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| property_id | String | 是 | 项目属性的id。 |

### Parameter

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | String | 否 | 项目属性的名称。在一个企业中这个名称是唯一的。 |
| options | Object[] | 否 | 选择项列表。`options`是整体更新的。 |
| options._id | Sting | 否 | 选择项的`_id`。如果`option`中不包含用于确定唯一性的`_id`，那么这个`option`将被视为新建，并为之创建新的`_id`。 |
| options.text | String | 是 | 选择项内容。 |
| options.parent_id | String | 否 | 选择项父级id。当属性类型为`cascade_select,cascade_multi_select`时，`parent_id`参数有效，用于构建级联类型选择项之间的父子关系，最多存在4级。 |

## 成功响应

### 响应示例：

```json
{
  "id": "xiangmuguimo",
  "url": "https://rest_api_root/v1/project/project_properties/xiangmuguimo",
  "name": "项目规模",
  "type": "select",
  "options": [
    {
      "_id": "5efb1859110533727a82c605",
      "text": "大"
    },
    {
      "_id": "5efb1859110533727a82c606",
      "text": "小"
    }
  ],
  "is_removable": true,
  "is_name_editable": true,
  "is_options_editable": true
}
```


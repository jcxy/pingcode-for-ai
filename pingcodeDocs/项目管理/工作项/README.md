# 工作项

## API 列表

- [创建一个工作项](创建一个工作项.md) - `POST /v1/project/work_items`
- [部分更新一个工作项](部分更新一个工作项.md) - `PATCH /v1/project/work_items/{work_item_id}`
- [批量部分更新工作项属性](批量部分更新工作项属性.md) - `PATCH /v1/project/work_items`
- [删除一个工作项](删除一个工作项.md) - `DELETE /v1/project/work_items/{work_item_id}`
- [获取工作项列表](获取工作项列表.md) - `GET /v1/project/work_items`
- [获取工作项类型列表](获取工作项类型列表.md) - `GET /v1/project/work_item/types?project_id={project_id}`
- [获取工作项状态列表](获取工作项状态列表.md) - `GET /v1/project/work_item/states?project_id={project_id}&work_item_type_id={work_item_type_id}`
- [获取工作项属性列表](获取工作项属性列表.md) - `GET /v1/project/work_item/properties?project_id={project_id}&work_item_type_id={work_item_type_id}`
- [获取工作项优先级列表](获取工作项优先级列表.md) - `GET /v1/project/work_item/priorities?project_id={project_id}`
- [获取工作项标签列表](获取工作项标签列表.md) - `GET /v1/project/work_item/tags`
- [获取工作项流转记录列表](获取工作项流转记录列表.md) - `GET /v1/project/work_items/{work_item_id}/transition_histories`
- [获取工作项关联类型列表](获取工作项关联类型列表.md) - `GET /v1/project/work_item/relation_types`
- [关联一个工作项](关联一个工作项.md) - `POST /v1/project/work_items/{work_item_id}/relations`
- [取消关联一个工作项](取消关联一个工作项.md) - `DELETE /v1/project/work_items/{work_item_id}/relations/{relation_id}`
- [获取关联的工作项列表](获取关联的工作项列表.md) - `GET /v1/project/work_items/{work_item_id}/relations`
- [向工作项中添加一个标签](向工作项中添加一个标签.md) - `POST /v1/project/work_items/{work_item_id}/tags`
- [在工作项中移除一个标签](在工作项中移除一个标签.md) - `DELETE /v1/project/work_items/{work_item_id}/tags/{tag_id}`
- [获取工作项工时列表](获取工作项工时列表.md) - `GET /v1/project/workloads`
- [创建一个工作项工时](创建一个工作项工时.md) - `POST /v1/project/workloads`
- [部分更新一个工作项工时](部分更新一个工作项工时.md) - `PATCH /v1/project/workloads/{workload_id}`
- [删除一个工作项工时](删除一个工作项工时.md) - `DELETE /v1/project/workloads/{workload_id}`
- [获取工作项工时类型列表](获取工作项工时类型列表.md) - `GET /v1/project/workload_types`
- [创建一个工作项交付目标](创建一个工作项交付目标.md) - `POST /v1/project/deliverables`
- [部分更新一个工作项交付目标](部分更新一个工作项交付目标.md) - `PATCH /v1/project/deliverables/{deliverable_target_id}`
- [删除一个工作项交付目标](删除一个工作项交付目标.md) - `DELETE /v1/project/deliverables/{deliverable_target_id}`
- [获取工作项交付目标列表](获取工作项交付目标列表.md) - `GET /v1/project/deliverables`


# 工单配置

## API 列表

- [获取全部工单类型列表](获取全部工单类型列表.md) - `GET /v1/ship/ticket_types`
- [创建一个工单状态](创建一个工单状态.md) - `POST /v1/ship/ticket_states`
- [部分更新一个工单状态](部分更新一个工单状态.md) - `Patch /v1/ship/ticket_states/{ticket_state_id}`
- [获取全部工单状态列表](获取全部工单状态列表.md) - `GET /v1/ship/ticket_states`
- [获取工单状态方案列表](获取工单状态方案列表.md) - `GET /v1/ship/ticket_state_plans`
- [向状态方案中添加一个工单状态](向状态方案中添加一个工单状态.md) - `POST /v1/ship/ticket_state_plans/{state_plan_id}/ticket_states`
- [获取状态方案中的工单状态列表](获取状态方案中的工单状态列表.md) - `GET /v1/ship/ticket_state_plans/{state_plan_id}/ticket_states`
- [在状态方案中移除一个工单状态](在状态方案中移除一个工单状态.md) - `DELETE /v1/ship/ticket_state_plans/{state_plan_id}/ticket_states/{state_id}`
- [向状态方案中添加一个工单状态流转](向状态方案中添加一个工单状态流转.md) - `POST /v1/ship/ticket_state_plans/{state_plan_id}/ticket_state_flows`
- [获取状态方案中的工单状态流转列表](获取状态方案中的工单状态流转列表.md) - `GET /v1/ship/ticket_state_plans/{state_plan_id}/ticket_state_flows`
- [在状态方案中移除一个工单状态流转](在状态方案中移除一个工单状态流转.md) - `DELETE /v1/ship/ticket_state_plans/{state_plan_id}/ticket_state_flows/{state_flow_id}`
- [创建一个工单属性](创建一个工单属性.md) - `POST /v1/ship/ticket_properties`
- [部分更新一个工单属性](部分更新一个工单属性.md) - `PATCH /v1/ship/ticket_properties/{property_id}`
- [获取全部工单属性列表](获取全部工单属性列表.md) - `GET /v1/ship/ticket_properties`
- [获取工单属性方案列表](获取工单属性方案列表.md) - `GET /v1/ship/ticket_property_plans`
- [向工单属性方案中添加一个工单属性](向工单属性方案中添加一个工单属性.md) - `POST /v1/ship/ticket_property_plans/{property_plan_id}/ticket_properties`
- [获取工单属性方案中的工单属性列表](获取工单属性方案中的工单属性列表.md) - `GET /v1/ship/ticket_property_plans/{property_plan_id}/ticket_properties`
- [在工单属性方案中移除一个工单属性](在工单属性方案中移除一个工单属性.md) - `DELETE /v1/ship/ticket_property_plans/{property_plan_id}/ticket_properties/{property_id}`


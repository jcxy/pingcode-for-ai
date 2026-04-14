# 用例

## API 列表

- [创建一个用例](创建一个用例.md) - `POST /v1/testhub/cases`
- [部分更新一个用例](部分更新一个用例.md) - `PATCH /v1/testhub/cases/{case_id}`
- [删除一个用例](删除一个用例.md) - `DELETE /v1/testhub/cases/{case_id}`
- [批量创建用例](批量创建用例.md) - `POST /v1/testhub/cases/bulk`
- [批量部分更新用例](批量部分更新用例.md) - `PATCH /v1/testhub/cases/bulk`
- [获取用例列表](获取用例列表.md) - `GET /v1/testhub/cases`
- [获取用例类型列表](获取用例类型列表.md) - `GET /v1/testhub/case/types?library_id={library_id}`
- [获取用例状态列表](获取用例状态列表.md) - `GET /v1/testhub/case/states?library_id={library_id}`
- [获取用例属性列表](获取用例属性列表.md) - `GET /v1/testhub/case/properties?library_id={library_id}`
- [获取用例模块列表](获取用例模块列表.md) - `GET /v1/testhub/case/suites?library_id={library_id}`
- [获取用例的执行历史列表](获取用例的执行历史列表.md) - `GET /v1/testhub/cases/{case_id}/histories`
- [批量创建测试用例关联工作项](批量创建测试用例关联工作项.md) - `POST /v1/testhub/cases/{case_id}/work_item_relations/bulk`
- [批量删除测试用例关联工作项](批量删除测试用例关联工作项.md) - `DELETE /v1/testhub/cases/{case_id}/work_item_relations/bulk`


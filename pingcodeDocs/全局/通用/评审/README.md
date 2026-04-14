# 评审

## API 列表

- [创建一个评审](创建一个评审.md) - `POST /v1/reviews`
- [获取评审列表](获取评审列表.md) - `GET /v1/reviews?principal_type={principal_type}&pilot_id={pilot_id}`
- [删除一个评审](删除一个评审.md) - `DELETE /v1/reviews/{review_id}?principal_type={principal_type}`
- [向评审中添加一个评审内容](向评审中添加一个评审内容.md) - `POST /v1/reviews/{review_id}/principals`
- [获取评审内容列表](获取评审内容列表.md) - `GET /v1/reviews/{review_id}/principals?principal_type={principal_type}`
- [在评审中移除一个评审内容](在评审中移除一个评审内容.md) - `DELETE /v1/reviews/{review_id}/principals/{principal_id}?principal_type={principal_type}`
- [获取一个评审内容](获取一个评审内容.md) - `GET /v1/reviews/{review_id}/principals/{principal_id}?principal_type={principal_type}`


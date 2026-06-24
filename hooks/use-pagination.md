# Pagination Hook

## Post Feed Behavior

- `keywords` 存 URL，用于驱动 Search 组件。
- `pageNo` 不存 URL。
- 刷新永远从第 1 页开始。
- 搜索词变化时重置列表和分页状态。

## Infinite Scroll

- 使用 `IntersectionObserver` 监听哨兵元素。
- 不依赖具体滚动容器。
- 加载中不要重复请求。
- 没有更多数据时停止观察或阻止后续请求。

## State Shape

- 分页状态放在客户端组件或 hook 内。
- 推荐维护：`items`、`pageNo`、`loading`、`hasMore`、`error`。
- 请求失败时保留已有列表，不清空用户已经看到的内容。

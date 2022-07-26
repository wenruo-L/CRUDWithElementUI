# 对 elementUI 的 table 和 form 进行二次封装的 crud

> 包含组件

- crud （增删查改）
- p-table（单纯的表格）
- p-form（单纯的表单）

### 使用方式

- crud 示例

| 属性名  | 类型    | 默认值                                  | 用途                 |
| :------ | :------ | :-------------------------------------- | :------------------- |
| form    | Object  | {}                                      | 增/改/查的表单数据源 |
| page    | Object  | {pageSize: 10,currentPage: 1,total: 0,} | 分页器配置的数据     |
| loading | Boolean | false                                   | 表单加载状态         |

## 对 elementUI 进行二次封装的 crud 组件

#### 安装

```
yarn add patpet-crud
或
npm i patpet-crud
```

#### 使用

```
import patpetCrud from 'patpet-crud'
import 'patpet-crud/lib/patpet-crud.css'
Vue.use(patpetCrud)
```

#### 示例

<https://wenruo-l.github.io/CRUDWithElementUI/dist/index.html#/testCrud>

代码

```
<template>
  <basic-container>
    <crud
      ref="crud"
      :option="option"
      v-model="form"
      :query.sync="query"
      :tableData="data"
      :before-open="beforeOpen"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-delete="rowDelete"
      @handle-delete="handleDelete"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    ></crud>
  </basic-container>
</template>

<script>
export default {
  name: "test-crud",
  data() {
    return {
      loading: true,
      form: {},
      query: {
        test4: "通过query设置的默认值",
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        height: "auto",
        // calcHeight: 30,
        border: true,
        selection: true,
        column: [
          {
            label: "测试1",
            prop: "test1",
            rules: [
              {
                required: true,
                message: "搞快点",
                trigger: "blur",
              },
            ],
          },
          {
            label: "测试2",
            prop: "test2",
            type: "select",
            search: true,
            searchValue: 1,
            dicData: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            label: "测试3",
            prop: "test3",
            searchValue: "通过option设置的默认值",
            search: true,
          },
          {
            label: "测试4",
            prop: "test4",
            search: true,
          },
          {
            label: "测试5",
            prop: "test5",
            search: true,
          },
          {
            label: "测试6",
            prop: "test6",
            search: true,
          },
          {
            label: "测试7",
            prop: "test8",
            span: 24,
            labelWidth: 200,
            search: true,
          },
        ],
      },
      data: [],
    };
  },
  created() {
    console.log("test-crud  this", this);
  },
  methods: {
    rowSave(form, done) {
      this.data.push(form);
      this.$message.success("操作成功");
      done();
    },
    rowUpdate(form, done, index) {
      this.$message.success(
        `第${index + 1}行 更新数据  ${JSON.stringify(form)}`
      );
      this.$set(this.data, index, form);
      setTimeout(() => {
        this.$message.success("操作成功");
      }, 500);
      done();
    },
    rowDelete(row, index) {
      this.data.splice(index, 1);
      this.$message.success("操作成功");
    },
    handleDelete(rows) {
      this.$message.warning(`选中删除数据 ${JSON.stringify(rows)}`);
    },
    beforeOpen(done, type) {
      if (type === "view") {
        this.form = {
          test1: "我不是哈哈嗨",
          test2: 2,
        };
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(rows) {
      this.selectionList = rows;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud && this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      console.log("refreshChange");
      this.onLoad(this.page, this.query);
    },
    onLoad() {
      this.loading = true;
      this.data.push({ test1: "哈哈嗨", test2: 1 });
      console.log("this.$refs.crud", this.$refs);
      this.selectionClear();
      this.loading = false;
    },
  },
};
</script>
```

#### 文档地址

[文档](https://wenruo-l.github.io/CRUDWithElementUI/dist/index.html#/document)

> 包含组件

- crud （增删查改）
- p-table（封装好的表格）
- p-form（封装好的表单）

```

```

<template>
  <div class="content__table">
    <!-- 头部预留插槽 -->
    <slot name="tableHeader"></slot>
    <!-- 顶部操作栏 -->
    <div class="header-mune-content">
      <div class="header-mune-content__btn_left">
        <el-button
          v-if="HeaderMuneAddBtn"
          type="primary"
          icon="el-icon-plus"
          :size="size"
          @click="openDialogForm('add')"
        >
          新 增
        </el-button>
        <el-button
          v-if="HeaderMuneDelBtn"
          type="danger"
          icon="el-icon-delete"
          :size="size"
          @click="deleteClick('handleDelete')"
        >
          删 除
        </el-button>
        <slot name="muneLeft"></slot>
      </div>
      <div class="header-mune-content__btn_right">
        <slot name="muneRight"></slot>
        <el-tooltip
          effect="dark"
          placement="top"
          content="刷新"
          v-if="HeaderMuneRefreshBtn"
        >
          <el-button
            icon="el-icon-refresh"
            circle
            :class="{ turn: isRefresh }"
            :size="size"
            @click="refreshChange"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          placement="top"
          content="搜索"
          v-if="HeaderMuneSearchBtn"
        >
          <el-button
            icon="el-icon-search"
            circle
            :size="size"
            @click="searchChange"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      class="crud__Table"
      ref="table"
      v-loading="loading"
      :data="tableData"
      :height="isAutoHeight ? tableHeight : crudOption.maxHeight"
      :max-height="crudOption.maxHeight"
      :stripe="crudOption.stripe"
      :border="crudOption.border"
      :size="size"
      :fit="crudOption.fit"
      :show-header="crudOption.showHeader"
      :highlight-current-row="crudOption.highlightCurrentRow"
      :cell-class-name="crudOption.cellClassName"
      :row-key="TableRowKey"
      :tree-props="TableTreeProps"
      :lazy="TableLazy"
      :load="treeLoad"
      @selection-change="selectionChange"
      style="width: 100%"
    >
      <!-- 多选 -->
      <el-table-column
        v-if="crudOption.selection"
        type="selection"
        fixed
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <!-- 索引 -->
      <el-table-column
        v-if="crudOption.index"
        type="index"
        fixed
        header-align="center"
        align="center"
        width="50"
        label="#"
      >
      </el-table-column>
      <!-- 动态列表 -->
      <template v-for="(column, index) in columnOption">
        <!-- 动态 -->
        <el-table-column
          :key="column.prop + index"
          :header-align="ColumnHeaderAlign"
          :align="ColumnAlign"
          :width="column.width"
          :fixed="column.fixed"
          :prop="column.prop || ''"
          :label="column.label || ''"
          :show-overflow-tooltip="getShowOverflowTooltip(column)"
        >
          <template slot-scope="{ row, $index }">
            <!-- 列表插槽 -->
            <slot
              v-if="column.slot"
              :name="column.prop"
              v-bind="{
                row: row,
                index: $index,
              }"
            >
            </slot>
            <!-- 列表内容 -->
            <template v-else>
              {{ getTableValue(row, column) }}
            </template>
          </template>
        </el-table-column>
      </template>
      <!-- 操作栏 -->
      <el-table-column
        v-if="ColumnMenu"
        header-align="center"
        fixed="right"
        label="操作"
        :width="ColumnMenuWidth"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="text"
            size="small"
            icon="el-icon-view"
            v-if="ColumnViewBtn"
            @click="openDialogForm('view', row, $index)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            v-if="ColumnEditBtn"
            @click="openDialogForm('edit', row, $index)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            v-if="ColumnDelBtn"
            @click="deleteClick('delete', row, $index)"
          >
            删除
          </el-button>
          <slot name="menuBtn" v-bind="{ row: row, index: $index }"></slot>
        </template>
      </el-table-column>
      <!-- 无数据 -->
      <template slot="empty">
        <slot name="empty">
          <svg
            t="1658390655809"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4213"
            width="128"
            height="128"
          >
            <path
              d="M147.34 910.77l-1.05-0.02c-6.05-0.2-37.49-2.21-58.44-21.85-21.48-20.14-24.04-49.1-24.34-54.71-0.03-0.53-0.04-1.06-0.04-1.58V674.86c-0.32-6.49-0.74-28.45 6.62-52.82 7.05-23.38 15.75-38.72 18.25-42.86l79.19-140.12c0.4-0.69 0.82-1.38 1.27-2.04 2.47-3.67 15.74-22.53 33.94-33.84 19.15-11.93 42.33-12.85 48.99-12.85h500.24c0.64 0 1.28 0.01 1.94 0.05 4.97 0.32 30.79 2.5 50.78 13.93 19.08 10.93 34.45 30.03 37.32 33.73 0.59 0.76 1.14 1.55 1.65 2.36l94.05 149.04c0.41 0.66 0.81 1.34 1.18 2.04 1.8 3.46 11.1 21.75 15.81 39.53 4.65 17.6 5.77 37.05 5.94 40.76l0.02 1.27v157.78c0.11 8.34-1.43 36.96-25.18 58.24-22.49 20.13-52.77 21.69-61.51 21.69l-726.63 0.02z"
              fill="#0077F1"
              p-id="4214"
            ></path>
            <path
              d="M139.28 611.14c-1.73 3.08-7.12 13.26-11.64 28.26-4.78 15.86-4.21 30.68-4.13 32.31 0.04 0.71 0.07 1.43 0.08 2.13v157.72l0.05 0.44c0.37 2.84 2.11 9.71 5.09 12.81l0.4 0.43 0.47 0.34c4.18 3.08 14.53 4.85 18.15 5.07l726.28 0.01c6.02-0.08 16.56-2.08 21.33-6.35 4.27-3.83 5.23-10.4 5.23-11.45l-0.05-1.82V673.99c-0.33-6.12-1.52-18.34-3.97-27.58-2.78-10.56-9.01-23.23-10.23-25.65l-0.34-0.59-92.3-146.28-0.29-0.34c-3.5-4.22-11.89-13.22-18.58-17.06-5.81-3.32-17.62-5.45-23.71-6.02l-0.63-0.03H251.83c-4.67 0.04-13.33 1.27-17.34 3.78-5.65 3.52-12.32 11.55-15.07 15.3l-0.24 0.33-78.7 139.22-0.85 1.43 0.01-0.03c-0.02 0.06-0.36 0.67-0.36 0.67z"
              fill="#ACD8FF"
              p-id="4215"
            ></path>
            <path
              d="M509.2 346.25c-16.6-0.02-30.04-13.46-30.06-30.06v-172.9c0.01-16.6 13.46-30.03 30.05-30.06 16.59 0.02 30.04 13.46 30.07 30.06v172.9c-0.02 16.6-13.47 30.04-30.06 30.06zM710.72 345.11c-16.59-0.02-30.04-13.47-30.06-30.06 0-6.9 2.38-13.58 6.71-18.94l68.71-84.74a30.005 30.005 0 0 1 23.38-11.13c6.94 0 13.48 2.32 18.89 6.71 6.22 5 10.17 12.29 10.98 20.23 0.86 7.93-1.5 15.87-6.54 22.05l-68.71 84.74a29.84 29.84 0 0 1-23.32 11.13l-0.04 0.01zM311.05 342.81a29.9 29.9 0 0 1-23.49-11.32l-67.54-84.74c-10.33-12.98-8.2-31.88 4.77-42.24a29.702 29.702 0 0 1 18.72-6.55c9.21 0 17.79 4.13 23.52 11.32l67.55 84.74c10.33 12.98 8.21 31.88-4.75 42.23a30.156 30.156 0 0 1-18.73 6.56h-0.05zM510.34 787.12c-66.96 0-125.15-44.9-141.47-109.16l-1.32-5.19-266.93-0.16c-16.6-0.03-30.04-13.48-30.06-30.08 0.02-16.59 13.47-30.02 30.06-30.04l293.94 0.19c16.59 0.04 30.01 13.48 30.04 30.07 0 47.25 37.66 84.25 85.75 84.25 47.91 0 85.45-37 85.45-84.25 0.03-16.58 13.47-30.03 30.06-30.07l291.21-0.19c16.58 0 30.06 13.46 30.07 30.03 0.01 16.58-13.46 30.07-30.03 30.09l-264.24 0.16-1.32 5.18c-16.32 64.27-74.37 109.17-141.21 109.17z m0 0"
              fill="#0077F1"
              p-id="4216"
            ></path>
          </svg>
          <div class="el-empty__description">
            <p>{{ crudOption.emptyText || "暂无数据" }}</p>
          </div>
        </slot>
      </template>
    </el-table>
  </div>
</template>

<script>
import crudConfig from "@/utils/CURD/crud-config";
import { getObjType } from "@/utils/util";
import { vaildData } from "@/utils/validate";

export default {
  name: "p-table",
  provide() {
    return {
      crudTable: this,
    };
  },
  props: {
    // crud的配置
    crudOption: {
      type: Object,
      default: () => {
        return Object.create(null);
      },
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => [],
    },
    // 树表格 懒加载的处理函数
    treeLoad: {
      type: Function,
    },
    // loading状态
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // data(){
    //   let dataList = [];
    //   if(this.tableData.length==0) return dataList;
    //   dataList =
    //   this.tableData.forEach((el)=>{

    //   })
    //   return dataList
    // },
    // 表格自动高度
    isAutoHeight() {
      return this.crudOption.height === "auto";
    },
    // 列配置
    columnOption() {
      let columnList = [];
      // console.log("p-table  this.crudOption", this.crudOption);
      if (this.crudOption.column.length == 0) return columnList;
      columnList = this.crudOption.column.filter((item, index) => {
        item.$index = index;
        return item.hide === undefined || item.hide === false;
      });
      return columnList;
    },
    // 样式大小 控制表格及新增、批量操作按钮大小
    size() {
      return vaildData(this.crudOption.size, crudConfig.size);
    },
    // 顶部新增按钮
    HeaderMuneAddBtn() {
      return vaildData(this.crudOption.addBtn, crudConfig.addBtn);
    },
    // 顶部删除按钮
    HeaderMuneDelBtn() {
      return vaildData(
        this.crudOption.topDelBtn,
        crudConfig.topDelBtn && this.crudOption.selection
      );
    },
    // 顶部刷新按钮
    HeaderMuneRefreshBtn() {
      return vaildData(this.crudOption.refreshBtn, crudConfig.refreshBtn);
    },
    // 顶部搜索开关按钮
    HeaderMuneSearchBtn() {
      return vaildData(this.crudOption.searchBtn, crudConfig.searchBtn);
    },
    // 表格 rowkey
    TableRowKey() {
      return vaildData(this.crudOption.rowKey, crudConfig.rowKey);
    },
    // 表格 tree-props
    TableTreeProps() {
      return vaildData(this.crudOption.treeProps, crudConfig.treeProps);
    },
    // 表格 lazy
    TableLazy() {
      return vaildData(this.crudOption.treeLazy, crudConfig.treeLazy);
    },
    // 列 header-align
    ColumnHeaderAlign() {
      return vaildData(this.crudOption.headerAlign, crudConfig.headerAlign);
    },
    // 列 align
    ColumnAlign() {
      return vaildData(this.crudOption.columnAlign, crudConfig.columnAlign);
    },
    // 列 操作栏
    ColumnMenu() {
      return vaildData(this.crudOption.menu, crudConfig.menu);
    },
    // 列 操作栏宽度
    ColumnMenuWidth() {
      return vaildData(this.crudOption.menuWidth, crudConfig.menuWidth);
    },
    // 列 查看按钮
    ColumnViewBtn() {
      return vaildData(this.crudOption.viewBtn, crudConfig.viewBtn);
    },
    // 列 编辑按钮
    ColumnEditBtn() {
      return vaildData(this.crudOption.editBtn, crudConfig.editBtn);
    },
    // 列 删除按钮
    ColumnDelBtn() {
      return vaildData(this.crudOption.delBtn, crudConfig.delBtn);
    },
  },
  created() {
    this.getTableHeight();
  },
  data() {
    return {
      tableHeight: undefined,
      crudConfig: crudConfig,
      isRefresh: false,
      tableSelect: [],
    };
  },
  methods: {
    // 表格多选框
    selectionChange(rows) {
      this.tableSelect = rows;
      this.$emit("selection-change", this.tableSelect);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    // 打开表单弹窗
    openDialogForm(openType, row, index) {
      this.$emit("open-dialog-form", openType, row, index);
    },
    // 删除
    deleteClick(deleteType, row, index) {
      if (deleteType === "handleDelete") {
        this.$emit("handle-delete", deleteType);
      } else {
        this.$emit("row-delete", row, index);
      }
    },
    // 刷新事件
    refreshChange() {
      this.$emit("refresh-change");
      this.isRefresh = true;
      setTimeout(() => {
        this.isRefresh = false;
      }, 500);
    },
    searchChange() {
      this.$emit("search-change");
    },
    getTableValue(row, column) {
      let value = row[column.prop];
      let matchType = ["select", "radio", "checkbox", "cascader"];
      // 1.1：该字段是否需要匹配
      // 1.2：需要匹配的字段的字典是否有值
      if (
        !matchType.includes(column.type) ||
        !vaildData(column.dicData) ||
        value === undefined ||
        value === null
      )
        return value;
      // 2.1：matchType的类型主要分两种，单选或多选
      if (
        !vaildData(column.multiple) &&
        getObjType(row[column.prop]) != "array"
      ) {
        // 怎么会有人配置了字段但是表格data不传对应的值的？原来是我
        let dicItem = column.dicData.find((item) => {
          return item[this.getColumnProps(column, "value")] === value;
        });
        return (value = dicItem
          ? dicItem[this.getColumnProps(column, "label")]
          : "");
      } else {
        if (column.type !== "cascader") {
          return (value = column.dicData
            .filter((item) => {
              return value.includes(item[this.getColumnProps(column, "value")]);
            })
            .map((item) => {
              return item[this.getColumnProps(column, "label")];
            })
            .join());
        } else {
          // 级联选择器。。。没想好怎么搞
          return value.join("-");
        }
      }
    },
    // 获取label/value对应的字段名 默认label/value
    getColumnProps(column, type) {
      return column.props && column.props[type] ? column.props[type] : type;
    },
    // 获取表格高度
    getTableHeight() {
      let clientHeight = document.documentElement.clientHeight;
      if (this.isAutoHeight) {
        this.$nextTick(() => {
          const tableRef = this.$refs.table;
          const tablePageRef = this.$refs.tablePage;
          if (!tableRef) return;
          const tableStyle = tableRef.$el;
          const pageStyle =
            (tablePageRef &&
              tablePageRef.$el &&
              tablePageRef.$el.offsetHeight) ||
            20;
          this.tableHeight =
            clientHeight -
            tableStyle.offsetTop -
            pageStyle -
            this.crudOption.calcHeight;
        });
      } else {
        this.tableHeight = this.crudOption.height;
      }
    },
    getShowOverflowTooltip(column) {
      return vaildData(column.overHidden, crudConfig.overHidden);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../style/table.scss";
</style>
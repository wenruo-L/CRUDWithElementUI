<template>
  <div class="content__table">
    <!-- 头部预留插槽 -->
    <slot name="tableHeader"></slot>
    <!-- 顶部操作栏 -->
    <div class="header-mune-content">
      <div class="header-mune-content__btn_left">
        <el-button
          v-permission="getPermission('addBtn')"
          v-if="HeaderMuneAddBtn"
          type="primary"
          icon="el-icon-plus"
          :size="size"
          @click="openDialogForm('add')"
        >
          新 增
        </el-button>
        <el-button
          v-permission="getPermission('delBtn')"
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
      :height="tableHeight"
      :max-height="isAutoHeight ? tableHeight : crudOption.maxHeight"
      :stripe="crudOption.stripe"
      :border="crudOption.border"
      :size="size"
      :fit="crudOption.fit || true"
      :show-header="crudOption.showHeader || true"
      :highlight-current-row="crudOption.highlightCurrentRow"
      :cell-class-name="crudOption.cellClassName"
      :row-key="TableRowKey"
      :tree-props="TableTreeProps"
      :lazy="TableLazy"
      :default-expand-all="crudOption.expandAll"
      :load="treeLoad"
      @selection-change="selectionChange"
      @expand-change="expandChange"
      style="width: 100%"
    >
      <!-- :show-summary="crudOption.showSummary"
      :summary-method="summaryMethod" -->
      <!-- 行展开 -->
      <el-table-column
        v-if="crudOption.expand"
        type="expand"
        fixed
        header-align="center"
        align="center"
        width="50"
      >
        <template slot-scope="props">
          <slot name="expand" v-bind="{ row: props.row }"></slot>
        </template>
      </el-table-column>
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
        <column-dynamic
          :key="column.prop ? column.prop + index : index"
          :column="column"
        >
          <template v-for="item in columnSlot" :slot="item" slot-scope="scope">
            <slot v-bind="scope" :name="item"></slot>
          </template>
        </column-dynamic>
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
            v-permission="getPermission('viewBtn')"
            @click="openDialogForm('view', row, $index)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            v-if="ColumnEditBtn"
            v-permission="getPermission('editBtn')"
            @click="openDialogForm('edit', row, $index)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            v-permission="getPermission('delBtn')"
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
          <el-empty :description="crudOption.emptyText || '暂无数据'">
          </el-empty>
        </slot>
      </template>
    </el-table>
    <!-- 底部预留插槽 -->
    <slot name="tableFooter"></slot>
  </div>
</template>

<script>
import crudConfig from "@/utils/CURD/crud-config";
import { getObjType } from "@/utils/util";
import { vaildData } from "@/utils/validate";
import permission from "@/utils/CURD/directive/permission";
import columnDynamic from "@/utils/CURD/p-table/column-dynamic";

export default {
  name: "p-table",
  directives: {
    permission,
  },
  provide() {
    return {
      pTable: this,
    };
  },
  components: {
    columnDynamic,
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
    // 权限
    permission: {
      type: Object,
      default: () => {
        return {
          addBtn: true,
          delBtn: true,
          editBtn: true,
          viewBtn: true,
        };
      },
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
    // 分页器高度
    tablePageHeight: {
      type: [String, Number],
      default: 20,
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
      // 是否需要做去重？？
      return columnList;
    },
    columnSlot() {
      let result = [];
      let filterList = [
        "tableHeader",
        "muneLeft",
        "muneRight",
        "expand",
        "menuBtn",
        "empty",
        "tableFooter",
      ];
      let scopedSlots = Object.keys(this.$scopedSlots);
      result = scopedSlots.filter((item) => {
        return !filterList.includes(item);
      });
      return result;
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
    console.log("ptable this", this);
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
    // 获取权限
    // 如果props不传进permission，即视为不进行权限管理，所以理应默认拥有权限
    getPermission(tagetPermission) {
      return vaildData(this.permission[tagetPermission], true);
    },
    // 行展开
    expandChange(row, expanded) {
      console.log("expandChange  row", row);
      console.log("expandChange  expanded", expanded);
    },
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
          if (!tableRef) return;
          const tableStyle = tableRef.$el;
          const pageStyle = Number(this.tablePageHeight);
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
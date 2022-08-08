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
          content="列显隐"
          v-if="HeaderMuneFilterBtn"
        >
          <el-popover placement="bottom" width="120" trigger="click">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAllColumn"
              @change="handleCheckAllColumnChange"
              :disabled="checkAllColumn"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="checkedColumns"
              @change="handleCheckedColumnsChange"
            >
              <el-checkbox
                v-for="(item, index) in columnFilter"
                :label="item.prop || item.label"
                :key="item.prop + index"
                @change="handleSingleColumnsChange(item.prop || item.label)"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
            <el-button
              slot="reference"
              icon="el-icon-s-operation"
              style="margin: 0 10px"
              circle
              :size="size"
            ></el-button>
          </el-popover>
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
      :key="reload"
      :data="tableData"
      :height="tableHeight"
      :max-height="isAutoHeight ? tableHeight : option.maxHeight"
      :stripe="option.stripe"
      :border="option.border"
      :size="size"
      :fit="option.fit || true"
      :show-header="option.showHeader || true"
      :highlight-current-row="option.highlightCurrentRow"
      :cell-class-name="option.cellClassName"
      :row-key="TableRowKey"
      :tree-props="TableTreeProps"
      :lazy="TableLazy"
      :default-expand-all="option.expandAll"
      :load="treeLoad"
      :span-method="spanMethod"
      @selection-change="selectionChange"
      @expand-change="expandChange"
      :sort-method="sortMethod"
      :sort-orders="sortOrders"
      :sort-by="sortBy"
      @sort-change="sortChange"
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
      :show-summary="option.showSummary"
      :summary-method="tableSummaryMethod"
      style="width: 100%"
    >
      <!-- 行展开 -->
      <el-table-column
        v-if="option.expand"
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
        v-if="option.selection"
        type="selection"
        fixed
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <!-- 索引 -->
      <el-table-column
        v-if="option.index"
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
          <el-empty :description="option.emptyText || '暂无数据'"> </el-empty>
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
    option: {
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
    sortBy: Function,
    sortOrders: Array,
    sortMethod: Function,
    spanMethod: Function,
    summaryMethod: Function,
    onFiltered: Function,
  },
  computed: {
    // 表格自动高度
    isAutoHeight() {
      return this.option.height === "auto";
    },
    columnList() {
      return this.option.column;
    },
    // 列配置
    columnOption() {
      let columnList = [];
      if (this.columnList.length == 0) return columnList;
      columnList = this.columnList.filter((item) => {
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
      return vaildData(this.option.size, crudConfig.size);
    },
    // 顶部新增按钮
    HeaderMuneAddBtn() {
      return vaildData(this.option.addBtn, crudConfig.addBtn);
    },
    // 顶部删除按钮
    HeaderMuneDelBtn() {
      return vaildData(
        this.option.topDelBtn,
        crudConfig.topDelBtn && this.option.selection
      );
    },
    // 顶部刷新按钮
    HeaderMuneRefreshBtn() {
      return vaildData(this.option.refreshBtn, crudConfig.refreshBtn);
    },
    // 顶部列显隐按钮
    HeaderMuneFilterBtn() {
      return vaildData(this.option.filterBtn, crudConfig.filterBtn);
    },
    // 顶部搜索开关按钮
    HeaderMuneSearchBtn() {
      return vaildData(this.option.searchBtn, crudConfig.searchBtn);
    },
    // 表格 rowkey
    TableRowKey() {
      return vaildData(this.option.rowKey, crudConfig.rowKey);
    },
    // 表格 tree-props
    TableTreeProps() {
      return vaildData(this.option.treeProps, crudConfig.treeProps);
    },
    // 表格 lazy
    TableLazy() {
      return vaildData(this.option.treeLazy, crudConfig.treeLazy);
    },
    // 列 header-align
    ColumnHeaderAlign() {
      return vaildData(this.option.headerAlign, crudConfig.headerAlign);
    },
    // 列 align
    ColumnAlign() {
      return vaildData(this.option.columnAlign, crudConfig.columnAlign);
    },
    // 列 操作栏
    ColumnMenu() {
      return vaildData(this.option.menu, crudConfig.menu);
    },
    // 列 操作栏宽度
    ColumnMenuWidth() {
      return vaildData(this.option.menuWidth, crudConfig.menuWidth);
    },
    // 列 查看按钮
    ColumnViewBtn() {
      return vaildData(this.option.viewBtn, crudConfig.viewBtn);
    },
    // 列 编辑按钮
    ColumnEditBtn() {
      return vaildData(this.option.editBtn, crudConfig.editBtn);
    },
    // 列 删除按钮
    ColumnDelBtn() {
      return vaildData(this.option.delBtn, crudConfig.delBtn);
    },
    // 进行合计的列
    sumColumnList() {
      return this.option.sumColumnList || [];
    },
  },
  data() {
    return {
      reload: Math.random(),
      tableHeight: undefined,
      crudConfig: crudConfig,
      isRefresh: false,
      tableSelect: [],
      isIndeterminate: false,
      checkAllColumn: true,
      checkedColumns: [],
      columnFilter: [], //列显隐数据源
    };
  },
  created() {
    this.getTableHeight();
    if (this.HeaderMuneFilterBtn) {
      this.setDefaultcheckedColumns();
    }
  },
  mounted() {
    window.onresize = () => {
      this.tableDoLayout();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    // 利用虚拟dom更新机制刷新key值达到更新table的目的
    refreshTable() {
      this.reload = Math.random();
    },
    setDefaultcheckedColumns() {
      // 过滤出非隐藏且能设置隐藏的列
      this.columnFilter = this.columnOption;
      let list = this.columnFilter.map((item) => {
        return item.prop || item.label;
      });
      this.checkedColumns = list;
    },
    handleCheckAllColumnChange(val) {
      if (!val) return (this.checkedColumns = []);
      let defaultValue = this.columnFilter.map((item) => {
        return item.prop || item.label;
      });
      this.checkedColumns = defaultValue;
      this.handleCheckedColumnsChange(defaultValue);
    },
    handleCheckedColumnsChange(val) {
      let checkedCount = val.length;
      this.checkAllColumn = checkedCount === this.columnFilter.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.columnFilter.length;
      this.columnList.forEach((item) => {
        let isHide = !val.includes(item.prop || item.label);
        this.$set(item, "hide", isHide);
      });
      this.refreshTable();
      if (typeof this.onFiltered === "function") {
        this.onFiltered(this.columnList);
      }
    },
    handleSingleColumnsChange(val) {
      if (this.checkedColumns.length === 0) {
        this.checkedColumns.push(val);
        return this.$message.warning("至少保留一列哦");
      }
    },
    // 表尾合计行
    tableSummaryMethod(param) {
      if (typeof this.summaryMethod === "function") {
        return this.summaryMethod(param);
      }
      const { columns, data } = param;
      let sumsList = {};
      let sums = [];
      if (columns.length > 0) {
        columns.forEach((column, index) => {
          let currItem = this.sumColumnList.find(
            (item) => item.name === column.property
          );
          if (currItem) {
            let decimals = currItem.decimals || 2;
            let label = currItem.label || "";
            let avgValues = data.map((item) => Number(item[column.property]));
            let nowindex = 1;
            let values = data.map((item) => Number(item[column.property]));
            switch (currItem.type) {
              case "count":
                sums[index] = label + data.length;
                break;
              case "avg":
                sums[index] = avgValues.reduce((perv, curr) => {
                  let value = Number(curr);
                  if (!isNaN(value)) {
                    return (perv * (nowindex - 1) + curr) / nowindex++;
                  } else {
                    return perv;
                  }
                }, 0);
                sums[index] = label + sums[index].toFixed(decimals);
                break;
              case "sum":
                sums[index] = values.reduce((perv, curr) => {
                  let value = Number(curr);
                  if (!isNaN(value)) {
                    return perv + curr;
                  } else {
                    return perv;
                  }
                }, 0);
                sums[index] = label + sums[index].toFixed(decimals);
                break;
            }
            sumsList[column.property] = sums[index];
          } else {
            sums[index] = "";
          }
        });
      }
      return sums;
    },
    // 行双击
    rowDblclick(row, event) {
      this.$emit("row-dblclick", row, event);
    },
    // 行单击
    rowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    },
    // 排序回调
    sortChange(val) {
      this.$emit("sort-change", val);
    },
    // 重绘表格
    tableDoLayout() {
      this.$refs.table.doLayout();
    },
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
    filterChange() {
      this.$emit("filter-change");
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
          // 级联选择器
          return this.matchCascaderValue(row, column);
        }
      }
    },
    matchCascaderValue(row, column) {
      let value = row[column.prop];
      // 1.1 当数据为空时处理显示格式，把原值返回显示
      if (column.dicData.length === 0) {
        value = column.multiple
          ? value
              .map((item) => {
                return item.join("-");
              })
              .join("/")
          : value.join("/");
        return value;
      }
      // 1.2 当存在数据时，递归匹配数据
      let labelList = [];
      let valueIndex = 0;
      const dealWithCascader = (value, data) => {
        let taggetData = data.find((item) => {
          return (
            item[this.getColumnProps(column, "value")] === value[valueIndex]
          );
        });
        if (taggetData) {
          labelList.push(taggetData[this.getColumnProps(column, "label")]);
          valueIndex++;
          if (
            !taggetData[this.getColumnProps(column, "children")] ||
            taggetData[this.getColumnProps(column, "children")].length === 0
          )
            return;
          dealWithCascader(
            value,
            taggetData[this.getColumnProps(column, "children")]
          );
        }
        return labelList.join("-");
      };
      if (column.multiple) {
        let resultList = [];
        value.forEach((el) => {
          resultList.push(dealWithCascader(el, column.dicData));
        });
        value = resultList.join(" / ");
      } else {
        value = dealWithCascader(value, column.dicData);
      }
      return value;
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
            this.option.calcHeight;
        });
      } else {
        this.tableHeight = this.option.height;
      }
    },
    getShowOverflowTooltip(column) {
      if (column.type === "upload") return false;
      return vaildData(column.overHidden, crudConfig.overHidden);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../style/table.scss";
</style>
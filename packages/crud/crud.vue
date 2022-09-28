<template>
  <div class="crud">
    <header-search ref="headerMune" v-if="searchShow">
      <template v-for="item in searchSlot" :slot="item" slot-scope="scope">
        <slot v-bind="scope" :name="getSlotName(item, 'Search')"></slot>
      </template>
    </header-search>
    <!-- 表格 -->
    <p-table
      ref="pTable"
      :loading="loading"
      :option="option"
      :tableData="tableData"
      :permission="permission"
      :tablePageHeight="tablePageHeight"
      :sort-method="sortMethod"
      :sort-orders="sortOrders"
      :sort-by="sortBy"
      :span-method="spanMethod"
      :summary-method="summaryMethod"
      :on-filtered="onFiltered"
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
      @sort-change="sortChange"
      @refresh-change="refreshChange"
      @search-change="shouldShowSearch"
      @row-delete="rowDelete"
      @handle-delete="handleDelete"
      @open-dialog-form="openDialogForm"
      @selection-change="selectionChange"
    >
      <template v-for="item in tableSlot" :slot="item" slot-scope="scope">
        <slot v-bind="scope" :name="item"></slot>
      </template>
    </p-table>
    <!-- 分页器 -->
    <table-page ref="tablePage" :page="page">
      <template slot="page">
        <slot name="page"></slot>
      </template>
    </table-page>
    <!-- 表单 -->
    <dialog-form ref="dialogForm">
      <template slot-scope="scope" v-for="item in formSlot" :slot="item">
        <slot v-bind="scope" :name="getSlotName(item, 'Form')"></slot>
      </template>
    </dialog-form>
  </div>
</template>

<script>
import crudConfig from "../config/crud-config";
import dialogForm from "./dialog-form";
import tablePage from "./table-page";
import headerSearch from "./header-search";
import { getSlot, deepClone } from "@/utils/util";
import { vaildData } from "@/utils/validate";
export default {
  name: "crud",
  model: {
    prop: "form",
    event: "handletableformchange",
  },
  components: {
    dialogForm,
    tablePage,
    headerSearch,
  },
  provide() {
    return {
      crud: this,
    };
  },
  props: {
    // 绑定的form表单
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 搜索
    query: {
      type: Object,
      default: () => {
        return {};
      },
    },
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
    // 分页器数据
    page: {
      type: Object,
      default: () => {
        return Object.create(null);
      },
    },
    beforeOpen: Function,
    sortBy: Function,
    sortOrders: Array,
    sortMethod: Function,
    spanMethod: Function,
    summaryMethod: Function,
    onFiltered: Function,
    uploadExceed: Function,
    uploadAfter: Function,
    uploadDelete: Function,
    uploadPreview: Function,
  },
  data() {
    return {
      crudConfig: crudConfig,
      tableFormIndex: null,
      tableFormType: null,
      tableForm: {},
      searchShow: false,
      searchForm: {},
    };
  },
  watch: {
    form: {
      handler(val) {
        this.tableForm = val;
      },
      deep: true,
      immediate: true,
    },
    tableForm: {
      handler() {
        this.handletableformchange();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // 把属于table的插槽传到子组件
    tableSlot() {
      return getSlot(this.$scopedSlots, "table");
    },
    formSlot() {
      return getSlot(this.$scopedSlots, "Form", true);
    },
    searchSlot() {
      return getSlot(this.$scopedSlots, "Search", true);
    },
    // 首次加载crud是否显示顶部搜索
    headerSearch() {
      return vaildData(this.option.searchShow, crudConfig.searchShow);
    },
    // 分页器高度
    tablePageHeight() {
      const tablePageRef = this.$refs.tablePage;
      return (
        (tablePageRef && tablePageRef.$el && tablePageRef.$el.offsetHeight) ||
        20
      );
    },
    // 字段处理，主要处理存在复杂表头情况下，需要把复杂表头下的子数组展开到原本的下标位置
    columnList() {
      let result = [];
      if (this.option.column.length === 0) return result;
      let list = deepClone(this.option.column);
      const dealWithColumn = (list) => {
        list.forEach((el) => {
          if (el.children && el.children.length) {
            dealWithColumn(el.children);
          } else {
            result.push(el);
          }
        });
      };
      dealWithColumn(list);
      return result;
    },
  },
  created() {
    // console.log("crud   this", this);
    this.searchShow = this.headerSearch;
  },
  mounted() {
    // console.log("columnList", this.columnList);
  },
  methods: {
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
    doLayout() {
      this.$refs.pTable.tableDoLayout();
    },
    // 获取slotname
    getSlotName(slotName, suffix) {
      return slotName + suffix;
    },
    // 显示、隐藏搜索
    shouldShowSearch() {
      this.searchShow = !this.searchShow;
    },
    // 刷新事件
    refreshChange() {
      this.$emit("refresh-change");
    },
    // 表格多选框
    selectionChange(rows) {
      this.$emit("selection-change", rows);
    },
    toggleSelection(rows) {
      this.$refs.pTable.toggleSelection(rows);
    },
    // 行数据克隆
    rowClone(row) {
      let rowData = {};
      Object.keys(row).forEach((ele) => {
        rowData[ele] = row[ele];
      });
      return rowData;
    },
    // 关闭弹窗
    closeDialogForm() {
      this.$refs.dialogForm.close();
      this.tableForm = {};
      this.tableFormIndex = null;
    },
    // 打开弹窗
    // 详情、编辑打开弹窗会默认拿**行数据**填充、匹配数据
    // 但是有一种情况，行数据并不是完整的数据，可通过传进来的beforeOpen回调使用接口拿回完整数据
    openDialogForm(openType, row, index) {
      this.tableFormType = openType;
      if (openType !== "add") {
        this.tableForm = this.rowClone(row);
        this.tableFormIndex = index;
      }
      this.$refs.dialogForm.show(openType);
    },
    // 新增与编辑
    handleSubmit(form) {
      if (this.tableFormType == "add") {
        this.$emit("row-save", form, this.closeDialogForm);
      } else if (this.tableFormType == "edit") {
        this.$emit(
          "row-update",
          form,
          this.closeDialogForm,
          this.tableFormIndex
        );
      }
    },
    // 行删除
    rowDelete(row, index) {
      this.$emit("row-delete", row, index);
    },
    // 批量删除
    handleDelete(rows) {
      if (rows.length === 0) {
        this.$message.warning("请选择一条数据后再进行操作");
        return;
      }
      this.$emit("handle-delete", rows);
    },
    handletableformchange(val) {
      this.$emit("handletableformchange", val ? val : this.tableForm);
    },
  },
};
</script>

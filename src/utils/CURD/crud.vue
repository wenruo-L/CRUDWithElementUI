<template>
  <div class="crud">
    <header-mune ref="headerMune" v-if="searchShow"></header-mune>
    <!-- 表格 -->
    <p-table
      ref="pTable"
      :loading="loading"
      :crudOption="crudOption"
      :tableData="tableData"
      @refresh-change="refreshChange"
      @search-change="shouldShowSearch"
      @row-delete="rowDelete"
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
        <slot v-bind="scope" :name="item"></slot>
      </template>
    </dialog-form>
  </div>
</template>

<script>
import pTable from "@/utils/CURD/p-table/p-table";
import crudConfig from "@/utils/CURD/crud-config";
import dialogForm from "@/utils/CURD/dialog-form";
import tablePage from "@/utils/CURD/table-page";
import headerMune from "@/utils/CURD/header-mune";
import { getSlot } from "@/utils/util";
import { vaildData } from "@/utils/validate";
export default {
  name: "crud",
  model: {
    prop: "form",
    event: "handletableformchange",
  },
  components: {
    pTable,
    dialogForm,
    tablePage,
    headerMune,
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
    // 分页器数据
    page: {
      type: Object,
      default: () => {
        return Object.create(null);
      },
    },
    beforeOpen: Function,
  },
  data() {
    return {
      tabelFormIndex: null,
      tableFormType: null,
      tabelForm: {},
      searchShow: false,
      searchForm: {},
    };
  },
  watch: {
    form: {
      handler(val) {
        this.tabelForm = val;
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
      return getSlot(this.$scopedSlots, "Form");
    },
    // 首次加载crud是否显示顶部搜索
    headerSearch() {
      return vaildData(this.crudOption.searchShow, crudConfig.searchShow);
    },
  },
  created() {
    this.searchShow = this.headerSearch;
  },
  methods: {
    // 显示、隐藏搜索
    shouldShowSearch() {
      this.searchShow = !this.searchShow;
      console.log("searchShow", this.searchShow);
      console.log("headerSearch", this.headerSearch);
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
      this.tabelForm = {};
      this.tabelFormIndex = null;
    },
    // 打开弹窗
    // 详情、编辑打开弹窗会默认拿**行数据**填充、匹配数据
    // 但是有一种情况，行数据并不是完整的数据，可通过传进来的beforeOpen回调使用接口拿回完整数据
    openDialogForm(openType, row, index) {
      this.tableFormType = openType;
      if (openType !== "add") {
        this.tabelForm = this.rowClone(row);
        this.tabelFormIndex = index;
      }
      this.$refs.dialogForm.show(openType);
    },
    // 新增与编辑
    handleSubmit(form) {
      if (this.tableFormType == "add") {
        this.$emit("row-save", form, this.closeDialogForm);
      } else if (this.tableFormType == "edit") {
        this.$emit("row-update", form, this.closeDialogForm);
      }
    },
    // 行删除
    rowDelete(row, index) {
      this.$emit("row-delete", row, index);
    },
    handletableformchange(val) {
      this.$emit("handletableformchange", val ? val : this.tabelForm);
    },
  },
};
</script>
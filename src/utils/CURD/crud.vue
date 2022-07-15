<template>
  <div class="crud">
    <!-- 表格 -->
    <p-table
      ref="pTable"
      :loading="loading"
      :crudOption="crudOption"
      :tableData="tableData"
      @refresh-change="refreshChange"
      @row-delete="rowDelete"
      @open-dialog-form="openDialogForm"
    >
      <template v-for="item in tableSlot" :slot="item" slot-scope="scope">
        <slot v-bind="scope" :name="item"></slot>
      </template>
    </p-table>
    <!-- 表单 -->
    <dialog-form ref="dialogForm"></dialog-form>
  </div>
</template>

<script>
import pTable from "@/utils/CURD/p-table/p-table";
import crudConfig from "@/utils/CURD/crud-config";
import dialogForm from "@/utils/CURD/dialog-form";
import { getTableSlot } from "@/utils/util";
export default {
  name: "crud",
  model: {
    prop: "form",
    event: "handletableformchange",
  },
  components: {
    pTable,
    dialogForm,
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
    beforeOpen: Function,
  },
  data() {
    return {
      tabelFormIndex: null,
      tableFormType: null,
      tabelForm: {},
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
      return getTableSlot(this.$scopedSlots);
    },
    headerSearch() {
      return this.crudOption.showSearch != undefined
        ? this.crudOption.showSearch
        : crudConfig.showSearch;
    },
  },
  methods: {
    // 刷新事件
    refreshChange() {
      this.$emit("refresh-change");
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
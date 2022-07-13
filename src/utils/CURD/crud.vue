<template>
  <div class="crud">
    <!-- 表格 -->
    <p-table
      ref="pTable"
      :loading="loading"
      :crudOption="crudOption"
      :tableData="tableData"
      @refresh-change="refreshChange"
    >
      <template v-for="item in tableSlot" :slot="item" slot-scope="scope">
        <slot v-bind="scope" :name="item"></slot>
      </template>
    </p-table>
    <!-- 表单 -->
    <dialog-form ref="dialogForm"> </dialog-form>
  </div>
</template>

<script>
import pTable from "@/utils/CURD/p-table/p-table";
import crudConfig from "@/utils/CURD/crud-config";
import dialogForm from "@/utils/CURD/dialog-form";
import { getTableSlot } from "@/utils/util";
export default {
  name: "crud",
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
  },
};
</script>
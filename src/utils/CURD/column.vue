<template>
  <div class="column">
    <!-- 多选 -->
    <el-table-column
      v-if="crud.crudOption.selection"
      type="selection"
      fixed
      header-align="center"
      align="center"
      width="50"
    >
    </el-table-column>
    <!-- 索引 -->
    <el-table-column
      v-if="crud.crudOption.index"
      type="index"
      fixed
      header-align="center"
      align="center"
      width="50"
      label="#"
    >
    </el-table-column>
    <template v-for="(column, index) in list">
      <!-- 动态 -->
      <el-table-column
        v-if="!column.slot"
        :key="column[crudConfig.rowKey] || index"
        :header-align="
          crud.crudOption.headerAlign != undefined
            ? crud.crudOption.headerAlign
            : crudConfig.headerAlign
        "
        :align="
          crud.crudOption.columnAlign != undefined
            ? crud.crudOption.columnAlign
            : crudConfig.columnAlign
        "
        :width="column.width"
        :fixed="column.fixed"
        :prop="column.prop || ''"
        :label="column.label || ''"
      >
      </el-table-column>
      <el-table-column
        v-else
        :key="column[crudConfig.rowKey] || index"
        :header-align="
          crud.crudOption.headerAlign != undefined
            ? crud.crudOption.headerAlign
            : crudConfig.headerAlign
        "
        :align="
          crud.crudOption.columnAlign != undefined
            ? crud.crudOption.columnAlign
            : crudConfig.columnAlign
        "
        :width="column.width"
        :fixed="column.fixed"
        :prop="column.prop || ''"
        :label="column.label || ''"
      >
        <!-- 列表插槽 -->
        <template slot-scope="{ row, $index }">
          <slot
            :name="column.prop"
            v-bind="{
              row: row,
              index: $index,
            }"
          >
          </slot>
        </template>
      </el-table-column>
    </template>
  </div>
</template>


<script>
import crudConfig from "@/utils/CURD/crud-config";
export default {
  name: "column",
  inject: ["crud"],
  props: {
    columnOption: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      crudConfig,
    };
  },
  computed: {
    list() {
      let res = [...this.columnOption];
      res = res.sort((a, b) => {
        return a.index - b.index;
      });
      return res;
    },
  },
};
</script>
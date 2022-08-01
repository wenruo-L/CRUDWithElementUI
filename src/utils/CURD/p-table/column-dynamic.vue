<template>
  <el-table-column
    :header-align="pTable.ColumnHeaderAlign"
    :align="pTable.ColumnAlign"
    :width="column.width"
    :fixed="column.fixed"
    :prop="column.prop || ''"
    :label="column.label || ''"
    :show-overflow-tooltip="pTable.getShowOverflowTooltip(column)"
  >
    <template slot-scope="{ row, $index }">
      <!-- 列表插槽 -->
      <slot
        v-if="$scopedSlots[column.prop]"
        :name="column.prop"
        v-bind="{
          row: row,
          index: $index,
        }"
      >
      </slot>
      <!-- 列表内容 -->
      <template v-else>
        {{ pTable.getTableValue(row, column) }}
      </template>
    </template>
    <!-- 复杂表头 -->
    <template v-for="(columnChild, indexChild) in column.children">
      <column-dynamic
        :column="columnChild"
        :key="columnChild.prop ? columnChild.prop + indexChild : indexChild"
      >
        <template
          v-for="item in pTable.columnSlot"
          :slot="item"
          slot-scope="scope"
        >
          <slot v-bind="scope" :name="item"></slot>
        </template>
      </column-dynamic>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: "column-dynamic",
  inject: ["pTable"],
  props: {
    column: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>
<template>
  <el-table-column
    :header-align="pTable.ColumnHeaderAlign"
    :align="pTable.ColumnAlign"
    :width="column.width"
    :fixed="column.fixed"
    :prop="column.prop || ''"
    :label="column.label || ''"
    :sortable="column.sortable || false"
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
        <template v-if="column.type === 'upload'">
          <div class="resources--content">
            <img
              v-if="getFileType(row[column.prop]) === 'img'"
              class="resources"
              :src="row[column.prop]"
              alt="无法展示"
              @click="resourcesPreview(row[column.prop])"
            />
            <video
              class="resources"
              v-if="getFileType(row[column.prop]) === 'video'"
              :src="row[column.prop]"
              controls
              @click="resourcesPreview(row[column.prop])"
            ></video>
            <span v-if="getFileType(row[column.prop]) === 'not support'">
              无法显示
            </span>
          </div>
        </template>
        <template v-else>
          {{ pTable.getTableValue(row, column) }}
        </template>
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
import crudConfig from "@/utils/CURD/crud-config";
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
  methods: {
    resourcesPreview(url) {
      this.$ImagePreview([{ url }]);
    },
    getFileType(url) {
      // 照片
      if (crudConfig.fileType.img.test(url)) {
        return "img";
      }
      // 视频
      if (crudConfig.fileType.video.test(url)) {
        return "video";
      }
      return "not support";
    },
  },
};
</script>

<style lang='scss' scoped>
.resources--content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  .resources {
    height: 40px;
  }
}
</style>
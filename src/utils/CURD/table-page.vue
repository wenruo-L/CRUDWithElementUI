<template>
  <div class="table-page" v-if="shouldShowPage">
    <slot name="page"></slot>
    <el-pagination
      :small="page.small"
      :disabled="defaultPage.disabled"
      :pager-count="defaultPage.pagerCount"
      :current-page.sync="defaultPage.currentPage"
      :background="defaultPage.background"
      :page-size="defaultPage.pageSize"
      :page-sizes="defaultPage.pageSizes"
      @size-change="sizeChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      :layout="defaultPage.layout"
      :total="defaultPage.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { vaildData } from "@/utils/validate";
import crudConfig from "@/utils/CURD/crud-config";
export default {
  name: "tabel-page",
  inject: ["crud"],
  props: {
    page: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      defaultPage: {
        total: 0, // 总页数
        pagerCount: 7, //超过多少条隐藏
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: "total, sizes, prev, pager, next, jumper",
        background: true, // 背景颜色
      },
    };
  },
  watch: {
    page: {
      handler() {
        this.pageInit();
      },
      deep: true,
    },
  },
  created() {
    this.pageInit();
    this.crud.$emit("on-load", this.defaultPage);
  },
  methods: {
    // 1.1默认展示分页器 除非主动传进了page:false
    // 1.2展示分页器条数得有值
    shouldShowPage() {
      return (
        vaildData(this.crud.crudOption.page, crudConfig.page) &&
        this.page.total &&
        this.page.total !== 0
      );
    },
    // 初始化
    pageInit() {
      this.defaultPage = Object.assign(this.defaultPage, this.page, {
        total: Number(this.page.total || this.defaultPage.total),
        pagerCount: Number(this.page.pagerCount || this.defaultPage.pagerCount),
        currentPage: Number(
          this.page.currentPage || this.defaultPage.currentPage
        ),
        pageSize: Number(this.page.pageSize || this.defaultPage.pageSize),
      });
      this.updateValue();
    },
    updateValue() {
      this.crud.$emit("update:page", this.defaultPage);
    },
    //下一页事件
    nextClick(val) {
      this.crud.$emit("next-click", val);
    },
    //上一页事件
    prevClick(val) {
      this.crud.$emit("prev-click", val);
    },
    // 页大小回调
    sizeChange(val) {
      this.defaultPage.currentPage = 1;
      this.defaultPage.pageSize = val;
      this.updateValue();
      this.crud.$emit("on-load", this.defaultPage);
      this.crud.$emit("size-change", val);
    },
    // 页码回调
    currentChange(val) {
      this.updateValue();
      this.crud.$emit("on-load", this.defaultPage);
      this.crud.$emit("current-change", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.table-page {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 25px 0 20px 20px;
}
</style>
<template>
  <el-dialog
    :title="dialogTitle"
    append-to-body
    :close-on-press-escape="crud.crudOption.dialogEscape || false"
    :close-on-click-modal="crud.crudOption.dialogClickModal || false"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :fullscreen="fullscreen"
    @closed="close"
  >
    <div slot="title" class="dialog__header">
      <span class="el-dialog__title">{{ dialogTitle }}</span>
      <div class="dialog__menu">
        <i
          @click="handleFullScreen"
          :class="fullscreen ? 'el-icon-news' : 'el-icon-full-screen'"
          class="el-dialog__close"
        ></i>
      </div>
    </div>
    <p-form
      ref="PForm"
      v-if="dialogVisible"
      v-model="crud.tabelForm"
      :option="formOption"
      :boxType="openType"
      @submitForm="crud.handleSubmit"
      @cancelForm="close"
    ></p-form>
  </el-dialog>
</template>

<script>
import crudConfig from "@/utils/CURD/crud-config";
import { vaildData } from "@/utils/validate";
import pForm from "@/utils/CURD/p-form/p-form";
export default {
  name: "dialog-form",
  inject: ["crud"],
  components: {
    pForm,
  },
  computed: {
    formOption() {
      return { column: this.crud.crudOption.column };
    },
    dialogWidth() {
      return vaildData(
        this.crud.crudOption.dialogWidth,
        crudConfig.dialogWidth
      );
    },
    dialogTitle() {
      return this.openType === "add"
        ? "新 增"
        : this.openType === "edit"
        ? "编 辑"
        : "查 看";
    },
  },
  data() {
    return {
      dialogVisible: false,
      openType: "add", //add view edit
      fullscreen: false,
    };
  },
  methods: {
    // 打开弹窗
    show(openType) {
      let hadBeforeOpen = typeof this.crud.beforeOpen === "function";
      const callback = () => {
        this.dialogVisible = true;
        this.openType = openType;
      };
      // 打开弹窗前的回调
      if (hadBeforeOpen) {
        this.crud.beforeOpen(callback, openType);
      } else {
        callback();
      }
    },
    // 关闭弹窗
    close() {
      this.dialogVisible = false;
    },
    handleFullScreen() {
      this.fullscreen = !this.fullscreen;
    },
  },
};
</script>

<style lang='scss' scoped>
@import url("./style/dialog-form.scss");
</style>
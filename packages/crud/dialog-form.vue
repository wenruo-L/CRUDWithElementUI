<template>
  <el-dialog
    :title="dialogTitle"
    append-to-body
    :close-on-press-escape="crud.option.dialogEscape || false"
    :close-on-click-modal="crud.option.dialogClickModal || false"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :fullscreen="fullscreen"
    v-dialogDrag="getDialogBind"
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
      v-model="crud.tableForm"
      :status.sync="btnDisabled"
      :option="formOption"
      :boxType="openType"
      :needBtnMune="false"
      @submitForm="crud.handleSubmit"
    >
      <template v-for="item in crud.formSlot" :slot="item" slot-scope="scope">
        <slot v-bind="scope" :name="item"></slot>
      </template>
    </p-form>
    <div
      slot="footer"
      class="dialog-footer"
      :style="'text-align:' + muneAlign"
      v-if="!isView"
    >
      <el-button
        type="primary"
        :size="size"
        :icon="btnDisabled ? 'el-icon-loading' : 'el-icon-circle-check'"
        :disabled="btnDisabled"
        @click="submit"
      >
        {{ getSubmitBtnText }}
      </el-button>
      <el-button
        :size="size"
        :icon="btnDisabled ? 'el-icon-loading' : 'el-icon-circle-close'"
        :disabled="btnDisabled"
        @click="close"
      >
        {{ getCancelBtnText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import crudConfig from "../config/crud-config";
import pFormConfig from "../config/p-form-config";
import dialogDrag from "../directive/dialog-drag";
import { vaildData } from "@/utils/validate";

export default {
  name: "dialog-form",
  inject: ["crud"],
  directives: {
    dialogDrag,
  },
  computed: {
    formOption() {
      return {
        detail: this.crud.option.detail,
        column: this.crud.columnList,
      };
    },
    dialogWidth() {
      return vaildData(this.crud.option.dialogWidth, crudConfig.dialogWidth);
    },
    dialogTitle() {
      return this.openType === "add"
        ? "新 增"
        : this.openType === "edit"
        ? "编 辑"
        : "查 看";
    },
    size() {
      return vaildData(this.crud.option.size, pFormConfig.size);
    },
    muneAlign() {
      return vaildData(this.crud.option.muneAlign, pFormConfig.muneAlign);
    },
    getSubmitBtnText() {
      return vaildData(this.crud.option.submitText, pFormConfig.submitText);
    },
    getCancelBtnText() {
      return vaildData(this.crud.option.cancelText, pFormConfig.cancelText);
    },
    isView() {
      return this.openType === "view";
    },
    // 是否开启拖拽表单
    getDialogBind() {
      return this.crud.option.dialogDrag === true;
    },
  },
  data() {
    return {
      dialogVisible: false,
      openType: "add", //add view edit
      fullscreen: false,
      btnDisabled: false,
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
    submit() {
      this.$refs.PForm.submitForm();
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
@import "/src/style/dialog-form.scss";
</style>
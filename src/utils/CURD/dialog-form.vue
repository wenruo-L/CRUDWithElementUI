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
import crudConfig from "@/utils/CURD/crud-config";
import pFormConfig from "@/utils/CURD/p-form/p-form-config";
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
    size() {
      return vaildData(this.crud.crudOption.size, pFormConfig.size);
    },
    muneAlign() {
      return vaildData(this.crud.crudOption.muneAlign, pFormConfig.muneAlign);
    },
    getSubmitBtnText() {
      return vaildData(this.crud.crudOption.submitText, pFormConfig.submitText);
    },
    getCancelBtnText() {
      return vaildData(this.crud.crudOption.cancelText, pFormConfig.cancelText);
    },
    isView() {
      return this.openType === "view";
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
@import "./style/dialog-form.scss";
</style>
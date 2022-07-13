<template>
  <div class="crud__from">
    <!-- PForm:{{ PForm }} -->
    <el-form
      ref="PForm"
      class="p-from"
      :model="PForm"
      :label-width="getFormLabelWidth"
      :size="size"
      :label-suffix="labelSuffix"
      :label-position="labelPosition"
      @submit.native.prevent
    >
      <div :class="btnMode === 'inline' ? 'row-content-flex' : 'row-content'">
        <el-row :gutter="20" class="row-main-content">
          <template v-for="(column, index) in columnOption">
            <el-col :span="columnSpan(column)" :key="column.prop">
              <el-form-item
                :key="'pform-item-' + column.prop + index"
                :label="column.label"
                :prop="column.prop"
                :rules="column.rules"
                :label-width="getColumnLabelWidth(column)"
                :label-position="column.position || labelPosition"
              >
                <!-- 内容插槽 -->
                <slot
                  v-if="column.formSlot"
                  v-bind="{ size, disabled: getDisabled(column) }"
                  :name="column.prop + 'Form'"
                ></slot>
                <!-- 组件 -->
                <component
                  v-else
                  :is="getComponent(column.type, column.props)"
                  :disabled="getDisabled(column)"
                  v-model="PForm[column.prop]"
                  v-bind="getComponentBind(column)"
                  clearable
                  style="width: 100%"
                  @change="
                    (value) => {
                      handleChange(value, column);
                    }
                  "
                >
                  <!-- radio 处理 -->
                  <template
                    v-if="
                      column.type === 'radio' &&
                      column.dicData &&
                      column.dicData.length
                    "
                  >
                    <template
                      v-if="column.showType && column.showType === 'button'"
                    >
                      <el-radio-button
                        v-for="(item, index) in column.dicData"
                        :key="index"
                        :size="size"
                        :label="item[getFormItemValue(column)]"
                      >
                        {{ item[getFormItemLabel(column)] }}
                      </el-radio-button>
                    </template>
                    <template v-else>
                      <el-radio
                        v-for="(item, index) in column.dicData"
                        :key="index"
                        :size="size"
                        :label="item[getFormItemValue(column)]"
                      >
                        {{ item[getFormItemLabel(column)] }}
                      </el-radio>
                    </template>
                  </template>
                  <!-- checkbox 处理 -->
                  <template
                    v-if="
                      column.type === 'checkbox' &&
                      column.dicData &&
                      column.dicData.length
                    "
                  >
                    <el-checkbox
                      v-for="(item, index) in column.dicData"
                      :key="index"
                      :label="item[getFormItemValue(column)]"
                    >
                      {{ item[getFormItemLabel(column)] }}
                    </el-checkbox>
                  </template>
                  <!-- select 处理 -->
                  <template
                    v-if="
                      column.type === 'select' &&
                      column.dicData &&
                      column.dicData.length
                    "
                  >
                    <el-option
                      v-for="item in column.dicData"
                      :key="item[column.prop]"
                      :label="item[getFormItemLabel(column)]"
                      :value="item[getFormItemValue(column)]"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </template>
                  <!-- upload 处理 -->
                  <!-- upload的插槽套上template会失效，暂时直接判断到插槽 -->
                  <el-button
                    size="small"
                    type="primary"
                    :disabled="getDisabled(column)"
                    v-if="
                      column.type == 'upload' &&
                      getListType(column.listType) === 'text'
                    "
                  >
                    点击上传
                  </el-button>
                  <!-- 有传限制就动态提示 -->
                  <div slot="tip" class="el-upload__tip" v-if="column.fileType">
                    <span> 只能上传{{ column.fileType }}文件 </span>
                    <span v-if="column.fileSize">
                      ，且不超过{{ column.fileSize }}MB
                    </span>
                  </div>
                </component>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <div
          v-if="!isView"
          :class="
            btnMode === 'search'
              ? 'row-mune-content row-mune-content__inline'
              : 'row-mune-content row-mune-content__block'
          "
        >
          <!-- v-loading用在按钮有点丑 -->
          <el-button
            type="primary"
            :size="size"
            v-if="shouldShowSubmitBtn"
            :icon="allDisabled ? 'el-icon-loading' : 'el-icon-circle-check'"
            :disabled="allDisabled"
            @click="submitForm('PForm')"
          >
            保 存
          </el-button>
          <el-button
            :size="size"
            :icon="allDisabled ? 'el-icon-loading' : 'el-icon-circle-close'"
            v-if="shouldShowCancelBtn"
            :disabled="allDisabled"
            @click="handleCancel"
          >
            取 消
          </el-button>
          <el-button
            :size="size"
            v-if="shouldShowResetBtn"
            :icon="allDisabled ? 'el-icon-loading' : 'el-icon-delete'"
            :disabled="allDisabled"
            @click="resetForm"
          >
            重 置
          </el-button>
        </div>
      </div>
    </el-form>
    <!-- upload 预览 -->
    <el-dialog :visible.sync="uploadDialog">
      <img width="100%" :src="uploadDataUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { setPx, changeValueType } from "@/utils/util";
import { vaildData } from "@/utils/validate";
import upload from "@/utils/CURD/upload";
import pFormConfig from "@/utils/CURD/p-form/p-form-config";

export default {
  name: "p-from",
  model: {
    prop: "form",
    event: "handleformvaluechange",
  },
  props: {
    // 父组件绑定的值
    form: {
      type: Object,
      default: Object.create(null),
    },
    // 表单的配置
    option: {
      type: Object,
      default: Object.create(null),
    },
    // 按钮模式  正常表单 block 搜索栏表单 inline
    btnMode: {
      type: String,
      default: "block",
    },
    // 显示模式 详情  新增  编辑
    //         view  add   edit
    boxType: {
      type: String,
      default: "edit",
    },
  },
  mixins: [upload()],
  data() {
    return {
      PForm: {},
      uploadDialog: false,
      uploadDataUrl: "",
      allDisabled: false, //用于提交表单时禁用所有按钮及组件操作
    };
  },
  watch: {
    PForm: {
      handler(val) {
        this.handleformvaluechange(val);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    columnOption() {
      let result = [];
      if (this.option.column.length === 0) return result;
      result = this.option.column.filter((item, index) => {
        item.$index = index;
        return !item.display || (item.display && item.display !== true);
      });
      return result;
    },
    getFormLabelWidth() {
      let labelWidth = vaildData(this.option.labelWidth)
        ? this.option.labelWidth
        : pFormConfig.labelWidth;
      return setPx(labelWidth);
    },
    // 大小
    size() {
      return vaildData(this.option.size, pFormConfig.size);
    },
    // 对齐方式
    labelPosition() {
      return vaildData(this.option.labelPosition, pFormConfig.labelPosition);
    },
    labelSuffix() {
      return vaildData(this.option.labelSuffix, pFormConfig.labelSuffix);
    },
    shouldShowSubmitBtn() {
      return vaildData(this.option.submitBtn, pFormConfig.submitBtn);
    },
    shouldShowResetBtn() {
      return vaildData(this.option.resetBtn, pFormConfig.resetBtn);
    },
    shouldShowCancelBtn() {
      return vaildData(this.option.cancelBtn, pFormConfig.cancelBtn);
    },
    // 判断表单的模式
    isView() {
      return this.boxType === "view";
    },
    isAdd() {
      return this.boxType === "add";
    },
    isEdit() {
      return this.boxType === "edit";
    },
  },
  created() {
    this.formInit();
    this.$nextTick(() => this.clearValidate());
  },
  methods: {
    // 禁用表单
    disableForm() {
      this.allDisabled = true;
    },
    // 启用表单
    enableForm() {
      this.allDisabled = false;
      this.formInit(true);
      this.clearValidate();
    },
    // 提交校验
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleSubmit();
        } else {
          return false;
        }
      });
    },
    // 清除校验
    clearValidate() {
      this.$refs.PForm.clearValidate();
    },
    // 提交
    handleSubmit() {
      this.disableForm();
      this.$emit("submitForm", this.PForm, this.enableForm);
    },
    // 取消
    handleCancel() {
      this.$emit("cancelForm");
    },
    // 重置表单
    resetForm() {
      this.formInit();
      this.$emit("resetFrom");
    },
    handleChange(value, column) {
      console.log("handleChange", value);
      console.log("column", column.label, column);
      let lableValueName = "$" + column.prop;
      if (column.type === "select" || column.type === "radio") {
        if (column.multiple) {
          this.PForm[lableValueName] = column.dicData.filter((item) => {
            return value.includes(item[this.getFormItemValue(column)]);
          });
        } else {
          this.PForm[lableValueName] = column.dicData.find((item) => {
            return item[this.getFormItemValue(column)] == value;
          })[this.getFormItemLabel(column)];
        }
      }
    },
    // 根据option传进来的column数组初始化form的值
    formInit(reset) {
      if (!this.option.column || this.option.column.length <= 0) return;
      this.option.column.forEach((el) => {
        if (!el.display || (el.display && el.display !== true)) {
          // 这些类型的组件有可能会把label和value的值一起传给后台，在此初始化
          // 取消checkBox和cascader（cascader绑定了ref，使用getCheckedNodes）
          let addLableValueType = ["select", "radio"];
          // 初始化默认值
          let defaultValue;
          if (reset) {
            defaultValue = changeValueType(el.dataType, el.value);
          } else {
            // 设置父组件form传进的值，如果没有对应的值则设置默认值
            defaultValue = this.form[el.prop]
              ? changeValueType(el.dataType, this.form[el.prop])
              : changeValueType(el.dataType, el.value);
          }
          this.$set(this.PForm, el.prop, defaultValue);
          if (el.type && addLableValueType.includes(el.type)) {
            let addLableValueName = "$" + el.prop;
            this.$set(this.PForm, addLableValueName, defaultValue);
          }
        }
      });
    },
    // 获取下拉框，单选框，多选框，联级等的组件绑定的label
    getFormItemLabel(column) {
      return column.props && column.props.label
        ? column.props.label
        : pFormConfig.props.label;
    },
    // 获取下拉框，单选框，多选框，联级等的组件绑定的value
    getFormItemValue(column) {
      return column.props && column.props.value
        ? column.props.value
        : pFormConfig.props.value;
    },
    // 获取form-item的labelWidth
    getColumnLabelWidth(column) {
      let labelWidth = vaildData(column.labelWidth)
        ? column.labelWidth
        : pFormConfig.labelWidth;
      return setPx(labelWidth);
    },
    // 获取组件是否禁用
    getDisabled(column) {
      return vaildData(column.disabled, false) || this.allDisabled;
    },
    // 动态获取组件
    getComponent(type, props) {
      let key_component_name = pFormConfig.key_component_name;
      let result = type || "input";
      // 特殊处理
      switch (result) {
        case "number":
          result = "input-number";
          break;
        case "password":
          result = "input";
          break;
        case "radio":
          result = "radio-group";
          break;
        case "checkbox":
          result = "checkbox-group";
          break;
        case "time":
          if (props) {
            result = "time-select";
          } else {
            result = "time-picker";
          }
          break;
        case "datetime":
          result = "date-picker";
          break;
        case "datetimerange":
          result = "date-picker";
          break;
      }
      return key_component_name + result;
    },
    // 动态绑定组件的option
    getComponentBind(column) {
      let result = {};
      let type = column.type || "input";
      // 公共的
      result.size = this.size;
      result.readonly = column.readonly || false;
      // disabled需要动态，就不在这绑定了
      result.placeholder = this.getPlaceHolder(column);
      if (type === "password") {
        result.showPassword = true;
      } else if (type === "number") {
        result.min = column.min || -Infinity;
        result.max = column.max || Infinity;
        result.controlsPosition = column.controlsPosition || "right";
        result.precision = this.getPrecision(column);
      } else if (type === "select") {
        result.collapseTags = column.collapseTags || false;
        result.filterable = column.filterable || false;
        result.remote = column.remote || false;
        result.remoteMethod = column.remoteMethod;
        result.allowCreate = column.allowCreate;
        result.defaultFirstOption = result.allowCreate ? true : false;
        result.valueKey =
          column.props && column.props.value
            ? column.props.value
            : pFormConfig.valueKey;
        result.collapseTags = column.collapseTags || false;
        result.multiple = column.multiple || false;
        result.multipleLimit = column.multipleLimit || 0;
        result.loading = column.loading || false;
      } else if (type === "checkbox") {
        result.min = column.min || 0;
        result.max = column.max || Infinity;
      } else if (type === "cascader") {
        result.ref = `${column.prop}Cascader`;
        result.props = {
          expandTrigger: column.expandTrigger || "click",
          multiple: column.multiple || false,
          collapseTags: column.collapseTags || false,
          showAllLevels: column.showAllLevels || true,
          checkStrictly: column.checkStrictly || false,
          lazy: column.lazy || false,
          lazyLoad: column.lazyLoad || false,
          separator: column.separator || "/",
          label: this.getFormItemLabel(column),
          value: this.getFormItemValue(column),
        };
        result.filterable = column.filterable || false;
        result.options = column.dicData || [];
      } else if (type == "switch") {
        result = column.props || null;
      } else if (type == "time") {
        result.valueFormat = column.valueFormat || "yyyy-MM-dd HH:mm:ss";
        if (column.props != undefined) {
          result.pickerOptions = column.props || null;
        } else {
          result.isRange = vaildData(column.isRange, true);
          result.arrowControl = vaildData(column.arrowControl, false);
          result.rangeSeparator = column.rangeSeparator || "至";
          result.startPlaceholder = column.startPlaceholder || "开始时间";
          result.endPlaceholder = column.endPlaceholder || "结束时间";
          result.format = column.format || "yyyy-MM-dd HH:mm:ss";
        }
      } else if (type == "datetime") {
        result.type = "datetime";
        result.valueFormat = column.valueFormat || "yyyy-MM-dd HH:mm:ss";
        result.format = column.format || "yyyy-MM-dd HH:mm:ss";
        result.defaultTime = column.defaultTime || "12:00:00";
        if (column.needOptions === true) {
          result.pickerOptions = vaildData(
            column.props,
            pFormConfig.datetimePickerOptions
          );
        }
      } else if (type == "datetimerange") {
        result.type = "datetimerange";
        result.valueFormat = column.valueFormat || "yyyy-MM-dd HH:mm:ss";
        result.format = column.format || "yyyy-MM-dd HH:mm:ss";
        result.rangeSeparator = column.rangeSeparator || "至";
        result.startPlaceholder = column.startPlaceholder || "开始时间";
        result.endPlaceholder = column.endPlaceholder || "结束时间";
        result.defaultTime = column.defaultTime || ["12:00:00", "12:00:00"];
        if (column.needOptions === true) {
          result.pickerOptions = vaildData(
            column.props,
            pFormConfig.datetimerangePickerOptions
          );
        }
      } else if (type == "upload") {
        result.ref = `${column.prop}Upload`;
        result.class = "uploader";
        result.action = column.action || "#0";
        result.limit = column.limit || pFormConfig.limit;
        result.multiple = column.multiple || false;
        result.drag = column.drag || false;
        result.autoUpload = column.autoUpload || true;
        result.listType = column.listType || "text"; //text/picture/picture-card
        result.fileList =
          result.listType == "text" ? this.PForm[column.prop] : null;
        // 上传相关
        result.name =
          column.propsHttp && column.propsHttp.name
            ? column.propsHttp.name
            : "file";
        result.data =
          column.propsHttp && column.propsHttp.data
            ? column.propsHttp.data
            : null;
        result.headers =
          column.propsHttp && column.propsHttp.headers
            ? column.propsHttp.headers
            : null;
        // 事件
        // 上传前
        result.beforeUpload = (file) => {
          return this.beforeUpload(file, column);
        };
        // 上传成功
        result.onSuccess = (res) => {
          this.handleOnSuccess(res, column);
        };
        // 上传失败
        result.onError = (err, file, fileList, column) => {
          this.handleOnError(err, file, fileList, column);
        };
        // 超过限制数量
        result.onExceed = (files, fileList) => {
          this.handleExceed(files, fileList, column);
        };
        // 预览
        result.onPreview = this.handlePreview;
        // 删除前
        result.beforeRemove = (file, fileList) => {
          return this.beforeRemove(file, fileList);
        };
        // 删除
        result.onRemove = (file) => {
          this.handleRemove(file, column);
        };
      }
      return result;
    },
    // 动态获取组件的子组件
    // getChildComponent(column){
    //   let key_component_name = pFormConfig.key_component_name;
    //   if(column.type === 'select'){

    //   }

    // },
    // 当有校验规则的时候使用检验规则的提示
    getPlaceHolder(column) {
      let placeHolder = `请输入${column.label}`;
      let inputType = ["input", "textarea", "password"];
      let columnType = column.type || "input";
      if (!inputType.includes(columnType)) {
        placeHolder = `请选择${column.label}`;
      }
      if (column.rules && column.rules.length) {
        placeHolder = column.rules[0].message;
      }
      return placeHolder;
    },
    getPrecision(column) {
      return vaildData(column.precision, pFormConfig.precision);
    },
    columnSpan(column) {
      return this.btnMode === "block"
        ? vaildData(column.span, pFormConfig.span)
        : vaildData(column.searchSpan, pFormConfig.searchSpan);
    },
    // 这里函数名不使用大/小驼峰是因为监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)
    handleformvaluechange(val) {
      this.$emit("handleformvaluechange", val ? val : this.PForm);
    },
  },
};
</script>

<style >
@import url("../style/form.scss");
</style>

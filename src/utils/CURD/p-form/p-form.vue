<template>
  <div class="crud__from" :class="[{ form__detail: isView || isDetail }]">
    <el-form
      ref="PForm"
      class="p-from"
      :inline="inline"
      :model="PForm"
      :label-width="getFormLabelWidth"
      :size="size"
      :label-suffix="labelSuffix"
      :label-position="labelPosition"
      @submit.native.prevent
    >
      <el-row :gutter="20" class="row-main-content">
        <template v-for="(column, index) in columnOption">
          <el-col
            :span="columnSpan(column)"
            :offset="columnOffset(column)"
            :push="columnPush(column)"
            :pull="columnPull(column)"
            :key="column.prop"
            :class="[
              { 'form__detail form__detail__column': vaildDetail(column) },
            ]"
          >
            <el-form-item
              :key="'pform-item-' + column.prop + index"
              :label="column.label"
              :prop="column.prop"
              :rules="column.rules"
              :label-width="getColumnLabelWidth(column)"
            >
              <!-- 内容插槽 -->
              <!-- 20220721 修改 
                  不需要再在column里声明slot为true开启插槽，以$scopedSlots的存在对应prop字段为开启插槽 
              -->
              <slot
                v-if="$scopedSlots[column.prop]"
                v-bind="{ size, disabled: getDisabled(column) }"
                :name="column.prop"
              ></slot>
              <!-- 
                组件
              -->
              <component
                v-else
                :is="getComponent(column)"
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
                      :label="item[getColumnProps(column, 'value')]"
                    >
                      {{ item[getColumnProps(column, "label")] }}
                    </el-radio-button>
                  </template>
                  <template v-else>
                    <el-radio
                      v-for="(item, index) in column.dicData"
                      :key="index"
                      :size="size"
                      :label="item[getColumnProps(column, 'value')]"
                    >
                      {{ item[getColumnProps(column, "label")] }}
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
                    :label="item[getColumnProps(column, 'value')]"
                  >
                    {{ item[getColumnProps(column, "label")] }}
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
                    :label="item[getColumnProps(column, 'label')]"
                    :value="item[getColumnProps(column, 'value')]"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </template>
                <!-- upload 处理 -->

                <template v-if="getTypeOfTextOnUpload(column)">
                  <el-button
                    size="small"
                    type="primary"
                    :disabled="getDisabled(column)"
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
                </template>

                <!-- upload的插槽套上template会失效，暂时直接判断到插槽 -->
                <i
                  slot="default"
                  class="el-icon-plus"
                  v-if="getTypeOfPictureCardOnUpload(column)"
                >
                </i>
                <div
                  slot="file"
                  slot-scope="{ file }"
                  v-if="getTypeOfPictureCardOnUpload(column)"
                >
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="form[column.prop]"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!getDisabled(column)"
                      @click="handleRemove(file)"
                      class="el-upload-list__item-delete"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </component>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="muneSpan" v-if="!isView && needBtnMune">
          <el-form-item
            label-width="0px"
            :style="'width: 100%;text-align:' + muneAlign"
          >
            <el-button
              type="primary"
              :size="size"
              v-if="shouldShowSubmitBtn"
              :icon="allDisabled ? 'el-icon-loading' : 'el-icon-circle-check'"
              :disabled="allDisabled"
              @click="submitForm"
            >
              {{ getSubmitBtnText }}
            </el-button>
            <el-button
              :size="size"
              :icon="allDisabled ? 'el-icon-loading' : 'el-icon-circle-close'"
              v-if="shouldShowCancelBtn"
              :disabled="allDisabled"
              @click="handleCancel"
            >
              {{ getCancelBtnText }}
            </el-button>
            <el-button
              :size="size"
              v-if="shouldShowResetBtn"
              :icon="allDisabled ? 'el-icon-loading' : 'el-icon-delete'"
              :disabled="allDisabled"
              @click="resetForm"
            >
              {{ getResetBtnText }}
            </el-button>
            <slot name="menuForm" v-bind="{ size, disabled: allDisabled }">
            </slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { setPx, changeValueType, getPlaceHolder } from "@/utils/util";
import { vaildData } from "@/utils/validate";
import upload from "@/utils/CURD/upload";
import pFormConfig from "@/utils/CURD/p-form/p-form-config";
import pUpload from "@/utils/CURD/p-form/components/p-upload";

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
      default: () => {
        return {};
      },
    },
    // 表单的配置
    option: {
      type: Object,
      default: Object.create(null),
    },
    needBtnMune: {
      type: Boolean,
      default: true,
    },
    // 按钮模式
    inline: {
      type: Boolean,
      default: false,
    },
    // 显示模式 详情  新增  编辑
    //         view  add   edit
    boxType: {
      type: String,
      default: "edit",
    },
    // 通知父组件的禁用状态
    status: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [upload()],
  components: {
    pUpload,
  },
  data() {
    return {
      PForm: {},
      allDisabled: false, //用于提交表单时禁用所有按钮及组件操作
    };
  },
  watch: {
    form: {
      handler(val) {
        // this.PForm = val;
        // 这里不能直接等于父组件绑定的值，如果编辑模式，column有配置，而没有对应的值，赋值会报错
        this.PForm = Object.assign(this.PForm, val);
      },
      deep: true,
    },
    // 通知父组件的禁用状态 目前dialog-form用到
    allDisabled: {
      handler(val) {
        this.$emit("update:status", val);
      },
      immediate: true,
    },
    // 通知父组件PForm发生了变化
    PForm: {
      handler(val) {
        this.handleformvaluechange(val);
      },
      deep: true,
    },
  },
  computed: {
    // 2022-08-01
    // 这里最终决定主要处理是否需要隐藏的字段，以及后续要做的**表单分组**功能时处理数据
    // 针对表格的复杂表头的情况，应在父组件处理好数据格式后传进
    columnOption() {
      let result = [];
      if (this.option.column.length === 0) return result;
      result = this.option.column.filter((item) => {
        item.IsDisplay = this.vaildDisplay(item);
        return item.IsDisplay === true;
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
    muneAlign() {
      return vaildData(this.option.muneAlign, pFormConfig.muneAlign);
    },
    muneSpan() {
      return vaildData(this.option.muneSpan, pFormConfig.muneSpan);
    },
    shouldShowSubmitBtn() {
      return vaildData(this.option.submitBtn, pFormConfig.submitBtn);
    },
    shouldShowCancelBtn() {
      return vaildData(this.option.cancelBtn, pFormConfig.cancelBtn);
    },
    shouldShowResetBtn() {
      return vaildData(this.option.resetBtn, pFormConfig.resetBtn);
    },
    getSubmitBtnText() {
      return vaildData(
        this.option.submitText,
        this.inline ? pFormConfig.submitText__search : pFormConfig.submitText
      );
    },
    getCancelBtnText() {
      return vaildData(this.option.cancelText, pFormConfig.cancelText);
    },
    getResetBtnText() {
      return vaildData(this.option.resetText, pFormConfig.resetText);
    },
    // 判断表单的模式
    isView() {
      return this.boxType === "view" || this.option.detail === true;
    },
    isAdd() {
      return this.boxType === "add";
    },
    isEdit() {
      return this.boxType === "edit";
    },
    isDetail() {
      return this.option.detail === true;
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
    },
    // 提交校验
    submitForm() {
      this.$refs["PForm"].validate((valid) => {
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
      let lableValueName = "$" + column.prop;
      if (
        (column.type === "select" || column.type === "radio") &&
        column.lableValueName
      ) {
        if (column.multiple) {
          this.PForm[lableValueName] = column.dicData.filter((item) => {
            return value.includes(item[this.getColumnProps(column, "value")]);
          });
        } else {
          this.PForm[lableValueName] = column.dicData.find((item) => {
            return item[this.getColumnProps(column, "value")] == value;
          })[this.getColumnProps(column, "label")];
        }
      }
    },
    // 根据option传进来的column数组初始化form的值
    formInit(reset) {
      if (!this.option.column || this.option.column.length <= 0) return;
      let addLableValueType = ["select", "radio"];
      const dealWithColumn = (columnList) => {
        for (let el of columnList) {
          // 处理复杂表头下的初始化
          if (el.children && el.children.length) {
            return dealWithColumn(el.children);
          }
          // 这些类型的组件有可能会把label和value的值一起传给后台，在此初始化
          // 取消checkBox和cascader（cascader绑定了ref，使用getCheckedNodes）
          // 初始化默认值
          let defaultValue;
          if (reset) {
            defaultValue = changeValueType(el.dataType, el.value);
          } else {
            // 设置父组件form传进的值，如果没有对应的值则设置默认值
            if (el.dataType) {
              defaultValue = this.form[el.prop]
                ? changeValueType(el.dataType, this.form[el.prop])
                : changeValueType(el.dataType, el.value);
            } else {
              defaultValue = this.form[el.prop] ? this.form[el.prop] : el.value;
            }
          }
          this.$set(this.PForm, el.prop, defaultValue);
          if (
            el.type &&
            addLableValueType.includes(el.type) &&
            el.lableValueName
          ) {
            this.$set(this.PForm, el.lableValueName, defaultValue);
          }
        }
      };
      dealWithColumn(this.option.column);
    },
    // 获取下拉框，单选框，多选框，联级等的组件绑定的label,value,children
    getColumnProps(column, type) {
      return column.props && column.props[type]
        ? column.props[type]
        : pFormConfig.props[type];
    },
    // 获取form-item的labelWidth
    getColumnLabelWidth(column) {
      let labelWidth = vaildData(column.labelWidth)
        ? column.labelWidth
        : pFormConfig.labelWidth;
      return setPx(labelWidth);
    },
    // 获取组件是否禁用
    // option内传入detail:true和this.isView = true 为表单详情
    // allDisabled为表单进行操作时一切操作、组件的禁用
    getDisabled(column) {
      return (
        this.vaildDetail(column) ||
        this.vaildDisabled(column) ||
        this.isView === true ||
        this.allDisabled === true
      );
    },
    // 获取字段是否禁用
    // 1.1 是否新增/编辑弹窗表单模式都禁用 column.disabled === true
    // 1.2 addDisabled | editDisabled 分别对应新增和编辑时是否禁用
    // 1.3 查看弹窗必为禁用
    vaildDisabled(column) {
      if (column.allDisabled) return true;
      let key;
      if (column.disabled === true) {
        key = "disabled";
      } else if (this.boxType === "add") {
        key = "addDisabled";
      } else if (this.boxType === "edit") {
        key = "editDisabled";
      } else if (this.boxType === "view") {
        return true;
      }
      return vaildData(column[key], false);
    },
    // 获取字段是否为详情
    // 1.1 如果表单为详情或在option.detail === true 即为详情
    // 1.2 addDetail和editDetail分别对应新增和编辑时是否为详情
    vaildDetail(column) {
      if (this.isView === true) return true;
      let key;
      if (column.detail === true) {
        key = "detail";
      } else if (this.boxType === "add") {
        key = "addDetail";
      } else if (this.boxType === "edit") {
        key = "editDetail";
      } else if (this.boxType === "view") {
        return true;
      }
      return vaildData(column[key], false);
    },
    // 获取字段是否隐藏
    // 1.1 如果column.display===true即为隐藏
    // 1.2 addDisplay和editDisplay分别对应新增和编辑时是否隐藏
    vaildDisplay(column) {
      if (column.display === false) return false;
      let key;
      if (this.boxType === "add") {
        key = "addDisplay";
      } else if (this.boxType === "edit") {
        key = "editDisplay";
      }
      return vaildData(column[key], true);
    },
    // 动态获取组件
    // 1.1：element-ui的组件或者说是已经通过getComponent处理好的组件
    // 1.2：父组件自己传入的组件或者插件
    getComponent(column) {
      // 如果有传入自定义组件或者插件，直接返回传入的组件名
      if (column.component && column.component !== "") return column.component;
      // 20020802 upload特殊处理
      if (column.type === "upload") return "p-upload";
      let key_component_name = pFormConfig.key_component_name;
      let result = column.type || "input";
      // 特殊处理
      switch (result) {
        case "number":
          result = "input-number";
          break;
        case "textarea":
          result = "input";
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
          if (column.props) {
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
      result.placeholder = getPlaceHolder(column);
      // 1.1 处理自定义组件或者第三方插件的属性
      // 1.2 处理elementUI组件的属性
      if (
        column.component &&
        column.component !== "" &&
        column.params &&
        Object.keys(column.params).length != 0
      ) {
        result = Object.assign(result, column.params);
      }
      if (type === "input") {
        result.maxlength = column.maxlength;
        result.minlength = column.minlength;
      } else if (type === "textarea") {
        result.type = "textarea";
        result.rows = column.rows || 3;
        result.autosize = column.autosize;
        result.maxlength = column.maxlength;
        result.minlength = column.minlength;
        result.showWordLimit = column.showWordLimit;
        if (column.minRows) {
          result.autosize.minRows = column.minRows;
        }
        if (column.maxRows) {
          result.autosize.maxRows = column.minRows;
        }
      } else if (type === "password") {
        result.showPassword = true;
      } else if (type === "number") {
        result.min = column.min || -Infinity;
        result.max = column.max || Infinity;
        result.controlsPosition = column.controlsPosition || "right";
        result.precision = this.getPrecision(column);
      } else if (type === "select") {
        result.filterable = column.filterable || false;
        result.filterMethod = column.filterMethod;
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
      } else if (type === "radio") {
        result.border = column.border || false;
      } else if (type === "checkbox") {
        result.min = column.min || 0;
        result.max = column.max || Infinity;
      } else if (type === "cascader") {
        result.ref = `${column.prop}Cascader`;
        result.props = {
          multiple: column.multiple || false,
          expandTrigger: column.expandTrigger || "click",
          checkStrictly: column.checkStrictly || false,
          lazy: column.lazy || false,
          lazyLoad: column.lazyLoad || false,
          label: this.getColumnProps(column, "label"),
          value: this.getColumnProps(column, "value"),
          children: this.getColumnProps(column, "children"),
        };
        result.filterable = column.filterable || false;
        result.filterMethod = column.filterMethod;
        result.collapseTags = column.collapseTags || false;
        result.separator = column.separator || "/";
        result.showAllLevels = column.showAllLevels || true;
        result.options = column.dicData || [];
      } else if (type == "switch") {
        result.activeColor = column.activeColor || "#409EFF";
        result.inactiveColor = column.inactiveColor || "##C0CCDA";
        result.activeValue = column.activeValue || true;
        result.inactiveValue = column.inactiveValue || false;
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
        result[column.prop] = this.PForm[column.prop];
        result.action = column.action || "#0";
        result.accept = column.accept;
        result.fileSize = column.fileSize || pFormConfig.fileSize;
        result.limit = column.limit || pFormConfig.limit;
        result.multiple = column.multiple || false;
        result.drag = column.drag;
        result.autoUpload = column.autoUpload || true;
        result.listType = column.listType || "text"; //text/picture/picture-card
        result.dataType = column.dataType;
        if (result.listType === "text") {
          result.fileList = this.PForm[column.prop];
        } else {
          result.multiple = false;
        }
        // 上传相关
        result.fileName = column.propsHttp && column.propsHttp.fileName;
        result.name = column.propsHttp.name && column.propsHttp.name;
        result.domain = column.propsHttp.domain && column.propsHttp.domain;
        result.res = column.propsHttp.res && column.propsHttp.res;
        result.url = column.propsHttp.url && column.propsHttp.url;
        result.data = column.data;
        result.headers = column.headers;
      }
      return result;
    },
    // 动态获取组件的子组件
    // getChildComponent(column){
    //   let key_component_name = pFormConfig.key_component_name;
    //   if(column.type === 'select'){

    //   }

    // },
    // upload
    getTypeOfTextOnUpload(column) {
      return column.type == "upload" && column.listType === "text";
    },
    getTypeOfPictureCardOnUpload(column) {
      return column.type == "upload" && column.listType === "picture-card";
    },
    getPrecision(column) {
      return vaildData(column.precision, pFormConfig.precision);
    },
    columnSpan(column) {
      return this.inline
        ? vaildData(column.searchSpan, pFormConfig.searchSpan)
        : vaildData(column.span, pFormConfig.span);
    },
    columnOffset(column) {
      return vaildData(column.offset, pFormConfig.offset);
    },
    columnPush(column) {
      return vaildData(column.push, pFormConfig.push);
    },
    columnPull(column) {
      return vaildData(column.pull, pFormConfig.pull);
    },
    // 这里函数名不使用大/小驼峰是因为监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)
    handleformvaluechange(val) {
      this.$emit("change", val);
      this.$emit("handleformvaluechange", val ? val : this.PForm);
    },
  },
};
</script>

<style lang="scss">
@import "../style/form.scss";
</style>

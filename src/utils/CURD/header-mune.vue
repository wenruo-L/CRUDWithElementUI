<template>
  <div class="header-mune" v-show="searchShow">
    searchForm:{{ searchForm }}
    <p-form
      v-if="crud.searchShow"
      ref="PForm"
      v-model="searchForm"
      :option="option"
      :inline="true"
      @change="handleChange"
      @submitForm="searchChange"
      @resetFrom="resetChange"
    >
      <template slot="menuForm">
        <template v-if="shouldShowSearchToggleIcon">
          <el-button
            type="text"
            v-if="show === false"
            @click="show = true"
            icon="el-icon-arrow-down"
            >展开</el-button
          >
          <el-button
            type="text"
            v-if="show === true"
            @click="show = false"
            icon="el-icon-arrow-up"
            >收起</el-button
          >
        </template>
      </template>
      <!-- @submitForm="crud.handleSubmit"
      @cancelForm="close" -->
    </p-form>
  </div>
</template>

<script>
import pForm from "@/utils/CURD/p-form/p-form";
import pFormConfig from "@/utils/CURD/p-form/p-form-config";
import crudConfig from "@/utils/CURD/crud-config";
import { deepClone, getPlaceHolder } from "@/utils/util";
import { vaildData } from "@/utils/validate";
export default {
  name: "header-mune",
  inject: ["crud"],
  components: {
    pForm,
  },
  data() {
    return {
      show: false,
      option: {},
      searchShow: true,
      searchForm: {},
      searchIndex: 4,
    };
  },
  watch: {
    show() {
      this.initOption();
    },
  },
  computed: {
    // 搜索的字段有多少
    searchLen() {
      let count = 0;
      this.crud.crudOption.column.forEach((el) => {
        if (el.search === true) count++;
      });
      return count;
    },

    // 是否展示搜索栏的按钮的展开/收起按钮
    // 1.1 是否显示搜索
    // 1.2 搜索的字段的长度是否大于要收起的数量
    shouldShowSearchToggleIcon() {
      return (
        vaildData(this.crud.crudOption.searchBtn, crudConfig.searchBtn) &&
        this.searchLen > this.searchIndex
      );
    },
  },
  created() {
    this.initFun();
    this.initOption();
  },
  methods: {
    initFun() {
      ["searchReset", "searchChange"].forEach((item) => {
        this.crud[item] = this[item];
      });
    },
    // 搜索回调
    searchChange(form, done) {
      this.crud.$emit("search-change", form, done);
    },
    // 搜索清空
    resetChange() {
      this.crud.$emit("search-reset", this.searchForm);
    },
    handleChange() {
      this.crud.$emit("update:query", this.searchForm);
    },
    initOption() {
      const option = this.crud.crudOption;
      this.searchShow = vaildData(option.searchBtn, crudConfig.searchBtn);
      this.searchIndex = vaildData(option.searchIndex, 4);
      this.searchForm = deepClone(this.crud.query);
      const dealWithColumn = (list = []) => {
        let column = [];
        list.forEach((el, index) => {
          if (el.search === true) {
            let obj = {};
            obj.label = el.label;
            obj.prop = el.prop;
            obj.props = el.props;
            obj.dicData = el.dicData;
            obj.type = this.getSearchType(el);
            obj.size = vaildData(el.searchSize, pFormConfig.size);
            obj.span = vaildData(el.searchSpan, pFormConfig.searchSpan);
            obj.labelWidth = vaildData(
              el.searchLabelWidth,
              pFormConfig.labelWidth
            );
            obj.labelSuffix = vaildData(
              el.searchLabelSuffix,
              pFormConfig.labelSuffix
            );
            obj.placeholder = vaildData(
              el.searchPlaceholder,
              getPlaceHolder(el)
            );
            obj.value = vaildData(el.searchValue, this.searchForm[el.prop]);
            obj.rules = el.searchRules;
            obj.display = (() => {
              if (!this.show) {
                return index > this.searchIndex - 1 ? true : false;
              } else {
                return false;
              }
            })();
            obj.formslot = el.searchslot;
            column.push(obj);
          }
        });
        return column;
      };
      let searchOption = {
        column: dealWithColumn(deepClone(option.column)),
        cancelBtn: false,
        labelWidth: vaildData(option.labelWidth, pFormConfig.labelWidth),
        labelPosition: vaildData(
          option.labelPosition,
          pFormConfig.labelPosition
        ),
        submitBtn: vaildData(option.searchSubmitBtn, pFormConfig.submitBtn),
        submitText: vaildData(
          option.searchSubmitText,
          pFormConfig.submitText__search
        ),
        resetBtn: true,
        resetText: vaildData(option.searchResetText, pFormConfig.resetText),
        muneSpan: vaildData(option.searchMenuSpan, pFormConfig.searchSpan),
      };
      this.option = searchOption;
    },
    // 获取搜索栏对应的组件类型
    getSearchType(column) {
      const type = column.type;
      let result = type;
      if (column.searchType) return column.searchType;
      if (["radio", "checkbox", "switch"].includes(type)) {
        result = "select";
      } else if (["textarea"].includes(type)) {
        result = "input";
      }
      return result;
    },
  },
};
</script>
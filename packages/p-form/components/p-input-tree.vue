<template>
  <el-select
    class="p-input-tree"
    :size="size"
    ref="main"
    :loading="loading"
    :loading-text="loadingText"
    :multiple="multiple"
    :multiple-limit="limit"
    :collapse-tags="tags"
    :value="labelShow"
    :clearable="clearableVal"
    :placeholder="placeholder"
    :disabled="disabled"
    @click.native="initScroll"
    @clear="handleClearSelect"
  >
    <div v-if="filter" style="padding: 0 10px; margin: 5px 0 0 0">
      <el-input
        size="mini"
        :placeholder="filterText"
        v-model="filterValue"
      ></el-input>
    </div>
    <el-option :value="text" class="p-input-tree-option">
      <el-tree
        :data="dicList"
        class="tree-option"
        style="padding: 10px 0"
        :node-key="props.value"
        :accordion="accordion"
        :icon-class="iconClass"
        :show-checkbox="multiple"
        :expand-on-click-node="expandOnClickNode"
        :props="treeProps"
        :check-strictly="checkStrictly"
        ref="tree"
        :highlight-current="!multiple"
        :current-node-key="multiple ? '' : text"
        :filter-node-method="filterNode"
        :default-expand-all="defaultExpandAll"
        @check="checkChange"
        @node-click.self="handleNodeClick"
      >
        <div style="width: 100%; padding-right: 10px" slot-scope="{ data }">
          <span :class="{ disabled: data[disabledKey] }">
            {{ data[labelKey] }}
          </span>
          <span class="desc" v-if="data[descKey]">{{ data[descKey] }}</span>
        </div>
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
import pFormConfig from "../../config/p-form-config";
import { deepClone } from "@/utils/util";
import { validatenull, vaildData } from "@/utils/validate";
import { detailDataType } from "@/utils/util";
export default {
  name: "p-input-tree",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    typeformat: Function,
    nodeClick: Function,
    checked: Function,
    value: {},
    loadingText: {
      type: String,
      default: "加载中。。。",
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 多选时是否将选中值按文字的形式展示
    tags: {
      type: Boolean,
      default: false,
    },
    // 多选时用户最多可以选择的项目数，为 0 则不限制
    limit: {
      type: Number,
      default: 0,
    },
    // 是否开启搜索
    filter: {
      type: Boolean,
      default: true,
    },
    // 搜索提示语
    filterText: {
      type: String,
      default: "输入关键字进行过滤",
    },
    // 是否只是叶子节点，默认值为 false
    leafOnly: {
      type: Boolean,
      default: false,
    },
    //是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 是否每次只打开一个同级树节点展开
    accordion: {
      type: Boolean,
      default: false,
    },
    // 父类是否可选
    parent: {
      type: Boolean,
      default: true,
    },
    // 自定义树节点的图标
    iconClass: {
      type: String,
    },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 自定义绑定值
    props: {
      type: Object,
      default: () => {
        return pFormConfig.props;
      },
    },
    size: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    separator: {
      type: String,
      default: ",",
    },
    dataType: {
      type: String,
    },
    dicData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      node: [],
      text: undefined,
      filterValue: "",
      created: false,
      loading: false,
    };
  },
  watch: {
    value(val) {
      this.text = val;
      this.init();
    },
    filterValue(val) {
      this.$refs.tree.filter(val);
    },
    // 直接绑定default-checked-keys会叠加，改手动设置默认值
    keysList(val) {
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCheckedKeys(val);
    },
  },
  computed: {
    dic() {
      return this.dicData;
    },
    keysList() {
      if (validatenull(this.text)) return [];
      let list = [];
      if (Array.isArray(this.text)) {
        list = this.text;
      } else {
        list = (this.text + "").split(this.separator);
        list = list.map((ele) => detailDataType(ele, this.dataType));
      }
      return list;
    },
    treeProps() {
      return Object.assign(this.props, {
        isLeaf: this.leafKey,
      });
    },
    dicList() {
      function addParent(result, parent) {
        result.forEach((ele) => {
          const children = ele.children;
          if (children) {
            addParent(children, ele);
          }
          if (parent) {
            ele.$parent = parent;
          }
        });
      }
      let list = this.dic;
      addParent(list);
      return list;
    },
    labelShow() {
      let result = [];
      let list = deepClone(this.node);
      if (this.typeformat) {
        result = list.map((ele) => this.getLabelText(ele));
      } else {
        result = list.map((ele) => ele[this.labelKey]);
      }
      if (this.multiple) {
        return result;
      } else {
        return result.join("");
      }
    },
    clearableVal() {
      return this.disabled ? false : this.clearable;
    },
    labelKey() {
      return this.props.label || pFormConfig.props.label;
    },
    valueKey() {
      let res = this.props.value || pFormConfig.props.value;
      return res;
    },
    childrenKey() {
      return this.props.children || pFormConfig.props.children;
    },
    descKey() {
      return this.props.desc || pFormConfig.props.desc;
    },
    leafKey() {
      return this.props.leaf || pFormConfig.props.leaf;
    },
    disabledKey() {
      return this.props.disabled || pFormConfig.props.disabled;
    },
  },
  created() {
    this.text = this.value;
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.node = [];
        if (this.multiple) {
          let list = this.$refs.tree.getCheckedNodes(this.leafOnly, false);
          list.forEach((ele) => {
            this.node.push(ele);
          });
        } else {
          let node = this.$refs.tree.getNode(vaildData(this.text, ""));
          if (node) {
            let data = node.data;
            this.$refs.tree.setCurrentKey(data[this.valueKey]);
            this.node.push(data);
          }
        }
      });
      //是否禁止父类
      this.disabledParentNode(this.dicList, this.parent);
      this.$emit("change", this.text);
    },
    disabledParentNode(dic, parent) {
      dic.forEach((ele) => {
        const children = ele[this.childrenKey];
        if (validatenull(children) === false) {
          if (!parent) {
            ele.disabled = true;
          }
          this.disabledParentNode(children, parent);
        }
      });
    },
    handleClearSelect() {
      if (this.multiple) {
        this.text = [];
      } else {
        this.text = "";
      }
      this.node = [];
      this.handleClearTree();
      this.init();
    },
    handleClearTree() {
      this.filterValue = "";
      this.$refs.tree.setCurrentKey(null);
      this.$refs.tree.setCheckedKeys([]);
    },
    handleNodeClick(data, node, nodeComp) {
      if (data.disabled) return;
      if (typeof this.nodeClick === "function")
        this.nodeClick(data, node, nodeComp);
      if (this.multiple) return;
      if (
        (validatenull(data[this.childrenKey]) && !this.multiple) ||
        this.parent
      ) {
        this.text = data[this.valueKey];
        this.$refs.main.blur();
      }
      this.init();
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data[this.labelKey].toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    },
    checkChange(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.text = [];
      const list = this.$refs.tree.getCheckedNodes(this.leafOnly, false);
      list.forEach((node) => this.text.push(node[this.valueKey]));
      this.init();
      if (typeof this.checked === "function")
        this.checked(
          checkedNodes,
          checkedKeys,
          halfCheckedNodes,
          halfCheckedKeys
        );
    },
    // 初始化滚动条
    initScroll() {
      setTimeout(() => {
        this.$nextTick(() => {
          let scrollBar = document.querySelectorAll(
            ".el-scrollbar .el-select-dropdown__wrap"
          );
          scrollBar.forEach((ele) => {
            ele.scrollTop = 0;
          });
        });
      }, 0);
    },
    // 获取label值
    getLabelText(item) {
      if (validatenull(item)) return "";
      if (typeof this.typeformat === "function") {
        return this.typeformat(item, "label", "value");
      }
      return item[this.labelKey];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "/src/style/input-tree.scss";
</style>

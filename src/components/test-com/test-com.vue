<template>
  <!-- 一个简单的双向绑定的input框 -->
  <el-input
    :disabled="disabled"
    placeholder="我是全局注册的测试组件喔"
    v-model="textStr"
  ></el-input>
</template>

<script>
export default {
  name: "test-com",
  model: {
    prop: "textValue",
    event: "handleValueChange",
  },
  props: {
    textValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    textStr: {
      handler() {
        this.handleValueChange();
      },
      immediate: true,
    },
  },
  data() {
    return {
      textStr: "",
    };
  },
  mounted() {
    console.log("test-com", this);
  },
  methods: {
    handleValueChange() {
      console.log("test-com  handleValueChange");
      this.$emit("input", this.textStr);
    },
  },
};
</script>
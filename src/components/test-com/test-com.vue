<template>
  <div>
    <!-- 一个简单的双向绑定的input框 -->
    <el-input
      :disabled="disabled"
      placeholder="我是全局注册的测试组件喔"
      v-model="textStr"
    ></el-input>
    <el-button type="text">testParams:{{ testParams }}</el-button>
  </div>
</template>

<script>
export default {
  name: "test-com",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    testCom: {
      type: String,
      default: "",
    },
    textValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    testParams: {
      type: String,
      default: "",
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
  created() {
    console.log("test-com this", this);
  },
  methods: {
    handleValueChange() {
      this.$emit("handlevaluechange", this.textStr);
    },
  },
};
</script>
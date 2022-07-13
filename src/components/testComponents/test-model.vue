<template>
  <div>
    这里有个对象testForm：{{ testForm }}
    <el-form ref="form" :model="testForm" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="testForm.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model.number="testForm.age"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="testForm.sex"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "test-model",
  model: {
    prop: "form",
    event: "handleformvaluechange",
  },
  props: {
    form: {
      type: Object,
      default: Object.create(null),
    },
  },
  watch: {
    testForm: {
      handler(val) {
        this.handleformvaluechange(val);
      },
      deep: true,
    },
  },
  data() {
    return {
      testForm: {},
    };
  },
  created() {
    this.$set(this.testForm, "name", "test");
    this.$set(this.testForm, "age", 19);
    this.$set(this.testForm, "sex", "男");
    this.handleformvaluechange();
  },
  methods: {
    handleformvaluechange(val) {
      this.$emit("handleformvaluechange", val ? val : this.testForm);
    },
  },
};
</script>
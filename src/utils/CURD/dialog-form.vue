<template>
  <el-dialog title="" :visible.sync="dialogVisible" width="width">
    <p-form></p-form>
  </el-dialog>
</template>

<script>
import pForm from "@/utils/CURD/p-form/p-form";
export default {
  name: "dialog-form",
  inject: ["crud"],
  components: {
    pForm,
  },
  computed: {
    formOption() {
      return {};
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
};
</script>
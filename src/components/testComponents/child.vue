<template>
  <div>
    C组件
    <div>
      <slot name="pane" data="我是C"
        >我是c组件(儿子)---外部没传递，我才显示</slot
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goods: "apple",
    };
  },
};
</script>

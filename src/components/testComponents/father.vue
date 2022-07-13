<template>
  <div>
    B组件---这是一个中间传递的slot
    <level3>
      <template v-slot:pane="{ data }">
        <!-- 定义插槽用于接受其父级组件的插槽内容 -->
        <slot name="pane" :data="data"></slot>
      </template>
    </level3>
  </div>
</template>

<script>
import level3 from "./child.vue";
export default {
  components: {
    level3,
  },
};
</script>

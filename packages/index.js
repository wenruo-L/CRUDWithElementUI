import axios from "axios";
// 组件
import pForm from "./p-form";
import pInputTree from "./p-form/components/p-input-tree.vue";
import pUpload from "./p-form/components/p-upload.vue";
import pTable from "./p-table";
import crud from "./crud";
// 全局资源
import permission from "./directive/permission";
import dialogDrag from "./directive/dialog-drag";
// 实例方法
import $ImagePreview from "./directive/image-preview";
import $crud from "./directive/crud";

const components = [pForm, pInputTree, pUpload, pTable, crud];
const prototypes = {
  $ImagePreview,
};
const directive = {
  dialogDrag,
  permission,
};

const install = function (Vue) {
  if (install.installed) return;
  components.map((item) => {
    Vue.component(item.name, item);
  });
  Object.keys(prototypes).forEach((key) => {
    Vue.prototype[key] = prototypes[key];
  });
  Object.keys(directive).forEach((key) => {
    Vue.directive(key, directive[key]);
  });
  Vue.prototype.$axios = axios;
  window.$crud = $crud;
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  ...components,
  install,
};

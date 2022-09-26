import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import Crud from './utils/CURD/crud.vue'
import basicContainer from "./components/basic-container/main";
import testCom from "@/components/test-com/test-com";
import { setPx } from "./utils/util";
// 源码
import patpetCrud from "../packages";
// 插件
// import patpetCrud from 'patpet-crud'
// import 'patpet-crud/lib/patpet-crud.css'
// 打包后的源码
// import patpetCrud from '../lib/patpet-crud.umd.min.js'
// import '../lib/patpet-crud.css'

import "./style/common.scss";

Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(patpetCrud);

Vue.component("basicContainer", basicContainer);
// Vue.component('Crud', Crud)
Vue.component("testCom", testCom);
Vue.prototype.setPx = setPx;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

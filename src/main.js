import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import Crud from './utils/CURD/crud.vue'
import basicContainer from './components/basic-container/main'
import testCom from '@/components/test-com/test-com'
import {
  setPx
} from './utils/util'
// import patpetCrud from '../packages'
import patpetCrud from 'patpet-crud'
import 'patpet-crud/lib/patpet-crud.css'

Vue.config.productionTip = false
Vue.use(Element)
Vue.use(patpetCrud)

Vue.component('basicContainer', basicContainer)
// Vue.component('Crud', Crud)
Vue.component('testCom', testCom)
Vue.prototype.setPx = setPx

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
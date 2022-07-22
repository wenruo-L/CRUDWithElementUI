import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Crud from './utils/CURD/crud.vue'
import $ImagePreview from './components/image-preview/'
import basicContainer from './components/basic-container/main'
import {
  setPx
} from './utils/util'

Vue.config.productionTip = false
Vue.use(Element)

Vue.component('basicContainer', basicContainer)
Vue.component('Crud', Crud)
Vue.prototype.setPx = setPx
Vue.prototype.$ImagePreview = $ImagePreview

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
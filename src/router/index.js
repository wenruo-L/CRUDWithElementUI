import Vue from 'vue'
import VueRouter from 'vue-router'
import testPage from '../views/test.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'test',
    component: testPage
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/about.vue')
  },
  {
    path: '/document',
    name: '文档',
    component: () => import( /* webpackChunkName: "test" */ '../views/document.vue')
  },
  {
    path: '/testCrud',
    name: "测试crud",
    component: () => import( /* webpackChunkName: "testCrud" */ '../views/testCrud.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
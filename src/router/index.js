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
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/document',
    name: '文档',
    component: () => import( /* webpackChunkName: "test" */ '../views/document.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
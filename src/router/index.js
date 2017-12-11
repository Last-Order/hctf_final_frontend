import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: "/admin",
      component: resolve => require(['@/components/Admin/Index.vue'], resolve)
    }
  ]
})

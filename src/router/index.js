import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
// 权限管理
import Rights from '@/components/rights/rights.vue'
import Roles from '@/components/rights/roles.vue'
// 商品管理
import GoodsList from '@/components/goods/goodsList.vue'
import GoodsAdd from '@/components/goods/goodsAdd.vue'
import CateParams from '@/components/goods/cateParams.vue'
import GoodsCate from '@/components/goods/goodsCate.vue'
// 订单管理
import OrdersList from '@/components/orders/ordersList.vue'
// 数据统计
import Reports from '@/components/reports/reports.vue'


Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/goods',
          name: 'goods',
          component: GoodsList
        },
        {
          path: '/goodsadd',
          name: 'goodsadd',
          component: GoodsAdd
        },
        {
          path: '/params',
          name: 'params',
          component: CateParams
        },
        {
          path: '/categories',
          name: 'categories',
          component: GoodsCate
        },
        {
          path: '/orders',
          name: 'orders',
          component: OrdersList
        },
        {
          path: '/reports',
          name: 'reports',
          component: Reports
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  if(to.name === 'login'){
    next()
    return true
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push({ name: "login" });
    }
    next()
  }
})

export default router

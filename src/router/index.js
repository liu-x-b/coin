import Vue from 'vue'
import VueRouter from 'vue-router'
import top from '../views/Home.vue'
import home from '../components/home.vue'
import shop from '../components/shop.vue'
import withdraw from '../components/withdraw.vue'
import history from '../components/history.vue'
import gameInfo from '../components/gameInfo.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: top,
    children:[
      {
        path: "/",
        component: home
      },
      {
        path: "/shop",
        component: shop
      },
      {
        path: "/withdraw",
        component: withdraw
      },
      {
        path: "/history",
        component: history
      },
      {
        path: "/gameInfo",
        component: gameInfo
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

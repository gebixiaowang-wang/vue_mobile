import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入rem组件 加载动态设置rem基准值
import 'amfe-flexible'

import './utils/dayjs'
// 导入vant核心组件库
import Vant, {
  Lazyload
} from 'vant'
// 加载vant全局样式
import 'vant/lib/index.css'
// 加载全局样式
import './styles/index.less'
// 注册使用vant组件库
Vue.use(Vant)
Vue.use(Lazyload)
Vue.config.productionTip = false
Vue.prototype.isLogin = async function () {
  //   如果用户未登录就触发
  if (!store.state.user) {
    try {
      const res = await Vue.prototype.$dialog.confirm({
        title: '登陆提醒',
        message: '点击确定按钮登录,跳转登陆页面'
      })
      if (res === 'confirm') return router.push('/login')
      return
    } catch (err) {
      return
    }
  }
}
// 设置路由守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'collectList') {
    if (!store.state.user) {
      Vue.prototype.isLogin()
    } else {
      next()
    }
  } else {
    next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
console.dir(Vue);

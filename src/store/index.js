import Vue from 'vue'
import Vuex from 'vuex'
// 把封装的操作本地内存的方法导入进来
import {
  setItem,
  getItem,
  removeItem
} from '@/utils/storage'

Vue.use(Vuex)
const token_key = 'token_user'
export default new Vuex.Store({
  state: {
    // 一个对象,用来存储当前登录用户信息
    // 先查看当前本地储存中有没有token 有的话直接赋值给user对象
    // 没有的话 用户登录后会设置token值
    user: getItem(token_key)
  },
  mutations: {
    // 用户登录成功后执行事件
    setUser(state, data) {
      // 把服务器返回的token赋值到user对象
      state.user = data
      // 再把token存到本地内存中
      setItem(token_key, data)

    }
  },
  actions: {},
  modules: {}
})

import Vue from 'vue'

import dayjs from 'dayjs'
// 默认是英文 配置为中文
import 'dayjs/locale/zh-cn' //加载中文语言包

import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

dayjs.locale('zh-cn') //全局使用
// 定义一个全局过滤器
Vue.filter('dateFormat', (val) => {
  return dayjs().to(dayjs(val))
})

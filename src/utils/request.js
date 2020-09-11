// 请求模块
import axios from 'axios'
import store from '@/store'
import jsonBig from 'json-bigint'
// 可以解决大数字的问题
// jsonBig,parse() 把json格式的字符串转为javascript对象
// jsonBig,stringify() 把javascript对象转为json格式字符串
// const jsonStr = '{"art_id":1231124141345252545}'
// console.log(JSON.parse(jsonStr));
// console.log(jsonBig.parse(jsonStr).art_id.toString());
// 自定义配置一个axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 自定义后端返回的原始数据
  transformResponse: [function (data) {
    // axios会默认在内部把json格式数据转换为对象格式返回

    try {
      // 我们使用jsonbig转换数据
      return jsonBig.parse(data)
    } catch (err) {
      // 如果出错就把元数据返回
      return data
    }

  }]
})
// 请求拦截器
request.interceptors.request.use(config => {
  // 如果store中有user user中有token才添加请求头
  if (store.state.user && store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }

  return config
}, err => {
  // 如果请求没有发出的时候出错了就执行
  return Promise.reject(err)
})
// 默认导出
export default request

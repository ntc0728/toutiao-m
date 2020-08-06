/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

//JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
//JSONBig.parse()  把 JSON 格式的字符串转为 JavaScript 对象
//JSONBig.stringify() 把 JavaScript 对象 转为 JSON 格式的字符串转

// request：axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口的基准路劲

  // 自定义后端返回的原始数据
  transformResponse: [
    function(data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
})
//请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // 发起请求会经过这里
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
  },
  function(error) {
    // 如果请求出错了(还没有发出去) 会进入这里
    return Promise.reject(error)
  }
)

//响应拦截器
export default request

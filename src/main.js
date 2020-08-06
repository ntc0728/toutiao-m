import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/dayjs'

/* 
整个工程，模块分的比较开，每个文件，各司其职
默认导出：export default xx -> import const b =2; import {a} from 'x.js'
按需到处：export const a = 1;export const b = 2; -> import {a} from 'x.js'
*/

// qdJY26@nj.itcast.cn  UEg4YOG2

// 加载 Vant 全局样式
import Vant from 'vant'

// 加载 Vant 全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置 REM 组件库
import 'amfe-flexible'

// 注册使用 Vant 组件库
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

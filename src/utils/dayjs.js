import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件   extend 拓展
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  // 把你需要的时间格式化好，然后返回即可
  return dayjs().to(dayjs(value))
})

/* 

定义一个全局过滤器，然后就可以在任何组件的模板中使用了
其实过滤器就相当于一个全 局可用的方法(仅供模板使用)
参数1:过滤器名称
参数2:过滤器函数
使用方式: {{ 表达式 | 过滤器名称} }
管道符前面的表达式的结果会作为参数传递到过滤器函数中
过滤器的返回值会渲染到使用过滤器的模板位置
直接返回一个时间戳


*/

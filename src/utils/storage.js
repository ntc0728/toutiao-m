/* 
封装本地存储操作模块

前端本地缓存数据方式
1、sess ionStorage 会话级别，存储的空间不是很大
2、localStorage 持久化存储，存储空间很大5M 
3、indexedDB 数据库级别，这里存储空间特别

存储对象，或者数组的时候;需要进行转化JSON.stringify 和JSON.parse配合转化
判断数据类型，是否是一个对象 return null !== obj && typeof obj === 'object'
检查数据类型几种方式： 
1.typeof 
2.instanceof 
3.constructor 
4.Object.prototype.toString.call{{}} === '[object Object]

token:JWT 鉴权操作，判断当前此次请求是否有效

布局相关：
1.定位
2.float 浮动
3.lex 弹性布局  水平居中 justify-content :center 垂直居中 align-items:center
4.百分比，rem，less，scss，响应式的

*/

/* 
存储数据
*/
export const setItem = (key, value) => {
  // 将数据、对象类型数据转换成 JSON 格式字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }

  window.localStorage.setItem(key, value)
}
/* 
获取数据
*/
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}
/* 
删除数据
*/
export const removeItem = key => {
  window.localStorage.removeItem(key)
}

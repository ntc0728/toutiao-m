/* 
JavaScript 是一个单线程(同一时间内，只能干一件事)
异步(代码在执行到耗时时，先进行下一个任务，等这个耗时热舞结束之后，再回来执行)
try catch 是同步执行的解构

*/

const { Sticky } = require('vant')

try {
  throw new Error('err')
} catch (err) {
  console.log(err)
}

try {
  setTimeout(() => {
    throw new Error('err')
  }, 100)
} catch (err) {
  console.log(err)
}

let ajax = () => {
  return new Promise((resolve, reject) => {
    // resolve('成功了')
    reject('错误了')
  })
}

async function getList() {
  //  UnhandledPromiseRejectionWarning: 错误了
  //1、解决方式,可以直接添加 promise 的 catch 方法
  //   let res = await ajax().catch(err => {
  //     console.log(err)
  // })
  // 2、try catch
  try {
    let res = await ajax()
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

getList()

// tabs Sticky 吸顶效果属性

// 数组的展开操作符，它会把数组元素一 个一 个拿出来
// 取出运算符:对象，数组
// ...这三个点如果是在函数参数上的(... largs),这个是收集参数，args是一个数组
// 单纯的 function 里面，是由 arguments -> 类数组,
// 如果是箭头函数的话，函数里面没有 arguments, (...args) => {sonsole.log(args) }
// 没有 this 的，会向最近的父级作用域查找 this 指向
// 函数的长度，就是参数的个数

//百分比单位是相对于父元素的
// height: 100号;
// viewport 就是:视口
// vh: viewport -heigth 1vh就是整个视C高的百分之一
// ww: viewport-width 1vw就是整个视口高的百分之一
//视口(在移动端是布局视口)单位: ww和vh,不受父元素影响
// 1vw =视口宽度的百分之一
// 1vh =视口高度的百分之一

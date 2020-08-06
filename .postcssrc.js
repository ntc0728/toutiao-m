// 设计稿、基准 -> iphone6 750px
module.exports = {
  // 配置要使用的 PostCSS 插件
  // 作用：申城浏览器 CSS 样式规则浅醉
  plugins: {
    //VueCLI 内部已经配置了 autoprefixer 插件
    // autoprefixer: {
    // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用 postcss-pxtorem 插件
    'postcss-pxtorem': {
      rootValue({ file }) {
        // lib-flexible 的rem 适配方案：把一行分为10份，
        // rootValue 应该设置为设计稿宽十分之一
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的 css 属性
      // * 表示所有
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}

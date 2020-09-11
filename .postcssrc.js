// postcss配置文件
module.exports = {
  // 配置要使用的postcss插件
  plugins: {
    //   配置使用autoprefixer插件
    // 作用:生成浏览器兼容性css样式规则前缀
    // vuecli内部已经配置了autoprefixer插件
    // 所以产生冲突了 注释掉
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用postcss-pxtorem插件
    // 作用:把px转换为rem
    'postcss-pxtorem': {
      // lib-flrxible的rem适配方案 把一行分为10份
      // 应该设置为你的设计稿宽度的十分之一
      //   因为vant使用的是375
      //如果是vant的样式使用37.5 自己的css样式使用75
      rootValue({
        file
      }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      //   配置要转换的css属性 *表示所有  把所有的属性都转换为rem适配
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}

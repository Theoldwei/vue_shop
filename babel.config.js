//项目发布阶段需要用到的babel插件
const productPlugins = []

//判断是开发还是发布阶段
if (process.env.NODE_ENV === 'production') {
  //发布阶段
  productPlugins.push("transform-remove-console")
}

module.exports = {
  'presets': [
    '@vue/app'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    //展开运算符，将数组里面的内容展示出来
    ...productPlugins,
    //配置路由懒加载插件
    "@babel/plugin-syntax-dynamic-import"
  ]
}

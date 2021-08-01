const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// html-webpack-plugin 会在打包结束后，自动生成一个html文件，并把打包生成的js文件自动引入到这个html文件中
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// plugin 可以在webpack运行到某个时刻的时候，帮你做一些事情  像vue/react的生命周期函数一样

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  output: {
    // publicPath:'http://cdn.com.cn',
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "release")
  },
  // devtool: 'none  source-map  inline-source-map  cheap-(inline)-source-map(显示出错行就行，不用显示列,只管业务代码,不管第三方模块或loader里的错误)  cheap-(module)-inline-source-map(管业务代码,管第三方模块或loader里的错误)',
  // eval 此选项会非常快地构建。主要缺点是，由于会映射到转换后的代码，而不是映射到原始代码（没有从 loader 中获取 source map），所以不能正确的显示行数。
  // 在开发环境中建议使用  cheap-module-eval-source-map
  // 在生产环境中建议使用  cheap-module-source-map
  // source-map会生成.map的文件， 只要有inline会把.map的文件合并到打包生成的目标文件中去
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "release"),
    open: true,
    port: 9000
    // hot: true,
    // hotOnly: true // hot失效时会刷新页面，不需要你刷新页面,失效就失效，配置hotOnly为true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader" //babel-loader处理js文件的时候， babel-loader只是一个webpack和babel做通信的一个桥梁，用了之后做了打通，但并不会把es6语法翻译成es5语法，还需要其他的一些模块才能  @babel/preset-env
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "设计模式",
      template: "./index.html",
      minify: false // true if mode is 'production', otherwise false
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

//  如果不设置corejs: 2,  WARNING: We noticed you're using the `useBuiltIns` option without declaring a core-js version. Currently, we assume version 2.x when no version is passed. Since this default version will likely change in future versions of Babel, we recommend explicitly setting the core-js version you are using via the `corejs` option.
// You should also be sure that the version you pass to the `corejs` option matches the version specified in your `package.json`'s `dependencies` section. If it doesn't, you need to run one of the following commands:

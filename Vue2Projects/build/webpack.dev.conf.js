var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    module: {
        loaders: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap
        })
    },
    // eval-source-map is faster for development
    devtool: '#eval-source-map',//使调试更容易 提高开发效率
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
        new webpack.NoErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({ //1.移除public文件夹，利用此插件，index.html文件会自动生成，此外CSS已经通过前面的操作打包到JS中了。
          //2.在app目录下，创建一个index.tmpl.html文件模板，这个模板包含title等必须元素，在编译过程中，插件会依据此模板生成最终的html页面，会自动添加所依赖的 css, js，favicon等文件.
          //3.更新webpack的配置文件，方法同上,新建一个build文件夹用来存放最终的输出文件
            filename: 'index.html',
            template: 'index.html',
            favicon: 'favicon.ico',
            inject: true
        })
    ]
})

/**
 * Created by ZHANGQIANG on 2018/11/19.
 */
const path=require("path");
const config={
    mode:'development',
    entry:'./module/main.js',//1.唯一入口。 2. 多页面多个入口用对象形式：entry:{ first:'./module/main.js'，second:'./module/main.js',three:'./module/main.js'}
    ouput:{
        filename:'bundle.js',//1.唯一出口。 2.多个出口用: '[name].bundle.js'
        path: path.resolve(__dirname + './webpack')//打包后放置的位置
    },
    module:{
        rules:[{test:'/\.css$/',use:''},{test:'/\.ts$/',use:''}]
    }
};
module.exports=config;
//命令行执行 webpack（非全局安装node_modules/.bin/webpack）,__dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
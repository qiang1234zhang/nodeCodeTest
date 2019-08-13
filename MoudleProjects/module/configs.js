/**
 * Created by ZHANGQIANG on 2018/11/23.
 */
//各模块路径配置
//加载多文件的配置
require.config({
    baseUrl:"js/",
    path:{
        "main":"js/main",
        "math":"app/calculate",
        "result":"app/result",
        "zhangqiang":"app/zhang123qiang" //模块的文件名
    },
    shim:{//配置没有遵循AMD规范的模块，通过exports向外暴露该文件内的全局变量
        "base":{
            deps:["jquery"],
            exports:"$"
        },
        "backbone":{
            deps:["underscore","jquery"],
            exports:"_"
        },
        "jquery.aaaa":["jquery"]//简写方式 使用插件
    }
});
//加载xx完成后执行回调函数 异步
//require(["js/main","app/calculate","app/result","app/zhang123qiang"],function() {
//    console.log("正确！");
//});
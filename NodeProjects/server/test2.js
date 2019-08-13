
//--------------------基于es5的node框架测试---------------------------
//es5的Express框架 

 var express = require('express');
 var app = express();

app.use(function(req,res,next){
    console.log("这是 第一个中间件");
    next();
});//全局中间件 不指定任何具体路由

app.get('/', function (req,res,next) {
     res.send('Hello World!');
     next();
 });
app.get('/page1', function (req,res,next) {
    res.send('This is page1!');//发送至前台数据
    next();
});

app.use(function(req,res,next){
    res.send("404");
});//全局中间件 不指定任何具体路由

 app.listen(24348, function () {
     console.log('Example app listening on port 24348!');
     console.log(`this process platform is：${process.platform}`);
     console.log(`父进程id为：${process.ppid}`);
     console.log(`进程id为：`+process.pid);
 });

//es6的Koa1
// var koa = require('koa');
// var koa = require('koa-router');
// var app = koa();

// app.use('/test', function *() {
//     yield doReadFile1();
//     var data = yield doReadFile2();
//     this.body = data;
// });

// app.listen(3000);   

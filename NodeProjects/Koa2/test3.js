
//--------------------基于es7的node框架无router测试------------成功---------------
//es7的Koa2
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于每一个请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {  //默认首页
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
    await next();//异步函数处理链 用它调用下一个异步（ 中间件 ）
});

//访问不同url页面   可以使用koa-router中间件来处理url映射
app.use(async (ctx, next) => {
    if (ctx.request.path === '/test') {
        ctx.response.body = 'TEST page';
    } else {
        await next();
    }
});
app.use(async (ctx, next) => {
    if (ctx.request.path === '/error') {
        ctx.response.body = 'ERROR page';
    } else {
        await next();
    }
});

//最后注意ctx对象有一些简写的方法，例如ctx.url相当于ctx.request.url，ctx.type相当于ctx.response.type。
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});
// 在端口监听:
app.listen(24348,function(){
    console.log('app started at port 24348...');
    console.log(`this process platform is：${process.platform}`);
    console.log(`父进程id为：${process.ppid}`);
    console.log(`进程id为：`+process.pid);
});
console.log('app started at port 24348...');




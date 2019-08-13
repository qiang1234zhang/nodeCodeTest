
//--------------------http服务模块监听测试---------------------------
// 导入http模块:
var http = require('http');

// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    console.log(request.method + ': ' + request.url);
    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'text/html'});
    // 将HTTP响应的HTML内容写入response:
    response.end('<h1>Hello world!</h1>');
});

// 让服务器监听24348端口:
server.listen(24348,function(){
    console.log('Server is running at http://127.0.0.1:24348/');
    console.log(`this process platform is：${process.platform}`);
    console.log(`父进程id为：${process.ppid}`);
    console.log(`进程id为：`+process.pid);
});


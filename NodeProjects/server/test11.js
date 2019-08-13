
//--------------------基于es6实现一个文件服务器的测试-----------成功----------------
'use strict';
//实现一个文件服务器
var
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

// 从命令行参数获取root目录，默认是当前目录:
var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

// 创建服务器:
var server = http.createServer(function (request, response) {
    // 获得URL的path，类似 '/css/bootstrap.css':
    var pathname = url.parse(request.url).pathname;
    console.log('pathname: ' + pathname);
    // 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
    var filepath = path.join(root, pathname);
    // 获取文件状态:
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没有出错并且文件存在:
            console.log('200 ' + request.url);
            // 发送200响应:
            response.writeHead(200, 'utf8');
            // 将文件流导向response:
            fs.createReadStream(filepath).pipe(response);
        } else {
            // 出错了或者文件不存在:
            console.log('404 ' + request.url);
            // 发送404响应:
            response.writeHead(404, 'utf8');
            response.end('404 Not Found');
        }
    });
});

server.listen(24348,function(){
    console.log('Server is running at http://127.0.0.1:24348/');
    console.log(`this process platform is：${process.platform}`);
    console.log(`父进程id为：${process.ppid}`);
    console.log(`进程id为：`+process.pid);
});

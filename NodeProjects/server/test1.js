//--------------------路径解析测试---------------------------
//解析路径使用的模块
var url=require("url"); //如过是文件服务器需对URL解析
  console.log(url.parse("http://localhost:24348/path/to/file?query=string#hash"));
  console.log(url.parse("http://localhost:24348/nodetest/text.txt"));

//构造路径使用的模块 
var path = require('path');
// 解析当前目录:
var workDir = path.resolve('.'); // '/Users/michael'
// 组合完整的文件路径:当前目录+'pub'+'index.html':
var filePath = path.join(workDir, 'pub', 'index.html');
// '/Users/michael/pub/index.html'



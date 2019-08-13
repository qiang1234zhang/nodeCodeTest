//--------------------基于es6实现一个node+express+mysql的web查询数据测试----------成功-----------------
//node+express+mysql 查询数据发至前台
const os = require('os'); //引入系统信息模块
var express = require('express');   //引入express模块
var mysql = require('mysql');     //引入mysql模块
var app = express();        //创建express的实例

var connection = mysql.createConnection({      //创建mysql实例
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'password'
});
connection.connect();
var sqls = 'SELECT * FROM sakila.city where city_id=7';
var str = " " ,cpu="";
connection.query(sqls, function (err,result) {
    if(err){
        console.log('[SELECT ERROR]:',err.message);
    }
    str = JSON.stringify(result);
    cpu = JSON.stringify(os.cpus());
    //数据库查询的数据保存在result中，但浏览器并不能直接读取result中的结果，因此需要用JSON进行解析
   // console.log(result);   //数据库查询结果返回到result中
    console.log(str);
});
app.get('/',function (req,res) {
    res.send("从数据库返回的数据:<br>"+str+"<br/>CPU:<br/>"+cpu);  //服务器响应请求
});
connection.end();
app.listen(24348,function () {  //当前进程监听24348端口
    console.log(`this process platform is：${process.platform} CPU个数为：${os.cpus()}`);
    console.log(`父进程id为：${process.ppid}`);
    console.log(`进程id为：`+process.pid);
    console.log('执行成功！'+'Server running at 24348 port');
});
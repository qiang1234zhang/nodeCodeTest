
//--------------------基于es7的node框架router+Koa2+jade+mysql的测试----------成功-----------------

const Koa = require('koa');
const fs = require('fs');
var mysql = require('mysql');     //引入mysql模块
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const views=require("koa-views");
const bodyParser = require('koa-bodyparser');//body中间件
var path=require("path");

const app = new Koa();
app.use(bodyParser());
//设置jade模板引擎
app.use(views(path.resolve(__dirname,'template'),{extension:'jade'}));
//创建mysql实例
var connection = mysql.createConnection({      
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'password'
});
connection.connect();
var sqls = 'SELECT * FROM sakila.city where city_id=7';
var str = " ";
connection.query(sqls, function (err,result) {
    if(err){
        console.log('[SELECT ERROR]:',err.message);
    }
    str = JSON.stringify(result);
    //数据库查询的数据保存在result中，但浏览器并不能直接读取result中的结果，因此需要用JSON进行解析
   // console.log(result);   //数据库查询结果返回到result中
    console.log(str);
});
router.get('/', async (ctx, next) => {
    //1.直接返回标签
    /* ctx.response.body = `<h1>Index主页</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`; */

     //2.直接返回查询数据
      // ctx.body=str;   
     //3.使用jade渲染并返回
     await ctx.render("index",{data:str});//需渲染的模板名称及数据
});

//从Index主页进入，成功后返回hellword.html文件内容
router.post('/signin', async (ctx, next) => {
    var name = ctx.request.body.name || '',//只能写成这种形式
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        //1.直接返回标签
        // ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        //2.返回html文件。 读取要返回的html文件,直接下载
          ctx.response.type = 'html';
        //  ctx.response.body = fs.createReadStream('hellword.html'); //为了最小化内存成本使用流读取文件
         //3.异步读取html文件 
        //异步读取使用 await
          ctx.response.body = await fs.readFile('hellword.html', 'utf8');  
        
        //4.cookie使用
        // const n = Number(ctx.cookies.get('view') || 0) + 1;
        // ctx.cookies.set('view', n);
        // ctx.response.body = n + ' views';
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

app.use(router.routes());
connection.end();
app.listen(24348,function(){
    console.log('app started at port 24348...');
    console.log(`this process platform is：${process.platform}`);
    console.log(`父进程id为：${process.ppid}`);
    console.log(`进程id为：`+process.pid);
});

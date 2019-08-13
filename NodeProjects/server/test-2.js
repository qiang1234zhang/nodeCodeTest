
//--------------------es6语法的模块、文件的读取测试---------------------------
//es6
// import {a,f} from "./test-1";
// console.log(a());
// console.log(f());
/**
 * commonjs
 */
 var f1=require("./test-1").fm;
 var f2=require("./test-1").fn;
 console.log(f1());
 console.log(f2());
 //文件 读取  
 var fs=require("fs");
/**
 * 同步    node必须异步
 */
 //var data = fs.readFileSync('text.txt', 'utf-8');
 // console.log(data);
/**
 * 异步
 */
  fs.readFile('text.txt', 'utf-8', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
//文件 写入
var data = 'Hello, Node.js';
//同步  fs.writeFileSync('text.txt', data);
fs.writeFile('text.txt', data, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('ok.');
    }
});
//文件状态类
fs.stat('sample.txt', function (err, stat) {
    if (err) {
        console.log(err);
    } else {
        // 是否是文件:
        console.log('isFile: ' + stat.isFile());
        // 是否是目录:
        console.log('isDirectory: ' + stat.isDirectory());
        if (stat.isFile()) {
            // 文件大小:
            console.log('size: ' + stat.size);
            // 创建时间, Date对象:
            console.log('birth time: ' + stat.birthtime);
            // 修改时间, Date对象:
            console.log('modified time: ' + stat.mtime);
        }
    }
});
//文件流的读
var rs = fs.createReadStream('text.txt', 'utf-8');

rs.on('data', function (chunk) {
    console.log('DATA:')
    console.log(chunk);
});

rs.on('end', function () {
    console.log('END');
});

rs.on('error', function (err) {
    console.log('ERROR: ' + err);
});
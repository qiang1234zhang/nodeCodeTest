
//--------------------es6语法的模块测试---------------------------
//es6语法
// export function a(){
//     console.log("执行！");
//     return 2;
// }
// a();
// export var f=()=>{return 5;}

/** 
 * 后端模块 遵循commonJS标准
*/
var f1=function(){
    console.log("执行！");
    return 2;
}
var f2=()=>{return 5;}
exports.fm=f1;
exports.fn=f2;
//或者
//  module.exports={
//      fm:f1,
//      fn:f2
//  };
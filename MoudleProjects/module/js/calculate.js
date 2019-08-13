/**
 * Created by ZHANGQIANG on 2018/9/11.
 */
//子模块
define([],function () {
    function add(a,b){
        var s=a+b;
        console.log("子模块"+s);
        return s;
    };
    function sub(a,b){
        var s=a-b;
        console.log("子模块"+s);
        return s;
    };
//es6  export  var y =() => {return 6;}

    return {//返回模块对象方式
            add:add,
            sub:sub
     };
});
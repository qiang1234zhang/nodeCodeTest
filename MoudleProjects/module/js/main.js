/**
 * Created by ZHANGQIANG on 2018/9/11.
 */
require(["M"]);//加载所有模块 ，并执行主模块 同步
define('M',["calculate","app/result","app/zhang123qiang"],function (m, h, foo){
   var r= m.add(1,2);
    console.log(r);
    var e= m.sub(6,2);
    console.log(e);
    var r2=h.res;
    console.log(r2);
    h.fn();
    var v=h.ff();
    alert(v);
    foo.foo();
});

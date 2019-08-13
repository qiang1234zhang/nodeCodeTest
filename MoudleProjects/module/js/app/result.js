/**
 * Created by ZHANGQIANG on 2018/9/12.
 */
//子模块
define(["../main","calculate"],function(ms, f){
    console.log(f);
    var f= f.add(7,8);
    console.log("第二个子模块"+f);
    var  res='我是第二个子模块';
    return  {
        res:res,
        f:f,
        'fn':function (){console.log("zhehsidingyide")},
        ff:function(){return 0;}
    }
});
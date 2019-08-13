/**
 * Created by ZHANGQIANG on 2018/9/12.
 */
//子模块
define(["require","exports","calculate"],function(require, exports, m){
    exports.foo=function(){//提供对外接口方式
        console.log("提供对外exports");
        return m.sub(0,0);
    };
});
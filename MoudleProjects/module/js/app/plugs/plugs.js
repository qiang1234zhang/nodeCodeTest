/**
 * Created by ZHANGQIANG on 2018/9/11.
 */

;(function($,win,doc,undefined){
    //默认设置
        var Plugname="aaaa";
        var _default={
            a:1,
            b:[]
        };
    //构造函数
    function Plug (el,op){
        this.name=Plugname;
        this.elements = $(el);
        this._default = _default;
        this._settings = $.extend({},_default,op);
        this.init();
    }
    //原型方法
    Plug.prototype={
        init:function(){ this.sud()},
        sud:function(){
            console.log(this._settings);
            this.asa();
        },
        asa:function (){ console.log("1234567890")}
    };
    //挂到jQuery上
    $.fn[Plugname]=function(op){
        return  $(this).each(function(){
            return new Plug(this,op);
        });
     //   return new Plug(this,op);
    }



})(jQuery,window,document);
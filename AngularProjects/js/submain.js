    /**
     * Created by hudaowan on 2016/8/09.
     */
    requirejs.config({
        baseUrl:"",
        urlArgs: 'v=v2',
        map: {
            '*': {
                'css': 'css.min'
            }
        },
        shim:{
            'angular':{
            	 deps:['jquery'],
                 exports:'angular'
             },
            'router':{
                  deps:['angular'],
                  exports:'router'
             },
             "dataapp":{
				  deps:['router']
		     },
		     "bootstrap":{
                  deps:["jquery"]
             },
            "jqueryUI":{
                deps:["jquery"]
            },
             "angular-ui-bootstrap":{
                 deps:["bootstrap","angular"]
             },
             "ngLocale":{
                 deps:["angular"]
             },
            "ngAnimate":{
                deps:["jquery","angular"]
            },
             "scroll":{
                 deps:["angular"]
             },
             "ngDrag":{
                 deps:["jquery","angular"]
             },
             "ngUpload":{
                 deps:["jquery","angular"]
             },
            "ngSlider":{
                deps:["jqueryUI","angular"]
            },
            "ngMessages":{
                deps:["angular"]
            },
            "bootstrap-select":{
                deps:["bootstrap","jquery"]
            },
             "iov":{
                 deps:["jquery","angular","jqueryUI"]
             },
            "ztree":{
                deps:["jquery"]
            },
            "ztreeCheck":{
                deps:["jquery","ztree"]
            },
            "ztreeEdit":{
                deps:["jquery","ztree"]
            },
            "echarts":{
                deps:["jquery"]
            },
            "myDatePicker":{

            },
            "datasourceDirective":{
                deps:["jquery","ztree"]
            },
            "fileDatasourceDirective":{
                deps:["jquery","ztree"]
            }
            
        },
        paths: {
            "angular":"js/basejs/angular/angular.min",
            "router":"js/basejs/angular/angular-ui-router",
            "angular-ui-bootstrap":'js/basejs/angular/angular-ui-bootstrap',
            "ngLocale":'js/basejs/angular/angular-locale_zh',
            "ngDrag":'js/basejs/angular/angular-drag',   
            "ngUpload":'js/basejs/angular/angular-file-upload/angular-file-upload',
            "ngSlider":"js/basejs/angular/angular-ui-slider",
            "ngMessages":"js/basejs/angular/angular-messages",
            "ngAnimate":'js/basejs/angular/angular-animate',

            "iov":"js/basejs/iov/iov-components",
            "bootstrap":"js/basejs/bootstrap/bootstrap.min",
            "bootstrap-select":'js/basejs/bootstrap/bootstrap-select',
            "iovdialog":'js/basejs/bootstrap/dialog',
            "jquery":"js/basejs/jquery/jquery-1.12.1",
            "jqueryUI":"js/basejs/jquery/jquery-ui.min",
            "echarts":"js/basejs/charts/echarts",

            "json2":"js/basejs/tool/json2",
            "underscore":"js/basejs/tool/underscore",
            "scroll":"js/basejs/tool/ngscrollbar",

            "ztree":'js/basejs/ztree/jquery.ztree.core',
            "ztreeCheck":'js/basejs/ztree/jquery.ztree.excheck',
            "ztreeEdit":'js/basejs/ztree/jquery.ztree.exedit',

            "dataapp":"js/dataapp",
            "datadirective":"js/directives/datadirectives" ,
            "datafilter":"js/filter/datafilter",
            "myDatePicker":"js/basejs/My97DatePicker/WdatePicker"
        },
    	urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
    });
    

	// 初始化dataCloudApp模块(手动启动)
    //1. 当你的所有文件，代码都加载完毕之后，去找到你的根元素(要作为Angular应用程序的那个元素)，通常，我们都是将文档(document)作为的我们的根。
    //2. 调用 angular.bootstrap，去编译为一个可以进行双向绑定的可执行的Angular应用程序。
	require(['dataapp'],function(){
		angular.bootstrap(document, ['dataCloudApp']);
		console.log("[dataCloudApp start succeed!]")
	});
	





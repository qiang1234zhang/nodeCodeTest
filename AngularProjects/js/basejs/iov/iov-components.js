define(['underscore' ,'jquery','iovdialog'], function(_,$,dialog) {
var iov = angular.module('iov', []);
//功能交互类指令
//单独添加active类，同伴去除
iov.directive("activeByClick", function() {  
    var link_func = function(scope, element, attr) {  
        $(element).click(function() {
            $(element).addClass("active");  
            $(element).siblings().removeClass("active")              
        })  
    }  
    return {  
        restrict: 'EA',  
        link: link_func
    }  
})
//单独添加active类，同伴去除(侧滑菜单一级菜单用)
iov.directive("firstMenuActive", function() {  
    var link_func = function(scope, element, attr) {  
        $(element).click(function() {
            $(element).addClass("active");  
            $(element).parent(".panel").siblings().children(".panel-heading").removeClass("active")    
            $(".panel-body li").removeClass("active")   
        })
    }  
    return {  
        restrict: 'EA',  
        link: link_func
    }  
})
//单独添加active类，同伴去除(侧滑菜单二级菜单用)
iov.directive("secondMenuActive", function() {  
    var link_func = function(scope, element, attr) {  
        $(element).click(function() {
        	$(".panel-body li").removeClass("active");
        	$(".panel-heading").removeClass("active");
            $(element).addClass("active");
        })  
    }  
    return {  
        restrict: 'EA',  
        link: link_func
    }  
})

//表单 input-下拉树选择组件
iov.directive("controlsTree", function($global_var,$q,$http,$document) {
    return {
        restrict: 'E',
        transclude:true,
        scope:{
            controls:"=",
            url:"@",
            hidecontrols:"=",
            messages:"@",
            unique:"@",
            title:"@",
            parameters:"@",
            hideicon:"@",
            ngModel:"="
        },
        templateUrl:'templates/app/pluginTemplates/controls-tree.html',
        link: function(scope, element, attr) {

            //--------------------scope初始化部分-----------------------------------------------
            if(attr.messages){
                scope.messageList = JSON.parse(attr.messages)
            }
            scope.rows=[];
            scope.openTreeClick=false;
            scope.initTree=function(){
                $.fn.zTree.init($('#buildintreeId'), setting, []);
                scope.zztreeObj = $.fn.zTree.getZTreeObj('buildintreeId');
                scope.zztreeObj.addNodes(null,scope.rows);
                scope.zztreeObj.expandAll(true);
            };

            //查询树节点
            (function (){
                var deferred=$q.defer();

                $http({
                    method: 'GET',
                    url:$global_var.base_url +attr.url,
                }).success(function(result) {
                    deferred.resolve(result);
                }).error(function(err){
                    deferred.reject(false);
                    console.log(err);
                });
                return deferred.promise;
            })().then(function (result) {
                scope.rows=angular.fromJson(result.content);

            }, function () {
                scope.errMsg = "系统繁忙，请稍后再试!";
            });

            //---------------------tree操作部分--------------------------------------------------
            var setting = {
                view:{
                    showIcon:false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: 0
                    }
                },
                callback:{
                    onClick: onClickTree
                }
            };
            function onClickTree(e, treeId, treeNode) {
                scope.ngModel=treeNode.id;
                scope.ngModelName=treeNode.name;

                if(scope.openTreeClick&&scope.zztreeObj){
                    hideSearch();
                }
            }
            //----------------------dom操作部分----------------------------------------------------
            scope.showSearch=function(obj){
                scope.openTreeClick=true;
                var w3c=(document.getElementById)? true:false;//w3c 标准
                var ns6=(w3c && (navigator.appName=="Netscape"))? true: false;//Netscape浏览器 标准的W3C
                var left,top;
                if (!ns6){//判断IE
                    var nLt = 0;
                    var nTp = 0;
                    var offsetParent = obj;
                    while (offsetParent!=null && offsetParent!=document.body) {
                        nLt += offsetParent.offsetLeft;
                        nTp += offsetParent.offsetTop;
                        offsetParentoffsetParent=offsetParent.offsetParent;
                    }
                    left = nLt;
                    top = nTp + obj.offsetHeight;
                } else {//标准w3c
                    left = obj.offsetLeft -5;
                    top = obj.offsetTop + obj.offsetHeight;
                }
                $('.showInfo').css('top',top);
                //延迟加载初始化树
                setTimeout(function(){
                    scope.initTree();
                    //当弹出框内点击时，阻止$document click事件
                    $(".showInfo").click(function(event){
                        event.stopPropagation();
                    });
                },300);


            }
            function hideSearch(){
                scope.zztreeObj=null;
                scope.openTreeClick=false;
                scope.$apply();  //外部dom改变scope，手动调用$apply来刷新加载scope
            }
            scope.$watch('ngModel',function(newValue,oldValue){
                if(newValue){

                   var obj=_.filter(scope.rows,{id:newValue});
                    if(obj.length!=0){
                        scope.ngModelName=obj[0].name;
                        scope.controls.$valid=true;
                        scope.controls.$dirty=true;
                    }

                }else if(newValue===""){
                    scope.ngModelName="";
                }
            });

            $document.click(function(){
                if(scope.openTreeClick&&scope.zztreeObj){
                    hideSearch();
                }
            });
        }
    }
});



//组件类指令
iov.directive("headMenu",function($location) {
    return {  
        restrict: 'E', 
        scope : true,
        transclude:true,
        template:
            '<header class="iovTitle">'+
			'<div ng-class="{true: \'logo\', false: \'sysw1n\'}[classSwitch]">'+
				'<img ng-src="{{logoPngUri}}"/>{{systemName}}'+
			'</div>'+
			'<ul>'+
			    /*'<li active-by-click ui-sref="appIndex.home"  ng-class="{true: \'active\', false: \'\'}[isActive(\'appIndex.home\')]">'+
					'<div class="menuIcon"><img src="img/index/1.png"/></div>'+
					'<span>首页</span>'+
				'</li>'+*/
				'<li active-by-click ng-repeat="x in permission.mainMenu|orderBy:index" ui-sref="{{x.router}}" ng-class="{true: \'active\', false: \'\'}[isActive(x.router)]">'+
					'<div class="menuIcon"><img ng-src="{{x.iconUrl}}"/></div>'+
					'<span>{{x.name}}</span>'+
				'</li>'+
			'</ul>'+
			'<div class="loginBox">'+
			    '<div class="skin">'+
			        /*'<span class="changeSkin">'+
			        '<span class="icon-umbrella" change-skin>换肤</span>'+
			        
			        '<ul>'+
				       '<li><span class="green" ng-click="changecss(\'green\')"></span></li>'+
				       '<li><span class="blue" ng-click="changecss(\'blue\')"></span></li>'+
				       '<li><span class="lightblue" ng-click="changecss(\'lightblue\')"></span></li>'+
				       '<li><span class="black" ng-click="changecss(\'black\')"></span></li>'+
				    '</ul>'+
			        '</span>'+*/
			    '</div>'+
			    '<div class="tool">'+
				'<span class="icon-key" data-toggle="modal" data-target="#authorizedInfo" ng-click = "addForm.$setPristine();authorizedInfo()"></span>'+
				'<span class="icon-user" data-toggle="modal" data-target="#globleEditInfo" ng-click = "editForm.$setPristine();userEdit()"></span>'+
                '<div class="off" ng-if="isDataPortal" ng-click="goIndex()"><span class="icon-backward"></span><span style="cursor:pointer">&nbsp;返回</span></div>'+
                '<div class="off" ng-click="back()"><span class="icon-off"></span><span style="cursor:pointer">&nbsp;退出</span></div>'+
                '<span id="username"><marquee onMouseOver="this.stop()" onMouseOut="this.start()" style="width:127px" direction="left" scrollamount="3">欢迎登录，{{userName}}</marquee></span>'+
			'</div>'+
        '</header>',
        
        link: function(scope, element, attr) {
            if (attr.width) {
                $("marquee").width(attr.width);
            }
            scope.isActive=function (a) {
                var path=$location.path().substring(1,$location.path().length).replace(/\//g,'.');
                return path.indexOf(a)!=-1;
            }
            //scope.path =$location.path().substring("/appIndex/",$location.path().length).replace(/\//g,'.');
        } 
    }
});

iov.directive("layout",function($global_var,$location) {
    return {  
        restrict: 'E', 
//      scope : true,
//      transclude:true,
        template:
        '<div class="iovNavBar">'+
		    '<div class="head">'+
			     '<span class="icon-list" nav_button_toggle></span>'+
		    '</div>'+
		    '<div class="leftBar" ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{show: true,scrollbar:{width: 6,hoverWidth: 8,color:\'#36B084\'}}">'+
		    '<div>'+
		       '<div class="panel-group" id="accordion">'+		       
		          '<div class="panel panel-default" ng-repeat="x in menuList|orderBy:index">'+
					'<div class="panel-heading" ui-sref="{{x.router}}" ng-if="x.child.length===0"   first-menu-active ng-class="{true: \'active\', false: \'\'}[x.router==path]">'+
						    '<div class="icon" title="{{x.name}}" ><img ng-src="{{x.iconUrl}}"/></div>'+
							'<span>{{x.name}}</span>'+
					'</div>'+
					'<div class="panel-heading" ng-if="x.child.length!==0" data-toggle="collapse" data-parent="#accordion" href="#collapse{{x.name}}">'+
						    '<div class="icon" title="{{x.name}}"  ><img ng-src="{{x.iconUrl}}"/></div>'+
							'<span>{{x.name}}</span>'+
					'</div>'+
					'<div id="collapse{{x.name}}"class="panel-collapse collapse" ng-class="{true: \'in\', false: \'\'}[$index==0]">'+
						'<div class="panel-body">'+
							'<ul>'+
								'<li ng-repeat="y in x.child|orderBy:index" ui-sref="{{y.router}}" second-menu-active ng-class="{true: \'active\', false: \'\'}[y.router==path]">{{y.name}}</li>'+
								'</ul>'+
						'</div>'+
					'</div>'+
				'</div>'+	       
		       '</div>'+
			'</div>'+
			'</div>'+
	    '</div>'+
	    '<div class="iovMainContent">'+
		    '<div class="contentBody" ui-view>'+

		    '</div>'+
	    '</div>'
        ,
        link: function(scope, element, attr) {

            scope.path ="";
        	if(attr.menu!==""){
        		scope.menuList = JSON.parse(attr.menu)
            }
            scope.$watch(function () {
                return $location.path();
            },function (newValue,oldValue) {
               if(newValue){
                   scope.path =$location.path().substring(1,$location.path().length).replace(/\//g,'.');
               }else {
                   scope.path ="";
               }

            });
        } 
    }
});

iov.directive("navButtonToggle", function() {  
    var link_func = function(scope, element, attr) {  
        $(element).click(function() {  
           if($(".iovNavBar").css("width")==="200px"){
           $(".iovNavBar").stop().animate({"width":"58px"},100)
    	   $(".iovMainContent").stop().animate({"left":"58px"},100)
           }
           else{
           	$(".iovNavBar").stop().animate({"width":"200px"},100)
    	    $(".iovMainContent").stop().animate({"left":"200px"},100)
           }
        })  
    }  
    return {  
        restrict: 'EA',  
        link: link_func
    }  
})
iov.directive("changeSkin", function() {  
    var link_func = function(scope, element, attr) {  
        $(element).click(function() { 
           if($(".iovTitle .loginBox .skin .changeSkin").css("right")==="-100px"){
           $(".iovTitle .loginBox .skin .changeSkin").stop().animate({"right":"0px"},100)
           }
           else{
           	$(".iovTitle .loginBox .skin .changeSkin").stop().animate({"right":"-100px"},100)
           }
        })  
    }  
    return {  
        restrict: 'EA',  
        link: link_func
    }  
})


iov.directive("contentTitle",function() {   
    return {  
        restrict: 'E', 
        scope : {
        	
        },
        template:'<div class="contentTitle"><span class="icon-map-marker"></span>{{txt}}</div>', 
        link: function(scope, element, attr) {
            alert(attr.content)
        	scope.txt = attr.content
        } 
    }
});


//删除模态框
iov.directive("del", function() {   
    return {  
        restrict: 'E',
        scope: {
        	title:"@",
        	content:"@",
        	confirm:"@",
        	cancel:"@",
        	modalId:"@",
            confirmhide:"@",
            cancelhide:"@",
        	click:"&",
            height:"@",
            width:"@"
        },
        template:
			'<div class="modal fade iovModalDelete" id="{{modalId}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
			'<div class="drag modalDelete" drag>'+
				'<div class="modal-content" id="modalContent">'+
					'<div class="modal-header" drag-cursor drag-handle>'+
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">'+
                                '&times;'+
                        '</button>'+
						'<h4 class="modal-title">'+
                            '{{title}}'+
                         '</h4>'+
					'</div>'+
					'<div class="modal-body" ng-keypress="enter()">'+
						'<div><span class=" icon-question-sign"></span><span>{{content}}</span></div>'	+
					    '<button type="submit" class="btn btn-danger" ng-click="click()" ng-hide="confirmhide">{{confirm}}</button>'+
					    '<button type="button" class="btn btn-default" data-dismiss="modal" ng-hide="cancelhide">{{cancel}}</button>'+
				    '</div>'+
			   '</div>'+
		   '</div>'+
		   '</div>',
        link: function(scope, element, attr) {
			attr.title?scope.title = attr.title:scope.title="确认删除";
			attr.content?scope.content = attr.content:scope.content="您即将删除相关数据。您确定要继续吗？";
			attr.confirm?scope.confirm = attr.confirm:scope.confirm="确认删除";
			attr.cancel?scope.cancel = attr.cancel:scope.cancel="取消";
        	scope.modalId = attr.modalId;
            scope.confirmhide = attr.confirmhide
            scope.cancelhide = attr.cancelhide
            if (attr.height) {
                $("#modalContent").height(attr.height);
            }
            if (attr.width) {
                $("#modalContent").width(attr.width);
            }
        }
    }  
});

//确认提示框
    iov.directive("confirm", function() {
        return {
            restrict: 'E',
            scope: {
                headtext:"@",
                content:"@",
                confirm:"@",
                cancel:"@",
                modalId:"@",
                confirmhide:"@",
                cancelhide:"@",
                click:"&"
            },
            template:
            '<div class="modal fade iovModalDelete" id="{{modalId}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="drag modalDelete" drag>'+
            '<div class="modal-content">'+
            '<div class="modal-header" drag-cursor drag-handle>'+
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">'+
            '&times;'+
            '</button>'+
            '<h4 class="modal-title">'+
            '{{headtext}}'+
            '</h4>'+
            '</div>'+
            '<div class="modal-body" ng-keypress="enter()">'+
            '<div><span class=" icon-question-sign"></span><span>{{content}}</span></div>'	+
            '<button type="submit" class="btn btn-danger" ng-click="click()" ng-hide="confirmhide">{{confirm}}</button>'+
            '<button type="button" class="btn btn-default" data-dismiss="modal" ng-hide="cancelhide">{{cancel}}</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>',
            link: function(scope, element, attr) {
                attr.headtext?scope.headtext = attr.headtext:scope.headtext="确认操作";
                attr.content?scope.content = attr.content:scope.content="您即将操作相关数据。您确定要继续吗？";
                attr.confirm?scope.confirm = attr.confirm:scope.confirm="确认操作";
                attr.cancel?scope.cancel = attr.cancel:scope.cancel="取消";
                scope.modalId = attr.modalId;
                scope.confirmhide = attr.confirmhide
                scope.cancelhide = attr.cancelhide
            }
        }
    });

//表单及验证空间指令
iov.directive("controls", function() {
    return {
        restrict: 'E',
        transclude:true,
        scope:{
            controls:"=",
            hidecontrols:"=",
            messages:"@",
            unique:"@",
            title:"@",
            hideicon:"@"
        },
        template:'<span ng-if="!hidecontrols" class="nameTip">{{title}}</span>'+
        '<div ng-if="!hidecontrols" class="form-group has-feedback" ng-class="{true: \'has-error\',false: \'has-success\'}[controls.$invalid&&controls.$dirty]">'+
        '<div ng-transclude></div>'+
        '<span class="glyphicon glyphicon-ok form-control-feedback" ng-show="controls.$valid&&controls.$dirty" ng-if="!hideicon"></span>'+
        '<span class="glyphicon glyphicon-remove form-control-feedback" ng-show="controls.$invalid&&controls.$dirty" ng-if="!hideicon"></span>'+
        '</div>'+
        '<div class="error" ng-messages="controls.$error" ng-if="controls.$dirty">'+
        '<div class="errorTips" ng-repeat="x in messageList" ng-message="{{x.name}}">'+
        '<div class="border">'+
        '<span></span>'+
        '</div>'+
        '<span class="icon-info-sign"></span>{{x.text}}'+
        '</div>'+
        '<div class="errorTips" ng-if="controls.$error.unique">'+
        '<div class="border">'+
        '<span></span>'+
        '</div>'+
        '<span class="icon-info-sign"></span>{{unique}}'+
        '</div>'+
        '</div>',
        link: function(scope, element, attr) {
            if(attr.messages){
                scope.messageList = JSON.parse(attr.messages)
            }

        }
    }
});

iov.directive("tips", function() {
    return {
        restrict: 'E',
        scope : {
            content : '=',
            animate : '='
        },
        template:'<div class="iovOperationAnimate" style="max-width: 650px;width: auto"><p class="tipIcon"><img src="img/index/overIcon.png"/></p><p class="tipWord">{{content}}</p></div>',
        link: function(scope, element, attr) {
            scope.$watch('animate', function(newVal){
                if(newVal){
                    $(".iovOperationAnimate").animate({
                        "bottom": "10px"
                    }, 500);
                    var a=scope.content?scope.content.length:0;
                    $(".iovOperationAnimate").delay(2000+a*50).animate({
                        "bottom": "-140px"
                    }, 500);
                    scope.animate=false
                }
            });
        }
    }
});
//提交按钮
iov.directive("formSubmit", function() {
    return {
        restrict: 'E',
        scope : {
            validForm : '=',
            repeatSub : '=',
            innerText : '@'
        },
        template:'<button type="submit" class="iovFormButton btn confirm" ng-hide="hiddenFlag"  ng-disabled="validForm">'
            +'{{innerText}}'
        +'</button>'
        +'<button type="button" class="iovFormButton btn confirm" ng-hide="!hiddenFlag" disabled="true">'
        +'{{innerText}}'
        +'</button>',
        link: function(scope, element, attr) {
            scope.$watch('repeatSub', function(newVal){
                if(newVal == true){
                    scope.hiddenFlag = true;
                }else {
                    scope.hiddenFlag = false;
                }
            });
        }
    }
});


iov.directive('iovztree',function () {
    return{
        require:'?ngModel',
        restrict:'A',
        link:function(scope,element,attr,ngModel){

            var a=element.offset().top;
            element.height($(".bodyMain").height()-a-10) ;
            element.css("overflow","auto");
            scope.treeSetting.data?scope.treeSetting.data:scope.treeSetting.data = {
                simpleData:{
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    name:"name",
                    code:"code",
                    rootPId: 0
                },
                key :{
                    url:""
                }
            };
            scope.treeSetting.view?scope.treeSetting.view:scope.treeSetting.view = {
                showIcon:false,
                    selectedMulti:false
            };
            scope.$watch('nodesdata', function (newValue, oldValue) {
                if(newValue && newValue.length>0){
                    scope.treeObj = $.fn.zTree.getZTreeObj(attr.id);
                    scope.treeObj.addNodes(null,scope.nodesdata);
                    scope.treeObj.expandAll(true);
                    // var node=scope.treeObj.getNodeByParam("id",1,null);
                    // scope.treeObj.selectNode(node);
                    // 默认选中根节点
                    var root = scope.treeObj.getNodesByFilter(function(node){return node.level==0;}, true);
                    scope.treeObj.selectNode(root);
                }
            });
            $.fn.zTree.init(element, scope.treeSetting, scope.nodesdata);
        }
    }
});
})
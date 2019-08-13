define(['app','jquery'],function(app,$){
  //单独添加active类，同伴去除(侧滑菜单二级菜单用)
app.register.directive("panelActive", function() {  
    var link_func = function(scope, element, attr) {  
        $(element).click(function() {
        	$(".sidebar-menu .menu-second li").removeClass("active")
        	$(".sidebar-menu .menu-second li").removeClass("childFirstActive")        	
            $(element).addClass("active");             
        })  
    }  
    return {  
        restrict: 'EA',  
        link: link_func,  
    }  
});
    app.register.directive('tableztree',function () {
        return{
            require:'?ngModel',
            restrict:'A',
            link:function(scope,element,attr,ngModel){
                scope.tableTreeSetting.data?scope.tableTreeSetting.data:scope.tableTreeSetting.data = {
                    simpleData:{
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        name:"name",
                        rootPId: 0
                    },
                    key :{
                        url:""
                    }
                };
                scope.tableTreeSetting.view?scope.tableTreeSetting.view:scope.tableTreeSetting.view = {
                    showIcon:false
                };
                scope.$watch('tablenodesdata', function (newValue, oldValue) {
                    if(oldValue){
                        var nodes = scope.tableTreeObj.getNodes();
                        for (var i=0; i < nodes.length; i++) {
                            scope.tableTreeObj.removeNode(nodes[0]);

                        }
                    }

                    if(newValue){
                        scope.tableTreeObj = $.fn.zTree.getZTreeObj(attr.id);
                        scope.tableTreeObj.addNodes(null,newValue);
                        scope.tableTreeObj.expandAll(true);
                        if(typeof(eval(scope.treeCallBack(scope.tableTreeObj,attr.id)))=="function"){
                            scope.treeCallBack(scope.tableTreeObj,attr.id);
                        }
                    }
                });
                $.fn.zTree.init(element, scope.tableTreeSetting, scope.tablenodesdata);

            }
        }
    });

        app.register.directive("datePicker", function() {

        return {
            restrict: 'A',
            scope:{
                ngMode:"@"
            },
            link: link_func,
        }
            var link_func = function(scope, element, attr) {
                $(element).click(function() {
                    $(".sidebar-menu .menu-second li").removeClass("active")
                    $(".sidebar-menu .menu-second li").removeClass("childFirstActive")
                    $(element).addClass("active");
                })
            }
    });

})
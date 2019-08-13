define(['dataapp','jquery'],function(app,$){
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
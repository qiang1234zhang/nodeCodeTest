define(['app', "../../service/console/serviceService"], function(app) {
    app.register.controller('appIndex.serviceManager', ['$scope', '$state', '$global_var', '$serviceService', function($scope, $state, $global_var, $serviceService) {
        $scope.pageItemNum = Math.floor(($(".contentMain").height()-280) / 40); //计算基于显示器能容纳的数据条数
        $scope.pageNum = 1

        //--------------------分页查询--------------------//
        $scope.pageChanged = function() {

            queryByPage();
        };

        //list的数据查询函数
        var queryByPage = function() {
            $scope.selectAll = false;
            var page = null;
            if($scope.key === "" || !$scope.key) {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition':{"tenantId":$global_var.user.id}
                };
            }else {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "tenantId":$global_var.user.id,
                        "name":$scope.key
                    }
                };
            }
            $serviceService.queryByPage(page).then(function(result) {
                console.group("【应用分页查询】'base/serverRestServer/byPage'");
                console.group("提交数据");
                console.dir(page);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $scope.pageTotal = result.total;
                $scope.dataItems = result.rows;
                $scope.isShowContentBottom = result.total == 0 ?false:true;
            }, function() {
                $scope.errMsg = "系统繁忙，请稍后再试!";
            });
        };

        //得到新建页面
        $scope.getAddPage = function() {
            $scope.create.serviceName = "";
            $scope.create.parameter = "";
            $scope.create.url = "";
            $scope.create.mode = "";
            $scope.create.depict = "";
            $scope.create.nameRepeat = false;
            $scope.isEditPage = false;
        };

        //--------------------新建向后台提交信息--------------------
        $scope.create = function(valid) {
            if(valid && !$scope.nameRepeat) {
                var userItem = {
                    "name": $scope.create.serviceName,
                    "parameter": $scope.create.parameter,
                    "url": $scope.create.url,
                    "mode": $scope.create.mode,
                    "depict" : $scope.create.depict
                };

                $serviceService.create(userItem).then(function(result) {
                    console.group("【服务创建】'base/serverRestServer/creating'");
                    console.group("提交数据");
                    console.dir(userItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if(result.status === "success") {
                        $scope.content = "创建成功"
                    } else {
                        $scope.content = "创建失败"
                    }
                    queryByPage();
                    $('#create').modal('hide');
                    $scope.animate = true
                });
            }
        };

        //得到编辑页面
        $scope.getUpdatePage = function(data) {
            $scope.editData = data;
            $scope.edit.serviceName= data.name;
            $scope.edit.parameter= data.parameter;
            $scope.edit.url= data.url;
            $scope.edit.mode= data.mode;
            $scope.edit.depict = data.depict;
            $scope.isEditPage = true;

        };

        //--------------------编辑向后台提交数据--------------------//
        $scope.edit = function(valid) {
            if(valid) {
                var editItems = {
                    "id": $scope.editData.id,
                    "name": $scope.edit.serviceName,
                    "parameter": $scope.edit.parameter,
                    "url": $scope.edit.url,
                    "mode": $scope.edit.mode,
                    "depict" : $scope.edit.depict
                };
                $serviceService.edit(editItems).then(function(result) {
                    console.group("【服务修改】'base/serverRestServer/updating'");
                    console.group("提交数据");
                    console.dir(editItems);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if(result.status === "success") {
                        $scope.content = "编辑成功"
                    } else {
                        $scope.content = "编辑失败"
                    }
                    queryByPage();
                    $('#edit').modal('hide');
                    $scope.animate = true
                });
            }

        };

        //--------------------批量删除--------------------//
        //批量删除确定按钮
        $scope.massDeletion = function() {
            $scope.massDeletionArr = [];
            $(".massDeletion").each(function() {
                if($(this).prop("checked")) {
                    $scope.massDeletionArr.push($(this).attr("id"))
                }
            });
            if($scope.massDeletionArr.length !== 0) {
                $('#massDeletion').modal('show');
            }else{
                Alert("请选择需要删除的数据！");
            }
        };

        $scope.delete = function() {
            var data = $scope.global_function.massdelete($scope.massDeletionArr);
            $serviceService.delete(data).then(function(result) {
                console.group("【删除数据】'base/serverRestServer/deleting?ids='");
                console.group("提交数据");
                console.dir(data);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                if(result.content === "true") {
                    $scope.content = "删除数据成功"
                } else {
                    $scope.content = "删除数据失败"
                }
                queryByPage();
                $('#massDeletion').modal('hide');
                $scope.animate = true
            });
        };

       //服务名称去重
        $scope.removeRepeat = function(name) {
            if(typeof($scope.isEditPage == false?$scope.create.serviceName:$scope.edit.serviceName) != "undefined") {
                var Items = {
                    "id":$scope.isEditPage == false?null:$scope.editData.id,
                    "name": name
                };
                console.log(Items)
                $serviceService.nameRepeat(Items).then(function(result) {
                    console.log(result)
                    if($scope.isEditPage == false){
                        if(result.content == "true"){
                            $scope.addForm.serviceName.$setValidity('unique', false);
                        }else{
                            $scope.addForm.serviceName.$setValidity('unique', true);
                            $scope.create.isChecked = false
                        }
                    }else{

                        if(result.content == "true"){
                            $scope.editForm.serviceName.$setValidity('unique', false);
                        }else{
                            $scope.editForm.serviceName.$setValidity('unique', true);
                            $scope.edit.isChecked = false
                        }
                    }
                });
            }
        };

        //回车事件
        $scope.mykey=function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                queryByPage();
            }
        };

        //页面初始化
        queryByPage();

    }]);
});
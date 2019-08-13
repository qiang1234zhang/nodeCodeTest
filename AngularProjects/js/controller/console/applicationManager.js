/**
 * Created by huangfx on 2016/12/8.
 */

define(['app', "../../service/console/applicationService"], function(app) {
    app.register.controller('appIndex.applicationManager', ['$scope', '$state', '$global_var', '$applicationService', function($scope, $state, $global_var, $applicationService) {
        $scope.pageItemNum = Math.floor(($(".contentMain").height()-180) / 40); //计算基于显示器能容纳的数据条数
        $scope.pageNum = 1

        //--------------------分页查询--------------------//
        $scope.pageChanged = function() {
            $scope.selectAll = false;
            queryByPage();
        };

        //list的数据查询函数
        var queryByPage = function() {
            var page = null;
            if($scope.key === "" || !$scope.key) {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition':{"type":"1"}
                };
            }else {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "type":"1",
                        "name":$scope.key
                    }
                };
            }
            $applicationService.queryByPage(page).then(function(result) {
                console.group("【应用分页查询】'base/appRestServer/byPage'");
                console.group("提交数据");
                console.dir(page);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $scope.pageTotal = result.total;
                $scope.dataItems = result.rows;
            }, function() {
                $scope.errMsg = "系统繁忙，请稍后再试!";
            });
        };

        //得到新建页面
        $scope.getAddPage = function() {
            $scope.create.appName = "";
            $scope.create.url = "";
            $scope.create.code = "";
            $scope.isEditPage = false;
        };

        //--------------------新建应用向后台提交信息--------------------//
        $scope.create = function(valid) {
            if(valid) {
                var appItem = {
                    "name": $scope.create.appName,
                    "url": $scope.create.url,
                    "code": $scope.create.code

                };

                $applicationService.create(appItem).then(function(result) {
                    console.group("【应用创建】'base/userRestServer/creating'");
                    console.group("提交数据");
                    console.dir(appItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if(result.status === "success") {
                        $scope.content = "应用创建成功"
                    } else {
                        $scope.content = "应用创建失败"
                    }
                    queryByPage();
                    $('#create').modal('hide');
                    $scope.animate = true
                });
            }
        };

        //得到编辑页面
        $scope.getUpdatePage = function(data) {
            $scope.appEditData = data;
            $scope.edit.appName = data.name;
            $scope.edit.url = data.url;
            $scope.edit.code = data.code;
            $scope.isEditPage = true;


        };

        //--------------------编辑向后台提交数据--------------------//
        $scope.edit = function(valid) {
            if(valid) {
                var appEditItem = {
                    "id": $scope.appEditData.id,
                    "name": $scope.edit.appName,
                    "url": $scope.edit.url,
                    "code": $scope.edit.code

                };
                $applicationService.edit(appEditItem).then(function(result) {
                    console.group("【应用修改】'base/appRestServer/updating'");
                    console.group("提交数据");
                    console.dir(appEditItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if(result.status === "success") {
                        $scope.content = "应用编辑成功"
                    } else {
                        $scope.content = "应用编辑失败"
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
            }
        };

        $scope.delete = function() {
            var data = $scope.global_function.massdelete($scope.massDeletionArr);
            $applicationService.delete(data).then(function(result) {
                console.group("【删除数据】'base/appRestServer/deleting?id='");
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

        //应用名去重
        $scope.checkAppRepeat = function(appName) {
            if(typeof($scope.isEditPage == false?$scope.create.appName:$scope.edit.appName) != "undefined") {
                var appNameItem = {
                    "id":$scope.isEditPage == false?null:$scope.appEditData.id,
                    "name": appName
                };
                $applicationService.nameRepeat(appNameItem).then(function(result) {
                    console.group("提交数据");
                    console.dir(appNameItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    if($scope.isEditPage == false){
                        if(result.content == "true"){
                            $scope.addForm.appName.$setValidity('unique', false);
                        }else{
                            $scope.addForm.code.$setValidity('unique', true);
                            $scope.create.isChecked = false
                        }
                    }else{

                        if(result.content == "true"){
                            $scope.editForm.appName.$setValidity('unique', false);
                        }else{
                            $scope.editForm.appName.$setValidity('unique', true);
                            $scope.edit.isChecked = false
                        }
                    }

                });
            }
        };

        //应用code去重
        $scope.checkCodeRepeat = function() {
            if($scope.create.code && $scope.create.code !== "") {
                var appCodeItem = {
                    "code": $scope.create.code
                };
                $applicationService.codeRepeat(appCodeItem).then(function(result) {

                    console.group("提交数据");
                    console.dir(appCodeItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();

                    if(result.content == "true") {
                        $scope.addForm.code.$setValidity('unique', false);
                    } else {
                        $scope.addForm.code.$setValidity('unique', true);
                        $scope.create.isChecked = false
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
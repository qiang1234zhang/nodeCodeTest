define(['app', "../../service/console/tenantService"], function(app) {
    app.register.controller('appIndex.tenantManager', ['$scope', '$state', '$global_var', '$tenantService', function($scope, $state, $global_var, $tenantService) {
        $scope.pageItemNum = Math.floor(($(".contentMain").height()-280) / 40)>0?Math.floor(($(".contentMain").height()-180) / 40):1; //计算基于显示器能容纳的数据条数
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
                    'condition':{"type":"0"}
                };
            }else {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "type":"0",
                        "userName":$scope.key
                    }
                };
            }

            $tenantService.queryByPage(page).then(function(result) {
                console.group("【系统管理员分页查询】'base/userRestServer/byPage'");
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
        $scope.getTenantAddPage = function() {
            $scope.tenantCreate.tenantLoginName = "";
            $scope.tenantCreate.tenantName = "";
            $scope.tenantCreate.tenantPassword = "";
            $scope.tenantCreate.tenantPhone = "";
            $scope.tenantCreate.tenantEmail = "";
            $scope.tenantCreate.tenantAddress = "";
            $scope.isTenantEditPage = false;
        };

        //--------------------新建用户向后台提交信息--------------------
        $scope.tenantCreate = function(valid) {
            if(valid) {
                var tenantCreateItem = {
                    "loginName": $scope.tenantCreate.tenantLoginName,
                    "passWord": $scope.tenantCreate.tenantPassword,
                    "userName": $scope.tenantCreate.tenantName,
                    "phone": $scope.tenantCreate.tenantPhone,
                    "email": $scope.tenantCreate.tenantEmail,
                    "address" : $scope.tenantCreate.tenantAddress
                };

                $tenantService.create(tenantCreateItem).then(function(result) {
                    console.group("【系统管理员创建】'base/userRestServer/creating'");
                    console.group("提交数据");
                    console.dir(tenantCreateItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if(result.status === "success") {
                        $scope.content = "系统管理员创建成功"
                    } else {
                        $scope.content = "系统管理员创建失败"
                    }
                    queryByPage();
                    $('#create').modal('hide');
                    $scope.animate = true
                });
            }
        };

        //得到编辑页面
        $scope.getUpdatePage = function(data) {
            $scope.tenantEditData = data;
            $scope.tenantEdit.tenantLoginName = data.loginName;
            $scope.tenantEdit.tenantName = data.userName;
            $scope.tenantEdit.tenantPassword = data.passWord;
            $scope.tenantEdit.tenantPhone = data.phone;
            $scope.tenantEdit.tenantEmail = data.email;
            $scope.tenantEdit.tenantAddress = data.address;
            $scope.isTenantEditPage = true;

        };

        //--------------------编辑向后台提交数据--------------------//
        $scope.tenantEdit = function(valid) {
            if(valid) {
                var tenantEditItem = {
                    "id": $scope.tenantEditData.id,
                    "roleId": $scope.tenantEditData.roleId,
                    "loginName": $scope.tenantEdit.tenantLoginName,
                    "passWord": $scope.tenantEdit.tenantPassword,
                    "userName": $scope.tenantEdit.tenantName,
                    "phone": $scope.tenantEdit.tenantPhone,
                    "email": $scope.tenantEdit.tenantEmail,
                    "address" : $scope.tenantEdit.tenantAddress
                };
                $tenantService.edit(tenantEditItem).then(function(result) {
                    console.group("【系统管理员修改】'base/userRestServer/updating'");
                    console.group("提交数据");
                    console.dir(tenantEditItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if(result.status === "success") {
                        $scope.content = "系统管理员编辑成功"
                    } else {
                        $scope.content = "系统管理员编辑失败"
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
            $tenantService.delete(data).then(function(result) {
                console.group("【删除数据】'base/userRestServer/deleting?id='");
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
                $scope.selectAll=false;
                $scope.animate = true
            });
        };

        //用户登录名去重
        $scope.checkLoginNameRepeat = function(loginName) {
            if(typeof($scope.isTenantEditPage == false?$scope.tenantCreate.tenantLoginName:$scope.tenantEdit.tenantLoginName) != "undefined") {
                var loginNameItem = {
                    "loginName": loginName,
                    "id":$scope.isTenantEditPage == false?null:$scope.tenantEditData.id
                };
                $tenantService.loginNameRepeat(loginNameItem).then(function(result) {
                    console.group("【删除数据】'base/userRestServer/checkLoginName'");
                    console.group("提交数据");
                    console.dir(loginNameItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();
                    if($scope.isTenantEditPage){
                        if(result.content == "true") {
                            $scope.tenantEditForm.tenantLoginName.$setValidity("unique",false);
                        } else {
                            $scope.tenantEditForm.tenantLoginName.$setValidity("unique",true);
                            $scope.tenantEdit.isChecked = false;
                        }
                    }else {
                        if(result.content == "true") {
                            $scope.tenantAddForm.tenantLoginName.$setValidity("unique",false);
                        } else {
                            $scope.tenantAddForm.tenantLoginName.$setValidity("unique",true);
                            $scope.tenantCreate.isChecked = false;
                        }
                    }
                });
            }
        };

        //用户名去重
        $scope.checkTenantNameRepeat = function(userName) {
            if(typeof($scope.isTenantEditPage == false?$scope.tenantCreate.tenantName:$scope.tenantEdit.tenantName) != "undefined") {
                var userNameItem = {
                    "userName": userName,
                    "id":$scope.isTenantEditPage == false?null:$scope.tenantEditData.id
                };
                $tenantService.userNameRepeat(userNameItem).then(function(result) {
                    console.group("【删除数据】'base/userRestServer/checkName'");
                    console.group("提交数据");
                    console.dir(userNameItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();
                    console.groupEnd();
                    if($scope.isTenantEditPage){
                        if(result.content == "true") {
                            $scope.tenantEditForm.tenantName.$setValidity("unique",false);
                        } else {
                            $scope.tenantEditForm.tenantName.$setValidity("unique",true);
                            $scope.tenantEdit.isChecked = false;
                        }
                    }else {
                        if(result.content == "true") {
                            $scope.tenantAddForm.tenantName.$setValidity("unique",false);
                        } else {
                            $scope.tenantAddForm.tenantName.$setValidity("unique",true);
                            $scope.tenantCreate.isChecked = false;
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
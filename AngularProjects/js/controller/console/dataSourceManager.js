/**
 * Created by huangfx on 2016/12/5.
 */
define(['app', "../../service/console/dataSourceService"], function (app) {
    app.register.controller('appIndex.dataSourceManager', ['$scope', '$state', '$global_var', '$dataSourceService', function ($scope, $state, $global_var, $dataSourceService) {
        $scope.pageItemNum = Math.floor(($(".contentMain").height() - 220) / 45) > 0 ? Math.floor(($(".contentMain").height() - 220) / 45) : 1; //计算基于显示器能容纳的数据条数
        $scope.pageNum = 1;
        $scope.sourceId = "";
        /*$scope.pageTotal = 200;*/ //需要从api拿


        //--------------------分页查询--------------------//
        $scope.pageChanged = function () {
            $scope.selectAll = false;
            queryByPage();
        };

        //查询函数
        var queryByPage = function () {
            var page = null;
            if ($scope.key === "" || !$scope.key) {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "tenantId": $global_var.user.id
                    }
                };
            } else {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "tenantId": $global_var.user.id,
                        "sourceName": $scope.key
                    }
                };
            }
            $dataSourceService.queryByPage(page).then(function (result) {
                console.group("【数据源管理分页查询】'base/dbSourceRestServer/byPage'");
                console.group("提交数据");
                console.dir(page);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $scope.pageTotal = result.total;
                $scope.dataItems = result.rows;
            });
        };


        //条件查询
        $scope.search = function () {
            if ($scope.test === "" || !$scope.test) {
                queryByPage();
            } else {
                var data = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "sourceName": $scope.test
                    }
                };
                $dataSourceService.queryByPage(data).then(function (result) {
                    console.group("【数据源条件查询】'base/dbSourceRestServer/byPage'");
                    console.group("提交数据");
                    console.dir(data);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();
                    $scope.pageTotal = result.total;
                    $scope.dataItems = result.rows;
                });
            }
        };

        //得到新建页面
        $scope.getAddPage = function () {
            $scope.create.databaseName = "";
            $scope.create.sourceType = "请选择类型";
            $scope.create.sourceName = "";
            $scope.create.username = "";
            $scope.create.password = "";
            $scope.create.IP = "";
            $scope.create.PORT = "";
            $scope.create.esClusterName = "";
            $scope.create.catalogName = "";
            $scope.create.esIndex = "";
            $scope.usernameShow = false;
            $scope.databaseNameShow = false;
            $scope.passwordShow = false;
            $scope.catalogNameShow = false;
            $scope.esClusterNameShow = false;
            $scope.esIndexShow = false;
            $scope.isDataSourceEditPage = false;
        };

        //--------------------新建--------------------//
        $scope.create = function (valid) {
            if (valid) {
                var dataSourceItem = {
                    "databaseName": $scope.create.databaseName,
                    "sourceType": $scope.create.sourceType,
                    "username": $scope.create.username,
                    "password": $scope.create.password,
                    "sourceName": $scope.create.sourceName,
                    "ip": $scope.create.IP,
                    "port": $scope.create.PORT,
                    "esClusterName": $scope.create.esClusterName,
                    "esIndex": $scope.create.esIndex,
                    "catalogName": $scope.create.catalogName
                };
                $dataSourceService.create(dataSourceItem).then(function (result) {
                    console.group("【数据源新建】'base/dbSourceRestServer/creating'");
                    console.group("提交数据");
                    console.dir(dataSourceItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if (result.status === "success") {
                        $scope.content = "数据源创建成功！"
                    } else {
                        $scope.content = "数据源创建失败！"
                    }
                    queryByPage();
                    $("#create").modal("hide");
                    $scope.animate = true
                });

            }
        };
//--------------------编辑--------------------//
        $scope.edit = function (valid) {
            if (valid) {
                var dataSourceItem = {
                    "id": $scope.datasourceEditData.id,
                    "databaseName": $scope.edit.databaseName,
                    "sourceType": $scope.edit.sourceType,
                    "username": $scope.edit.username,
                    "password": $scope.edit.password,
                    "sourceName": $scope.edit.sourceName,
                    "ip": $scope.edit.IP,
                    "port": $scope.edit.PORT,
                    "esClusterName": $scope.edit.esClusterName,
                    "esIndex": $scope.edit.esIndex,
                    "catalogName": $scope.edit.catalogName
                };
                $dataSourceService.edit(dataSourceItem).then(function (result) {
                    console.group("【存储服务编辑】'base/dataBase/updating'");
                    console.group("提交数据");
                    console.dir(dataSourceItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if (result.status === "success") {
                        $scope.content = "数据源编辑成功！"
                    } else {
                        $scope.content = "数据源编辑失败！"
                    }
                    queryByPage();
                    $("#edit").modal("hide");
                    $scope.animate = true
                });
            }
        };

        //得到编辑页面
        $scope.getUpdatePage = function (data) {
            $scope.datasourceEditData = data;
            $scope.isDataSourceEditPage = true;
            $scope.edit.sourceName = data.sourceName == null ? '' : data.sourceName;
            $scope.edit.sourceType = data.sourceType == null ? '' : data.sourceType;
            $scope.edit.IP = data.ip == null ? '' : data.ip;
            $scope.edit.PORT = data.port == null ? '' : data.port;
            $scope.edit.catalogName = data.catalogName == null ? '' : data.catalogName;
            $scope.edit.databaseName = data.databaseName == null ? '' : data.databaseName;
            $scope.edit.esClusterName = data.esClusterName == null ? '' : data.esClusterName;
            $scope.edit.esIndex = data.esIndex == null ? '' : data.esIndex;
            $scope.edit.username = data.username == null ? '' : data.username;
            $scope.edit.password = data.password == null ? '' : data.password;
            $scope.showChange($scope.edit.sourceType);
        };

        //--------------------批量删除--------------------//
        //批量删除确定按钮
        $scope.massDeletion = function () {
            $scope.massDeletionArr = [];
            $(".massDeletion").each(function () {
                if ($(this).prop("checked")) {
                    $scope.massDeletionArr.push($(this).attr("id"))
                }
            });
            if ($scope.massDeletionArr.length !== 0) {
                $('#massDeletion').modal('show');
            }
        };

        $scope.delete = function () {
            var data = $scope.global_function.massdelete($scope.massDeletionArr);
            $dataSourceService.delete(data).then(function (result) {
                console.group("【删除数据表】'base/database/deleting?id='");
                console.group("提交数据");
                console.dir(data);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                if (result.content === "true") {
                    $scope.content = "删除数据源成功！"
                } else {
                    $scope.content = "删除数据源失败！"
                }
                queryByPage();
                $('#massDeletion').modal('hide');
                $scope.animate = true
            });
        };

        $scope.dataBaseTest = function (data) {
            var id = data.id;
            $dataSourceService.test(id).then(function (result) {
                console.group("【数据库连接测试】'base/database/getDBConn'");
                console.group("提交数据");
                console.dir(id);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                if (result.content) {
                    $scope.tipWord = "成功"
                } else {
                    $scope.tipWord = "失败"
                }
            });
        };

        //数据源名称去重
        $scope.removeRepeat = function (sourceName) {
            if (typeof($scope.isDataSourceEditPage == false?$scope.create.sourceName:$scope.edit.sourceName) != "undefined") {
                var sourceNameItem = {
                    "sourceName": sourceName
                };
                console.log(sourceNameItem)
                $dataSourceService.nameRepeat(sourceNameItem).then(function (result) {
                    console.log(result)
                    if ($scope.isDataSourceEditPage) {
                        if (result.content == "true") {
                            $scope.editForm.sourceName.$setValidity("unique", false);
                        } else {
                            $scope.editForm.sourceName.$setValidity("unique", true);
                            $scope.edit.isChecked = false;
                        }
                    } else {
                        if (result.content == "true") {
                            $scope.addForm.sourceName.$setValidity("unique", false);
                        } else {
                            $scope.addForm.sourceName.$setValidity("unique", true);
                            $scope.create.isChecked = false;
                        }
                    }
                });
            }
        };

        //回车事件
        $scope.mykey = function (e) {
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.search();
            }
        };
        // queryByPage();

        //
        $scope.showChange = function (value) {
            console.info("value=" + value);
            if (value === "00000000") {
                $scope.usernameShow = true;
                $scope.databaseNameShow = true;
                $scope.passwordShow = true;
                $scope.catalogNameShow = false;
                $scope.esClusterNameShow = false;
                $scope.esIndexShow = false;

            } else if (value === "00000001") {
                $scope.usernameShow = true;
                $scope.databaseNameShow = true;
                $scope.passwordShow = true;
                $scope.catalogNameShow = false;
                $scope.esClusterNameShow = false;
                $scope.esIndexShow = false;

            } else if (value === "00000002") {
                $scope.usernameShow = true;
                $scope.databaseNameShow = true;
                $scope.passwordShow = true;
                $scope.catalogNameShow = false;
                $scope.esClusterNameShow = false;
                $scope.esIndexShow = false;

            } else if (value === "00000003") {
                $scope.usernameShow = true;
                $scope.databaseNameShow = true;
                $scope.passwordShow = true;
                $scope.catalogNameShow = true;
                $scope.esClusterNameShow = false;
                $scope.esIndexShow = false;

            } else if (value === "00000200") {
                $scope.usernameShow = false;
                $scope.databaseNameShow = false;
                $scope.passwordShow = false;
                $scope.catalogNameShow = false;
                $scope.esClusterNameShow = true;
                $scope.esIndexShow = true;

            } else {

            }
        }
    }]);
});
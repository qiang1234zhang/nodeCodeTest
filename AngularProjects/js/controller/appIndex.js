define(['app', 'jquery', 'directive', 'datasourceDirective', 'fileDatasourceDirective', 'filter', 'iovdialog', "js/service/appIndexService"], function (app, $) {
    app.register.controller('managementApp.appIndex', ['$scope', '$global_var', '$state', '$appIndexService', function ($scope, $global_var, $state, $appIndexService) {
        'use strict';
        $scope.systemName = "大数据管理平台";
        $scope.isDataPortal = false;
        $scope.logoPngUri = "img/index/cloud.png";
        $scope.classSwitch = true;
        //换肤
        $scope.changecss = function (color) {
            var baseUrl = "css/theme/"
            var url = baseUrl + color + ".css"
            $("#skin").prop("href", url)
            localStorage.user_skin = color
        }

        if (!localStorage.user) {
            $global_var.user.isLogged = false;
            $state.go('login')
        } else {
            $global_var.user = JSON.parse(localStorage.user);
            if ($global_var.user) {
                $scope.userName = $global_var.user.userName
                $scope.permission = $global_var.user.permission
                if (localStorage.user_skin) {
                    $scope.changecss(localStorage.user_skin)
                }
            }

        }
        //退出登录
        $scope.back = function () {
            $global_var.user = null;
            localStorage.user = null;
            removeCookies("user_id");
            removeCookies("user_role_id");
            removeCookies("username");
            removeCookies("loginname");
            $state.go('login')
        }
        var removeCookies = function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();

        }
        var getCookie = function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
        $scope.global_function = {
            checkField: function (sorArr, sorFld, sorVal, tarFld) {
                var out;
                for (var i = 0; i < sorArr.length; i++) {
                    if (sorArr[i][sorFld] === sorVal) {
                        out = sorArr[i][tarFld]
                    }
                }
                return out
            },
            massdelete: function (arr) {
                var str = ""
                for (var i = 0; i < arr.length; i++) {
                    str += (arr[i] + ',')
                }
                str = str.slice(0, str.length - 1)
                return str
            }
        }

        //根据id查询用户所有信息
        $scope.userEdit = function () {
            $appIndexService.queryUserById($global_var.user.id).then(function (result) {
                console.group("【用户信息查询】'base/user/byId'");
                console.group("提交数据");
                console.dir($global_var.user.id);
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $scope.userData = result.content;
                $("#userName").val($scope.userData.userName);
                $("#address").val($scope.userData.address);
                $scope.userinfo.userName = $scope.userData.userName;
                $scope.userinfo.address = $scope.userData.address;
                $scope.userinfo.passWord = $scope.userData.passWord;
                $scope.userinfo.phone = $scope.userData.phone;
                $scope.userinfo.Email = $scope.userData.email;

            }, function () {
                $scope.errMsg = "系统繁忙，请稍后再试!";
            });
        };
        //--------------------编辑向后台提交数据--------------------//
        $scope.userinfo = function () {
            var userItem = {
                "id": $scope.userData.id,
                "userName": $scope.userinfo.userName,
                "passWord": $scope.userinfo.passWord,
                "phone": $scope.userinfo.phone,
                "email": $scope.userinfo.Email,
                "address": $scope.userinfo.address

            };
            console.group("【用户信息修改】'base/user/updating'");
            console.group("提交数据");
            console.dir(userItem);
            console.groupEnd();
            $appIndexService.edit(userItem).then(function (result) {
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $('#globleEditInfo').modal('hide');
            });

        };
        //用户名去重
        $scope.checkUsernameRepeat = function (userName) {
            if (typeof($scope.userinfo.userName) != "undefined") {
                var userNameItem = {
                    "userName": userName,
                    "id": $scope.userData.id
                };
                console.group("【删除数据】'base/userRestServer/checkName'");
                console.group("提交数据");
                console.dir(userNameItem);
                console.groupEnd();
                $appIndexService.userNameRepeat(userNameItem).then(function (result) {
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();
                    console.groupEnd();
                    if (result.content == "true") {
                        $scope.editForm.userName.$setValidity("unique", false);
                    } else {
                        $scope.editForm.userName.$setValidity("unique", true);
                        $scope.userinfo.isChecked = false;
                    }
                });
            }
        };

        $scope.authorizedInfo = function () {
            $scope.authorizedData = null;
            $appIndexService.getlicenceInfo().then(function (result) {
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                $scope.authorizedData = result;
                $scope.flag = $scope.authorizedData.failDay < 30 ? true : false;

            });
            // appName: "/cloud"
            // auth: false
            // endTime: "2017-12-30"
            // failDay: "303"
            // machineCode: "1515-3D89-4627-6E89-F3FD-A16A-29FA-F624"
            // nodeNum: "10"
            // startTime: "2016-09-30"
            // trialVersion: "NO"
            // useUnit: "ZJGIS"
        }
        
        var getLogoPng = function () {
            $appIndexService.getLogoUri().then(function (result) {
                if (result.content) {
                    var data = JSON.parse(result.content);
                    $scope.logoPngUri = data.logoPng;
                    $scope.classSwitch = data.logoClass == "logo"?true:false;
                }
            });
        }
        getLogoPng();

    }]);
});
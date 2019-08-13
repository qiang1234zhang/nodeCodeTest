define(['dataapp', 'jquery', 'datadirective',   'datafilter', 'iovdialog','js/service/dataPortalIndexService'], function (app, $) {
    app.register.controller('dataPortal.appIndex', ['$scope', '$global_var', '$state','$dataPortalIndexService', function ($scope, $global_var, $state,$dataPortalIndexService) {
        'use strict';
        $scope.systemName = "数据门户";
        $scope.logoPngUri = "img/index/cloud.png";
        $scope.classSwitch = true;
        var initUrlObj = JSON.parse(localStorage.user);
        if(initUrlObj.appInitUrl && initUrlObj.appInitUrl.indexOf("dataPortal")>-1){
            $scope.isDataPortal = false;
        }else {
            $scope.isDataPortal = true;
        }


        //换肤
        $scope.changecss = function (color) {
            var baseUrl = "css/theme/"
            var url = baseUrl + color + ".css"
            $("#skin").prop("href", url)
            localStorage.user_skin = color
        }
        $scope.getMenuPermission = function (menu) {
            var result = {
                "mainMenu": [],
                "menu": {
                    "developerCenter": [],
                    "dataCenter": [],
                    "personalCenter": [],
                    "serviceCenter": [],
                    "subjectAnalysis": []
                }
            }
            //遍历全部基础菜单数据
            var secondLevelMenu = []
            var thirdLevelMenu = []
            for(var i = 0; i < menu.length; i++) {
                //提取出其中的父顶级菜单
                if (menu[i].level === '1') {
                    var obj = {
                        name: menu[i].name,
                        iconUrl: menu[i].img,
                        router: menu[i].url,
                        id: menu[i].id,
                        index: menu[i].menuIndex,
                        pId: menu[i].pId
                    }
                    if(menu[i].url.indexOf("dataPortal")>-1){
                        result.mainMenu.push(obj);
                    }

                }

                //二级菜单
                var parentIdLen = menu[i].level-1;
                if(parentIdLen==1 && menu[i].pId != 0){
                    var child_obj = {
                        name: menu[i].name,
                        iconUrl: menu[i].img,
                        router: menu[i].url,
                        id: menu[i].id,
                        index:menu[i].menuIndex,
                        pId: menu[i].pId,
                        child:[]
                    }
                    if(menu[i].url.indexOf("dataPortal")>-1){
                        secondLevelMenu.push(child_obj);
                    }

                }

                //三级菜单
                if(parentIdLen==2){
                    var child_obj = {
                        name: menu[i].name,
                        iconUrl: menu[i].img,
                        router: menu[i].url,
                        id: menu[i].id,
                        index:menu[i].menuIndex,
                        pId: menu[i].pId,
                        child:[]
                    }
                    if(menu[i].url.indexOf("dataPortal")>-1){
                        thirdLevelMenu.push(child_obj);
                    }

                }

            }

            //组合三级菜单和二级菜单
            for(var var1 =0;var1<secondLevelMenu.length;var1++){
                for(var var2 =0;var2<thirdLevelMenu.length;var2++ ){
                    if(thirdLevelMenu[var2].pId == secondLevelMenu[var1].id){
                        secondLevelMenu[var1].child.push(thirdLevelMenu[var2]);
                    }
                }
                if($.inArray("developerCenter", secondLevelMenu[var1].router.split(".")) !== -1) {
                    result.menu.developerCenter.push(secondLevelMenu[var1])
                }else if($.inArray("dataCenter", secondLevelMenu[var1].router.split(".")) !== -1) {
                    result.menu.dataCenter.push(secondLevelMenu[var1])
                }else if($.inArray("personalCenter", secondLevelMenu[var1].router.split(".")) !== -1) {
                    result.menu.personalCenter.push(secondLevelMenu[var1])
                }else if($.inArray("serviceCenter", secondLevelMenu[var1].router.split(".")) !== -1) {
                    result.menu.serviceCenter.push(secondLevelMenu[var1])
                }else if($.inArray("subjectAnalysis", secondLevelMenu[var1].router.split(".")) !== -1) {
                    result.menu.subjectAnalysis.push(secondLevelMenu[var1])
                }
            }
            return result
        }
        if (!localStorage.user) {
            $global_var.user.isLogged = false;
            //$state.go('login')
        } else {
            $global_var.user = JSON.parse(localStorage.user);
            if ($global_var.user) {
                $scope.userName = $global_var.user.userName
                var permission = $global_var.user.menuContent
                $scope.permission = $scope.getMenuPermission(permission);
                var menuArray=$scope.permission.mainMenu
                menuArray=_.sortBy(menuArray,'menuIndex');
                var initUrl=_.first(menuArray).router;
                if("dataPortal"==$state.current.name)
                    $state.go(initUrl);
                if (localStorage.user_skin) {
                    $scope.changecss(localStorage.user_skin)
                }
            }

        }


        
        //返回app
        $scope.goIndex = function () {
            var appInitUrl = JSON.parse(localStorage.user).appInitUrl.replace(".", "/");
            var win = window;
            while (win != win.top){
                win = win.top;
            }
            win.location.href= "/index.html#/"+appInitUrl;
        }
        //退出登录
        $scope.back = function () {
            $global_var.user = null;
            localStorage.user = null;
            removeCookies("user_id");
            removeCookies("user_role_id");
            removeCookies("username");
            removeCookies("loginname");
            var win = window;
            while (win != win.top){
                win = win.top;
            }
            win.location.href= "/index.html#/login";
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
            $dataPortalIndexService.queryUserById($global_var.user.id).then(function (result) {

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

            $dataPortalIndexService.edit(userItem).then(function (result) {

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

                $dataPortalIndexService.userNameRepeat(userNameItem).then(function (result) {
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
            $dataPortalIndexService.getlicenceInfo().then(function (result) {
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                $scope.authorizedData = result;
                $scope.flag = $scope.authorizedData.failDay < 30 ? true : false;

            });
        }


        var getLogoPng = function () {
            $dataPortalIndexService.getLogoUri().then(function (result) {
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
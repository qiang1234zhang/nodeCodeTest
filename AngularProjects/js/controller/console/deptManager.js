define(['app', 'jquery', 'ztree', 'ztreeCheck', "js/service/console/deptService","js/service/console/userManagementService"], function(app) {
    app.register.controller('appIndex.deptManager', ['$scope', '$state', '$global_var', '$deptService','$userManagementService', function($scope, $state, $global_var, $deptService,$userManagementService) {

        //*****************************用户相关************************************
        $scope.roleId = "请选择用户角色";
        $scope.pageItemNum = Math.floor(($(".menuContentMain").height()-280) / 40); //计算基于显示器能容纳的数据条数
        $scope.pageNum = 1;


        $scope.treeSetting = {
            callback :{
                onClick:function(e, treeId, treeNode) {
                    $scope.selectAll = false;
                    if(treeNode.id=="0"){
                        $('.isDelete').attr("disabled",true);
                        $('.isEdit').attr("disabled",true) ;
                    }else{
                        if(treeNode.isParent){
                            $('.isDelete').attr("disabled",true);
                            $('.isEdit').attr("disabled",true) ;
                        }else{
                            $('.isDelete').attr("disabled",false);
                            $('.isEdit').attr("disabled",false);
                        }
                    }

                    $scope.create.parentName =treeNode.name;
                    $scope.create.parentId=treeNode.id;
                    $scope.orgId=treeNode.id;
                    $scope.orgName=treeNode.name;
                    $scope.edit.id =treeNode.id;
                    $scope.edit.parentId =treeNode.parentId;
                    $scope.edit.deptName = treeNode.name;
                    $scope.edit.deptId = treeNode.id;
                    $scope.edit.code = treeNode.code;
                    $scope.deleteTreeId=treeNode.id;
                    $scope.userPageChanged();
                }
            }
        };

        $deptService.queryTreeData().then(function (result) {
            //$scope.isChoose=true;
            var zNodes = angular.fromJson(result.content);
            $scope.nodesdata=zNodes;
            $('.isDelete').attr("disabled",true);
            $('.isEdit').attr("disabled",true) ;
        })

        //--------------------分页查询--------------------//
        $scope.userPageChanged = function() {

            userQueryByPage();
        };

        //list的数据查询函数
        var userQueryByPage = function() {
            $scope.selectAll = false;
            var page = null;
            if($scope.key == "" || !$scope.key) {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition':{
                        "tenantId":$global_var.user.id,
                        "type":1,
                        "orgId":$scope.orgId == '0' ? '' : $scope.orgId
                    }
                };
            }else {
                page = {
                    'pageNum': $scope.pageNum,
                    'pageSize': $scope.pageItemNum,
                    'condition': {
                        "tenantId":$global_var.user.id,
                        "type":1,
                        "orgId":$scope.orgId == '0' ? '' : $scope.orgId,
                        "userName":$scope.key
                    }
                };
            }

            $userManagementService.queryByPage(page).then(function(result) {
                console.group("【用户分页查询】'base/userRestServer/byPage'");
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
        $scope.getUserAddPage = function() {
            $scope.userCreate.loginName = "";
            $scope.userCreate.passWord = "";
            $scope.userCreate.userName = "";
            $scope.userCreate.email = "";
            $scope.userCreate.phone = "";
            $scope.userCreate.address = "";
            $scope.userCreate.roleId = "请选择用户角色";
            $scope.isUserEditPage = false;


            //创建页面中角色下拉框得到全部角色的列表
            $userManagementService.getPermissions().then(function(result) {
                console.group("【角色列表】'base/roleRestServer/getRoleList'");
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                var array = eval ("(" + result.content + ")");
                $scope.userPermission =array;
            });
        };

        $('#userCreate').on('show.bs.modal', function (e) {
            console.info("$scope.orgId="+$scope.orgId)
            if(!($scope.orgId) || $scope.orgId == '0'){
                Alert('请选择机构树非根节点');
                return e.preventDefault() // stops modal from being shown
            }
        })
        //--------------------新建用户向后台提交信息--------------------
        $scope.userCreate = function(valid) {
            if(valid) {
                var userItem = {
                    "loginName": $scope.userCreate.loginName,
                    "passWord": $scope.userCreate.passWord,
                    "userName": $scope.userCreate.userName,
                    "email": $scope.userCreate.email,
                    "roleId": $scope.userCreate.roleId,
                    "phone": $scope.userCreate.phone,
                    "address":$scope.userCreate.address,
                    "orgId": $scope.orgId,
                    "orgName":$scope.orgName
                };
                $userManagementService.create(userItem).then(function(result) {
                    console.group("【用户创建】'base/userRestServer/creating'");
                    console.group("提交数据");
                    console.dir(userItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.log(result.content);
                    if(result.status === "success") {
                        $scope.content = "用户创建成功"
                    } else {
                        $scope.content = "用户创建失败"
                    }
                    userQueryByPage();
                    $('#userCreate').modal('hide');
                    $scope.animate = true
                });
            }
        };
        //得到编辑页面
        $scope.getUserUpdatePage = function(data) {
            $scope.isUserEditPage = true;
            $scope.userEditData = data;
            $scope.userEdit.loginName = data.loginName;
            $scope.userEdit.passWord = data.passWord;
            $scope.userEdit.userName = data.userName;
            $scope.userEdit.email = data.email;
            $scope.userEdit.phone = data.phone;
            $scope.userEdit.address = data.address;
            $scope.userEdit.roleId = data.roleId;
            //得到所有角色的列表
            $userManagementService.getPermissions().then(function(result) {
                console.group("【角色列表】'base/roleRestServer/getRoleList'");
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                var array = eval ("(" + result.content + ")");
                $scope.userPermission =array;
            });
        };
        //--------------------编辑向后台提交数据--------------------//
        $scope.userEdit = function(valid) {
            if(valid) {
                var userEditItem = {
                    "id": $scope.userEditData.id,
                    "roleId": $scope.userEdit.roleId,
                    "loginName": $scope.userEdit.loginName,
                    "passWord": $scope.userEdit.passWord,
                    "userName": $scope.userEdit.userName,
                    "email": $scope.userEdit.email,
                    "phone": $scope.userEdit.phone,
                    "address": $scope.userEdit.address
                };
                $userManagementService.edit(userEditItem).then(function(result) {
                    console.group("【用户修改】'base/userRestServer/updating'");
                    console.group("提交数据");
                    console.dir(userEditItem);
                    console.groupEnd();
                    console.group("接收数据");
                    console.dir(result);
                    console.groupEnd();
                    console.groupEnd();

                    if(result.status === "success") {
                        $scope.content = "用户编辑成功"
                    } else {
                        $scope.content = "用户编辑失败"
                    }
                    userQueryByPage();
                    $('#userEdit').modal('hide');
                    $scope.animate = true
                });
            }

        };

        //--------------------批量删除--------------------//
        //批量删除确定按钮
        $scope.userMassDeletion = function() {
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
            console.log("$scope.massDeletionArr="+$scope.massDeletionArr);
        };

        $scope.userDelete = function() {
            var data = $scope.global_function.massdelete($scope.massDeletionArr);
            $userManagementService.delete(data).then(function(result) {
                console.group("【删除数据】'base/userRestServer/deleting?ids='");
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
                userQueryByPage();
                $('#massDeletion').modal('hide');
            });
        };

        //用户登录名去重
        $scope.removeLoginNameRepeat = function(loginName) {
            if(typeof($scope.isUserEditPage == false?$scope.userCreate.loginName:$scope.userEdit.loginName) != "undefined") {
                var Items = {
                    "id":$scope.isUserEditPage == false?null:$scope.userEditData.id,
                    "loginName": loginName
                };
                console.log(Items)
                $userManagementService.loginNameRepeat(Items).then(function(result) {
                    console.log(result)
                    if($scope.isUserEditPage == false){
                        if(result.content == "true"){
                            $scope.userAddForm.loginName.$setValidity('unique', false);
                        }else{
                            $scope.userAddForm.loginName.$setValidity('unique', true);
                            $scope.userCreate.isChecked = false
                        }
                    }else{

                        if(result.content == "true"){
                            $scope.userEditForm.loginName.$setValidity('unique', false);
                        }else{
                            $scope.userEditForm.loginName.$setValidity('unique', true);
                            $scope.userEdit.isChecked = false
                        }
                    }
                });
            }
        };
        //用户名去重
        $scope.removeUserNameRepeat = function(userName) {
            if(typeof($scope.isUserEditPage == false?$scope.userCreate.userName:$scope.userEdit.userName) != "undefined") {
                var Items = {
                    "id":$scope.isUserEditPage == false?null:$scope.userEditData.id,
                    "userName": userName
                };
                console.log(Items)
                $userManagementService.userNameRepeat(Items).then(function(result) {
                    console.log(result)
                    if($scope.isUserEditPage == false){
                        if(result.content == "true"){
                            $scope.userAddForm.userName.$setValidity('unique', false);
                        }else{
                            $scope.userAddForm.userName.$setValidity('unique', true);
                            $scope.userCreate.isChecked = false
                        }
                    }else{

                        if(result.content == "true"){
                            $scope.userEditForm.userName.$setValidity('unique', false);
                        }else{
                            $scope.userEditForm.userName.$setValidity('unique', true);
                            $scope.userEdit.isChecked = false
                        }
                    }
                });
            }
        };
        //*************************用户相关*************************************
        //*************************部门相关*************************************
        //得到新建页面
        $('#create').on('show.bs.modal', function (e) {
            console.log("$scope.create.parentId"+$scope.create.parentId);
            if((!$scope.create.parentId)|| ""===$scope.create.parentId){
                Alert("请先选择父级机构");
                return e.preventDefault() // stops modal from being shown
            }
        })
        $scope.getAddPage = function() {
            $scope.create.deptName = "";
            $scope.create.code = "";
            $scope.isDeptEditPage = false;
        };
        //--------------------新建向后台提交信息--------------------
        $scope.create = function(valid) {
            if(valid) {
                var deptItem = {
                    "parentId": $scope.create.parentId,
                    "name": $scope.create.deptName,
                    "code": $scope.create.code
                };

                $deptService.create(deptItem).then(function(result) {
                    console.group("【服务创建】'base/deptRestServer/creating'");
                    console.group("提交数据");
                    console.dir(deptItem);
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
                    //queryByPage();
                    $('#create').modal('hide');
                    deptItem.id = result.content;
                    var cNode = {
                        "id":result.content,
                        "pId":$scope.create.parentId,
                        "name":$scope.create.deptName,
                        "code":$scope.create.code
                    };
                    var parentZNode = $scope.treeObj.getNodeByParam("id", cNode.pId, null); //获取父节点
                    $scope.treeObj.addNodes(parentZNode,0, cNode, null);
                    $scope.treeObj.reAsyncChildNodes(parentZNode, "refresh");
                    $scope.animate = true
                });
            }
        };

        //得到编辑页面
        $scope.getUpdatePage = function() {
            $scope.isDeptEditPage = true;
            //编辑页面中根据parentId获取parentName
            if($scope.edit.parentId=="0"){
                $scope.edit.parentName="机构";
            }else{
                $deptService.getParentName($scope.edit.parentId).then(function(result) {
                    var obj = angular.fromJson(result.content);
                    $scope.edit.parentName =obj.name;
                });
            }
        };

        //--------------------编辑向后台提交数据--------------------//
        $scope.edit = function(valid) {
            if(valid) {
                var deptEditItem = {
                    "id": $scope.edit.id,
                    "name": $scope.edit.deptName,
                    "code": $scope.edit.code,
                    "parentId": $scope.edit.parentId
                };
                $deptService.edit(deptEditItem).then(function(result) {
                    console.group("【部门修改】'base/deptRestServer/updating'");
                    console.group("提交数据");
                    console.dir(deptEditItem);
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
                    //queryByPage();
                    var sNode = $scope.treeObj.getNodeByParam("id", deptEditItem.id, null); //获取节点
                    sNode.name = deptEditItem.name;
                    $scope.treeObj.updateNode(sNode);
                    $scope.edit.deptName=deptEditItem.name;
                    $scope.edit.code=deptEditItem.code;
                    $('#edit').modal('hide');
                    $scope.animate = true
                });
            }

        };

        //--------------------机构删除--------------------//
        //机构删除确定按钮
        $scope.deleteTree = function() {
            $scope.massDeletionArr = [];
            if($scope.deleteTreeId!=""){
                $scope.massDeletionArr.push($scope.deleteTreeId)
            }
            var data = $scope.global_function.massdelete($scope.massDeletionArr);
            $deptService.delete(data).then(function(result) {
                $scope.content = result.message;
                if(result.content === "true") {
                    //queryByPage();
                    //$('#massDeletion').modal('hide');
                    var nodes = $scope.treeObj.getNodes();
                    angular.forEach($scope.massDeletionArr,function (delId,idx,ary) {
                        var sNode = $scope.treeObj.getNodeByParam("id", delId, null); //获取节点
                        var selectNode = $scope.treeObj.getNodeByParam("id", sNode.parentId, null); //获取其父节点节点
                        $scope.treeObj.removeNode(sNode);
                        //选中父节点
                        $scope.treeObj.selectNode(selectNode);
                        if(selectNode.id=="0"){
                            $('.isDelete').attr("disabled",true);
                            $('.isEdit').attr("disabled",true) ;
                        }else{
                            if(selectNode.isParent){
                                $('.isDelete').attr("disabled",true);
                                $('.isEdit').attr("disabled",true) ;
                            }else{
                                $('.isDelete').attr("disabled",false);
                                $('.isEdit').attr("disabled",false);
                            }
                        }
                        $scope.create.parentName =selectNode.name;
                        $scope.create.parentId=selectNode.id;
                        $scope.orgId=selectNode.id;
                        $scope.orgName=selectNode.name;
                        $scope.edit.id =selectNode.id;
                        $scope.edit.parentId =selectNode.parentId;
                        $scope.edit.deptName = selectNode.code;
                        $scope.edit.code = selectNode.code;
                        $scope.deleteTreeId=selectNode.id;
                    });
                }
                $scope.animate = true
            });
        };

        //名称去重
        $scope.removeNameRepeat = function(deptName) {
            if(typeof($scope.isDeptEditPage == false?$scope.create.deptName:$scope.edit.deptName) != "undefined") {
                var deptNameItem = {
                    "name": deptName,
                    "id":$scope.isDeptEditPage == false ? null:$scope.edit.deptId
                };
                console.log(deptNameItem)
                $deptService.nameRepeat(deptNameItem).then(function(result) {
                    console.log(result)
                    if($scope.isDeptEditPage == false){
                        if(result.content == "true"){
                            $scope.addForm.deptName.$setValidity('unique', false);
                        }else{
                            $scope.addForm.deptName.$setValidity('unique', true);
                            $scope.create.isChecked = false
                        }
                    }else{

                        if(result.content == "true"){
                            $scope.editForm.deptName.$setValidity('unique', false);
                        }else{
                            $scope.editForm.deptName.$setValidity('unique', true);
                            $scope.edit.isChecked = false
                        }
                    }
                });
            }
        };

        //CODE去重
        $scope.removeCodeRepeat = function(code) {
            if(typeof($scope.isDeptEditPage == false?$scope.create.code:$scope.edit.code) != "undefined") {
                var deptCodeItem = {
                    "code": code,
                    "id":$scope.isDeptEditPage == false ? null:$scope.deptEditData.id
                };
                console.log(deptCodeItem)
                $deptService.codeRepeat(deptCodeItem).then(function(result) {
                    console.log(result)
                    if($scope.isDeptEditPage == false){
                        if(result.content == "true"){
                            $scope.addForm.code.$setValidity('unique', false);
                        }else{
                            $scope.addForm.code.$setValidity('unique', true);
                            $scope.create.isChecked = false
                        }
                    }else{

                        if(result.content == "true"){
                            $scope.editForm.code.$setValidity('unique', false);
                        }else{
                            $scope.editForm.code.$setValidity('unique', true);
                            $scope.edit.isChecked = false
                        }
                    }
                });
            }
        };
//*************************部门相关*************************************
        //回车事件
        $scope.mykey=function(e){
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                userQueryByPage();
            }
        };
        //页面初始化
        userQueryByPage();
    }]);
});
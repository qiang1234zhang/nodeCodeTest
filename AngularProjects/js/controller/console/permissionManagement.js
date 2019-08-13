define(['app', 'ztree', 'ztreeCheck', "js/service/console/permissionManagementService"], function (app) {
    app.register.controller('appIndex.permissionManagement', ['$scope', '$state', '$global_var', '$permissionManagementService', function ($scope, $state, $global_var, $permissionManagementService) {


        $scope.roleAuth = "";
        var treeObjAll = null;
        var setting = {
            check: {
                enable: true,
                chkDisabledInherit: true
            },
            data: {
                key: {
                    url: "#"
                },
                simpleData: {
                    enable: true
                }
            }

        };


        //获取角色列表
        var queryData = function () {
            var data = {
                "tenantId": $global_var.user.id
            };
            $permissionManagementService.queryData(data).then(function (result) {
                console.group("【角色列表】'base/roleRestServer/byCondition'");
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                /*$scope.pageTotal = result.total;*/
                if(result){
                    $scope.dataItems = result.content;
                    if(result.content.length!=0){
                        getMenuShow(result.content[0].id);
                        $scope.roleAuth = result.content[0].id;
                    }
                }
            });
        };

        //获取平台菜单
        var getPermission = function () {
            $permissionManagementService.queryMenuData().then(function (result) {
                console.group("【平台菜单】'base/menu/getMenu'");
                console.groupEnd();
                console.group("接收数据");
                console.dir(result);
                console.groupEnd();
                console.groupEnd();
                $scope.zNodes = JSON.parse(result.content);
                /*var newNode = {id:"0",name:"大数据管理平台",pId:null,open:true,iconOpen:"../../img/console/ztree1.png",iconClose:"../../img/console/ztree1.png"};
                 $scope.zNodes.push(newNode);*/

                treeObjAll = $.fn.zTree.init($("#treeAuth"), setting, $scope.zNodes);
                queryData();
            });
        }

        //获取该角色所拥有的权限
        $scope.getMenuShow = function (data) {
            getMenuShow(data);
        }
        var getMenuShow = function (id) {
        var roleSelectId = id;
        //全部设置成未选中
        treeObjAll.checkAllNodes(false);

        $permissionManagementService.queryMenusByRoleId(roleSelectId).then(function (result) {
            console.group("【获取该角色的权限菜单】'base/menu/getByRoleId'");
            console.group("提交数据");
            console.info(roleSelectId);
            console.groupEnd();
            console.groupEnd();
            var selectNodes = angular.fromJson(result.content);//对象数组-角色权限
            console.group("接收数据");
            console.dir(selectNodes);
            console.groupEnd();


            /*---第二种--转换成数组写法----*/
            var nodes = treeObjAll.transformToArray(treeObjAll.getNodes());
            var check_node = []

            for (var i = 0; i < nodes.length; i++) {
                for (var j = 0; j < selectNodes.length; j++) {
                    if (selectNodes[j].id === nodes[i].id) {
                        nodes[i].checked = true;
                    }
                }
                check_node.push(nodes[i]);

            }

            // 修改节点的选中状态
            for (var j = 0; j < check_node.length; j++) {
                var new_node = check_node[j]

                treeObjAll.updateNode(new_node);
            }

            console.group("平台数据所有节点");
            console.dir(nodes);

        });
    };

    //点击保存按钮调用的函数
    $scope.permissionChooseConfirm = function () {
        console.dir(treeObjAll);
        console.dir($scope.roleAuth);

        var nodesDate = [];
        var nodes = treeObjAll.getCheckedNodes(true);
        for (var i = 0; i < nodes.length; i++) {
            nodesDate.push(nodes[i].id);
        }

        var data = {
            roleId: $scope.roleAuth,
            menuIds: nodesDate
        };

        $permissionManagementService.granting(data).then(function (result) {
            console.group("【角色菜单授权】'base/menu/granting'");
            console.group("提交数据");
            console.dir(data);
            console.groupEnd();
            console.group("接收数据");
            console.dir(result);
            console.groupEnd();
            console.groupEnd();
            if (result.status === "success") {
                $scope.content = "角色授权成功！"
            } else {
                $scope.content = "角色授权失败！"
            }
            $scope.animate = true
        });

    };
    getPermission();


}
])
;

})
;
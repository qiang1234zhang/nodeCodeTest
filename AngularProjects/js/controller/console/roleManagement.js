define(['app', 'ztree', 'ztreeCheck', "js/service/console/roleManagementService"], function(app) {
	app.register.controller('appIndex.roleManagement', ['$scope', '$state', '$global_var', '$roleManagementService', function($scope, $state, $global_var, $roleManagementService) {
		$scope.pageItemNum = Math.floor(($(".contentMain").height()-280) / 45); //计算基于显示器能容纳的数据条数
		$scope.pageNum = 1;

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
			$roleManagementService.queryByPage(page).then(function(result) {
				console.group("【角色分页查询】'base/roleRestServer/byPage'");
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
		//--------------------分页查询--------------------//
		$scope.pageChanged = function() {

			queryByPage()
		};

		//得到新建页面
		$scope.getAddPage = function() {
			$scope.roleCreate.roleName = "";
			// $scope.roleCreate.roleCode = "";
			$scope.isRoleEditPage = false;
		};

		//--------------------新建--------------------//
		$scope.roleCreate = function() {
			$('#create').modal('hide');
				var roleItem = {
					"name":$scope.roleCreate.roleName/*,
					"code":$scope.roleCreate.roleCode*/
				};
				$roleManagementService.create(roleItem).then(function(result) {
					console.group("【角色新建】'base/roleRestServer/creating'");
					console.group("提交数据");
					console.dir(roleItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();
					if(result.status === "success") {

						$scope.content = "角色创建成功"
					} else {
						$scope.content = "角色创建失败"
					}

					queryByPage();

					$scope.animate = true;

				});
		};

		//得到编辑页面
		$scope.getUpdatePage = function(data) {
			$scope.roleEditData = data;
            $scope.roleEdit.roleName = data.name;
			$("#roleNameEdit").val(data.name);
            // $scope.roleEdit.roleCode = data.code;
			$scope.isRoleEditPage = true;
		};

		//--------------------编辑--------------------//
		$scope.roleEdit = function() {
				$('#edit').modal('hide');
				var roleEditItem = {
					"id": $scope.roleEditData.id,
                    "name" :$scope.roleEdit.roleName/*,
                    "code": $scope.roleEdit.roleCode*/
				};
				$roleManagementService.editRole(roleEditItem).then(function(result) {
					console.group("【角色编辑】'base/role/updating'");
					console.group("提交数据");
					console.dir(roleEditItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();
					if(result.content === "true") {
						$scope.content = "角色编辑成功"
					} else {
						$scope.content = "角色编辑失败"
					}
					queryByPage();
					$scope.animate = true;
				});

		};


		//------------------查看权限--------------------//
		$scope.getPermission = function(data) {

            var setting = {
                check: {
                    enable: false
                },
                data: {
					key:{
						url:"#"
					},
                    simpleData: {
                        enable: true
                    }
                }

            };

			var roleId = data.id;
			var zNodes = [];
			$roleManagementService.permission(roleId).then(function(result) {
				console.group("【根据角色查看权限】'base/menuRestServer/getByRoleId?roleId='"+roleId);
				console.group("提交数据");
				console.dir(roleId);
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();

                zNodes = JSON.parse(result.content);
				console.group("接收数据zNodes");
				console.log(zNodes);


                $(document).ready(function(){
					var newNode = {id:0,name:"大数据管理平台",pId:null,open:true,iconOpen:"../../img/console/ztree1.png",iconClose:"../../img/console/ztree1.png"};
					zNodes.push(newNode);
					$.fn.zTree.init($("#treeDemo"), setting, zNodes);
                });
			});



		}



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
			}else {
				Alert("请选择需要删除的数据！");
			}
		};

		$scope.delete = function() {
			var data = $scope.global_function.massdelete($scope.massDeletionArr);
			$roleManagementService.delete(data).then(function(result) {
				console.group("【删除数据】'base/role/deleting?id='");
				console.group("提交数据");
				console.dir(data);
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.content = result.message;
				queryByPage();
				$('#massDeletion').modal('hide');
				$scope.animate = true
			});
		};

		//角色名称去重
		$scope.checkRoleNameRepeat = function(roleName) {
			if(typeof($scope.isRoleEditPage == false?$scope.roleCreate.roleName:$scope.roleEdit.roleName) != "undefined") {
				var roleNameItem = {
					"name": roleName,
					"id":$scope.isRoleEditPage == false ? null:$scope.roleEditData.id
				};
				$roleManagementService.nameRepeat(roleNameItem).then(function(result) {
					console.group("【查询数据】'base/role/checkName'");
					console.group("提交数据");
					console.dir(roleNameItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();
					console.log(result)
					if($scope.isRoleEditPage){
						if(result.content == "true") {
							$scope.roleEditForm.roleName.$setValidity("unique",false);
						} else {
							$scope.roleEditForm.roleName.$setValidity("unique",true);
							$scope.roleEdit.isChecked = false;
						}
					}else {
						if(result.content == "true") {
							$scope.roleAddForm.roleName.$setValidity("unique",false);
						} else {
							$scope.roleAddForm.roleName.$setValidity("unique",true);
							$scope.roleCreate.isChecked = false;
						}
					}
				});
			}
		};
		//角色Code去重
		// $scope.checkRoleCodeRepeat = function(roleCode) {
		// 	if(typeof($scope.isRoleEditPage == false?$scope.roleCreate.roleCode:$scope.roleEdit.roleCode) != "undefined") {
		// 		var roleCodeItem = {
		// 			"code": roleCode,
		// 			"id":$scope.isRoleEditPage == false ? null:$scope.roleEditData.id
		// 		};
		// 		$roleManagementService.codeRepeat(roleCodeItem).then(function(result) {
		// 			console.group("【查询数据】'base/role/checkCode'");
		// 			console.group("提交数据");
		// 			console.dir(roleCodeItem);
		// 			console.groupEnd();
		// 			console.group("接收数据");
		// 			console.dir(result);
		// 			console.groupEnd();
		// 			console.groupEnd();
		// 			console.log(result);
		// 			if($scope.isRoleEditPage){
		// 				if(result.content == "true") {
		// 					$scope.roleEditForm.roleCode.$setValidity("unique",false);
		// 				} else {
		// 					$scope.roleEditForm.roleCode.$setValidity("unique",true);
		// 					$scope.roleEdit.isChecked = false;
		// 				}
		// 			}else {
		// 				if(result.content == "true") {
		// 					$scope.roleAddForm.roleCode.$setValidity("unique",false);
		// 				} else {
		// 					$scope.roleAddForm.roleCode.$setValidity("unique",true);
		// 					$scope.roleCreate.isChecked = false;
		// 				}
		// 			}
		// 		});
		// 	}
		// };
		//回车事件
		$scope.mykey=function(e){
			var keycode = window.event ? e.keyCode : e.which;//获取按键编码
			if (keycode == 13) {
				alert(keycode);
                queryByPage();
			}
		};
		queryByPage();
	}]);
});
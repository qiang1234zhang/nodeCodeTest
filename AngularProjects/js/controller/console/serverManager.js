/**
 * Created by huangfx on 2016/12/8.
 */
define(['app', "js/service/console/serverManagerService", "jqueryUI"], function(app) {
	app.register.controller('appIndex.serverManager', ['$scope', '$state', '$global_var', '$serverManagerService', function($scope, $state, $global_var, $serverManagerService) {
		$scope.pageItemNum = Math.floor(($(".contentMain").height()-280) / 40); //计算基于显示器能容纳的数据条数
		$scope.pageNum = 1

		//--------------------分页查询--------------------//
		$scope.pageChanged = function() {

			queryByPage();
		};

		//查询函数
		var queryByPage = function() {
			$scope.selectAll = false;
			var page = null;
			if($scope.key === "" || !$scope.key) {
				page = {
					'pageNum': $scope.pageNum,
					'pageSize': $scope.pageItemNum
				};
			}else {
				page = {
					'pageNum': $scope.pageNum,
					'pageSize': $scope.pageItemNum,
					'condition': {
						"name":$scope.key
					}
				};
			}

			$serverManagerService.queryByPage(page).then(function(result) {
				console.group("【服务器分页查询】'base/hostComputerRestServer/byPage'");
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
			});
		};


		//得到新建页面
		$scope.getAddPage = function() {
			$scope.create.serverName = "";
			$scope.create.osType = "请选择系统类型";
			$scope.create.ip = "";
			$scope.create.username = "";
			$scope.create.password = "";
			$scope.create.sshPort ="";
			$scope.create.remark ="";
			$scope.isEditPage = false;
		};

		//--------------------新建--------------------//
		$scope.create = function(valid) {
			if(valid) {
				var serverItem = {
					"name": $scope.create.serverName,
					"osType": $scope.create.osType,
					"ip": $scope.create.ip,
					"username": $scope.create.username,
					"password": $scope.create.password,
					"sshPort": $scope.create.sshPort,
					"remark":$scope.create.remark
				};
				$serverManagerService.create(serverItem).then(function(result) {
					console.group("【服务器新建】'base/hostComputerRestServer/creating'");
					console.group("提交数据");
					console.dir(serverItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();
					if(result.status === "success") {
						$scope.content = "服务器新建成功"
					} else {
						$scope.content = "服务器新建失败"
					}
					queryByPage();
					$("#create").modal("hide");
					$scope.animate = true
				});
			}

		};

		//得到编辑页面
		$scope.getUpdatePage = function(data) {
			$scope.serverEditData = data;
			$scope.edit.serverName = data.name;
			$scope.edit.osType = data.osType;
			$scope.edit.ip = data.ip;
			$scope.edit.username = data.username;
			$scope.edit.password = data.password;
			$scope.edit.sshPort =data.sshPort;
			$scope.edit.remark =data.remark;
			$scope.isEditPage = true;
		};

		//--------------------编辑--------------------//
		$scope.edit = function(valid) {
			if(valid) {
				if($scope.edit.osType=="Windows"){
					$scope.edit.sshPort="";
				}
				var serverEditItem = {
					"id": $scope.serverEditData.id,
					"name": $scope.edit.serverName,
					"osType": $scope.edit.osType,
					"ip": $scope.edit.ip,
					"username": $scope.edit.username,
					"password": $scope.edit.password,
					"sshPort": $scope.edit.sshPort,
					"remark":$scope.edit.remark
				};
				$serverManagerService.edit(serverEditItem).then(function(result) {
					console.group("【服务器编辑】'base/hostComputerRestServer/updating'");
					console.group("提交数据");
					console.dir(serverEditItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();

					if(result.status === "success") {
						$scope.content = "服务器编辑成功"
					} else {
						$scope.content = "服务器编辑失败"
					}
					queryByPage();
					$("#edit").modal("hide");
					$scope.animate = true
				});
			}

		};

		$scope.initComputer = function (data) {
			$serverManagerService.initComputer(data).then(function (result) {
				$scope.content = result.message;
				queryByPage();
				$scope.animate = true
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
			}else{
				Alert("请选择需要删除的数据！");
			}
		};

		$scope.delete = function() {
			var data = $scope.global_function.massdelete($scope.massDeletionArr);
			$serverManagerService.delete(data).then(function(result) {
				console.group("【服务器删除数据】'base/hostComputerRestServer/deleting?id='");
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

		//服务名去重
		$scope.checkServerRepeat = function(serverName) {
			if(typeof($scope.isEditPage == false?$scope.create.serverName:$scope.edit.serverName) != "undefined") {
				var serverNameItem = {
					"id":$scope.isEditPage == false?null:$scope.serverEditData.id,
					"name": serverName
				};
				$serverManagerService.nameRepeat(serverNameItem).then(function(result) {
					console.group("【服务器重名校验】'base/hostComputerRestServer/checkName'");
					console.group("提交数据");
					console.dir(serverNameItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					if($scope.isEditPage == false){
						if(result.content == "true"){
							$scope.addForm.serverName.$setValidity('unique', false);
						}else{
							$scope.addForm.serverName.$setValidity('unique', true);
							$scope.create.isChecked = false
						}
					}else{
						if(result.content == "true"){
							$scope.editForm.serverName.$setValidity('unique', false);
						}else{
							$scope.editForm.serverName.$setValidity('unique', true);
							$scope.edit.isChecked = false
						}
					}

				});
			}
		};

		//IP去重
		$scope.checkIpRepeat = function(ip) {
			if(typeof($scope.isEditPage == false?$scope.create.ip:$scope.edit.ip) != "undefined") {
				var serverNameItem = {
					"id":$scope.isEditPage == false?null:$scope.serverEditData.id,
					"ip": ip
				};
				$serverManagerService.ipRepeat(serverNameItem).then(function(result) {
					console.group("【IP重名校验】'base/hostComputerRestServer/checkIp'");
					console.group("提交数据");
					console.dir(serverNameItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					if($scope.isEditPage == false){
						if(result.content == "true"){
							$scope.addForm.ip.$setValidity('unique', false);
						}else{
							$scope.addForm.ip.$setValidity('unique', true);
							$scope.create.isChecked = false
						}
					}else{
						if(result.content == "true"){
							$scope.editForm.ip.$setValidity('unique', false);
						}else{
							$scope.editForm.ip.$setValidity('unique', true);
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

		queryByPage();
	}]);
});
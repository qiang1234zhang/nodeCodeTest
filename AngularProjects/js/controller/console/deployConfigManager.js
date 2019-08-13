/**
 * Created by huangfx on 2016/12/9.
 */
define(['app', "js/service/console/deployConfigService"], function(app) {
	app.register.controller('appIndex.deployConfigManager', ['$scope', '$state', '$global_var', '$deployConfigService', function($scope, $state, $global_var, $deployConfigService) {
		/*$scope.deploymentIp = "请选择服务器";*/
		$scope.pageItemNum = Math.floor(($(".contentMain").height()-280) / 40); //计算基于显示器能容纳的数据条数
		$scope.pageNum = 1


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
			$deployConfigService.queryByPage(page).then(function(result) {
				console.group("【部署配置分页查询】'base/appDeployRestServer/byPage'");
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

		//--------------------分页查询--------------------//
		$scope.pageChanged = function() {

			queryByPage();
		};



		//得到新建页面
		$scope.getAddPage = function() {
			$scope.create.deployName = "";
			$scope.create.contextPath = "";
			$scope.create.hostId = "请选择服务器";
			$scope.create.respackId = "请选择资源包";
			$scope.create.port = "";
			$scope.create.remark = ""
			$scope.isEditPage=false;
			//创建页面中服务器下拉框
			$deployConfigService.getHost().then(function(result) {
				console.group("【server列表】'base/hostComputerRestServer/byAll'");
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.hostList = result.content;
			});
			//创建页面中资源包下拉框
			$deployConfigService.getResource().then(function(result) {
				console.group("【资源包列表】'base/resourcePackRestServer/byAll'");
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.resourceList = result.content;
			});
		};

		$scope.resChange=function(resId){
			if(resId!=""){
				$deployConfigService.getResById(resId).then(function(result) {
					console.group("【根据id得到资源contextPath】'base/resourcePackRestServer/'"+resId);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();
					if($scope.isEditPage == false){
						$scope.create.contextPath = result.content.contextPath;
					}else{
						$scope.edit.contextPath = result.content.contextPath;
					}

				});
			}
		}


		//--------------------新建向后台传输数据--------------------//
		$scope.create = function(valid) {

			if(valid) {
				var serverItem = {
					"name": $scope.create.deployName,
					"contextPath":$scope.create.contextPath,
					"hostId":  	$scope.create.hostId,
					"respackId":  $scope.create.respackId,
					"port": $scope.create.port,
					"status":"0", //默认是未部署
					"remark": $scope.create.remark
				};
				$deployConfigService.createServiceDeployment(serverItem).then(function(result) {
					console.group("【服务部署新建】'base/resourcePackRestServer/creating'");
					console.group("提交数据");
					console.dir(serverItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();

					if(result.status==="success"){
						$scope.content="配置部署创建成功"
					}
					else{
						$scope.content="配置部署创建失败"
					}
					queryByPage();
					$("#create").modal("hide");
					$scope.animate=true

				});
			}

		};

		//得到编辑页面
		$scope.getUpdatePage = function(data) {
			$scope.serviceDeploymentEditData = data;
			$scope.edit.deployName = data.name;
			$scope.edit.contextPath = data.contextPath;
			$scope.edit.hostId = data.hostId;
			$scope.edit.respackId = data.respackId;
			$scope.edit.port = data.port;
			$scope.edit.remark = data.remark
			$scope.isEditPage=true;

			//编辑页面中服务器下拉框
			$deployConfigService.getHost().then(function(result) {
				console.group("【server列表】'base/hostComputerRestServer/byAll'");
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.hostList = result.content;
			});
			//编辑页面中资源包下拉框
			$deployConfigService.getResource().then(function(result) {
				console.group("【server列表】'base/resourcePackRestServer/byAll'");
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.resourceList = result.content;
			});
		};
		//--------------------编辑--------------------//
		$scope.edit = function(valid) {
			if(valid) {
				var serviceDeploymentEditItem = {
					"id": $scope.serviceDeploymentEditData.id,
					"name": $scope.edit.deployName,
					"contextPath": $scope.edit.contextPath,
					"hostId":$scope.edit.hostId,
					"respackId":$scope.edit.respackId,
					"port": $scope.edit.port,
					"remark": $scope.edit.remark
				};
				$deployConfigService.editServiceDeployment(serviceDeploymentEditItem).then(function(result) {
					console.group("【部署配置编辑】'base/resourcePackRestServer/updating'");
					console.group("提交数据");
					console.dir(serviceDeploymentEditItem);
					console.groupEnd();
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();

					if(result.status==="success"){
						$scope.content="部署配置编辑成功"
					}
					else{
						$scope.content="部署配置编辑失败"
					}
					queryByPage();
					$("#edit").modal("hide");
					$scope.animate=true
				});
			}

		};
		//名称去重
		$scope.removeNameRepeat = function(deployName) {
			if(typeof($scope.isEditPage == false?$scope.create.deployName:$scope.edit.deployName) != "undefined") {
				var deployNameItem = {
					"name": deployName,
					"id":$scope.isEditPage == false ? null:$scope.serviceDeploymentEditData.id
				};
				console.log(deployNameItem)
				$deployConfigService.nameRepeat(deployNameItem).then(function(result) {
					console.log(result)
					if($scope.isEditPage == false){
						if(result.content == "true"){
							$scope.addForm.deployName.$setValidity('unique', false);
						}else{
							$scope.addForm.deployName.$setValidity('unique', true);
							$scope.create.isChecked = false
						}
					}else{

						if(result.content == "true"){
							$scope.editForm.deployName.$setValidity('unique', false);
						}else{
							$scope.editForm.deployName.$setValidity('unique', true);
							$scope.edit.isChecked = false
						}
					}
				});
			}
		};
		//--------------------批量删除--------------------//
		//批量删除确定按钮
		$scope.massDeletion = function(){
			$scope.massDeletionArr=[];
			$(".massDeletion").each(function() {
				if($(this).prop("checked")) {
					$scope.massDeletionArr.push($(this).attr("id"))
				}
			});
			if($scope.massDeletionArr.length!==0){
				$('#massDeletion').modal('show');
			}else{
				Alert("请选择需要删除的数据！");
			}
		};

		$scope.delete = function(){
			var data = $scope.global_function.massdelete($scope.massDeletionArr);
			$deployConfigService.delete(data).then(function(result){
				console.group("【删除数据】'base/appDeployRestServer/deleting?ids='");
				console.group("提交数据");
				console.dir(data);
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.content=result.message;
				queryByPage();
				$('#massDeletion').modal('hide');
				$scope.animate=true
			});
		};

		//--------------------部署--------------------//
		$scope.deploy = function(data){
			var appId = data.id;
			$deployConfigService.deploy(appId).then(function(result){
				$scope.content=result.message;
				queryByPage();
				$scope.animate=true
			});
		};

		//--------------------启动--------------------//
		$scope.start = function(data){
			var appId = data.id;
			$deployConfigService.start(appId).then(function(result){
				if(result.status==="success"){
					$scope.content="应用正在启动中"
				}
				else{
					$scope.content="启动应用失败"
				}
				queryByPage();
				$scope.animate=true
			});
		};

		//--------------------停止--------------------//
		$scope.stop = function(data){
			var appId = data.id;
			$deployConfigService.stop(appId).then(function(result){
				if(result.content==="true"){
					$scope.content="停止应用成功"
				}
				else{
					$scope.content="停止应用失败"
				}
				queryByPage();
				$scope.animate=true
			});
		};

		//--------------------卸载--------------------//
		$scope.uninstall = function(data){
			var appId = data.id;
			$deployConfigService.uninstall(appId).then(function(result){
				if(result.status==="success"){
					$scope.content="卸载应用成功"
				}
				else{
					$scope.content="卸载应用失败"
				}
				queryByPage();
				$scope.animate=true
			});
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
/**
 * Created by huangfx on 2016/12/5.
 */
define(['app', "../../service/console/fileSourceService"], function(app) {
	app.register.controller('appIndex.fileSourceManager', ['$scope', '$state', '$global_var', '$fileSourceService', function($scope, $state, $global_var, $fileSourceService) {
		$scope.pageItemNum = Math.floor(($(".contentMain").height() - 220) / 45)>0?Math.floor(($(".contentMain").height() - 220) / 45):1; //计算基于显示器能容纳的数据条数
		$scope.pageNum = 1;
		$scope.sourceId = "";
			/*$scope.pageTotal = 200;*/ //需要从api拿


		//--------------------分页查询--------------------//
		$scope.pageChanged = function() {
			queryByPage();
		};

		//查询函数
		var queryByPage = function() {
			var page = null;
			if($scope.key === "" || !$scope.key) {
				page = {
					'pageNum': $scope.pageNum,
					'pageSize': $scope.pageItemNum,
					'condition':{
						"tenantId":$global_var.user.id
					}
				};
			}else {
				page = {
					'pageNum': $scope.pageNum,
					'pageSize': $scope.pageItemNum,
					'condition': {
						"tenantId":$global_var.user.id,
						"sourceName":$scope.key
					}
				};
			}
			$fileSourceService.queryByPage(page).then(function(result) {
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
		$scope.search = function() {
			if($scope.test === "" || !$scope.test) {
				queryByPage();
			} else {
				var data = {
					'pageNum': $scope.pageNum,
					'pageSize': $scope.pageItemNum,
					'condition': {
						"sourceName": $scope.test
					}
				};
				$fileSourceService.queryByPage(data).then(function(result) {
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
		$scope.getAddPage = function() {
			$scope.fileDir = "";
			$scope.sourceType = "请选择类型";
			$scope.sourceName = "";
			$scope.IP = "";
			$scope.PORT = "";
			$scope.esClusterName = "";
			$scope.esTableName = "";
			$scope.dbSourceId = "请选择索引库";
			$scope.isfileSourceEditPage = false;
			$scope.sourceNameRepeat = false;
			//创建页面中索引库下拉框得到该用户下的所有索引库
			$fileSourceService.getEsDatabase().then(function(result) {
				console.group("【角色列表】'base/dbSourceRestServer/getEsDb'");
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				var array = angular.fromJson(result.content);
				console.dir(array);
				$scope.esDatabase =array;
			});
		};

		//--------------------新建--------------------//
		$scope.fileSourceCreate = function(valid) {
			if(valid && !$scope.sourceNameRepeat) {
				var dataSourceItem = {
					"fileDir": $scope.fileDir,
					"sourceType": $scope.sourceType,
					"sourceName":$scope.sourceName,
					"ip":$scope.IP,
					"port":$scope.PORT,
					"dbSourceId":$scope.dbSourceId,
					"esTableName":$scope.esTableName
				};
				if($scope.isDataSourceEditPage){
					$fileSourceService.edit(dataSourceItem).then(function(result) {
						console.group("【存储服务编辑】'base/file/updating'");
						console.group("提交数据");
						console.dir(dataSourceItem);
						console.groupEnd();
						console.group("接收数据");
						console.dir(result);
						console.groupEnd();
						console.groupEnd();

						if(result.status === "success") {
							$scope.content = "数据源编辑成功"
						} else {
							$scope.content = "数据源编辑失败"
						}
						queryByPage();
						$("#create").modal("hide");
						$scope.animate = true
					});
				}else{
					$fileSourceService.create(dataSourceItem).then(function(result) {
						console.group("【数据源新建】'base/file/creating'");
						console.group("提交数据");
						console.dir(dataSourceItem);
						console.groupEnd();
						console.group("接收数据");
						console.dir(result);
						console.groupEnd();
						console.groupEnd();

						if(result.status === "success") {
							$scope.content = "数据源创建成功"
						} else {
							$scope.content = "数据源创建失败"
						}
						queryByPage();
						$("#create").modal("hide");
						$scope.animate = true
					});
				}

			}
		};

		//得到编辑页面
		$scope.getUpdatePage = function(data) {
			$scope.isfileSourceEditPage = true;
			$scope.sourceNameRepeat=false;
			$scope.sourceId = data.id;
			$scope.sourceName = data.sourceName;
			$scope.sourceType = data.sourceType;
			$scope.IP = data.ip;
			$scope.PORT = data.port;
			$scope.esTableName = data.esTableName;
			$scope.dbSourceId = data.dbSourceId;
			$scope.fileDir = data.fileDir;
			//创建页面中索引库下拉框得到该用户下的所有索引库
			$fileSourceService.getEsDatabase().then(function(result) {
				console.group("【索引列表】'base/dbEs/getEsDb'");
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				var array = angular.fromJson(result.content);
				console.dir(array);
				$scope.esDatabase =array;
			});
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
			$fileSourceService.delete(data).then(function(result) {
				console.group("【删除数据表】'base/database/deleting?id='");
				console.group("提交数据");
				console.dir(data);
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				if(result.content === "true") {
					$scope.content = "删除数据源成功"
				} else {
					$scope.content = "删除数据源失败"
				}
				queryByPage();
				$('#massDeletion').modal('hide');
				$scope.animate = true
			});
		};

		$scope.dataBaseTest = function(data) {
			var id = data.id;
			$fileSourceService.test(id).then(function(result) {
				console.group("【数据库连接测试】'base/database/getDBConn'");
				console.group("提交数据");
				console.dir(id);
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				if(result.content) {
					$scope.tipWord = "成功"
				} else {
					$scope.tipWord = "失败"
				}
			});
		};

		//数据源名称去重
		$scope.removeRepeat = function(isValid, sourceName) {
			if(typeof($scope.sourceName) != "undefined" && isValid) {
				var sourceNameItem = {
					"sourceName": sourceName
				};
				console.log(sourceNameItem)
				$fileSourceService.nameRepeat(sourceNameItem).then(function(result) {
					console.log(result)
					if(result.content == "true") {
						$scope.sourceNameRepeat = true
					} else {
						$scope.sourceNameRepeat = false
					}
				});
			}
		};

		//回车事件
		$scope.mykey=function(e){
			var keycode = window.event ? e.keyCode : e.which;//获取按键编码
			if (keycode == 13) {
				$scope.search();
			}
		};
		queryByPage();
	}]);
});
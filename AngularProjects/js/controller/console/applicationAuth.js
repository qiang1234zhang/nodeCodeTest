define(['app', 'jquery', 'ztree', 'ztreeCheck', "js/service/console/applicationAuthService"], function(app) {
	app.register.controller('appIndex.applicationAuth', ['$scope', '$state', '$global_var', '$applicationAuthService', function($scope, $state, $global_var, $applicationAuthService) {
		$scope.itemApp = [];

		//查询租户函数
		var queryTenant = function () {

			var condition = {"type": "0"}

			$applicationAuthService.queryTenant(condition).then(function (result) {
				console.group("【租户查询】'base/userRestServer/byCondition'");
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.pageTotal = result.total;
				$scope.dataItems = JSON.parse(result.content);
			});
		};


		//查询应用列表
		var queryAppData = function() {
			$applicationAuthService.queryAppData().then(function(result) {
				console.group("【应用查询】'base/appRestServer/byAll'");
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				$scope.dataAppItems = result.content;
			});
		};

		//根据用户ID,获取其拥有的应用
		$scope.queryAppByUserId = function(data){
			var userId = data.id;
			$scope.userId = userId;
			$applicationAuthService.queryAppData().then(function(dataItems) {

				var dataAppItems = dataItems.content
				$applicationAuthService.queryAppByUserId(userId).then(function(result) {
					console.group("【根据用户id查询应用】'base/appRestServer/findByUserId?userId='"+userId);
					console.group("接收数据");
					console.dir(result);
					console.groupEnd();
					console.groupEnd();
					var arr = JSON.parse(result.content);
					for(var i=0;i<dataAppItems.length;i++){
						for(var j=0;j<arr.length;j++){
							if(arr[j].id===dataAppItems[i].id){
								dataAppItems[i].checked = true;
							}
						}

					}
					$scope.dataAppItems = dataAppItems
				});
			});

		};


		//给租户授权应用
		$scope.authAppToUser = function(){
			var data = [];
			$(".itemApp").each(function() {
				if($(this).prop("checked")) {
					data.push($(this).attr("id"))
				}
			});

			var dataItem = {
				"userId": $scope.userId,
				"appIds" : data
			};

			$applicationAuthService.authAppToUser(dataItem).then(function(result) {
				console.group("【给租户授权应用】'base/appAuthRestServer/creating'");
				console.group("提交数据");
				console.dir(dataItem);
				console.groupEnd();
				console.group("接收数据");
				console.dir(result);
				console.groupEnd();
				console.groupEnd();
				if(result.status === "success") {
					$scope.content = "租户授权成功！"
				} else {
					$scope.content = "租户授权失败！"
				}
			});
			$scope.animate = true
		};

		queryTenant();
		queryAppData();
	}]);

});
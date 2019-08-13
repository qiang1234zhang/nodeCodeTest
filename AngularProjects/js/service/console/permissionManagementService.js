define(['app'],function(app){
    app.register.service('$permissionManagementService', ['$http','$q','$global_var',function($http,$q,$global_var){
    	//查询
    	this.queryData = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "base/roleRestServer/byCondition",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//编辑
		this.updatingData = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "base/menuRestServer/updating",
				data:page
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//查询当前用户所拥有的菜单数据
		this.queryMenuData = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "base/menuRestServer/getTreeMenus"
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//授权
		this.granting = function (data) {
			var deferred=$q.defer();
			$http({
				method:'POST',
				url:$global_var.base_url+"base/menuRoleRestServer/creating",
				data:data
			}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//根据角色id查询其已有菜单权限
		this.queryMenusByRoleId = function (roleId) {
			var deferred=$q.defer();
			$http({
				method:'GET',
				url:$global_var.base_url+"base/menuRestServer/getByRoleId?roleId="+roleId
			}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

    }]);
});

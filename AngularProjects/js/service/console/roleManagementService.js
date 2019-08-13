define(['app'],function(app){
    app.register.service('$roleManagementService', ['$http','$q','$global_var',function($http,$q,$global_var){
    	//查询
    	this.queryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/roleRestServer/byPage",
				data:page
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//条件查询
		this.queryByCondition = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/roleRestServer/getByPageWithName",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//新建
        this.create = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "base/roleRestServer/creating",
				data:page
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//编辑
		this.editRole = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "base/roleRestServer/updating",
				data:page
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//删除
		this.delete = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "base/roleRestServer/deleting?ids="+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//角色名称去重
		this.nameRepeat = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/roleRestServer/checkName",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//角色Code去重
		this.codeRepeat = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/roleRestServer/checkCode",
				data:data
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
				url:$global_var.base_url + "base/menuRestServer/getMenu"
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//根据角色id查询其已有菜单权限
		this.permission = function (data) {
			var deferred=$q.defer();
			$http({
				method:'GET',
				url:$global_var.base_url+"base/menuRestServer/getByRoleId?roleId="+data
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

define(['app'],function(app){
	app.register.service('$taskManagerService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(jsonStr){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "jobs/jobTaskRestServer/byPage",
				data:jsonStr
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//得到所有用户角色列表
		this.getPermissions = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "base/roleRestServer/getRoleList"
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};

		//新建
		this.create = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "jobs/jobTaskRestServer/creating",
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
		this.edit = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "jobs/jobTaskRestServer/updating" ,
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
				url: $global_var.base_url + "jobs/jobTaskRestServer/deleting?ids="+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//用户登录名校验
		this.loginNameRepeat = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/userRestServer/checkLoginName",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//用户名校验
		this.taskNameRepeat = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "jobs/jobTaskRestServer/checkName",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//得到所有任务名称
		this.getTaskNameByType = function (source,sourceType) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "jobs/jobTaskRestServer/getTaskNameByType?source="+source+"&sourceType="+sourceType
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};

		//根据名称查重
		this.getTaskNameByCategoryId = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url +"jobs/jobTaskRestServer/getTaskNameByCategoryId?id="+data.id+"&taskId="+data.taskId
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
	}]);


});

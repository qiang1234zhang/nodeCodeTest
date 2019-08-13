define(['app'],function(app){
	app.register.service('$applicationAuthService', ['$http','$q','$global_var',function($http,$q,$global_var){

		//租户查询
		this.queryTenant = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/userRestServer/byCondition",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//应用查询
		this.queryAppData = function(){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "base/appRestServer/byAll"
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		/*//获取当前用户拥有的应用
		 this.queryAppData = function(){
		 var deferred=$q.defer();
		 $http({
		 method: 'GET',
		 url:$global_var.base_url + "base/appRestServer/byAll"
		 }).success(function(result) {
		 deferred.resolve(result);
		 }).error(function(err){
		 deferred.reject(false);
		 console.log(err);
		 });
		 return deferred.promise;
		 };*/

		//根据用户ID,获取其拥有的应用
		this.queryAppByUserId = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "base/appRestServer/findByUserId?userId="+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//给租户授权应用
		this.authAppToUser = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "base/appAuthRestServer/creating",
				data:data
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

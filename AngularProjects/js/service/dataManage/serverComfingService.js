define(['app'],function(app){
    app.register.service('$serverComfingService', ['$http','$q','$global_var',function($http,$q,$global_var){
    	//分页查询数据源信息
		this.queryByPage = function(jsonStr){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/serverRestServer/byPage",
				data:jsonStr
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//新建数据源信息
		this.create = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/serverRestServer/creating",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//编辑数据源信息
		this.edit = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "db/serverRestServer/updating" ,
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//删除数据源信息
		this.delete = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/serverRestServer/deleting?ids="+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//数据源名称重名验证
		this.checkName = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/serverRestServer/checkName?id="+data.id +"&name=" + data.name,
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



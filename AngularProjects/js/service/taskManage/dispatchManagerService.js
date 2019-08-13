define(['app'],function(app){
	app.register.service('$dispatchManagerService',['$http','$q','$global_var',function($http,$q,$global_var){
		
		//查询右侧表格
		this.queryTable = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"jobs/jobScheduleRestServer/byPage",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//创建右侧表格数据
		this.createTable = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"jobs/jobScheduleRestServer/creating",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//根据名称查重
		this.queryDataByName = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"jobs/jobScheduleRestServer/byCondition",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//根据名称查重
		this.queryDataById = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "jobs/jobScheduleRestServer/"+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//编辑右侧表格数据
		this.editTable = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"jobs/jobScheduleRestServer/updating",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//删除右侧表格 数据
		this.deleteTable = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url +"jobs/jobScheduleRestServer/deleting?ids=" + data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//启动
		this.start = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "jobs/jobScheduleRestServer/start?ids="+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//停止
		this.stop = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "jobs/jobScheduleRestServer/stop?ids="+data
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
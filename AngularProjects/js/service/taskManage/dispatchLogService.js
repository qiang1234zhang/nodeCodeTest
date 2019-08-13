define(['app'],function(app){
	app.register.service('$dispatchLogService',['$http','$q','$global_var',function($http,$q,$global_var){
		
		//查询左侧ztree树
		this.queryData = function(){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url +"base/jobCategory/byAll",
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//查询左侧ztree树
		this.queryTableData = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"base/jobManageLog/getByPageWithName",
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
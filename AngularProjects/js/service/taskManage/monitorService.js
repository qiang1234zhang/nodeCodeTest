define(['app'],function(app){
	app.register.service('$monitorService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(jsonStr){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "jobs/jobLogsRestServer/byPage",
				data:jsonStr
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//查看详细
        this.getDetailById = function(jsonStr){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "jobs/jobLogsDetailRestServer/byPage",
                data:jsonStr
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
		//调度名称树
		this.queryScheduleNameAll = function(){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "jobs/jobScheduleRestServer/byAll"
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
				url: $global_var.base_url + "jobs/jobLogsDetailRestServer/deleting?ids="+data
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

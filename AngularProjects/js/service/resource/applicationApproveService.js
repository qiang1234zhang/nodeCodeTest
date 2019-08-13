define(['app'],function(app){
	app.register.service('$applicationApproveService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "resource/rsRpResourceAppRestServer/byPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
//获取表字段
		this.queryColumnInfoByTableId = function (data) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "resource/rsRpDataAuthRestServer/publishColumnList",
				data:data
			}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

        //审批
        this.approve = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsRpResourceAppRestServer/updating",
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


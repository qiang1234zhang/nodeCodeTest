define(['app'],function(app){
    app.register.service('$structureExportService', ['$http','$q','$global_var',function($http,$q,$global_var){
    	//查询
    	this.queryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: "",
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
				url: "",
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
				url: "",
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
				url: "",
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
		this.delete = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: "",
				data:page
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



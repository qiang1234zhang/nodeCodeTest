define(['app'],function(app){
	app.register.service('$fileStorageDataBrowseService', ['$http','$q','$global_var',function($http,$q,$global_var){

		//--------------------查询说有存储路径-----------------//
		this.queryStoragePathConfigs = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileSystemStorageRestServer/byAll"
			}).success(function(result) {
				console.log(result)
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//-----------------查询存储路径下的子目录-----------------//
		this.queryDirsByStoragePathId = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileStorageBrowserRestServer/findDirList?id="+data
			}).success(function(result) {
				console.log(result)
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//-----------------查询目录下的文件-----------------//
		this.queryFileInSelectedDirByPage = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/fileStorageBrowserRestServer/findByPage",
				data:data
			}).success(function(result) {
				console.log(result)
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//-----------------删除文件-----------------//
		this.deleteFile = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileStorageBrowserRestServer/deleteByIds?storageId="+data.storageId+"&fileIds="+data.fileIds
			}).success(function(result) {
				console.log(result)
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		this.fileDownload = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileStorageBrowserRestServer/download?storageId="+data.storageId+"&fileId="+data.fileId
			}).success(function(result) {
				console.log(result)
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}


	}]);
});



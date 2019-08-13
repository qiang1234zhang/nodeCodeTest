define(['app'],function(app){
	app.register.service('$fileBackupRuleService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/fileBackupRestServer/byPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//文件存储列表
		this.getStorages = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileSystemConfigRestServer/byAll"
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};

		//存储配置信息
		this.getStoragePaths = function (storageId) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileSystemStorageRestServer/findByFilesystemConfigId?filesystemConfigId="+storageId
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};

		//存储路径配置
		this.getWayName = function (storageManagerId) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileSystemStorageRestServer/findByFilesystemConfigId?filesystemConfigId="+storageManagerId
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
				url:$global_var.base_url + "db/fileBackupRestServer/creating",
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
				url:$global_var.base_url + "db/fileBackupRestServer/updating",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//名称去重
		this.nameRepeat = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				data:data,
				url: $global_var.base_url + "db/fileBackupRestServer/checkName"

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
				url: $global_var.base_url + "db/fileBackupRestServer/deleting?ids="+data
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


define(['app'],function(app){
	app.register.service('$fileImportService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/fileImportRestServer/byPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//查询日志
		this.queryByPageLog = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/fileImportLogRestServer/byPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//文件存储配置信息
		this.getDataStorage = function () {
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
				url:$global_var.base_url + "db/fileImportRestServer/creating",
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
				url:$global_var.base_url + "db/fileImportRestServer/updating",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//导入
		this.fileImport = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "db/fileImportRestServer/importData",
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
				method: 'GET',
				url: $global_var.base_url + "db/fileImportRestServer/checkName?id="+data.id+"&name="+data.name
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//文件导入路径校验
		this.pathWayCheck = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileImportRestServer/checkdirLast?path="+data.path,
				data:data
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
				url: $global_var.base_url + "db/fileImportRestServer/deleting?ids="+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//删除日志
		this.deleteLog = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/fileImportLogRestServer/deleting?ids="+data
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


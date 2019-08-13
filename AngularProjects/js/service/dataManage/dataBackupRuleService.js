define(['app'],function(app){
	app.register.service('$dataBackupRuleService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/dataBackupRuleRestServer/byPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//文件类型
		this.getFileType = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/dictRestServer/getDict?dictCode=file_type_dict"
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};

		//存储配置信息
		this.getDataStorage = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/databaseManagerRestServer/byAll"
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};

		//获取左侧列表
		this.getLeftList = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/dataBackupRuleRestServer/findMetaDataByStorageId?storageManagerId="+data
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};
		//获取右侧列表
		this.getRightList = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/dataBackupRuleRestServer/getSelectMD?ruleId="+data
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
				url:$global_var.base_url + "db/dataBackupRuleRestServer/creating",
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
				url:$global_var.base_url + "db/dataBackupRuleRestServer/updating",
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
				url: $global_var.base_url + "db/dataBackupRuleRestServer/checkName"

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
				url: $global_var.base_url + "db/dataBackupRuleRestServer/deleting?ids="+data
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


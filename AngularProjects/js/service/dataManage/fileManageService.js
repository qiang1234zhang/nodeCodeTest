define(['app'],function(app){
    app.register.service('$fileManageService', ['$http','$q','$global_var',function($http,$q,$global_var){
    	//查询根目录
    	this.queryFileByPage = function(){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "base/fileManager/byAll"
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//新建根目录--查询数据源（青云）
    	this.getDataBase = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/dataBase/byCondition",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//新建根目录
    	this.createFile = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/fileManager/createFolder",
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
		//查询全部文件夹
    	this.queryFolder = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/fileManager/listDir",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//根据路径查询文件
    	this.queryFile = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/fileManager/listFile",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//文件下载
		this.downloadFile = function(dbId,path){
			var deferred=$q.defer();
			$http({
				method: 'GET', 
				url: "",
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//文件上传
		this.uploadFile = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//文件上传
		this.deleteFile = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/fileManager/remove",
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



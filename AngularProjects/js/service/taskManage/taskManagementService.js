define(['app'],function(app){
	
	app.register.service('$taskManagementService',['$http','$q','$global_var',function($http,$q,$global_var){
		
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
		
		//根据任务类型名称查重
		this.queryDataBytaskType = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"base/jobCategory/byCondition",
				data:data,
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//根据ztree节点查询右侧表格
		this.queryTable = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"base/jobInfo/getByPageWithName",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//创建二级子节点
		this.createChild = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"base/jobCategory/creating",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		
		//编辑二级菜单
		this.edit = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"base/jobCategory/updating",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
			
		}
		//删除二级子菜单
		this.delete = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url +"base/jobCategory/delete?id=" + data,
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		
		//创建右侧表格数据
		this.createTable = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"base/jobInfo/creating",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//根据创建任务名称查重
		this.queryDataByName = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url +"base/jobInfo/byCondition",
				data:data
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
				url: $global_var.base_url +"base/jobInfo/updating",
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
				url: $global_var.base_url +"base/jobInfo/delete?id=" + data,
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
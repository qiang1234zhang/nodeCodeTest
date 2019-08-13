define(['app'],function(app){
	app.register.service('$shareApproveService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "resource/proposeShareRestServer/byPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//获取机构树数据
		this.queryOrgData = function (data) {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "resource/catalogRestServer/tree?type="+data.type+"&containLeaf="+data.containLeaf+"&parentId="+data.parentId+""}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//跳转到新增页面
		this.getAddPage = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "resource/proposeShareRestServer/"+data.id
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};
		//删除数据
		this.deleteByIds = function (data) {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "resource/proposeShareRestServer/deleting?ids=" + data
			}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//审批--新增
		this.create = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "resource/proposeShareRestServer/updating",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//跳转到编辑页面
		this.getEditPage = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "resource/proposeShareRestServer/"+data.id
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(){
				deferred.reject();
			});
			return deferred.promise;
		};
		//审批--修改
		this.edit = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "resource/proposeShareRestServer/audit",
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


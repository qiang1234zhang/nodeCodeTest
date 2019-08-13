define(['app'],function(app){
	app.register.service('$etlBaseService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.queryByPage = function(page){

			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "etl/workflowManagerRestServer/byPage",
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
				url:"",
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
				url: $global_var.base_url + "etl/workflowManagerRestServer/creating",
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
				url: $global_var.base_url+"etl/workflowManagerRestServer/updating",
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
		this.delete = function(data){
			var deferred=$q.defer();
			$http({
				method: 'get',
				url:$global_var.base_url + "etl/workflowManagerRestServer/deleting?ids="+data,

			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//部署
		this.deploy = function(data){
			var deferred=$q.defer();

			$http({
				method: 'get',
				url:$global_var.base_url + "etl/workflowManagerRestServer/deploy?ids="+data,

			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//取消部署
		this.undeploy = function(data){
			var deferred=$q.defer();

			$http({
				method: 'get',
				url:$global_var.base_url + "etl/workflowManagerRestServer/unDeploy?ids="+data,

			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//服务发布
		this.createService = function(data){
			var deferred=$q.defer();

			$http({
				method: 'get',
				url:$global_var.base_url + "etl/serverSummaryRestServer/saveServer?ids="+data,

			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		this.checkName = function (page) {
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "etl/workflowManagerRestServer/checkName",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//获取树数据
		this.queryTreeData = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "etl/workflowCategoryRestServer/byAll",
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//新增流程分类
		this.createFlowClass = function (page) {
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "etl/workflowCategoryRestServer/creating",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//获取流程分类
		this.getFlowClass = function (id) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "etl/workflowManagerRestServer/byId?id="+id
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//修改流程分类
		this.updateFlowClass = function (page) {
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "etl/workflowCategoryRestServer/updating",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//删除流程分类
		this.deleteFlowClass = function (ids) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "etl/workflowCategoryRestServer/deleting?ids="+ids,
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//流程分类名称校验
		this.checkFlowClassName = function (page) {
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "etl/workflowCategoryRestServer/checkName",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//删除流程分类
		this.queryFlowClass = function (ids) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "etl/workflowCategoryRestServer/"+ids,
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//获取机构
		this.queryDept = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "etl/deptRestServer/byAll",
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//获取指标项
		this.queryItems = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'post',
				url:$global_var.base_url + "etl/itemRestServer/byPage",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//获取集群组
		this.queryClusterGroup = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url:$global_var.base_url + "etl/clusterGroupRestServer/byAll",
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}



	}]);
});



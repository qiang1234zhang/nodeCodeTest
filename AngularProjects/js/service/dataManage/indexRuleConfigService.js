define(['app'],function(app){
	app.register.service('$indexRuleConfigService', ['$http','$q','$global_var',function($http, $q, $global_var){
		//查询
		this.queryByPage = function(jsonStr){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/indexRuleRestServer/byPage",
				data:jsonStr
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//添加
		this.create = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/indexRuleRestServer/creating",
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
				url:$global_var.base_url + "db/indexRuleRestServer/updating" ,
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//查询索引库
		this.getEsDatabase = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/indexManagerRestServer/byAll"
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		this.getEsDoctype = function (id) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/indexManagerRestServer/getDoctypes?id="+id
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		this.import = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/indexDoctypeRestServer/importAndSave",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//查询表管理下的表分类
		this.getMetaDataVersionId = function () {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/byAll"
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//查询表管理下分类名称下的表
		this.findMetadata = function (id) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/indexRuleRestServer/findMetadata?metaDataTypeId=" +id
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		this.addGetPage = function (id) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/indexRuleRestServer/findColumn?metadataId="+id
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}

		//索引规则导入
		this.importFormDB = function (data) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/indexRuleRestServer/importFromDB?id="+data.id + "&clear=" +data.clear
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
		//删除
		this.delete = function(data){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "db/indexRuleRestServer/deleting?ids="+data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//用户名去重
		this.nameRepeat = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "db/indexRuleRestServer/checkName?name="+ name,
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

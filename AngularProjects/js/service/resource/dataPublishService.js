define(['app'],function(app){
	app.register.service('$dataPublishService', ['$http','$q','$global_var',function($http,$q,$global_var){
		//查询
		this.themeQueryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "resource/rsRpPublishDataRestServer/themePublishDataByPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//查询
		this.primaryQueryByPage = function(page){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "resource/rsRpPublishDataRestServer/primaryPublishDataByPage",
				data:page
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
		//新建
		this.create = function( data ){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "resource/rsRpPublishDataRestServer/creating",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

		//编辑
		this.edit = function(data){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url:$global_var.base_url + "resource/rsRpPublishDataRestServer/updating",
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
				url: $global_var.base_url + "resource/rsRpPublishDataRestServer/deletePublish",
				data:data
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};

        this.deleteColumn = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsRpDataAuthRestServer/deleting?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

		//获取表属性
		this.queryTableColumns = function (data) {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "resource/rsDgItemRestServer/getTableColumns/"+data
			}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
        //查询树节点数据
        this.getTopicTree = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDcCatalogRestServer/treeNodesWithTable"
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //查询树节点数据
        this.getItemTree = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgCatalogRestServer/tree?containLeaf=true"
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        // 显示用户树
        this.getOrgTree = function(type,itemId) {
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "resource/rsRpPublishDataRestServer/getAuthOrgList?type="+type+"&itemId="+itemId
			}).success(function(result) {
				deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
        };
		// 显示用户树
		this.getOrg = function() {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "resource/rsDgCatalogRestServer/tree?containLeaf=false"
			}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		};
        //获取主题部门树数据
        this.getThemePublishiTree = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDcCatalogRestServer/treeNodes"
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //获取包含表的部门树数据
        this.getColumnsById = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpDataAuthRestServer/publishColumnList",
				data:data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //检查指定表是否已经发布给指定机构
        this.checkHasPublish = function (data) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "resource/rsRpPublishDataRestServer/checkHasPublish",
				data:data
			}).success(function (result) {
				deferred.resolve(result);
			}).error(function (err) {
				deferred.reject(false);
				console.log(err);
			});
			return deferred.promise;
		}
	}]);
});


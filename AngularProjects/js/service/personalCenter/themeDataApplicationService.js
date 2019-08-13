define(['dataapp'], function (app) {
    app.register.service('$themeDataApplicationService', ['$http', '$q', '$global_var', function ($http, $q, $global_var) {
        //保存申请
        this.createData = function (data) {
            var deferred = $q.defer();
            var url = "";
            if(data.id){
                url = "updating";
            }else{
                url = "creating"
            }
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpResourceAppRestServer/"+url,
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //编辑申请
        this.editData = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpResourceAppRestServer/updating",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //分页查询数据
        this.queryDataByPage = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpResourceAppRestServer/byPage",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //删除数据
        this.deleteByIds = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsRpResourceAppRestServer/deleting?ids=" + data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }



        //查询树节点数据 原始数据
        this.getTree = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgCatalogRestServer/treeWithFavoriteTable"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //查询树节点数据  主题数据
        this.getTopicTree = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDcCatalogRestServer/treeNodesWithFavoriteTable"
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //获取表字段
        this.queryColumnInfoByTableId = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpResourceAppRestServer/columnList",
                data:data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //获取已申请字段
        this.queryColumnInfoByResId = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpResourceAppDetailRestServer/byCondition",
                data: data
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


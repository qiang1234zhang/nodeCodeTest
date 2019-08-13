define(['app'],function(app){
    app.register.service('$indexDataBrowseService', ['$http','$q','$global_var',function($http,$q,$global_var){

        <!--查询库-->
        this.queryTableCatalogs = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/indexManagerRestServer/byAll"
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--根据库Id查询其下面的所有表-->
        this.queryTablesByCatalogId = function (id) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/indexBrowseDataRestServer/getIndexTree?id="+id
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        <!--查询表结构-->
        this.queryTableStructure = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/indexBrowseDataRestServer/getMapping",
                data:data
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--查询表内容-->
        this.queryTableContent = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/indexBrowseDataRestServer/getPage",
                data:data
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
    }]);
});



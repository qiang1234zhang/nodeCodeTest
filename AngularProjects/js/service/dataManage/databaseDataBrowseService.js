define(['app'],function(app){
    app.register.service('$databaseDataBrowseService', ['$http','$q','$global_var',function($http,$q,$global_var){

        <!--查询表分类-->
        this.queryTableCatalogs = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/byAll"
            }).success(function(result) {

                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);

            });
            return deferred.promise;
        }

        <!--根据表分类Id查询其下面的所有表-->
        this.queryTablesByCatalogId = function (id) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/getByTypeId?metaDataTypeId="+id
            }).success(function(result) {

                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);

            });
            return deferred.promise;
        }
        <!--查询表结构-->
        this.queryTableStructure = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/dataExportRestServer/findTableStructure?metadataId="+data
            }).success(function(result) {

                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);

            });
            return deferred.promise;
        }

        <!--查询表内容-->
        this.queryTableContent = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/dataExportRestServer/showDataList",
                data:data
            }).success(function(result) {

                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);

            });
            return deferred.promise;
        }
    }]);
});


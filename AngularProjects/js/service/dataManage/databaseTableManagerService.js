define(['app'], function (app) {
    app.register.service('$databaseTableManagerService', ['$http', '$q', '$global_var', function ($http, $q, $global_var) {
        // 查询所有数据库类型
        this.getAllDsTypes = function() {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseManagerRestServer/getAllDsTypes"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        //--------------------表分类-----------------//
        this.queryTableCatalogs = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/byAll"
            }).success(function (result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //--------------------表分类名称校验-----------------//
        this.catalogNameCheck = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/checkName?name=" + data.name + "&parentId=" + data.parentId
            }).success(function (result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //--------------------创建表分类-----------------//
        this.createCatalog = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/creating",
                data: data
            }).success(function (result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //--------------------更新表分类-----------------//
        this.updateCatalog = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/updating",
                data: data
            }).success(function (result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //验证表分类是否可以删除
        this.checkDelStatus = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/checkDelStatus/" + data,
            }).success(function (result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }


        //--------------------删除表分类-----------------//
        this.deleteCatalog = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataTypeRestServer/deleting?ids=" + data,
            }).success(function (result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //-----------------创建表-----------------//
        this.createTable = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/creating",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //-----------------表名校验-----------------//
        this.checkTableName = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/checkName?name=" + data.name + "&metaDataTypeId=" + data.metaDataTypeId
            }).success(function (result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //-----------------表信息分页查询-----------------//
        this.queryDataTableByPage = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/byPage",
                data: data
            }).success(function (result) {
                console.log(result);
                deferred.resolve(result);
            }).error(function (err) {
                console.log(err);
                deferred.reject(false);
            });
            return deferred.promise;
        }
        //-----------------更新表-----------------//
        this.updateTable = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/updating",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //-----------------查询数据库表字段类型-----------------//
        this.getDataType = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataVersionRestServer/getDataType?metaDataId=" + data,
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //-----------------删除表-----------------//
        this.deleteTable = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/deleting?ids=" + data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //-----------------检查表是否被使用-----------------//
        this.checkTableIsUse = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/checkIsUse?ids=" + data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //-----------------根据数据类型code查询数据源-----------------//
        this.queryDatasourceByCode = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseManagerRestServer/byCondition",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.queryInDataSourceHadNotImportTables = function (id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseManagerRestServer/getTables?id=" + id
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.importTable = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataVersionRestServer/importAndSave",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.createProperty = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataVersionRestServer/creating",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.importProperty = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataVersionRestServer/upload",
                data: data,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.initNewestRdbmsInfo = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataVersionRestServer/initNewestRdbmsInfo",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.upsertPropert = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataVersionRestServer/upsert",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.syncTable = function(id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/updateTableField/"+id
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



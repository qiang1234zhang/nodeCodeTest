define(['app'],function(app){
    app.register.service('$databaseConfigService', ['$http','$q','$global_var',function($http,$q,$global_var){

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


        <!--分页查询-->
        this.queryDataByPage = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseManagerRestServer/byPage",
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

        <!--创建-->
        this.create = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseManagerRestServer/creating",
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

        <!--更新-->
        this.update = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/databaseManagerRestServer/updating",
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

        <!--删除-->
        this.delete = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseManagerRestServer/deleting?ids="+data,
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--名称校验-->
        this.checkName = function (data) {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/databaseManagerRestServer/checkName?name="+data.name+"&id="+data.id,
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--查询数据库类型字典-->
        this.queryDatabaseType = function (data) {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/dictRestServer/getDict?dictCode=database_dict",
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--查询数据源-->
        this.queryDatabase = function (data) {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/serverRestServer/byAll"
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--数据源连接测试-->
        this.testConnection = function (data) {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/databaseManagerRestServer/checkDataSourceAvailable?storageId="+data
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



define(['app'],function(app){
    app.register.service('$fileStorageConfigService', ['$http','$q','$global_var',function($http,$q,$global_var){


        <!--分页查询-->
        this.queryDataByPage = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/fileSystemConfigRestServer/byPage",
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
                url: $global_var.base_url + "db/fileSystemConfigRestServer/creating",
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
                url: $global_var.base_url + "db/fileSystemConfigRestServer/updating",
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
                url: $global_var.base_url + "db/fileSystemConfigRestServer/deleting?ids="+data,
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
                url:$global_var.base_url+"db/fileSystemConfigRestServer/checkName?name="+data.name+"&id="+data.id,
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--查询类型字典-->
        this.queryFileType = function () {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/dictRestServer/getDict?dictCode=storage_db_dict",
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--查询服务器-->
        this.queryFileServer = function () {
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

        <!--连接测试-->
        this.testConnection = function (data) {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/fileSystemConfigRestServer/checkConn?id="+data
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



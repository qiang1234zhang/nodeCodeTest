define(['app'],function(app){
    app.register.service('$fileStoragePathConfigService', ['$http','$q','$global_var',function($http,$q,$global_var){


        <!--分页查询-->
        this.queryDataByPage = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/fileSystemStorageRestServer/byPage",
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
                url: $global_var.base_url + "db/fileSystemStorageRestServer/creating",
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
                url: $global_var.base_url + "db/fileSystemStorageRestServer/updating",
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
                url: $global_var.base_url + "db/fileSystemStorageRestServer/deleting?ids="+data,
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
                url:$global_var.base_url+"db/fileSystemStorageRestServer/checkName?id="+data.id+"&name="+data.name,
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--查询指定文件系统下的路径-->
        this.queryByPathAndSystemConfigId = function (data) {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/fileSystemStorageRestServer/findDirs?id="+data.id+"&path="+data.path,
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        <!--查询存储配置-->
        this.queryFileStorageConfig = function () {
            var deferred=$q.defer();
            $http({
                method:'GET',
                url:$global_var.base_url+"db/fileSystemConfigRestServer/byAll"
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



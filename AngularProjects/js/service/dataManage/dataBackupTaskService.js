define(['app'],function(app){
    app.register.service('$dataBackupTaskService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询
        this.queryByPage = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/dataBackupTaskRestServer/byPage",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //备份规则名称
        this.getDataStorage = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/dataBackupTaskRestServer/findNoneBindTask?id="+data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        //新建
        this.create = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "db/dataBackupTaskRestServer/creating",
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
                url:$global_var.base_url + "db/dataBackupTaskRestServer/updating",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //名称去重
        this.nameRepeat = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/dataBackupTaskRestServer/checkName",
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
                method: 'GET',
                url: $global_var.base_url + "db/dataBackupTaskRestServer/deleting?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //停用备份规则
        this.stop = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/dataBackupTaskRestServer/stop?ids="+data.id
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        //启用备份规则
        this.start = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/dataBackupTaskRestServer/start?ids="+data.id
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

    }]);
});


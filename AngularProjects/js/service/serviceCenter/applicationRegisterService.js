define(['dataapp'],function(app){
    app.register.service('$applicationRegisterService', ['$http','$q','$global_var',function($http, $q, $global_var){
        //查询树节点数据
        this.getTree = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "base/deptRestServer/getLocalUserOrgList"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //查询自己部门树节点数据
        this.getTreeById = function (orgId) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "base/deptRestServer/getTreeById?orgId="+orgId
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.getOrgName = function (id) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "base/deptRestServer/"+id
            }).success(function(result) {
                deferred.resolve(result);
                console.dir(result);
            }).error(function(err){;
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //查询
        this.queryByPage = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsAppInfoRestServer/byPage",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //删除
        this.delete = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsAppInfoRestServer/deleting?ids="+data,
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        };
        //跳转到新增页面
        this.getAddPage = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsAppInfoRestServer/"+data.id
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        //新增
        this.create = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsAppInfoRestServer/creating",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //修改
        this.update = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsAppInfoRestServer/updating",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //获取应用id
        this.getClinetId = function(page){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url:$global_var.base_url + "resource/rsAppInfoRestServer/getClientId",
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //获取应用id
        this.checkClientId = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url:$global_var.base_url + "resource/rsAppInfoRestServer/"+data,
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
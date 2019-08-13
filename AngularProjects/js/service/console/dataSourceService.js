/**
 * Created by huangfx on 2016/12/5.
 */
define(['app'],function(app){
    app.register.service('$dataSourceService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询
        this.queryByPage = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "base/dbSourceRestServer/byPage",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //条件查询
        this.queryByCondition = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "base/dbSourceRestServer/byPage",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //新建
        this.create = function(date){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "base/dbSourceRestServer/creating",
                data:date
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
                url:$global_var.base_url + "base/dbSourceRestServer/updating",
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
        this.delete= function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "base/dbSourceRestServer/deleting?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //测试数据库连接
        this.test = function(id){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url:$global_var.base_url + "base/dbSourceRestServer/testConnection?id="+id
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //数据源名称去重
        this.nameRepeat = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "base/dbSourceRestServer/checkName",
                data:data
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


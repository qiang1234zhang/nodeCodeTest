define(['app'],function(app){
    app.register.service('$taskCategoryService', ['$http','$q','$global_var',function($http, $q, $global_var){
        //查询
        this.queryTaskCategoryByAll = function(){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "jobs/jobCategoryRestServer/byAll"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //新建
        this.create = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "jobs/jobCategoryRestServer/creating",
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
                url:$global_var.base_url + "jobs/jobCategoryRestServer/updating" ,
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
        this.delete = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "jobs/jobCategoryRestServer/deleting?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //根据一条数据的id查询详细
        this.getObjById = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "jobs/jobCategoryRestServer/"+data,
                data:data
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
                url: $global_var.base_url + "jobs/jobCategoryRestServer/checkName",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };


        //code去重
        this.codeRepeat = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "jobs/jobCategoryRestServer/checkName",
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

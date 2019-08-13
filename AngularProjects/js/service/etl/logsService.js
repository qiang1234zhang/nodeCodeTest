define(['app'],function(app){
    app.register.service('$etlLogsService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询
        this.queryByPage = function(jsonStr){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "etl/workflowRunLogRestServer/byPage",
                data:jsonStr
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //获取树数据
        this.queryTreeData = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url:$global_var.base_url + "etl/workflowRunLogRestServer/getCategoryTree",
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //删除流程日志
        this.delete = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'get',
                url:$global_var.base_url + "etl/workflowRunLogRestServer/deleting?ids="+jsonStr
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //根据workflowRunCode查询流程插件
        this.queryPluginLogs = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'post',
                url:$global_var.base_url + "etl/pluginRunLogRestServer/byPage",
                data:jsonStr
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //根据workflowRunCode查询日志详情
        this.queryLogDetail = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'post',
                url:$global_var.base_url + "etl/workflowRunLogDetailRestServer/byCondition",
                data:jsonStr
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }



    }]);
});

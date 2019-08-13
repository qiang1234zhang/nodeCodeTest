define(['app'],function(app){
    app.register.service('$etlClusterService', ['$http','$q','$global_var',function($http, $q, $global_var){
        //查询
        this.queryByPage = function(jsonStr){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "etl/clusterNodeRestServer/byPage",
                data:jsonStr
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
                url: $global_var.base_url + "etl/clusterNodeRestServer/creating",
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
                url:$global_var.base_url + "etl/clusterNodeRestServer/updating" ,
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
                url: $global_var.base_url + "etl/clusterNodeRestServer/deleting?ids="+data
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
                url: $global_var.base_url + "etl/clusterNodeRestServer/"+data,
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
                url: $global_var.base_url + "etl/clusterNodeRestServer/checkName",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //启动
        this.start = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                    url: $global_var.base_url + "etl/clusterNodeRestServer/start?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //停止
        this.stop = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                    url: $global_var.base_url + "etl/clusterNodeRestServer/stop?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //查看详细
        this.getDetail = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "etl/clusterNodeRestServer/getDetail?id="+data
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

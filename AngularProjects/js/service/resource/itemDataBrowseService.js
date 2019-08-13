define(['app'],function(app){
    app.register.service('$itemDataBrowseService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询树节点数据
        this.getTree = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgCatalogRestServer/tree?containLeaf=true"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        // 查询接收数据
        this.queryDataByPage = function(page) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getDataByPage",
                headers: {
                    "Content-Type":'application/json'
                },
                data: page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        // 查询接收数据表字段
        this.queryTableColumns = function(ioId) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getDataByPageColumns/"+ioId
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }
    }]);
});



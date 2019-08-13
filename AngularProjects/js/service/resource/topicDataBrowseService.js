define(['app'], function (app) {
    app.register.service('$topicDataBrowseService', ['$http', '$q', '$global_var', function ($http, $q, $global_var) {

        //查询树节点数据
        this.getTree = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDcCatalogRestServer/treeNodesWithTable"
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //更新树节点
        this.editTopic = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: $global_var.base_url + "resource/catalogRestServer",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //删除树节点
        this.deleteTopic = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: $global_var.base_url + "resource/catalogRestServer/" + data,
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //获取表属性
        this.queryTableColumns = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getTableColumns/"+data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        <!--查询表内容-->
        this.queryTableContent = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/dataExportRestServer/showDataList",
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
    }]);
});


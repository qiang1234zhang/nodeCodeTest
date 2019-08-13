define(['dataapp'], function (app) {
    app.register.service('$dataMartThemeDataService', ['$http', '$q', '$global_var', function ($http, $q, $global_var) {
        //分页查询数据
        this.queryDataByPage = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpPublishDataRestServer/themePublishDataByPage",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //查询发布记录
        this.queryPublishiData = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsRpDataAuthRestServer/byPage",
                data:data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //添加收藏夹
        this.addToFavorite = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsUserFavoriteDataRestServer/creating",
                data:data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //获取主题部门树数据
        this.getThemePublishiTree = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDcCatalogRestServer/treeNodesWithPublishTable"
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
    }]);
});


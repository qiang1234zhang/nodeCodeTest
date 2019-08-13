define(['app'],function(app){
    app.register.service('$etlDataSourceFileService', ['$http','$q','$global_var',function($http, $q, $global_var){

        //查询
        this.queryByPage = function(jsonStr){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "etl/fileSourceRestServer/byPage",
                data:jsonStr
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //查询
        this.queryByPage = function(jsonStr){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "etl/fileSourceRestServer/byPage",
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
                url: $global_var.base_url + "etl/fileSourceRestServer/creating",
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
                url:$global_var.base_url + "etl/fileSourceRestServer/updating" ,
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
                url: $global_var.base_url + "etl/fileSourceRestServer/deleting?ids="+data
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
                url: $global_var.base_url + "etl/fileSourceRestServer/"+data,
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
                url: $global_var.base_url + "etl/fileSourceRestServer/checkName",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //链接测试
        this.testConn = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "etl/fileSystem/checkConn?id="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //文件数据源目录查询
        this.listFileAndDirTree = function(id,pId){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "etl/fileSystem/listFileAndDirTree?id="+id+"&pId="+pId
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
            };
            //文件数据源目录查询
            this.queryFileCatalogByPage = function(data){
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: $global_var.base_url + "etl/fileCatalogRestServer/byPage",
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
        this.createFileCatalog = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "etl/fileCatalogRestServer/saveBatchPaths",
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
        this.deleteFileCatalog = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "etl/fileCatalogRestServer/deleting?ids="+data
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

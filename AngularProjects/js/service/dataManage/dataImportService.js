define(['app'],function(app){
    app.register.service('$dataImportService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询
        this.queryByPage = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "db/dataImportRestServer/byPage",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //数据结构
        this.getDataStructure = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/dictRestServer/getDict?dictCode=data_struct_dict"
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        //文件类型
        this.getFileType = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/dictRestServer/getDict?dictCode=file_type_dict"
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        //数据存储
        this.getDataStorage = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseManagerRestServer/byAll"
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        //数据存储的表名
        this.getTableName = function (storageManagerId) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/databaseMetaDataRestServer/findByStorageId?storageManagerId="+storageManagerId
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        //导入数据
        this.dataImportTest = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/dataImportRestServer/importData?id="+data.id+"&clean="+data.clean
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
                url:$global_var.base_url + "db/dataImportRestServer/creating",
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
                url:$global_var.base_url + "db/dataImportRestServer/updating",
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
                url: $global_var.base_url + "db/dataImportRestServer/checkName",
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
                url: $global_var.base_url + "db/dataImportRestServer/deleting?ids="+data
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


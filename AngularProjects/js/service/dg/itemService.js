define(['app'],function(app){
    app.register.service('$itemService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询
        this.queryByPage = function(jsonStr){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/itemRestServer/byPage",
                data:jsonStr
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };


        //得到所有数据源类型
        this.getTypeList = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "dg/dgContants/getTypeList"
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        //得到所有数据源类型
        this.getDsTypeList = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "dg/dgContants/getDsTypeList?typeId="+data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        //得到所有数据源名称
        this.getDbSourceList = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/dbSourceRestServer/byCondition",
                data:jsonStr
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        //得到所有数据源名称
        this.getFileSourceList = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/fileSourceRestServer/byCondition",
                data:jsonStr
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        //得到所有数据源名称
        this.getMqSourceList = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/mqSourceRestServer/byCondition",
                data:jsonStr
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };


        this.getTableList = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/tableRestServer/byCondition",
                data:jsonStr
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        this.getFileCatalogList = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/fileCatalogRestServer/byCondition",
                data:jsonStr
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        this.getMqQueueList = function (jsonStr) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/mqQueueRestServer/byCondition",
                data:jsonStr
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
                url: $global_var.base_url + "dg/itemRestServer/creating",
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
                url:$global_var.base_url + "dg/itemRestServer/updating" ,
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
                url: $global_var.base_url + "dg/itemRestServer/deleting?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };


        //指标项名称校验
        this.itemNameRepeat = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/itemRestServer/checkName",
                data:data
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
                url:$global_var.base_url + "dg/deptRestServer/getDeptTree",
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //根据parentId(另外一条数据的id)查询parentName
        this.getParentName = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "dg/deptRestServer/"+data,
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
                url: $global_var.base_url + "dg/deptRestServer/checkName",
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
                url: $global_var.base_url + "dg/deptRestServer/checkName",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };


        //删除部门
        this.deleteDept = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "dg/deptRestServer/deleting?ids="+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //编辑
        this.editDept = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "dg/deptRestServer/updating" ,
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };


        //新建部门
        this.createDept = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "dg/deptRestServer/creating",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //新建部门
        this.queryDeptByTreeId = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "base/deptRestServer/"+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //新建部门
        this.queryLocalDeptByTreeId = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "dg/deptRestServer/"+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //新建部门
        this.getOrgName = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "dg/deptRestServer/"+data
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

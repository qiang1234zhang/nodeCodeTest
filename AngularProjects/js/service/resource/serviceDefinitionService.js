define(['app'],function(app){
    app.register.service('$serviceDefinitionService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询树节点数据
        this.getTree = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsServiceCatalogRestServer/tree"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //服务分类--新增
        this.createCatalog = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsServiceCatalogRestServer/creating",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //服务分类--查询
        this.searchCatalog = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url:$global_var.base_url + "resource/rsServiceCatalogRestServer/"+data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //服务分类--修改
        this.updateCatalog = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsServiceCatalogRestServer/updating",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //服务分类--删除
        this.delServiceCatalog = function(data){
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url:$global_var.base_url + "resource/rsServiceCatalogRestServer/deleting?ids="+data,
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };
        //查询
        this.queryByPage = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsServiceInfoRestServer/byPage",
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
        this.delete = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsServiceInfoRestServer/deleting?ids="+data,
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        };

        //查询原始数据树
        this.getPrimaryData = function() {
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
        };

        //查询主题数据树
        this.getThemeData = function () {
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

        //根据选择的表获取sql语句
        this.getTableSql = function (page) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsServiceInfoRestServer/getTableSql",
                data:page
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //选择数据库类型
        this.getDBType = function (dataType,id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsServiceInfoRestServer/getDBType?dataType="+dataType+"&tableId=" + id
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //新增
        this.create = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsServiceInfoRestServer/creating",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //跳转到编辑页面
        this.getServiceInfo = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsServiceInfoRestServer/"+data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        // 得到服务接口信息
        this.getServiceInterface = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsServiceInterfaceRestServer/getServiceInterface?sId="+data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        // 得到字段信息
        this.getServiceColumns = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsServiceColumnsRestServer/getServiceColumns?id="+data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        // 查询表字段信息
        this.queryTableColumns = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getTableColumns/"+data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };


        //修改
        this.update = function(page){
            console.dir(page);
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsServiceInfoRestServer/updating",
                data:page
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        };

        //修改
        this.updateStatus = function(page){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url:$global_var.base_url + "resource/rsServiceInfoRestServer/updateStatus",
                data:page
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



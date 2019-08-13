define(['app'],function(app){
    app.register.service('$itemManagerService', ['$http','$q','$global_var',function($http,$q,$global_var){
        //查询树节点数据
        this.getTree = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgCatalogRestServer/tree?containLeaf=false"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        // 显示用户树
        this.getAddTree = function() {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "base/deptRestServer/getLocalUserOrgList"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        // 添加机构
        this.addOrg = function(branch) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                    url: $global_var.base_url + "resource/rsDgCatalogRestServer/creating",
                headers: {
                    "Content-Type":'application/json'
                },
                data: branch
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        // 删除机构
        this.deleteOrg = function(id) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgCatalogRestServer/deleting?ids="+id
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        // 根据数据源类型查询数据源列表
        this.getItemDataSources = function(type,datasourceType) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getDsList/"+type+"/"+datasourceType
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        // 根据数据源查询表列表或目录列表
        this.getTablesOrDirs = function(type, sourceId) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getTablesOrDirs/"+type+'/'+sourceId
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        // 创建指标项
        this.create = function(io,id) {
            var deferred=$q.defer();
            var url = "resource/rsDgItemRestServer/creating";
            if(id){
                url = "resource/rsDgItemRestServer/updating";
            }
            $http({
                method: 'POST',
                url: $global_var.base_url + url,
                headers: {
                    "Content-Type":'application/json'
                },
                data:io
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        // 更新指标项
        this.update = function(io) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgItemRestServer/updating",
                headers: {
                    "Content-Type":'application/json'
                },
                data:io
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        // 保存指标项采集配置
        this.config = function(dgItem) {
            // id为空表示新增，不为空表示更新
            var url = 'resource/rsDgItemRestServer/saveMappingColumns'
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + url,
                headers: {
                    "Content-Type":'application/json'
                },
                data: dgItem
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        // 查询源io列信息
        this.getTableColumns = function(tableId) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getTableColumns/" + tableId
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        // 根据io id查询指标项采集配置
        this.getConfigs = function(id) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/getMappingColumns/"+id
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        <!--分页查询-->
        this.queryDataByPage = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgItemRestServer/byPage",
                data:data
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        <!--删除-->
        this.delete = function (data) {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgItemRestServer/deleting?ids="+data,
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
            });
            return deferred.promise;
        }

        <!--查询数据库类型字典-->
        this.queryDatasourceType = function (type) {
            var deferred=$q.defer();
            var datasourceType = type=="db"?"database_dict":"storage_db_dict";
            $http({
                method:'GET',
                url:$global_var.base_url+"db/dictRestServer/getDict?dictCode="+datasourceType,
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //指标项名称去重
        this.nameRepeat = function(data){
            var deferred=$q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgItemRestServer/checkName",
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



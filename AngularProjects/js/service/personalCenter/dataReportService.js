define(['dataapp'], function (app) {
    app.register.service('$dataReportService', ['$http', '$q', '$global_var', function ($http, $q, $global_var) {

        //查询树节点数据
        this.getTree = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "resource/rsDgCatalogRestServer/filetree"
            }).success(function(result) {
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        //下载模板
        this.downloadTemplet = function (templatePath,tempAlias) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "base/servlet/resourceDownloadServlet?templatePath="+templatePath+"&tempAlias="+tempAlias,
                responseType: 'arraybuffer'
            }).success(function (result,status, headers) {
                deferred.resolve(result,status, headers);
                var blob = new Blob([result], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                var fileName = tempAlias;
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.download = fileName;
                a.href = URL.createObjectURL(blob);
                a.click();
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //上报数据
        this.ReportData = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgFileDirRestServer/uploadTemplate",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //上报数据
        this.saveReportData = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgFileReportRestServer/creating",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //分页查询数据
        this.queryDataByPage = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgItemRestServer/byPage",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (err) {
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        //分页查询数据
        this.queryReportDataByPage = function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $global_var.base_url + "resource/rsDgFileReportRestServer/byPage",
                data: data
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


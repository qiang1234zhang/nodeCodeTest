define(['app'],function(app){
    app.register.service('$dashboardService', ['$http','$q','$global_var',function($http,$q,$global_var){

        this.getFileLineData = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/panelFileRestServer/getLineData"
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }
        
        this.getDBLineData = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/panelDBChartRestServer/getLineData"
            }).success(function(result) {
                console.log(result)
                deferred.resolve(result);
            }).error(function(err){
                deferred.reject(false);
                console.log(err);
            });
            return deferred.promise;
        }

        this.getAggregations = function () {
            var deferred=$q.defer();
            $http({
                method: 'GET',
                url: $global_var.base_url + "db/panelDBChartRestServer/getAggregations"
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



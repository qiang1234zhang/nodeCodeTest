define(['app'],function(app){
    app.register.service('$homeService', ['$http','$q','$global_var',function($http,$q,$global_var){
    	//一级菜单查询
    	this.queryParentMenu = function(id){
			var deferred=$q.defer();
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/menu/byCondition",
				data:id
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

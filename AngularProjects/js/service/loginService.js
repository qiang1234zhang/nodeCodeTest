define(['app'],function(app){
    app.register.service('$loginService', ['$http','$q','$global_var',function($http,$q,$global_var){
    	this.loginAuth = function(data){
			var result={status :'success' ,1:true};
			/*var deferred=$q.defer();//promise对象
			$http({
				method: 'POST',
				url: $global_var.base_url + "base/userRestServer/loginCheck",
				data:data
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});*/
			return result;
		};
		
		this.getMenu = function(){
			var deferred=$q.defer();
		/*	$http({
				method: 'GET',
				url: $global_var.base_url + "base/menuRestServer/getMenu",
			}).success(function(result) {
					deferred.resolve(result);
			}).error(function(err){
				deferred.reject(false);
				console.log(err);
			});*/
			var menu={df:343,hht:76767,hy:444}
			return menu;
		};
		//promise 方式
         this.promises=function(){
			var p=new Promise(function(resovle,reject){
				if(true){
					//do something...
					/*$http({
						method: 'GET',
						url: $global_var.base_url + "base/role/" + roleId
					}).success(function(result) {
						resolve(result);
					}).error(function(err){
						reject(false);
					});*/
					console.log("立即执行");
					resovle();
				}else{
					reject();
				}
			});
            return p;
		}
		this.getPermission = function(roleId){
			var deferred=$q.defer();
			$http({
				method: 'GET',
				url: $global_var.base_url + "base/role/" + roleId
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



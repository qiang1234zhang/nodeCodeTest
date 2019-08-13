/**
 * webApp的路由配置
 */
define(['angular', 'router', "angular-ui-bootstrap","ngLocale",'scroll','ngDrag','iov','ngUpload','ngSlider','ngMessages','ngAnimate'], function() {
	var app = angular.module("dataCloudApp", ['ui.router', 'ui.bootstrap','ngLocale','widget.scrollbar','angular-drag','iov','angularFileUpload','ui.slider','ngMessages','ngAnimate']);
	app.factory('httpInterceptor', [ '$q', '$injector','$global_var',function($q, $injector,$global_var) {
		var httpInterceptor = {
			'responseError' : function(response) {
				if(response.status == 504)
					Alert("系统服务异常，请联系管理员");
				return $q.reject(response);
			},
			'response' : function(response) {
				if(response.config.url.indexOf("restful/cloud")>-1 && !(response.config.url.indexOf("servlet")>-1)){
					if(response.data){
						var resObj = angular.fromJson(response.data);
						if(resObj && resObj.result=='timeout'){
							var win = window;
							while (win != win.top){
								win = win.top;
							}
							win.location.href= "/";
						}
					}
				}
				return response;
			},
			'request' : function(config) {
				if(config.url.indexOf("/login")>-1){

				}else{
					var userId = getCookie("user_id");
					if(userId!=null && userId!=""){
					}else{
						var win = window;
						while (win != win.top){
							win = win.top;
						}
						win.location.href= "/";
					}
				}

				return config;
			},
			'requestError' : function(config){
				return $q.reject(config);
			}
		};
		return httpInterceptor;
	}]);
	var getCookie = function (name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}
	app.config([ '$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	} ]);
	//系统常量设置
	app.constant("$global_var", {
		base_url: '/restful/cloud/',
		user:{}
	});

	//用于注入 controller、filter、directive、service
	app.config(function($controllerProvider, $compileProvider, $filterProvider, $provide) {
		app.register = {
			controller: $controllerProvider.register,
			directive: $compileProvider.directive,
			filter: $filterProvider.register,
			service: $provide.service
		};
	});

	//用于加载ControllerJS
	app.loadControllerJs = function(path) {
		return function($rootScope, $q) {
			var def = $q.defer(),
				deps = [];
			angular.isArray(path) ? (deps = path) : deps.push(path);
			require(deps, function() {
				$rootScope.$apply(function() {
					def.resolve();
				});
			});
			return def.promise;
		}
	};
	//配置前端路由
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.when("", "/dataPortal");
		$urlRouterProvider.when("/dataPortal/dataCenter", "/dataPortal/dataCenter/primaryData");  //数据集市
		$urlRouterProvider.when("/dataPortal/serviceCenter", "/dataPortal/serviceCenter/applicationRegister");  //服务中心
		$urlRouterProvider.when("/dataPortal/personalCenter", "/dataPortal/personalCenter/primaryData");  //个人中心
		$stateProvider
			.state("login", {
				url: "/login",
				controller: 'managementApp.login',
				templateUrl: 'templates/login.html',
				resolve: {
					deps: app.loadControllerJs('js/controller/login')
				}
			})
			.state('dataPortal', {
				url: '/dataPortal',
				templateUrl: 'templates/app/dataIndex.html',
				controller: 'dataPortal.appIndex',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataPortal')
				}
			})
			//主页
			.state('dataPortal.home', {
				url: '/home',
				templateUrl: 'templates/app/home/home.html',
				controller: 'dataPortal.home',
				resolve: {
					deps: app.loadControllerJs('js/controller/home/home')
				}
			})

			//资源门户----开始
			//数据集市
			.state('dataPortal.dataCenter', {
				url: '/dataCenter',
				templateUrl: 'templates/app/dataMart/dataMart.html',
				controller: 'dataPortal.dataMart',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/dataMart')
				}
			})
			//原始数据
			.state('dataPortal.dataCenter.primaryData', {
				url: '/primaryData',
				templateUrl: 'templates/app/dataMart/primaryData.html',
				controller: 'dataPortal.dataMart.primaryData',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/primaryData')
				}
			})

			//主题数据
			.state('dataPortal.dataCenter.themeData', {
				url: '/themeData',
				templateUrl: 'templates/app/dataMart/themeData.html',
				controller: 'dataPortal.dataMart.themeData',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/themeData')
				}
			})
				//数据浏览
			.state('dataPortal.dataCenter.primaryDataBrowse', {
				url: '/primaryDataBrowse',
				templateUrl: 'templates/app/dataMart/primaryDataBrowse.html',
				controller: 'dataPortal.dataCenter.primaryDataBrowse',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/primaryDataBrowse')
				}
			})

				//数据浏览
			.state('dataPortal.dataCenter.themeDataBrowse', {
				url: '/themeDataBrowse',
				templateUrl: 'templates/app/dataMart/themeDataBrowse.html',
				controller: 'dataPortal.dataCenter.themeDataBrowse',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/themeDataBrowse')
				}
			})

			//服务中心
			.state('dataPortal.serviceCenter', {
				url: '/serviceCenter',
				templateUrl: 'templates/app/serviceCenter/serviceCenter.html',
				controller: 'dataPortal.serviceCenter',
				resolve: {
					deps: app.loadControllerJs('js/controller/serviceCenter/serviceCenter')
				}
			})
			.state('dataPortal.serviceCenter.applicationRegister', {
				url: '/applicationRegister',
				templateUrl: 'templates/app/serviceCenter/applicationRegister.html',
				controller: 'dataPortal.applicationRegister',
				resolve: {
					deps: app.loadControllerJs('js/controller/serviceCenter/applicationRegister')
				}
			})
			.state('dataPortal.serviceCenter.serviceMart', {
				url: '/serviceMart',
				templateUrl: 'templates/app/serviceCenter/serviceMart.html',
				controller: 'dataPortal.serviceMart',
				resolve: {
					deps: app.loadControllerJs('js/controller/serviceCenter/serviceMart')
				}
			})

			//主题分析
			.state('dataPortal.subjectAnalysis', {
				url: '/subjectAnalysis',
				templateUrl: 'templates/app/subjectAnalysis/subjectAnalysis.html',
				controller: 'dataPortal.subjectAnalysis',
				resolve: {
					deps: app.loadControllerJs('js/controller/subjectAnalysis/subjectAnalysis')
				}
			})
			//人口库
			.state('dataPortal.subjectAnalysis.populationLibrary', {
				url: '/populationLibrary',
				templateUrl: 'templates/app/subjectAnalysis/populationLibrary.html',
				controller: 'dataPortal.subjectAnalysis.populationLibrary',
				resolve: {
					deps: app.loadControllerJs('js/controller/subjectAnalysis/populationLibrary')
				}
			})
			//法人库
			.state('dataPortal.subjectAnalysis.corporateLibrary', {
				url: '/corporateLibrary',
				templateUrl: 'templates/app/subjectAnalysis/corporateLibrary.html',
				controller: 'dataPortal.subjectAnalysis.corporateLibrary',
				resolve: {
					deps: app.loadControllerJs('js/controller/subjectAnalysis/corporateLibrary')
				}
			})
			//个人中心
			.state('dataPortal.personalCenter', {
				url: '/personalCenter',
				templateUrl: 'templates/app/personalCenter/personalCenter.html',
				controller: 'dataPortal.personalCenter',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/personalCenter')
				}
			})
			//主题数据
			.state('dataPortal.personalCenter.themeData', {
				url: '/themeData',
				templateUrl: 'templates/app/personalCenter/themeData.html',
				controller: 'dataPortal.personalCenter.themeData',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/themeData')
				}
			})
			//原始数据
			.state('dataPortal.personalCenter.primaryData', {
				url: '/primaryData',
				templateUrl: 'templates/app/personalCenter/primaryData.html',
				controller: 'dataPortal.personalCenter.primaryData',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/primaryData')
				}
			})

			//数据服务
			.state('dataPortal.personalCenter.serverCenter', {
				url: '/serverCenter',
				templateUrl: 'templates/app/personalCenter/dataServer.html',
				controller: 'dataPortal.dataServer',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/dataServer')
				}
			})
			//主题数据申请
			.state('dataPortal.personalCenter.themeDataApplication', {
				url: '/themeDataApplication',
				templateUrl: 'templates/app/personalCenter/themeDataApplication.html',
				controller: 'dataPortal.personalCenter.themeDataApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/themeDataApplication')
				}
			})
			.state('dataPortal.personalCenter.primaryDataApplication', {
				url: '/themeDataApplication',
				templateUrl: 'templates/app/personalCenter/themeDataApplication.html',
				controller: 'dataPortal.personalCenter.themeDataApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/themeDataApplication')
				}
			})
			//共享数据申请
			.state('dataPortal.personalCenter.shareDataApplication', {
				url: '/shareDataApplication',
				templateUrl: 'templates/app/personalCenter/shareDataApplication.html',
				controller: 'dataPortal.personalCenter.shareDataApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/shareDataApplication')
				}
			})
			.state('dataPortal.personalCenter.serviceApplication', {
				url: '/serviceApplication',
				templateUrl: 'templates/app/personalCenter/serviceApplication.html',
				controller: 'dataPortal.serviceApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/serviceApplication')
				}
			})
			//数据上报
			.state('dataPortal.personalCenter.dataReport', {
				url: '/dataReport',
				templateUrl: 'templates/app/personalCenter/dataReport.html',
				controller: 'dataPortal.personalCenter.dataReport',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/dataReport')
				}
			})
			//共享申请
			.state('dataPortal.personalCenter.shareApplication', {
				url: '/shareApplication',
				templateUrl: 'templates/app/personalCenter/shareApplication.html',
				controller: 'dataPortal.personalCenter.shareApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/shareApplication')
				}
			})
			//资源门户----结束
	}]);


	return app;



});


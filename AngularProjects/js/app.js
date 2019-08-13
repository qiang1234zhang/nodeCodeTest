/**
 * webApp的路由配置
 */
define(['angular', 'router', "angular-ui-bootstrap","ngLocale",'scroll','ngDrag','iov','ngUpload','ngSlider','ngMessages','ngAnimate'], function() {
	var app = angular.module("CloudApp", ['ui.router', 'ui.bootstrap','ngLocale','widget.scrollbar','angular-drag','iov','angularFileUpload','ui.slider','ngMessages','ngAnimate']);
	app.factory('httpInterceptor', [ '$q', '$injector','$global_var',function($q, $injector,$global_var) {
		var httpInterceptor = {

            'request' : function(config) {

                if(config.url.indexOf("/login")>-1){

                }else{
                    var userId = getCookie("user_id");
                    if(userId!=null && userId!=""){
                    }else{
                        localStorage.clear();
                        var win = window;
                        while (win != win.top){
                            win = win.top;
                        }
                        win.location.href= "/";
                    }
                }

                return config;
            },
			'response' : function(response) {
				if(response.config.url.indexOf("restful/cloud")>-1){
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
			'requestError' : function(config){

				return $q.reject(config);
			},
            'responseError' : function(response) {
                if(response.status == 504)
                    Alert("系统服务异常，请联系管理员");
                return $q.reject(response);
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
		if(localStorage.user){
			var initUrlObj = JSON.parse(localStorage.user);
			if(initUrlObj&&initUrlObj.appInitUrl){
				var initUrl = initUrlObj.appInitUrl;

				initUrl = initUrl.replace(".", "/");
				$urlRouterProvider.when("", "/"+initUrl);
			}else {
				$urlRouterProvider.when("", "/login");
			}
		}else {
			$urlRouterProvider.when("", "/login");
		}

        $urlRouterProvider.when("/appIndex/dg", "/appIndex/dg/itemManager");  //数据采集
        $urlRouterProvider.when("/appIndex/etl", "/appIndex/etl/ruleManager");	//数据融合
        $urlRouterProvider.when("/appIndex/taskManage", "/appIndex/taskManage/taskManager");	//任务调度
		$urlRouterProvider.when("/appIndex/resource","/appIndex/resource/itemManager"); //资源管理
		$urlRouterProvider.when("/appIndex/dataManage","/appIndex/dataManage/fileDataManager"); //数据管理
        $urlRouterProvider.when("/appIndex/console","/appIndex/console/roleManagement"); //数据管理
        
		$stateProvider.state("login", {
				url: "/login",
				controller: 'managementApp.login',
				templateUrl: 'templates/login.html',
				resolve: {
					deps: app.loadControllerJs('js/controller/login')
				}
			})
			.state('appIndex', {
				url: '/appIndex',
				templateUrl: 'templates/app/appIndex.html',
				controller: 'managementApp.appIndex',
				resolve: {
					deps: app.loadControllerJs('js/controller/appIndex')
				}
			})
			//主页
			.state('appIndex.home', {
				url: '/home',
				templateUrl: 'templates/app/home/home.html',
				controller: 'appIndex.home',
				resolve: {
					deps: app.loadControllerJs('js/controller/home/home')
				}
			})
			//数据门户

			.state('appIndex.dataPortal', {
				url: '/dataPortal',
				templateUrl: 'templates/app/dataPortal/dataPortal.html',
				controller: 'appIndex.dataPortal'
			})
			/* 数据采集start  */
			.state('appIndex.dg', {
				url: '/dg',
				templateUrl: 'templates/app/dg/dg.html',
				controller: 'appIndex.dg',
				resolve: {
					deps: app.loadControllerJs('js/controller/dg/dg')
				}
			})

			//数据采集-节点管理
			.state('appIndex.dg.clusterManager', {
				url: '/clusterManager',
				templateUrl: 'templates/app/dg/clusterManager.html',
				controller: 'appIndex.clusterManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dg/clusterManager')
				}
			})

			//指标项管理
			.state('appIndex.dg.itemManager', {
				url: '/itemManager',
				templateUrl: 'templates/app/dg/itemManager.html',
				controller: 'appIndex.reItemManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/resource/itemManager')
				}
			})

			//流程管理
			.state('appIndex.dg.workflow',{
				url: '/workflow',
				templateUrl: 'templates/app/dg/workflow.html',
				controller: 'appIndex.dg.workflow',
				resolve: {
					deps: app.loadControllerJs('js/controller/dg/workflow')
				}
			})

			//流程设计
			.state('appIndex.dg.workflowDesign',{
				url: '/workflowDesign',
				params:{args:{}},
				templateUrl: 'templates/app/dg/workflowDesign.html',
				controller: 'appIndex.dg.workflowDesign',
				resolve: {
					deps: app.loadControllerJs('js/controller/dg/workflowDesign')
				}
			})
			//流程日志管理
			.state('appIndex.dg.logs', {
				url: '/logs',
				templateUrl: 'templates/app/dg/workflowLogManager.html',
				controller: 'appIndex.dg.logs',
				resolve: {
					deps: app.loadControllerJs('js/controller/dg/logsManager.js')
				}
			})

			/* 数据采集end  */

			//数据管理
			.state('appIndex.dataManage.dashboard',{
				url:'/dashboard',
				templateUrl:'templates/app/dataManage/dashboard.html',
				controller:'appIndex.dashboard',
				resolve:{
					deps:app.loadControllerJs('js/controller/dataManage/dashboard')
				}
			})
			.state('appIndex.dataManage.serverComfing',{
				url:'/serverComfing',
				templateUrl:'templates/app/dataManage/serverComfing.html',
				controller:'appIndex.serverComfing',
				resolve:{
					deps:app.loadControllerJs('js/controller/dataManage/serverComfing')
				}
			})
			.state('appIndex.dataManage', {
				url: '/dataManage',
				templateUrl: 'templates/app/dataManage/dataManage.html',
				controller: 'appIndex.dataManage',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/dataManage')
				}
			})
			.state('appIndex.dataManage.tableStructure', {
				url: '/tableStructure',
				templateUrl: 'templates/app/dataManage/tableStructure.html',
				controller: 'appIndex.tableStructure',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/tableStructure')
				}
			})
			.state('appIndex.dataManage.fileManage', {
				url: '/fileManage',
				templateUrl: 'templates/app/dataManage/fileManage.html',
				controller: 'appIndex.fileManage',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileManage')
				}
			})
			.state('appIndex.dataManage.databaseConfig', {
				url: '/databaseConfig',
				templateUrl: 'templates/app/dataManage/databaseConfig.html',
				controller: 'appIndex.databaseConfig',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/databaseConfig')
				}
			})
			.state('appIndex.dataManage.databaseTableManager', {
				url: '/databaseTableManager',
				templateUrl: 'templates/app/dataManage/databaseTableManager.html',
				controller: 'appIndex.databaseTableManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/databaseTableManager')
				}
			})
			.state('appIndex.dataManage.databaseDataBrowse', {
				url: '/databaseDataBrowse',
				templateUrl: 'templates/app/dataManage/databaseDataBrowse.html',
				controller: 'appIndex.databaseDataBrowse',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/databaseDataBrowse')
				}
			})

            .state('appIndex.dataManage.fileDataManager', {
                url: '/fileDataManager',
                templateUrl: 'templates/app/dataManage/fileDataManager.html',
                controller: 'appIndex.fileDataManager',
                resolve: {
                    deps: app.loadControllerJs('js/controller/dataManage/fileDataManager')
                }
            })
			.state('appIndex.dataManage.fileStorageDataBrowse', {
				url: '/fileStorageDataBrowse',
				templateUrl: 'templates/app/dataManage/fileStorageDataBrowse.html',
				controller: 'appIndex.fileStorageDataBrowse',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileStorageDataBrowse')
				}
			})
			//数据授权---用户管理
			.state('appIndex.dataManage.dataAuthUserManage', {
				url: '/dataAuthUserManage',
				templateUrl: 'templates/app/dataManage/dataAuthUserManage.html',
				controller: 'appIndex.dataAuthUserManage',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/dataAuthUserManage')
				}
			})
			//数据授权--表数据授权
			.state('appIndex.dataManage.tableDataAuthorization', {
				url: '/tableDataAuthorization',
				templateUrl: 'templates/app/dataManage/tableDataAuthorization.html',
				controller: 'appIndex.tableDataAuthorization',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/tableDataAuthorization')
				}
			})
			//数据授权--文件数据授权
			.state('appIndex.dataManage.fileDataAuthorization', {
				url: '/fileDataAuthorization',
				templateUrl: 'templates/app/dataManage/fileDataAuthorization.html',
				controller: 'appIndex.fileDataAuthorization',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileDataAuthorization')
				}
			})
			//索引管理--索引规则定制
			.state('appIndex.dataManage.indexRuleConfig', {
				url: '/indexRuleConfig',
				templateUrl: 'templates/app/dataManage/indexRuleConfig.html',
				controller: 'appIndex.indexRuleConfig',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/indexRuleConfig')
				}
			})
			//索引库管理
			.state('appIndex.dataManage.indexDataBaseManage', {
				url: '/indexDataBaseManage',// 模板文件名
				templateUrl: 'templates/app/dataManage/indexDataBaseManage.html',//模板的路径
				controller: 'appIndex.indexDataBaseManage',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/indexDataBaseManage')
				}
			})
			.state('appIndex.dataManage.indexTableManage', {
				url: '/indexDatabase',// 模板文件名
				templateUrl: 'templates/app/dataManage/indexTableManage.html',//模板的路径
				controller: 'appIndex.indexTableManage',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/indexTableManage')
				}
			})
			//索引管理--数据浏览
			.state('appIndex.dataManage.indexDataBrowseManager', {
				url: '/indexDataBrowseManager',
				templateUrl: 'templates/app/dataManage/indexDataBrowseManager.html',
				controller: 'appIndex.dataManage.indexDataBrowseManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/indexDataBrowseManager')
				}
			})
			//数据导入导出-数据导入
			.state('appIndex.dataManage.dataImportManager', {
				url: '/dataImportManager',
				templateUrl: 'templates/app/dataManage/dataImportManager.html',
				controller: 'appIndex.dataManage.dataImportManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/dataImportManager')
				}
			})
			//数据导入导出-数据导出
			.state('appIndex.dataManage.dataExportManager', {
				url: '/dataExportManager',
				templateUrl: 'templates/app/dataManage/dataExportManager.html',
				controller: 'appIndex.dataManage.dataExportManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/dataExportManager')
				}
			})
			//文件导入导出-文件导入
			.state('appIndex.dataManage.fileImportManager', {
				url: '/fileImportManager',
				templateUrl: 'templates/app/dataManage/fileImportManager.html',
				controller: 'appIndex.dataManage.fileImportManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileImportManager')
				}
			})
			//文件导入导出-文件导出
			.state('appIndex.dataManage.fileExportManager', {
				url: '/fileExportManager',
				templateUrl: 'templates/app/dataManage/fileExportManager.html',
				controller: 'appIndex.dataManage.fileExportManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileExportManager')
				}
			})
			.state('appIndex.dataManage.structureImport', {
				url: '/structureImport',
				templateUrl: 'templates/app/dataManage/structureImport.html',
				controller: 'appIndex.structureImport',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/structureImport')
				}
			})
			.state('appIndex.dataManage.structureExport', {
				url: '/structureExport',
				templateUrl: 'templates/app/dataManage/structureExport.html',
				controller: 'appIndex.structureExport',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/structureExport')
				}
			})
			//数据备份管理-备份规则
			.state('appIndex.dataManage.dataBackupRuleManager', {
				url: '/dataBackupRuleManager',
				templateUrl: 'templates/app/dataManage/dataBackupRuleManager.html',
				controller: 'appIndex.dataManage.dataBackupRuleManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/dataBackupRuleManager')
				}
			})
			//数据备份管理-备份任务
			.state('appIndex.dataManage.dataBackupTaskManager', {
				url: '/dataBackupTaskManager',
				templateUrl: 'templates/app/dataManage/dataBackupTaskManager.html',
				controller: 'appIndex.dataManage.dataBackupTaskManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/dataBackupTaskManager')
				}
			})
			//数据备份管理-备份日志
			.state('appIndex.dataManage.dataBackupLogManager', {
				url: '/dataBackupLogManager',
				templateUrl: 'templates/app/dataManage/dataBackupLogManager.html',
				controller: 'appIndex.dataManage.dataBackupLogManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/dataBackupLogManager')
				}
			})
			//文件备份管理-备份规则
			.state('appIndex.dataManage.fileBackupRuleManager', {
				url: '/fileBackupRuleManager',
				templateUrl: 'templates/app/dataManage/fileBackupRuleManager.html',
				controller: 'appIndex.dataManage.fileBackupRuleManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileBackupRuleManager')
				}
			})
			//文件备份管理-备份任务
			.state('appIndex.dataManage.fileBackupTaskManager', {
				url: '/fileBackupTaskManager',
				templateUrl: 'templates/app/dataManage/fileBackupTaskManager.html',
				controller: 'appIndex.dataManage.fileBackupTaskManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileBackupTaskManager')
				}
			})
			//文件备份管理-备份日志
			.state('appIndex.dataManage.fileBackupLogManager', {
				url: '/fileBackupLogManager',
				templateUrl: 'templates/app/dataManage/fileBackupLogManager.html',
				controller: 'appIndex.dataManage.fileBackupLogManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileBackupLogManager')
				}
			})
			.state('appIndex.dataManage.fileBackup', {
				url: '/fileBackup',
				templateUrl: 'templates/app/dataManage/fileBackup.html',
				controller: 'appIndex.fileBackup',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/fileBackup')
				}
			})	
			.state('appIndex.dataManage.structureBackup', {
				url: '/structureBackup',
				templateUrl: 'templates/app/dataManage/structureBackup.html',
				controller: 'appIndex.structureBackup',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataManage/structureBackup')
				}
			})


			/* 数据融合start  */
			.state('appIndex.etl', {
				url: '/etl',
				templateUrl: 'templates/app/etl/etl.html',
				controller: 'appIndex.etl',
				resolve: {
					deps: app.loadControllerJs('js/controller/etl/etl')
				}
			})
			//数据融合-数据源管理
			/*.state('appIndex.etl.dataSourceManager', {
				url: '/dataSourceManager',
				templateUrl: 'templates/app/etl/dataSourceManager.html',
				controller: 'appIndex.etl.dataSourceManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/etl/dataSourceManager')
				}
			})*/

			//数据融合-节点管理
			.state('appIndex.etl.clusterManager', {
				url: '/clusterManager',
				templateUrl: 'templates/app/etl/clusterManager.html',
				controller: 'appIndex.etl.clusterManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/etl/clusterManager')
				}
			})
            //数据采集-规则管理
            .state('appIndex.etl.ruleManager', {
                url: '/ruleManager',
                templateUrl: 'templates/app/etl/ruleManager.html',
                controller: 'appIndex.ruleManager',
                resolve: {
                    deps: app.loadControllerJs('js/controller/etl/ruleManager')
                }
            })

			.state('appIndex.etl.workflow',{
				url: '/workflow',
				templateUrl: 'templates/app/etl/workflow.html',
				controller: 'appIndex.etl.workflow',
				resolve: {
					deps: app.loadControllerJs('js/controller/etl/workflow')
				}
			})
			//流程设计
			.state('appIndex.etl.workflowDesign',{
				url: '/workflowDesign',
				params:{args:{}},
				templateUrl: 'templates/app/etl/workflowDesign.html',
				controller: 'appIndex.etl.workflowDesign',
				resolve: {
					deps: app.loadControllerJs('js/controller/etl/workflowDesign')
				}
			})
			//流程日志管理
			.state('appIndex.etl.logs', {
				url: '/logs',
				templateUrl: 'templates/app/etl/workflowLogManager.html',
				controller: 'appIndex.etl.workflowlog',
				resolve: {
					deps: app.loadControllerJs('js/controller/etl/workflowLogManager')
				}
			})
			/* 数据融合end  */




            //任务调度
			.state('appIndex.taskManage', {
				url: '/taskManage',
				templateUrl: 'templates/app/taskManage/taskManage.html',
				controller: 'appIndex.taskManage',
				resolve: {
					deps: app.loadControllerJs('js/controller/taskManage/taskManage')
				}
			})
			.state('appIndex.taskManage.taskManager',{
				url:'/taskManager',
				templateUrl:'templates/app/taskManage/taskManager.html',
				controller: 'appIndex.taskManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/taskManage/taskManager')
				}
			})
			.state('appIndex.taskManage.dispatchManager',{
				url:'/dispatchManager',
				templateUrl:'templates/app/taskManage/dispatchManager.html',
				controller: 'appIndex.dispatchManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/taskManage/dispatchManager')
				}
			})
			//日志监控
			.state('appIndex.taskManage.monitorManager',{
				url:'/monitorManager',
				templateUrl:'templates/app/taskManage/monitorManager.html',
				controller: 'appIndex.monitorManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/taskManage/monitorManager')
				}
			})
			.state('appIndex.taskManage.receiveLog',{
				url:'/receiveLog',
				templateUrl:'templates/app/taskManage/receiveLog.html'
			})
			.state('appIndex.taskManage.impleteLog',{
				url:'/impleteLog',
				templateUrl:'templates/app/taskManage/impleteLog.html'
			})
			
			//-------





			//平台管理开始
			.state('appIndex.console', {
				url: '/console',
				templateUrl: 'templates/app/console/console.html',
				controller: 'appIndex.console',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/console')
				}
			})		
			//服务器管理
			.state('appIndex.console.serverManager', {
				url: '/serverManager',
				templateUrl: 'templates/app/console/serverManager.html',
				controller: 'appIndex.serverManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/serverManager')
				}
			})
			//资源包管理
			.state('appIndex.console.resourceManager', {
				url: '/ResourceManagement',
				templateUrl: 'templates/app/console/resourceManager.html',

				controller: 'appIndex.resourceManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/resourceManager')
				}
			})
			//部署配置
			.state('appIndex.console.deployConfigManager', {
				url: '/deployConfigManager',
				templateUrl: 'templates/app/console/deployConfigManager.html',
				controller: 'appIndex.deployConfigManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/deployConfigManager')
				}
			})
			//数据源管理

			//数据库系统
			.state('appIndex.console.dataSourceManager', {
				url: '/dataSourceManager',
				templateUrl: 'templates/app/console/dataSourceManager.html',
				controller: 'appIndex.dataSourceManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/dataSourceManager')
				}
			})
			//文件系统
			.state('appIndex.console.fileSourceManager', {
				url: '/fileSourceManager',
				templateUrl: 'templates/app/console/fileSourceManager.html',
				controller: 'appIndex.fileSourceManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/fileSourceManager')
				}
			})
			//用户管理
			.state('appIndex.console.deptManager', {
				url: '/deptManager',
				templateUrl: 'templates/app/console/deptManager.html',
				controller: 'appIndex.deptManager',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/deptManager')
				}
			})
			//租户管理
			.state('appIndex.console.tenantManager', {
				url: '/tenantManager',
				templateUrl: 'templates/app/console/tenantManager.html',
                controller: 'appIndex.tenantManager',
                resolve: {
                    deps: app.loadControllerJs('js/controller/console/tenantManager')
                }
			})
			//角色管理
			.state('appIndex.console.roleManagement', {
				url: '/roleManagement',
				templateUrl: 'templates/app/console/roleManagement.html',
				controller: 'appIndex.roleManagement',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/roleManagement')
				}
			})
			//菜单授权
			.state('appIndex.console.permissionManagement', {
				url: '/permissionManagement',
				templateUrl: 'templates/app/console/permissionManagement.html',
				controller: 'appIndex.permissionManagement',
				resolve: {
					deps: app.loadControllerJs('js/controller/console/permissionManagement')
				}
			})
            //服务管理
            .state('appIndex.console.serviceManager', {
                url: '/serviceManager',
                templateUrl: 'templates/app/console/serviceManager.html',
                controller: 'appIndex.serviceManager',
                resolve: {
                    deps: app.loadControllerJs('js/controller/console/serviceManager')
                }
            })

			//平台管理结束//

			//资源管理中心
			.state('appIndex.resource', {
                url: '/resource',
                templateUrl: 'templates/app/resource/resource.html',
                controller: 'appIndex.resource',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/resource')
                }
            })
			//指标项管理
			.state('appIndex.resource.itemManager', {
                url: '/itemManager',
                templateUrl: 'templates/app/resource/itemManager.html',
                controller: 'appIndex.reItemManager',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/itemManager')
                }
            })
			//原始数据浏览
			.state('appIndex.resource.itemDataBrowse', {
                url: '/itemDataBrowse',
                templateUrl: 'templates/app/resource/itemDataBrowse.html',
                controller: 'appIndex.itemDataBrowse',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/itemDataBrowse')
                }
            })
			//清洗规则
			.state('appIndex.resource.cleanRule', {
                url: '/cleanRule',
                templateUrl: 'templates/app/resource/cleanRule.html',
                controller: 'appIndex.cleanRule',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/cleanRule')
                }
            })
			//清洗结果
			.state('appIndex.resource.cleanResult', {
                url: '/cleanResult',
                templateUrl: 'templates/app/resource/cleanResult.html',
                controller: 'appIndex.cleanResult',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/cleanResult')
                }
            })
			//对比规则
			.state('appIndex.resource.compareRule', {
                url: '/compareRule',
                templateUrl: 'templates/app/resource/compareRule.html',
                controller: 'appIndex.compareRule',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/compareRule')
                }
            })
			//对比结果
			.state('appIndex.resource.compareResult', {
                url: '/compareResult',
                templateUrl: 'templates/app/resource/compareResult.html',
                controller: 'appIndex.compareResult',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/compareResult')
                }
            })
			//主题数据目录
			.state('appIndex.resource.topicDataDirectory', {
                url: '/topicDataDirectory',
                templateUrl: 'templates/app/resource/topicDataDirectory.html',
                controller: 'appIndex.topicDataDirectory',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/topicDataDirectory')
                }
            })
			//主题数据浏览
			.state('appIndex.resource.topicDataBrowse', {
                url: '/topicDataBrowse',
                templateUrl: 'templates/app/resource/topicDataBrowse.html',
                controller: 'appIndex.topicDataBrowse',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/topicDataBrowse')
                }
            })
			//原始数据发布
			.state('appIndex.resource.primaryDataPublish', {
                url: '/primaryDataPublish',
                templateUrl: 'templates/app/resource/primaryDataPublish.html',
                controller: 'appIndex.primaryDataPublish',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/primaryDataPublish')
                }
            })
			//z主题数据发布
			.state('appIndex.resource.themeDataPublish', {
                url: '/themeDataPublish',
                templateUrl: 'templates/app/resource/themeDataPublish.html',
                controller: 'appIndex.themeDataPublish',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/themeDataPublish')
                }
            })
			//数据审批
			.state('appIndex.resource.dataApplicationApprove', {
                url: '/applicationApprove',
                templateUrl: 'templates/app/resource/applicationApprove.html',
                controller: 'appIndex.applicationApprove',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/applicationApprove')
                }
            })
			//共享审批
			.state('appIndex.resource.shareApprove', {
                url: '/shareApprove',
                templateUrl: 'templates/app/resource/shareApprove.html',
                controller: 'appIndex.shareApprove',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/shareApprove')
                }
            })
			//服务审批
			.state('appIndex.resource.serviceApprove', {
                url: '/serviceApprove',
                templateUrl: 'templates/app/resource/serviceApprove.html',
                controller: 'appIndex.resource.serviceApprove',
                resolve: {
                    deps: app.loadControllerJs('js/controller/resource/serviceApprove')
                }
            })
			//资源门户----开始
			//数据集市
			.state('appIndex.dataMart', {
				url: '/dataMart',
				templateUrl: 'templates/app/dataMart/dataMart.html',
				controller: 'appIndex.dataMart',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/dataMart')
				}
			})
			//原始数据
			.state('appIndex.dataMart.primaryData', {
				url: '/primaryData',
				templateUrl: 'templates/app/dataMart/primaryData.html',
				controller: 'appIndex.dataMart.primaryData',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/primaryData')
				}
			})
			//主题数据
			.state('appIndex.dataMart.themeData', {
				url: '/themeData',
				templateUrl: 'templates/app/dataMart/themeData.html',
				controller: 'appIndex.dataMart.themeData',
				resolve: {
					deps: app.loadControllerJs('js/controller/dataMart/themeData')
				}
			})
			//服务中心
			.state('appIndex.serviceCenter', {
				url: '/serviceCenter',
				templateUrl: 'templates/app/serviceCenter/serviceCenter.html',
				controller: 'appIndex.serviceCenter',
				resolve: {
					deps: app.loadControllerJs('js/controller/serviceCenter/serviceCenter')
				}
			})
			.state('appIndex.serviceCenter.serviceFa', {
				url: '/serviceFa',
				templateUrl: 'templates/app/serviceCenter/serviceFa.html',
				controller: 'appIndex.serviceCenter.serviceFa',
				resolve: {
					deps: app.loadControllerJs('js/controller/serviceCenter/serviceFa')
				}
			})
			//主题分析
			.state('appIndex.subjectAnalysis', {
				url: '/subjectAnalysis',
				templateUrl: 'templates/app/subjectAnalysis/subjectAnalysis.html',
				controller: 'appIndex.subjectAnalysis',
				resolve: {
					deps: app.loadControllerJs('js/controller/subjectAnalysis/subjectAnalysis')
				}
			})
			//人口库
			.state('appIndex.subjectAnalysis.populationLibrary', {
				url: '/populationLibrary',
				templateUrl: 'templates/app/subjectAnalysis/populationLibrary.html',
				controller: 'appIndex.subjectAnalysis.populationLibrary',
				resolve: {
					deps: app.loadControllerJs('js/controller/subjectAnalysis/populationLibrary')
				}
			})
			//法人库
			.state('appIndex.subjectAnalysis.corporateLibrary', {
				url: '/corporateLibrary',
				templateUrl: 'templates/app/subjectAnalysis/corporateLibrary.html',
				controller: 'appIndex.subjectAnalysis.corporateLibrary',
				resolve: {
					deps: app.loadControllerJs('js/controller/subjectAnalysis/corporateLibrary')
				}
			})
			//个人中心
			.state('appIndex.personalCenter', {
				url: '/personalCenter',
				templateUrl: 'templates/app/personalCenter/personalCenter.html',
				controller: 'appIndex.personalCenter',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/personalCenter')
				}
			})
			//主题数据
			.state('appIndex.personalCenter.themeData', {
				url: '/themeData',
				templateUrl: 'templates/app/personalCenter/themeData.html',
				controller: 'appIndex.personalCenter.themeData',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/themeData')
				}
			})
			//原始数据
			.state('appIndex.personalCenter.primaryData', {
				url: '/primaryData',
				templateUrl: 'templates/app/personalCenter/primaryData.html',
				controller: 'appIndex.personalCenter.primaryData',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/primaryData')
				}
			})
			//主题数据申请
			.state('appIndex.personalCenter.themeDataApplication', {
				url: '/themeDataApplication',
				templateUrl: 'templates/app/personalCenter/themeDataApplication.html',
				controller: 'appIndex.personalCenter.themeDataApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/themeDataApplication')
				}
			})
			//共享数据申请
			.state('appIndex.personalCenter.shareDataApplication', {
				url: '/shareDataApplication',
				templateUrl: 'templates/app/personalCenter/shareDataApplication.html',
				controller: 'appIndex.personalCenter.shareDataApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/shareDataApplication')
				}
			})

			//共享申请
			.state('appIndex.personalCenter.shareApplication', {
				url: '/shareApplication',
				templateUrl: 'templates/app/personalCenter/shareApplication.html',
				controller: 'appIndex.personalCenter.shareApplication',
				resolve: {
					deps: app.loadControllerJs('js/controller/personalCenter/shareApplication')
				}
			})
			//资源门户----结束
			//服务管理----开始
			//应用注册
			.state('appIndex.resource.applicationRegister', {
				url: '/appRegister',
				templateUrl: 'templates/app/resource/appRegister.html',
				controller: 'appIndex.resource.appRegister',
				resolve: {
					deps: app.loadControllerJs('js/controller/resource/appRegister')
				}
			})
			//服务定义
			.state('appIndex.resource.serviceDefinition', {
				url: '/serviceDefinition',
				templateUrl: 'templates/app/resource/serviceDefinition.html',
				controller: 'appIndex.resource.serviceDefinition',
				resolve: {
					deps: app.loadControllerJs('js/controller/resource/serviceDefinition')
				}
			})
			//服务授权
			.state('appIndex.resource.servicePermission', {
				url: '/servicePermission',
				templateUrl: 'templates/app/resource/servicePermission.html',
				controller: 'appIndex.resource.servicePermission',
				resolve: {
					deps: app.loadControllerJs('js/controller/resource/servicePermission')
				}
			})
			//服务管理----结束
	}]);


	return app;



});


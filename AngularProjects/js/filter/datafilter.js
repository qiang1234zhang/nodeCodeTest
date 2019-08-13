define(['dataapp', 'jquery'], function(app, $) {
	//数据管理模块
	app.register.filter("tableStructureStatus", function() {
		return function(input) {
			var out = "";
			switch (input){
				case true:		
				out="已创建"
					break;
				case false:
				out="未创建"
					break;
				default:
				out="无数据"
					break;
			}
			return out;
		}
	});
	app.register.filter("tableStructureType", function() {
		return function(input) {
			var out = "";
			switch (input){
				case 0:
				out="平台外部"
					break;
				case 1:
				out="平台内部"
					break;
				default:
				out="无数据"
					break;
			}
			return out;
		}
	});
	app.register.filter("sizeToKB", function() {
		return function(input) {
			var out = parseFloat(parseInt(parseInt(input)/1000)).toLocaleString();
			return out;
		}
	});
	
	//设备类型管理的过滤器
	app.register.filter("deviceTypeStatus", function() {
		return function(input) {
			var out = "";
			switch (input){
				case true:
					out="是";
					break;
				case false:
					out="否";
					break;
				default:
					out="无数据";
					break;
			}
			return out;
		}
	});
	//设备管理和车辆绑定状态的过滤滤器
	app.register.filter("deviceBIndStatus", function() {
		return function(input) {
			var out = "";
			switch (input){
				case true:
					out="已绑定";
					break;
				case false:
					out="未绑定";
					break;
				default:
					out="无数据";
					break;
			}
			return out;
		}
	});
	//设备状态和车辆状态的过滤器
	app.register.filter("deviceStatus", function() {
		return function(input) {
			var out = "";
			switch (input){
				case true:
					out="在线";
					break;
				case false:
					out="离线";
					break;
				default:
					out="无数据";
					break;
			}
			return out;
		}
	});

	//设备状态的过滤器
	app.register.filter("vpnStatus", function() {
		return function(input) {
			var out = "";
			switch (input){
				case true:
					out="在线";
					break;
				case false:
					out="离线";
					break;
				default:
					out="无数据";
					break;
			}
			return out;
		}
	});

	//数据格式定义的过滤器
	app.register.filter("dataStatus", function() {
		return function(input) {
			var out = "";
			switch (input){
				case true:
					out="运行";
					break;
				case false:
					out="停止";
					break;
				default:
					out="无数据";
					break;
			}
			return out;
		}
	});
	//数据传输通道的过滤器
	app.register.filter("DataStatus", function() {
		return function(input) {
			var out = "";
			switch (input){
				case true:
					out="传输中";
					break;
				case false:
					out="停止";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});

	//平台运维模块状态的过滤器
	app.register.filter("status",function(){
		return function(input){
			var out = "";
			switch (input){
				case "0":
					out="停止";
					break;
				case "1":
					out="运行";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});
	
	//调度日志过滤
	app.register.filter("statusexchange",function(){
		return function(input){
			var out = "";
			switch (input){
				case "0":
					out="失败";
					break;
				case "1":
					out="成功";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});

	//用户管理用户状态过滤
	app.register.filter("statusUser",function(){
		return function(input){
			var out = "";
			switch (input){
				case "0":
					out="不可用";
					break;
				case "1":
					out="可用";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});

	//用户管理时间格式过滤
	app.register.filter("statusTime",function(){
		return function(input){
			var out =input.split(" ")[0];
			return out;
		}
	});
	//节点管理启用状态过滤
	app.register.filter("statusFilter",function(){
		return function(input){
            var out = "";
            switch (input){
                case "1":
                    out="启用";
                    break;
                case "0":
                    out="禁用";
                    break;
                default:
                    out="异常";
                    break;
            }
            return out;
		}
	});
	//节点管理启用状态过滤
	app.register.filter("clusterStatusFilter",function(){
		return function(input){
            var out = "";
            switch (input){
                case "1":
                    out="正常";
                    break;
                default:
                    out="异常";
                    break;
            }
            return out;
		}
	});

	//数据源类型
	app.register.filter("dataSourceType",function(){
		return function(input){
			var out = "";
			switch (input){
				case "00000000":
					out="MYSQL";
					break;
				case "00000001":
					out="ORACLE";
					break;
				case "00000002":
					out="SQLSERVER";
					break;
				case "00000003":
					out="CLOUDDB";
					break;
				case "00000100":
					out="CloudFile";
					break;
				case "00000101":
					out="HDFS文件系统";
					break;
				case "00000102":
					out="FTP文件系统";
					break;
				case "00000103":
					out="WINDOWS共享文件系统";
					break;
				case "00000104":
					out="LINUX共享文件系统";
					break;
				case "00000105":
					out="LOCAL文件系统";
					break;
				case "00000200":
					out="ELASTICSEARCH";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});

	//流程管理-流程状态1
	app.register.filter("flowStatusFilter",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="已部署";
					break;
				case "0":
					out="未部署";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});
	//流程管理-任务状态
	app.register.filter("flowTaskStatusFilter",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="已创建任务";
					break;
				case "0":
					out="未创建任务";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});
	//任务调度任务管理任务来源
	app.register.filter("jobTaskSource",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="数据采集";
					break;
				case "2":
					out="数据融合";
					break;
				case "3":
					out="资源服务管理系统";
					break;
				case "4":
					out="云数据库";
					break;
				default:
					out="外部";
					break;
			}
			return out;
		}
	});
	//任务调度任务管理接入方式
	app.register.filter("jobTaskInsertMethod",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="REST";
					break;
				case "2":
					out="MQ";
					break;
				case "3":
					out="SSH";
					break;
				default:
					out="平台";
					break;
			}
			return out;
		}
	});
	//任务调度--调度管理--执行类型
	app.register.filter("executeType",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="并行";
					break;
				case "2":
					out="串行";
					break;
			}
			return out;
		}
	});
	//任务调度--调度管理--频率
	app.register.filter("freq",function(){
		return function(input){
			var out = "";
			switch (input){
				case "0":
					out="秒";
					break;
				case "1":
					out="分";
					break;
				case "2":
					out="时";
					break;
				case "3":
					out="天";
					break;
				case "4":
					out="周";
					break;
				case "5":
					out="月";
					break;
				default:
					out="无";
					break;
			}
			return out;
		}
	});
	// /任务调度--调度管理--状态
	app.register.filter("executeState",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="启动";
					break;
				case "2":
					out="停止";
					break;
			}
			return out;
		}
	});

	//日志监控完成情况
	app.register.filter("overStatus",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="执行完成";
					break;
				case "2":
					out="未完成";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});
	//日志监控任务状态
	app.register.filter("status",function(){
		return function(input){
			var out = "";
			switch (input){
				case "1":
					out="启用";
					break;
				case "2":
					out="停用";
					break;
				default:
					out="异常";
					break;
			}
			return out;
		}
	});
	app.register.filter("pkFilter",function () {
		return function(input){
			var out = "";
			switch (input){
				case "0":
					out="否";
					break;
				case "1":
					out="是";
					break;
				default:
					out="无";
					break;
			}
			return out;
		}
	});
	app.register.filter("deployStatusFilter",function () {
		return function(input){
			var out = "";
			//0未部署，1部署成功 ，10部署失败，2启动失败，3已启动，4停止失败，5已停止,6卸载失败，7卸载成功
			switch (input){
				case "0":
					out="未部署";
					break;
				case "1":
					out="部署成功";
					break;
				case "2":
					out="启动失败";
					break;
				case "3":
					out="已启动";
					break;
				case "4":
					out="停止失败";
					break;
				case "5":
					out="已停止";
					break;
				case "6":
					out="卸载失败";
					break;
				case "7":
					out="卸载成功";
				case "8":
					out="部署中";
					break;
				case "9":
					out="启动中";
					break;
				case "10":
					out="部署失败";
					break;
				default:
					out="无";
					break;
			}
			return out;
		}
	})

	// /资源管理审批中心--资源申请类型
	app.register.filter("authLevelState",function(){
		return function(input){
			var out = "";
			switch (input){
				case "0":
					out="临时生效";
					break;
				case "1":
					out="永久生效";
					break;
			}
			return out;
		}
	});
	// /资源管理审批中心--审批状态
	app.register.filter("authStatusState",function(){
		return function(input){
			var out = "";
			switch (input){
				case "0":
					out="审批中";
					break;
				case "1":
					out="审批通过";
					break;
				case "2":
					out="审批驳回";
					break;
				case "3":
					out="撤回";
					break;
			}
			return out;
		}
	});
});
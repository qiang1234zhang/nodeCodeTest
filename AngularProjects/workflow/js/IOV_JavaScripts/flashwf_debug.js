requirejs.config({
    baseUrl: "js",
    urlArgs: 'v=v4',
    map: {
        '*': {
            'css': 'Tool_JavaScripts/css'
        }
    },
    shim: {
        "bootstrap": {"deps": ["jquery"]},
        "scroll": {"deps": ["jquery"]},
        "ztree": {"deps": ["jquery"]}
    },
    paths: {
        "bootstrap": "Tool_JavaScripts/bootstrap",
        "ztree": "Tool_JavaScripts/ztree",
        "json2": "Tool_JavaScripts/json2",
        "jquery": "Tool_JavaScripts/jquery",
        "avalon": "Tool_JavaScripts/avalon2",
        "avalon_filter": "Tool_JavaScripts/avalon_filter",
        "etpl": "Tool_JavaScripts/etpl",
        "base": "Tool_JavaScripts/base",
        "underscore": "Tool_JavaScripts/underscore",
        "scroll": "Tool_JavaScripts/nicescroll",
        "noty": "Tool_JavaScripts/noty",
        "dialog-plus": "Tool_JavaScripts/artDialog",
        "dialog-plus-css": "../css/ui-dialog",
        "bootstrap-dialog": "Tool_JavaScripts/bootstrap-dialog",

        "leador": "IOV_JavaScripts/iov",
        "nodeutil": "IOV_JavaScripts/nodeutil",
        "MOMO": "IOV_JavaScripts/MOMO",
        "workflow": "IOV_JavaScripts/workflow",
        "EventEmitter": "Tool_JavaScripts/EventEmitter",
        "component": "Tool_JavaScripts/component",
        "wfdata": "IOV_JavaScripts/dataproxy",
        "jsonFieldMapping": "IOV_JavaScripts/jsonFieldMapping",
        "iovValidate": "IOV_JavaScripts/iov-validate"
    }
});
define(['jquery', 'avalon', 'underscore', 'dialog-plus', "nodeutil", "base","wfdata","ztree"], function ($, avalon, _, dialogPlus, nodeUtil, base,wfdata) {


    window.loadSwf();//加载流程swf
    window.nodeUtil = nodeUtil;//暴露出nodeUtil api

    var workflowCode = base.getURLParameter("workflowCode");//接受页面过来的流程参数workflowCode
    var readOnly = base.getURLParameter("readOnly") || false;//接受页面过来的流程参数readOnly
    var workflowId = base.getURLParameter("workflowId");//接受页面过来的流程参数id
    var status=  base.getURLParameter("status")||0;    //接受页面过来的流程部署状态。
    window.itemManageId=base.getURLParameter("itemManageId"); //接受页面过来的指标项id。

    console.log("流程设计器-流程ID:" + workflowId)

    var path = window.restPath + contextPath;

    var treeUrl = path + "/workflowManagerRestServer/getWfPluginNodeList";
    var saveflowUrl = path + "/workflow/saveWorkflow";
    var runflowUrl = path + "/workflowManagerRestServer/startWorkFlow";
    var deployflowUrl = path + "/workflowManagerRestServer/deploy";
    var getWfInfoUrl = path + "/workflow/getWorkflow?id=" + workflowId;
    var requestLogHisUrl = path + "/workflowRunLogRestServer/byPage";
    var requestLogPlugInUrl = path + "/pluginRunLogRestServer/byPage";
    var requestLogDetailUrl = path + "/workflowRunLogDetailRestServer/byCondition";

    var dCount = 0;//记录
    var flashapi = {
        flashNodeList: null,
        flashLineList: null,
        /**
         * 给flash容器调用的js方法
         * @param type
         * @param data
         * @returns {null}
         */
        callbackForFlash: function (type, data) {

            if (type === "openEditNode") {

                //编辑节点操作
                var sourceData = _.findWhere(nodeUtil.nodes, {code: data.code});
                var keys1 = _.keys(sourceData);
                _.each(keys1, function (value5) {
                    if (!_.has(data, value5)) {
                        data[value5] = sourceData[value5];
                    }
                })
                //data.url = sourceData.url;
                //增量计数器

                var a=this;
                var haNoHtmlCode=data.code=="db_increment_counter"||data.code=="parallelGatewayStart"||data.code=="parallelGatewayEnd"||data.code=="file_increment_readRecord";  //没有html页面的节点
                //判断与指标项数据源信息是否匹配，不符合则不允许打开
                if(sourceData.itemSourceTypeId||sourceData.itemTargetTypeId){
                    var itemSourceTypeId=sourceData.itemSourceTypeId?sourceData.itemSourceTypeId:"";
                    var itemTargetTypeId=sourceData.itemTargetTypeId?sourceData.itemTargetTypeId:"";
                    wfdata.dataProxy.getDataSourceByItemManageId_(2).done(function (dataObj) {
                        var obj = JSON.parse(dataObj.content);

                        if(itemSourceTypeId){
                            if(itemSourceTypeId.indexOf(obj.sourceDsTypeId)==-1){
                                noty({
                                    layout: "center",
                                    timeout: 8000,
                                    type: "warning",
                                    text: "指标项源数据源类型为："+obj.sourceDsTypeName+",请选择相匹配的插件。"
                                });
                                return;
                            }
                        }
                        if(itemTargetTypeId){
                            if(itemTargetTypeId.indexOf(obj.targetDsTypeId)==-1){
                                noty({
                                    layout: "center",
                                    timeout: 8000,
                                    type: "warning",
                                    text: "指标项目标数据源类型为："+obj.targetDsTypeName+",请选择相匹配的插件。"
                                });
                                return;
                            }
                        }

                        if(haNoHtmlCode){

                        }else{
                            //子流程
                            if(data.code=="subflow"){
                                a.openHtml("wfconfig.html", "编辑节点", data, sourceData.width=500,sourceData.height=400);
                            }else{
                                a.openHtml("wfconfig.html", "编辑节点", data, (sourceData.width ? sourceData.width : 800));
                            }
                        }
                    })

                }else {
                    if(haNoHtmlCode){

                    }else {
                        //子流程
                        if (data.code == "subflow") {
                            a.openHtml("wfconfig.html", "编辑节点", data, sourceData.width = 500, sourceData.height = 400);
                        } else {
                            a.openHtml("wfconfig.html", "编辑节点", data, (sourceData.width ? sourceData.width : 800));
                        }
                    }
                }



            } else if (type === "openEditLineForm") {

                //编辑线段节点操作
                data.url = "gateway.html";
                this.openHtml("wfconfig.html", "设置网关条件", data, 400, 100);

            } else if (type == "fromflashcall_flashdone") {

                initLeftTree();

            } else if (type == "fromflash_gettingwfxml") {

                //flash端获取流程xml数据
                return {
                    flashNodeList: this.flashNodeList,
                    flashLineList: this.flashLineList
                };

            } else if (type == "fromflashcall_delenode") {

                //删除节点

                _.each(data.split(","), function (value) {
                    nodeUtil.allNodeInfo[value] = null;
                    delete nodeUtil.allNodeInfo[value];
                });

            }
            return null;
        },
        /**
         * 调用flash暴露出来的api
         * @param type 调用类型
         * @param data
         * @returns {*}
         */
        callFlashMethod: function (type, data) {
            return document.getElementById("workflow").callbackForJavaScript(type, data);
        },
        'config': _.create(null),
        /**
         * 打开html页面
         * @param htmlpath 路径
         * @param title 标题
         * @param param 传递的参数,必须为object形式 {}
         * @param width 宽度
         * @param height 高度
         */
        openHtml: function (htmlpath, title, param, width, height) {
            dCount++;
            var dgId = "dialog_" + dCount;

            var dialogConfig = {
                id: dgId,
                "title": title,
                "align": "bottom",
                "url": htmlpath,
                "width": width ? width : 600,
                "height": 500,
                okValue: "确定",
                ok: function () {
                    if (param.url.indexOf("gateway") >= 0) {
                        $("[name=\"" + dgId + "\"]")[0].contentWindow.saveLine();
                    } else {
                        $("[name=\"" + dgId + "\"]")[0].contentWindow.saveNode();
                    }
                    return false;
                },
                cancelValue: "关闭",
                cancel: function () {
                    this.close().remove();
                },
                button: [
                    /*{
                        value: "帮助",
                        callback: function () {
                            return false;
                        }
                    }*/
                ]
            };
            this.config.popupParam = (param == null ? {dialogId: dgId} : _.extend(param, {dialogId: dgId}));
            height && (dialogConfig.height = height);
            var dialog = dialogPlus(dialogConfig);
            dialog.showModal();
        },
        /*refreshIframeHeight: function (h) {
         dialogPlus.get(this.config.popupParam.dialogId).height(h);
         },*/
        closePopup: function () {
            dialogPlus.get(this.config.popupParam.dialogId).close().remove();
        }
    };

    //暴露出来flash操作api
    window.flashapi = flashapi;

    /**
     * 保存工作流
     */
    function saveWf(callback) {
        var nodeArr = flashapi.callFlashMethod("fromjscall_get_nodearr", null);
        var lineArr = flashapi.callFlashMethod("fromjscall_get_linearr", null);
        var a=nodeUtil.verifyRule(nodeArr,lineArr);
        if(a!==true){
            noty({text:a, type: 'error', timeout: true, timeout: 3000});
            return;
        }
        var xml = nodeUtil.getXml("wf_" + workflowId, nodeArr, lineArr);
        //console.log(xml);
        var allnodejsons = nodeUtil.getAllNodesJson();
        //console.log(allnodejsons);

        var saveJson = {
            id: workflowId,
            showXml: xml,
            workflowParam: allnodejsons
        };
        console.log(JSON.stringify(saveJson));
        base.doPostData(saveflowUrl, JSON.stringify(saveJson)).done(function () {
            if(callback){
                callback();
            }else {
                noty({text: '流程保存成功', type: 'success', timeout: true});
            }

        }).fail(function () {
            noty({text: '流程保存失败', type: 'error', timeout: true});
        })
    }

    /**
     * 运行工作流
     */
    function runWf() {
        if(status==0){
            noty({text: "请先部署流程！", type: 'error', timeout: 2000});
            return;
        }
        saveWf(function(){
            base.doGetData(runflowUrl, {id: workflowId}).done(function (data) {

                if (data.status == "success") {
                    noty({text: data.message, type: 'success', timeout: 2000});
                } else {
                    noty({text: data.message, type: 'error', timeout: 2000});
                }

                setTimeout(function(){
                    requestLogHis();
                    if($("#pluglog").html()!="隐藏日志"){
                        $("#pluglog").click();
                    }

                },2000)

            }).fail(base.deferredFail);
        });

    }

    /**
     * 部署工作流
     */
    function initWf() {

        saveWf(function(){
            base.doGetData(deployflowUrl, {ids: workflowId}).done(function (data) {

                if (data.status == "success") {
                    status=1;
                    noty({text: data.message, type: 'success', timeout: 2000});
                } else {
                    noty({text: data.message, type: 'error', timeout: 2000});
                }
            }).fail(base.deferredFail);
        });
        

    }


    /**
     * 获取流程信息根据流程id
     */
    function getWfInfoById() {
        base.doGetData(getWfInfoUrl).done(function (data) {
            parseWfInfo(data);
        });
    }

    function JsonParse(jsonStr) {
        if (!jsonStr) {
            throw new Error("无流程信息");
            return null;
        }
        if (!_.isString(jsonStr)) {
            return jsonStr;
        }
        try {
            var jsonObj = JSON.parse(jsonStr);
            return jsonObj;
        } catch (err) {
            throw new Error("流程信息json解析错误" + jsonStr);
            return null;
        }
    }

    /**
     * 根据后端返回的流程信息进行解析
     *
     */
    function parseWfInfo(wfInfo) {

        var json = JsonParse(wfInfo.content);
        if (!json || !json.showXml || !json.workflowParam) {
            throw new Error("parseWfInfo流程信息格式错误1,无showXml或者workflowParam");
            return;
        }

        var nodeXml = JsonParse(json.showXml);
        var nodeInfo = JsonParse(json.workflowParam);

        if (!nodeXml || !nodeInfo || !nodeXml.process) {
            throw new Error("parseWfInfo流程信息格式错误2" + nodeXml);
            return;
        }

        //初始化子流程多实例循环配置
        if(nodeXml.process && nodeXml.process.subProcess && nodeXml.process.subProcess.multiInstanceLoopCharacteristics){
            var a=nodeXml.process.subProcess.multiInstanceLoopCharacteristics;
            this.nodeUtil.subFlowItems.isMultiton=true;
            this.nodeUtil.subFlowItems.inValue=a["@activiti:collection"];
            this.nodeUtil.subFlowItems.outValue=a["@activiti:elementVariable"];
            this.nodeUtil.subFlowItems.orderDo=a["@isSequential"];
        }

        var allNodeInfo = nodeUtil.allNodeInfo;//所有节点信息

        var idArr = [],//所有id数组
            pluginKeyPluginCode = nodeInfo.pluginKeyPluginCode,
            pluginSetValue = nodeInfo.pluginSetValue;

        _.each(pluginKeyPluginCode, function (value, key) {

            allNodeInfo[key] = _.create(null);
            allNodeInfo[key].code = value;
            allNodeInfo[key].jsonInfo = (pluginSetValue[key] ? pluginSetValue[key] : _.create(null));

        });

        var flashNodeList = [];//所有节点数组
        var lineList = [];//所有线段数组

        generateFlash(nodeXml.process, lineList, flashNodeList, idArr, allNodeInfo, pluginKeyPluginCode, "");

        if (idArr.length > 0) {
            nodeUtil.maxIndex = _.max(idArr);
        }
        idArr.length = 0;
        idArr = null;

        var flashLineList = [],
            _lineTmp2 = null;

        _.each(lineList, function (value) {
            _lineTmp2 = _.create(null);
            _lineTmp2.sid = value["@sourceRef"];
            _lineTmp2.eid = value["@targetRef"];
            _lineTmp2.linetype = value["@linetype"];
            if (value.conditionExpression) {
                //如果此线段含有conditionExpression
                _lineTmp2.lineCondition = value.conditionExpression["#text"];
                nodeUtil.allLineList[value["@id"]] = _.create(null);
                nodeUtil.allLineList[value["@id"]].conditionExpression = _lineTmp2.lineCondition;
            }
            flashLineList.push(_lineTmp2);
            _lineTmp2 = null;
        });

        flashapi.flashNodeList = flashNodeList;
        flashapi.flashLineList = flashLineList;
        flashapi.callFlashMethod("fromjscall_cangetwfinfo", null);//通知flash容器可以获取流程节点信息来反向绘制了
    }


    /**
     *
     * @param process 流程节点object
     * @param lineList 所有的线段集合
     * @param flashNodeList 所有的节点集合
     * @param idArr 所有节点的id索引值集合
     * @param allNodeInfo 所有节点的节点信息object
     * @param pluginKeyPluginCode id:code对照表
     * @param parentId 父节点
     */
    function generateFlash(process, lineList, flashNodeList, idArr, allNodeInfo, pluginKeyPluginCode, parentId) {
        var seNodeInfo = null;
        //是否有开始节点
        if (process.startEvent) {

            seNodeInfo = _.create(null);
            seNodeInfo.code = "startEvent";
            seNodeInfo.jsonInfo = _.create(null);
            allNodeInfo[process.startEvent["@id"]] = seNodeInfo;

        }
        seNodeInfo = null;

        //是否有结束节点
        if (process.endEvent) {

            seNodeInfo = _.create(null);
            seNodeInfo.code = "endEvent";
            seNodeInfo.jsonInfo = _.create(null);
            allNodeInfo[process.endEvent["@id"]] = seNodeInfo;

        }

        var code,
            point,
            className1,
            url,
            tmpIns1;

        _.each(process, function (value, key) {
            if (_.isString(value)) {
                return false;
            }
            if (key === "sequenceFlow") {
                //如果为线段节点
                pushLine(lineList, value);
                return false;
            }
            if (key === "subProcess") {
                //如果为子流程
                if (_.isArray(value)) {
                    _.each(value, function (value2) {
                        idArr.push(value2["@id"].substr(5));
                        code = pluginKeyPluginCode[value2["@id"]];
                        tmpIns1 = _.findWhere(nodeUtil.nodes, {code: code});
                        if (!tmpIns1) {
                            throw new Error("generateFlash方法运行错误，根据code为" + code + "查找对应的插件配置信息未找到" + value2);
                        }
                        className1 = (tmpIns1.className ? tmpIns1.className : "");
                        url = tmpIns1.imageName ? tmpIns1.imageName : "";
                        point = value2["@point"].split(",");
                        createNode1(flashNodeList, code, point, className1, value2, value2["@wh"], parentId, url);
                        generateFlash(value2, lineList, flashNodeList, idArr, allNodeInfo, pluginKeyPluginCode, value2["@id"]);
                    })
                } else {
                    idArr.push(value["@id"].substr(5));
                    code = pluginKeyPluginCode[value["@id"]];
                    tmpIns1 = _.findWhere(nodeUtil.nodes, {code: code});
                    if (!tmpIns1) {
                        throw new Error("generateFlash方法运行错误，根据code为" + code + "查找对应的插件配置信息未找到" + value);
                    }
                    className1 = (tmpIns1.className ? tmpIns1.className : "");
                    url = tmpIns1.imageName ? tmpIns1.imageName : "";
                    point = value["@point"].split(",");
                    createNode1(flashNodeList, code, point, className1, value, value["@wh"], parentId, url);
                    generateFlash(value, lineList, flashNodeList, idArr, allNodeInfo, pluginKeyPluginCode, value["@id"]);
                }

                return false;

            }

            if (_.isArray(value)) {

                _.each(value, function (value1) {

                    if (pluginKeyPluginCode[value1["@id"]]) {

                        idArr.push(value1["@id"].substr(5));
                        code = pluginKeyPluginCode[value1["@id"]];
                        tmpIns1 = _.findWhere(nodeUtil.nodes, {code: code});
                        if (!tmpIns1) {
                            throw new Error("generateFlash方法运行错误，根据code为" + code + "查找对应的插件配置信息未找到" + value1);
                        }
                        className1 = (tmpIns1.className ? tmpIns1.className : "");
                        url = tmpIns1.imageName ? tmpIns1.imageName : "";
                        point = value1["@point"].split(",");
                        createNode1(flashNodeList, code, point, className1, value1, value["@wh"], parentId, url);

                    }

                })

            } else {

                if (pluginKeyPluginCode[value["@id"]]) {

                    idArr.push(value["@id"].substr(5));
                    code = pluginKeyPluginCode[value["@id"]];
                    tmpIns1 = _.findWhere(nodeUtil.nodes, {code: code});
                    if (!tmpIns1) {
                        throw new Error("generateFlash方法运行错误，根据code为" + code + "查找对应的插件配置信息未找到" + value);
                    }
                    className1 = (tmpIns1.className ? tmpIns1.className : "");
                    url = tmpIns1.imageName ? tmpIns1.imageName : "";
                    point = value["@point"].split(",");
                    createNode1(flashNodeList, code, point, className1, value, value["@wh"], parentId, url);

                }

            }//end if-else

        });//end _.each
    }

    function pushLine(lineList, lines) {
        if (_.isArray(lines)) {
            _.each(lines, function (value) {
                lineList.push(value);
            })
        } else {
            lineList.push(lines);
        }
    }

    /**
     *
     * @param flashNodes 所有的流程节点
     * @param code 节点类型
     * @param point 节点坐标值
     * @param className class类名称
     * @param value
     * @param wh 节点宽高
     * @param parentId 父节点(子流程用)
     */
    function createNode1(flashNodeList, code, point, className, value, wh, parentId, url) {

        var _nodeInfo = {
            lable: value["@name"],
            id: value["@id"],
            className: className,
            code: code,
            x: point[0],
            y: point[1],
            addType: "auto",
            parentId: (parentId ? parentId : ""),
            iconurl: url ? url : "system_setting",
            wh: wh ? wh : "37,37"
        };
        if (value["@default"]) {
            _nodeInfo.defaultGateway = value["@default"];
        }
        flashNodeList.push(_nodeInfo);
    }


    /**
     * 在流程上添加节点
     * @param text 流程节点名称
     * @param id 流程节点id
     * @param code 流程节点代码
     * @param x
     * @param y
     */
    function addNode(text, id, code, x, y, className, wh, url) {

        flashapi.callFlashMethod("fromjscall_add_node", {
            lable: text,
            id: id,
            code: code,
            className: className ? className : "",
            x: x,
            y: y,
            addType: "drag",
            iconurl: url ? url : "system_setting",
            wh: wh ? wh : "37,37"
        });
        var nodeInfo = _.create(null);
        nodeInfo.code = code;
        //nodeInfo.jsonInfo = null;
        nodeInfo.jsonInfo = _.create(null);
        nodeUtil.allNodeInfo[id] = nodeInfo;
        nodeInfo = null;
    }

    function initLeftTree() {
        $.ajax({
            type: "GET",
            url: treeUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            cache: false
        }).done(function (data) {
            if (data.content) {
                var nodeArr1 = [],
                    nodeArr2 = [],
                    need_expandNode = 'baseNode,inPutNode,outPutNode,tansNode,subflow',  //需要展开的插件类型节点
                    i = 0,
                    pid,
                    nodeObj;

                var data1 = JSON.parse(data.content);
                var parentData = data1.baseNode.concat(data1.listPlugin);
                var url_prefix = "assets/icon/";

                _.each(parentData, function (value, key) {
                    i++;
                    nodeObj = _.create(null);
                    nodeObj.id = i;
                    nodeObj.pId = 0;
                    nodeObj.name = value.type;
                    nodeObj.code = value.code;
                    nodeObj.icon = url_prefix + value.treeImageName;
                    nodeObj.title = value.type;
                    nodeArr1.push(nodeObj);


                    if (_.isArray(value.plugin)) {
                        pid = i;
                        _.each(value.plugin, function (value1, key1) {
                            i++;
                            nodeObj = _.create(null);
                            nodeObj.id = i;
                            nodeObj.pId = pid;
                            nodeObj.code = value1.code;
                            nodeObj.name = value1.name;
                            nodeObj.url = value1.url;
                            nodeObj.className = value1.className;
                            nodeObj.icon = url_prefix + value1.treeImageName;
                            nodeObj.title = value1.description;
                            nodeObj.imageName = value1.imageName;
                            nodeObj.wh = value1.wh;
                            if (value1.extendParameter) {
                                _.each(value1.extendParameter.split(","), function (value2) {
                                    nodeObj[value2.split("=")[0]] = value2.split("=")[1];
                                })
                            }
                            nodeArr2.push(nodeObj);
                            nodeArr1.push(nodeObj);
                        })
                    }
                });
                nodeUtil.nodes = nodeArr2;
                getWfInfoById();//开始查询流程信息

                var setting = {
                    callback: {
                        beforeDrag: function (treeId, treeNodes) {

                            if (treeNodes[0].children) {  //如何是父节点,禁止拖拽.
                                return false;
                            }

                            if (treeNodes[0].code) {
                                return true;
                            }
                            return false;
                        },
                        beforeDrop: function (treeId, treeNodes) {

                        },
                        onDrop: function (event, treeId, treeNodes) {

                            var drpNode = treeNodes[0],
                                ox,
                                oy;
                            if (!drpNode) {
                                return;
                            }
                            if (event.clientX) {
                                ox = event.offsetX;
                                oy = event.offsetY;
                            } else {
                                ox = event.x;
                                oy = event.y;
                            }
                            addNode(drpNode.name, nodeUtil.getNodeId(drpNode.code), drpNode.code, ox, oy, drpNode.className, drpNode.wh, drpNode.imageName);
                        }
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            rootPId: 0
                        }
                    },
                    edit: {
                        enable: true,
                        showRemoveBtn: false,
                        showRenameBtn: false,
                        drag: {
                            isMove: false,
                            prev: false,
                            next: false,
                            inner: false
                        }
                    },
                    view: {
                        showTitle: true,
                        fontCss: function (treeId, treeNode) {
                            if (treeNode.level == 0) {
                                return {"font-weight": "bold", color: "#00598A"}
                            } else {
                                return {
                                    color: "#3E5378"
                                }
                            }
                        }
                    }
                };
                //end each
                console.log(nodeArr1);
                var tree = $.fn.zTree.init($("#leftTree"), setting, nodeArr1);

                var nodes = tree.getNodes();
                _.each(tree.getNodes(), function (obj) {
                    if (need_expandNode.indexOf(obj.code) != -1) {
                        tree.expandNode(obj, true);
                    }
                });


            }
        })//end done
    };


    //初始化
    $(function () {
        //流程保存事件
        $("#saveBtn").on("click", function (e) {
            saveWf();
        });
        //流程运行事件
        $("#runBtn").on("click", function (e) {
            runWf();
        });
        //流程部署事件
        $("#initBtn").on("click", function (e) {
            initWf();
        });


        //树显隐控制
        var width = $("#leftTree").width();
        var workflowWidth=document.body.scrollWidth;
        var workflowHeigh=document.body.scrollHeight;

        //动态计算工具栏left属性,该属性必须大于树的必要宽度。
        $(".manageGroup").css("left",document.body.scrollWidth/2-200>210?document.body.scrollWidth/2-200:210);

        $("#consoleID").on("click", function (e) {
            $("#pluglog").html("显示日志");
            $("#consoleDiv").hide();
            $("#consoleMinDiv").show();
        });

        //日志栏大小控制按钮
        var smartCounter=0;
        $("#updown").on("click", function (e) {
            if(smartCounter%2==0){
                $(".consoleScope").css("height","280px");

                $("#logDetail").animate({height:document.body.scrollHeight-80-50}, "slow");
                $(".consoleScope").animate({height:document.body.scrollHeight-80}, "slow");
            }else{
                $("#logDetail").animate({height:280-50}, "slow");
                $(".consoleScope").animate({height:280}, "slow");
            }
            smartCounter++;
        });

        //日志显隐控制
        $("#pluglog").on("click", function (e) {
            var aa = $(this).html();
            if (aa == "显示日志") {

                if($("#plugtree").html()=="显示树"){
                    $(".consoleScope").css("left","10px");
                }else{
                    $(".consoleScope").css("left","210px");
                }
                $("#consoleDiv").slideDown("slow", "linear");
                $(this).html("隐藏日志");

            } else {
                //$("#consoleDiv").hide();
                $("#consoleDiv").slideUp("slow", "linear");
                $(this).html("显示日志");

            }
        });

        $("#plugtree").on("click", function (e) {
            var aa = $(this).html();
            if (aa == "显示树") {
                $("#leftTree").show();

                if($("#pluglog").html()=="隐藏日志"){
                    //$(".consoleScope").css("left","210px");
                    $(".consoleScope").animate({left: 210}, "slow");
                }
                $("#leftTree").animate({width: width}, "slow");
                $(this).html("隐藏树");
            } else {
                if($("#pluglog").html()=="隐藏日志"){
                    $(".consoleScope").animate({left: 10}, "slow");
                }
                $("#leftTree").animate({width: '0px'}, "slow", function () {
                    $("#leftTree").hide();
                });
                $(this).html("显示树");
            }
        });
        //全屏控制
        $("#fullScreen").on("click", function (e) {
            var aa = $(this).html();
            if (aa == "全屏") {
                parent.fullScreen();
            } else {
                //$("#consoleDiv").hide();
                $("#consoleDiv").slideUp("slow", "linear");
                $(this).html("显示日志");


            }
        });
        //返回主页
        $("#returnBtn").on("click", function (e) {

            var aa = $(this).html();
            if (aa == "返回主页") {
                parent.returnParent();
            } else {

            }
        });

    });//end

    /**
     * 日志业务处理
     * Start
     * --------------------------------------------------------------------------
     */

    var _runcode = "";
    var _status = "";

    // 标签切换
    var tag = {
        init: function (ctrlDivs, Targets, cb) {

            ctrlDivs.click(function () {
                var $index = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                Targets.eq($index).show().siblings().hide();
            });
        }
    };
    tag.init($("#tags").find("li"), $("#tags-content").find("div"));


    //绑定日志信息
    var vm_run = avalon.define({
        $id: 'avalon-flow-log',
        logDetail: '暂时无运行日志。',
        readOnly: readOnly,
        tableData_plugIn: [],
        tableData_his: [],
        clickThisTr: function ($event, runcode, status) {
            _clickThisTr($event, runcode, status);
        },
        clickRefresh: function () {
            requestLogHis();
        }
    });

    //流程日志tr点击click事件
    function _clickThisTr($event, runcode, status) {


        $(".tager>tr").removeClass("clickTr");
        $event.currentTarget.className = "clickTr";
        logHisRelationManage(runcode, status);
    }


    //获取流程日志信息
    function requestLogHis() {
        //默认流程日志

        $("#tags-content").find("div").eq(2).show().siblings().hide();
        $("#tags").find("li").removeClass("active").eq(2).addClass("active");

        if (!workflowCode||workflowCode=="null") {
            workflowCode="wf_"+workflowId;
        }
        base.doPostData(requestLogHisUrl, JSON.stringify({
            "condition": {workflowCode: workflowCode},
            pageNumber: 1,
            pageSize: 5
        })).done(function (data) {

            if (data) {
                vm_run.tableData_his = data.rows;
                if (data.rows.length != 0) {
                    logHisRelationManage(data.rows[0].workflowRunCode, data.rows[0].status);
                    $(".tager>tr").eq(0).addClass("clickTr").siblings().removeClass("clickTr"); //默认选中第一行
                } else {
                    console.log("流程日志数据查询返回0条！");
                }
            } else {
                $.confirm({text: "历史日志数据查询失败！"});
            }
        }).fail(base.deferredFail);

    }

    //获取插件日志信息
    function requestLogPlugIn(runcode) {

        base.doPostData(requestLogPlugInUrl, JSON.stringify({
            condition: {workflowRunCode: runcode},
            pageNumber: 1,
            pageSize: 30
        })).done(function (data) {

            if (data) {
                var content = data;
                if (content != "") {
                    vm_run.tableData_plugIn = content.rows;
                }
            } else {
                $.confirm({text: "插件日志数据查询失败！"});
            }
        }).fail(base.deferredFail);

    }

    //根据运行code获取日志详情
    function requestLogDetail(runcode) {

        base.doPostData(requestLogDetailUrl, JSON.stringify({
            workflowRunCode: runcode,
            sortField: "start_time",
            sortType: "desc"
        })).done(function (data) {
            if (data) {
                var content = data.content;
                var logs = "";
                if (content) {
                    for (var ct in content) {
                        logs += content[ct].logContent + "\n";
                    }
                    vm_run.logDetail = logs;
                }
                document.getElementById("logDetail").scrollTop = document.getElementById("logDetail").scrollHeight;
            } else {
                $.confirm({text: "日志详情数据查询失败！"});
            }
        }).fail(base.deferredFail);
    }

    //流程日志点击处理
    function logHisRelationManage(runcode, status) {

        requestLogDetail(runcode);
        requestLogPlugIn(runcode);
        _runcode = runcode;
        _status = status;
    }

    //页面初始化
    requestLogHis();
    window.setInterval(timeTask(), 3000);
    function timeTask() {
        if (_status == 1) {
            logHisRelationManage(_runcode, _status);
        }
    }

    /**
     * avalon过滤器
     * @param str
     * @returns {*}
     */
    avalon.filters.conditionTrans_runState = function (str) {
        if (str == "1") {
            return "开始运行";
        } else if (str == "2") {
            return "运行结束";
        } else {
            return "异常结束";
        }
    }

    avalon.scan(document.getElementById("avalon-id"));
    /**
     * End
     * --------------------------------------------------------------------------
     */

});
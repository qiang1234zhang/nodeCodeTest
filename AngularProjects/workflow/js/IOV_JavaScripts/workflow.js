requirejs.config({
    baseUrl: "js",
    urlArgs: 'v=v5',
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
        "noty":"Tool_JavaScripts/noty",
        "dialog-plus": "Tool_JavaScripts/artDialog",
        "dialog-plus-css": "../css/ui-dialog",
        "bootstrap-dialog": "Tool_JavaScripts/bootstrap-dialog",

        "leador": "IOV_JavaScripts/iov",
        "nodeutil": "IOV_JavaScripts/nodeutil",
        "MOMO":"IOV_JavaScripts/MOMO",
        "workflow":"IOV_JavaScripts/workflow",
        "EventEmitter":"Tool_JavaScripts/EventEmitter",
        "component":"Tool_JavaScripts/component",
        "wfdata": "IOV_JavaScripts/dataproxy",
        "jsonFieldMapping": "IOV_JavaScripts/jsonFieldMapping",
        "iovValidate": "IOV_JavaScripts/iov-validate"


    }
});
define(['jquery', 'avalon', 'underscore', "etpl", "EventEmitter", "component", "wfdata", "jsonFieldMapping", "ztree", "iovValidate"],
    function ($, avalon, _, etpl, EventEmitter, component, wfdata, jsonFieldMapping) {
        $.validator.setDefaults({
            showErrors: function (map, list) {
                var focussed = document.activeElement;
                this.currentElements.removeClass("ui-state-highlight");
                $.each(list, function (index, error) {
                    $(error.element).addClass("ui-state-highlight");
                });
                if (focussed && $(focussed).is("input, textarea")) {

                } else {
                    if (list.length > 0) {
                        noty({
                            layout: "center",
                            timeout: 1000,
                            type: "warning",
                            text: list[0].message
                        });
                    }//end if
                }//end else
            }
        });


        var param = window.parent.flashapi.config.popupParam;
        wfdata.swapValue.currentNodeId = param.id;//设置当前窗口的nodeid值

        //var htmlPath = "http://localhost:8020/etlwf/etl-workflow/";

        window.htmlPath = "plugconf/"+ window.parent.contextPath+"/" ;
        window.fpath="/workflow";
        var htmlTmp = null;
        /**
         * 流程配置节点里的 ${component | componentFormat('DataSourceComponent')}类似组件就是在这里解析返回xml的，
         * 非常重要
         */
        etpl.addFilter("componentFormat", function (source, type) {
            return getComponentHtml.apply(null, Array.prototype.slice.call(arguments, 1));
        });

        /**
         * 流程配置页面的avalon声明对象,默认声明插件步骤名称，插件code,节点id,以及列集合
         * @type {{$id: string, pluginName: *, pluginCode: *, activitiNodeId: *, $fieldColumns: Array}}
         */
        var avaConfig = {
            $id: "avalonWf",
            pluginName: param.nodeLabel,
            pluginCode: param.code,
            activitiNodeId: param.id,
            $fieldColumns: []//保存到json的字段列集合,不是监控属性
        }, avaWf;

        var EE = new EventEmitter();
        wfdata.swapValue.EE = EE;
        $.ajax({
            url: htmlPath + param.url,
            type: "GET",
            dataType: "html",
            cache: false
        }).done(function (data) {
            //根据url,获取到流程html片段
            parsePlugHtml(data);
        });

        function parsePlugHtml(html) {
            htmlTmp = etpl.compile(html);
            $(".form-horizontal").append(htmlTmp({component: ""}));
        }


        /**
         * 实例化avalon对象，以及初始化反选值,
         * 此方法有插件配置页面调用
         */
        function initAvalon() {
            $("#form1").validate();
            window.avalonCustomizeConfigInit && window.avalonCustomizeConfigInit(avaConfig);
            avaWf = avalon.define(avaConfig);
            wfdata.swapValue.avaWf = avaWf;
            avalon.scan(document.getElementById("form1"));

            init$Watch();
            _.each(componentInsArrs, function (value) {
                value.vmDefineDoneCallback();
                value.getRestData();
            });
            window.vmCustomizeDefineDoneCallback && window.vmCustomizeDefineDoneCallback();
            window.preloadInit && window.preloadInit();//预加载数据
            $(".sk-rotating-plane").show();
            setTimeout(function () {
                if (_.has(avaConfig, "conditionExpression")) {
                    initLineFormValue();
                } else {
                    initFormValue();
                }
                $(".sk-rotating-plane").hide();
            }, 1000);
            //window.parent.flashapi.refreshIframeHeight($(document).height());
        }

        /**
         * 初始化页面并反选
         */
        function initFormValue() {
            var allNodeInfo = window.parent.nodeUtil.allNodeInfo;
            var formInfo = allNodeInfo[param.id];
            if (!formInfo) {
                //return;
            } else {
                formInfo = formInfo.jsonInfo;
            }
            if (formInfo && _.keys(formInfo).length > 0) {
                _.each(jsonFieldMapping.mappingField, function (value, key) {
                    if (_.has(avaConfig, value)) {
                        avaWf[value] = formInfo[key];
                    }
                });
            }

            var inVarList1 = [],
                outVar1 = null;
            _.each(allNodeInfo, function (value, key) {
                if (value && key !== param.id && value.jsonInfo) {
                    outVar1 = _.create(null);
                    outVar1.name = value.jsonInfo.outValue;
                    outVar1.checked = false;
                    outVar1.name && (inVarList1.push(outVar1));
                }
            });
            var index1 = -1;
            if(avaWf.inValue){
                _.each(avaWf.inValue.split(","), function (value) {
                    index1 = _.findIndex(inVarList1, {name: value});
                    if (index1 > -1) {
                        inVarList1[index1].checked = true
                    }
                });
            }
            avaWf.inVarLists = inVarList1;
            inVarList1 = null;

            window.CustomizeInitFormValue && window.CustomizeInitFormValue();

            $("#form1").on("click", function (e) {
                if (!(e.target.name === "inVarChks")) {
                    avaWf.isShowInVarSelect = false;
                }
            });
            allNodeInfo = null;
            formInfo = null;
        }

        /**
         * 初始化页面并反选
         */
        function initLineFormValue() {
            var allLineList = window.parent.nodeUtil.allLineList;
            var formInfo = allLineList[param.id];
            if (formInfo) {
                _.each(jsonFieldMapping.mappingField, function (value, key) {
                    if (_.has(avaConfig, value)) {
                        avaWf[value] = formInfo[key];
                    }
                });
            }

            window.CustomizeInitFormValue && window.CustomizeInitFormValue();
            formInfo = null;
            allLineList = null;
        }

        window.initAvalon = initAvalon;


        var $watchArr = [],
            componentInsArrs = [];

        /**
         * 根据不同的组件类型返回对应的组件实例
         * @returns {*}
         */
        function getComponentHtml() {
            var type = arguments[0];
            var comp,
                watchTmp1,
                compHtml = null;

            switch (type) {
                case "DataSourceComponent":
                    comp = new component.DataSourceComponent(avaConfig);
                    compHtml = comp.getHtml();
                    watchTmp1 = comp.getAvalonWatch();
                    watchTmp1 && ($watchArr = _.union($watchArr, watchTmp1));
                    componentInsArrs.push(comp);
                    break;
                case "EsDataSourceComponent":
                    comp = new component.EsDataSourceComponent(avaConfig);
                    compHtml = comp.getHtml();
                    watchTmp1 = comp.getAvalonWatch();
                    watchTmp1 && ($watchArr = _.union($watchArr, watchTmp1));
                    componentInsArrs.push(comp);
                    break;
                case "SqlInputComponent":
                    comp = new component.SqlInputComponent(avaConfig, arguments[1]);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "CommonTextInputComponent":
                    comp = new component.CommonTextInputComponent(arguments[1], avaConfig);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "SingleInVarComponent":
                    comp = new component.SingleInVarComponent(arguments[1], avaConfig);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "MultiInVarComponent":
                    comp = new component.MultiInVarComponent(null, avaConfig);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "FileSourceComponent":
                    comp = new component.FileSourceComponent(arguments[1]?arguments[1]:null, avaConfig);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "FileComponent":
                    comp = new component.FileComponent(arguments[1]?arguments[1]:null, avaConfig);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "FileSourceComponent_EX":
                    comp = new component.FileSourceComponent_EX(arguments[1]?arguments[1]:null, avaConfig);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "RuleSourceComponent":
                    comp = new component.RuleSourceComponent(null, avaConfig);
                    compHtml = comp.getHtml();
                    componentInsArrs.push(comp);
                    break;
                case "DataSourceComponent_ES":
                    comp = new component.DataSourceComponent_ES(avaConfig);
                    compHtml = comp.getHtml();
                    watchTmp1 = comp.getAvalonWatch();
                    watchTmp1 && ($watchArr = _.union($watchArr, watchTmp1));
                    componentInsArrs.push(comp);
                    break;

                default:
                    compHtml = "";
                    break;
            }
            return compHtml;
        }

        function init$Watch() {
            _.each($watchArr, function (value) {
                avaWf.$watch(value, function (newValue, oldValue, changeP) {
                    EE.emit(changeP + "Change", newValue, oldValue, changeP);
                });
            })
        }

        /**
         * 暴露保存节点json信息的方法
         */
        window.saveNode = function () {
            var vm = avaWf;
            if (!vm) {
                return;
            }

            //验证
            var formValidFlag = $("#form1").valid();
            if (!formValidFlag) {
                return;
            }
            if (window.customizeFormValid) {
                formValidFlag = window.customizeFormValid();
            }
            if (!formValidFlag) {
                return;
            }


            //在这里可以保存$fieldColumns赋值等一系列操作
            window.customizePrepareSave && window.customizePrepareSave();

            var nodeJson = _.create(null);
            nodeJson.activitiNodeId = param.id;
            _.each(jsonFieldMapping.getNodeSaveField(), function (value) {
                nodeJson[value] = vm[jsonFieldMapping.mappingField[value]];
            });
            nodeJson.columnList = vm.$fieldColumns;

            var allNodeInfo = window.parent.nodeUtil.allNodeInfo;
            allNodeInfo[param.id] = _.create(null);
            allNodeInfo[param.id]["code"] = param.code;
            allNodeInfo[param.id]["jsonInfo"] = nodeJson;

            window.parent.flashapi.callFlashMethod("fromjscall_update_nodename", {name: vm.pluginName, id: param.id});
            //如果插件配置页面有自定义保存，则执行
            if (window.customizeSave) {
                window.customizeSave(nodeJson);
            } else {

                console.log(JSON.stringify(nodeJson));
                allNodeInfo = null;
                vm = null;

                window.parent.flashapi.closePopup();
            }

        };

        window.saveLine = function () {
            var vm = avaWf;
            if (!vm) {
                return;
            }

            //验证
            var formValidFlag = true;
            if (window.customizeFormValid) {
                formValidFlag = window.customizeFormValid();
            }
            if (!formValidFlag) {
                return;
            }

            window.customizePrepareSave && window.customizePrepareSave();

            var _lineInfo = _.create(null);
            _lineInfo.conditionExpression = vm.conditionExpression;
            var allLineList = window.parent.nodeUtil.allLineList;
            allLineList[param.id] = _lineInfo;
            window.parent.flashapi.callFlashMethod("edit_linedata_event1", {
                id: param.id,
                nodeLabel: _lineInfo.conditionExpression
            });

            vm = null;
            window.parent.flashapi.closePopup();
        };
        /**
         * avalon过滤器
         * @param str
         * @returns {*}
         */
        avalon.filters.conditionTrans = function (str) {
            if (str === "greaterequal") {
                return "大于等于";
            } else if (str === "greater") {
                return "大于";
            } else if (str === "lessequal") {
                return "小于等于";
            } else if (str === "less") {
                return "小于";
            } else if (str === "term") {
                return "等于";
            } else if (str === "prefix") {
                return "%like";
            }else if (str === "like") {
                return "like";
            } else {
                return "等于";
            }
        }

    });
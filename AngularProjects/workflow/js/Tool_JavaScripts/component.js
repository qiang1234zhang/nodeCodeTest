!define(["underscore", "jquery", "etpl", "base", "wfdata", "dialog-plus"], function (_, $, etpl, base, wfdata, dialog) {

    var etplEngine = new etpl.Engine({
        variableOpen: "{{{",
        variableClose: "}}}"
    });

    function BaseComponent(avaConfig) {
        this.avaConfig = avaConfig;
        this.init();
    }

    _.extend(BaseComponent.prototype, {
        //初始化操作
        init: function () {
            this.bindEvent();
            this.initAvalonConfig();
        },
        getValue: function () {

        },
        setValue: function () {

        },
        get: function (key) {
            return this.config[key];
        },
        bindEvent: function () {

        },
        initAvalonConfig: function () {

        },
        getAvalonWatch: function () {

        },
        getRestData: function () {

        },
        getRestFile: function () {

        },
        getHtml: function () {
            return this.etplIns(this.config || null);
        },
        /**
         * vm定义完毕后的回调
         */
        vmDefineDoneCallback: function () {
            console.log("BaseComponent vmDefineDoneCallback execute");
        },
        destroy: function () {

        }
    });
    /**
     * 数据源组件
     * @constructor
     */
    var dsTemplate,
        tableSelectTemplate;

    function DataSourceComponent() {
        if (!dsTemplate) {
            dsTemplate = etplEngine.compile($("#template_DataSourceComponent").html());
        }
        if (!tableSelectTemplate) {
            tableSelectTemplate = etplEngine.compile($("#template_TreeComponent").html());
        }
        this.etplIns = dsTemplate;
        DataSourceComponent.superclass.constructor.apply(this, arguments);
    }

    _.extend(DataSourceComponent.prototype, {
        initAvalonConfig: function () {
            DataSourceComponent.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.showSqlBtn = false;
            this.avaConfig.dsTypeId = "";
            this.avaConfig.dsTypeLists = [];

            this.avaConfig.dsId = "";
            this.avaConfig.dsLists = [];
            this.avaConfig.selectClass = "col-sm-9";
            this.avaConfig.openTableSelect = function () {
                var d = dialog({
                    "title": "选择表",
                    "content": tableSelectTemplate(),
                    "width": 300,
                    okValue: "选择",
                    ok: function () {

                        var seleNodes = wfdata.swapValue.selectTableTree.tree.getCheckedNodes();
                        var ids = [];

                        _.each(seleNodes, function (value) {
                            ids.push(value.id);
                        });
                        if(ids.length==0){
                            noty({
                                layout: "center",
                                timeout: 3000,
                                type: "warning",
                                text: "请至少选择一张表!"
                            });
                            return false;
                        }
                        wfdata.dataProxy.getTableSql(ids.join(",")).done(function (data) {
                            wfdata.swapValue.avaWf.sql = data.content;
                        })
                    },
                    cancelValue: "关闭",
                    cancel: function () {

                    }
                });
                d.showModal();
                wfdata.swapValue.selectTableTree = new TreeComponent({
                    element: "#treeSelectTable"
                });
            }
        },
        getAvalonWatch: function () {
            return null;
        },
        vmDefineDoneCallback: function () {
            DataSourceComponent.superclass.vmDefineDoneCallback.apply(this, arguments);
            wfdata.swapValue.avaWf.$watch("dsTypeId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getDataSource(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.dsLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.dsLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.dsLists = [];
                }
            });
            wfdata.swapValue.avaWf.$watch("showSqlBtn", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.swapValue.avaWf.selectClass = "col-sm-7";
                } else {
                    wfdata.swapValue.avaWf.selectClass = "col-sm-9";
                }
            });
        },
        getRestData: function () {
            wfdata.dataProxy.getDataSourceType().done(function (data) {
                wfdata.swapValue.avaWf.dsTypeLists = JSON.parse(data.content);
            });
        },
        setValue: function () {

        }
    });


    /**
     * es数据源组件
     * @constructor
     */
    var esdsTemplate;

    function DataSourceComponent_ES() {
        if (!esdsTemplate) {
            esdsTemplate = etplEngine.compile($("#template_DataSourceComponent_ES").html());
        }
        this.etplIns = esdsTemplate;
        DataSourceComponent_ES.superclass.constructor.apply(this, arguments);
    }

    _.extend(DataSourceComponent_ES.prototype, {
        initAvalonConfig: function () {
            DataSourceComponent_ES.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.dsTypeId = "";
            this.avaConfig.dsTypeLists = [];

            this.avaConfig.dsId = "";
            this.avaConfig.dsLists = [];
        },
        getAvalonWatch: function () {
            return null;
        },
        vmDefineDoneCallback: function () {
            DataSourceComponent_ES.superclass.vmDefineDoneCallback.apply(this, arguments);
            wfdata.swapValue.avaWf.$watch("dsTypeId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getDataSource(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.dsLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.dsLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.dsLists = [];
                }
            });
        },
        getRestData: function () {
            wfdata.dataProxy.getESSourceType().done(function (data) {
                wfdata.swapValue.avaWf.dsTypeLists = JSON.parse(data.content);
            });
        },
        setValue: function () {

        }
    });

    /**
     * 文件系统数据源组件
     * @constructor
     */
    var fileTemplate1;

    function FileComponent(config, avaConfig) {
        if (!fileTemplate1) {
            fileTemplate1 = etplEngine.compile($("#template_FileComponent").html());
        }
        if(config){
            var c1 = config.split(",");
            config = _.create(null);
            _.each(c1, function (value) {
                config[value.split(":")[0]] = value.split(":")[1];
            });
            this.config = config;
        }
        this.avaConfig = avaConfig;
        this.etplIns = fileTemplate1;
        this.init();
    }

    _.extend(FileComponent.prototype, {
        initAvalonConfig: function () {
            FileComponent.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.fileTypeId = "";
            this.avaConfig.fileTypeLists = [];

            this.avaConfig.fileId = "";
            this.avaConfig.fileLists = [];

            this.avaConfig.filePath = "";
            this.avaConfig.filePathLists = [];
            this.avaConfig.isDir="";
        },
        getAvalonWatch: function () {
            return null;
        },
        vmDefineDoneCallback: function () {
            FileComponent.superclass.vmDefineDoneCallback.apply(this, arguments);
            wfdata.swapValue.avaWf.$watch("fileTypeId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getFileSource(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.fileLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.fileLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.fileLists = [];
                }
            });
            //读取本地文件插件  读取文件目录方法
            wfdata.swapValue.avaWf.$watch("fileId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getFileCatalogDir(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.filePathLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.filePathLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.filePathLists = [];
                }
            });

            //监控filePath选中值，动态付给isDir属性
            var vm=wfdata.swapValue.avaWf;
            vm.$watch("filePath", function (newValue) {
                for(var i in vm.filePathLists){
                    if(vm.filePathLists[i].name==newValue){
                        vm.isDir=vm.filePathLists[i].isDir;
                        break;
                    }

                }

            });
        },
        getRestData: function () {
            wfdata.dataProxy.getFileSourceType().done(function (data) {
                try {
                    wfdata.swapValue.avaWf.fileTypeLists = JSON.parse(data.content);
                }catch(err){
                    wfdata.swapValue.avaWf.fileTypeLists = [];
                }
            });
        },
        setValue: function () {

        }
    });


    /**
     * 文件系统数据源组件
     * @constructor
     */
    var fileTemplate;

    function FileSourceComponent(config, avaConfig) {
        if (!fileTemplate) {
            fileTemplate = etplEngine.compile($("#template_FileSourceComponent").html());
        }
        if(config){
            var c1 = config.split(",");
            config = _.create(null);
            _.each(c1, function (value) {
                config[value.split(":")[0]] = value.split(":")[1];
            });

            this.config = config;
        }

        this.avaConfig = avaConfig;
        this.etplIns = fileTemplate;
        this.init();
    }

    _.extend(FileSourceComponent.prototype, {
        initAvalonConfig: function () {
            FileSourceComponent.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.fileTypeId = "";
            this.avaConfig.fileTypeLists = [];

            this.avaConfig.fileId = "";
            this.avaConfig.fileLists = [];

            this.avaConfig.filePath = "";
            this.avaConfig.filePathLists = [];
            this.avaConfig.isDir="";
        },
        getAvalonWatch: function () {
            return null;
        },
        vmDefineDoneCallback: function () {
            FileSourceComponent.superclass.vmDefineDoneCallback.apply(this, arguments);
            wfdata.swapValue.avaWf.$watch("fileTypeId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getFileSource(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.fileLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.fileLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.fileLists = [];
                }
            });
            wfdata.swapValue.avaWf.$watch("fileId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getFileCatalog(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.filePathLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.filePathLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.filePathLists = [];
                }
            });

            //监控filePath选中值，动态付给isDir属性
            var vm=wfdata.swapValue.avaWf;
            vm.$watch("filePath", function (newValue) {
                for(var i in vm.filePathLists){
                    if(vm.filePathLists[i].name==newValue){
                        vm.isDir=vm.filePathLists[i].isDir;
                        break;
                    }

                }

            });
        },
        getRestData: function () {
            wfdata.dataProxy.getFileSourceType().done(function (data) {
                try {
                    wfdata.swapValue.avaWf.fileTypeLists = JSON.parse(data.content);
                }catch(err){
                    wfdata.swapValue.avaWf.fileTypeLists = [];
                }
            });
        },
        setValue: function () {

        }
    });

    /**
     *
     * @constructor
     */
    var fileTemplate_EX;

    function FileSourceComponent_EX(config, avaConfig) {
        if (!fileTemplate_EX) {
            fileTemplate_EX = etplEngine.compile($("#template_FileSourceComponent_EX").html());
        }
        if(config){
            var c1 = config.split(",");
            config = _.create(null);
            _.each(c1, function (value) {
                config[value.split(":")[0]] = value.split(":")[1];
            });
            this.config = config;
        }
        this.avaConfig = avaConfig;
        this.etplIns = fileTemplate_EX;
        this.init();
    }

    _.extend(FileSourceComponent_EX.prototype, {
        initAvalonConfig: function () {
            FileSourceComponent_EX.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.fileTypeId = "";
            this.avaConfig.fileTypeLists = [];

            this.avaConfig.fileId = "";
            this.avaConfig.fileLists = [];

            this.avaConfig.filePath = "";
            this.avaConfig.filePathLists = [];
            this.avaConfig.isDir="";
        },
        getAvalonWatch: function () {
            return null;
        },
        vmDefineDoneCallback: function () {
            FileSourceComponent_EX.superclass.vmDefineDoneCallback.apply(this, arguments);
            wfdata.swapValue.avaWf.$watch("fileTypeId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getFileSource(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.fileLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.fileLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.fileLists = [];
                }
            });
            wfdata.swapValue.avaWf.$watch("fileId", function (newValue, oldValue, changeP) {
                if (newValue) {
                    wfdata.dataProxy.getFileCatalogDir(newValue).done(function (data) {
                        if (data.content) {
                            wfdata.swapValue.avaWf.filePathLists = JSON.parse(data.content);
                        } else {
                            wfdata.swapValue.avaWf.filePathLists = [];
                        }
                    });
                } else {
                    wfdata.swapValue.avaWf.filePathLists = [];
                }
            });

            //监控filePath选中值，动态付给isDir属性
            var vm=wfdata.swapValue.avaWf;
            vm.$watch("filePath", function (newValue) {
                for(var i in vm.filePathLists){
                    if(vm.filePathLists[i].name==newValue){
                        vm.isDir=vm.filePathLists[i].isDir;
                        break;
                    }

                }

            });
        },
        getRestData: function () {
            wfdata.dataProxy.getFileSourceType().done(function (data) {
                try {
                    wfdata.swapValue.avaWf.fileTypeLists = JSON.parse(data.content);
                }catch(err){
                    wfdata.swapValue.avaWf.fileTypeLists = [];
                }
            });
        },
        setValue: function () {

        }
    });
    /**
     * 自定义规则
     */

    var ruleTemplate;

    function RuleSourceComponent(config, avaConfig) {
        if (!ruleTemplate) {
            ruleTemplate = etplEngine.compile($("#template_RuleSourceComponent").html());
        }
        this.avaConfig = avaConfig;
        this.etplIns = ruleTemplate;
        this.init();
    }

    _.extend(RuleSourceComponent.prototype, {
        initAvalonConfig: function () {
            RuleSourceComponent.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.rulesScriptId = "";
            this.avaConfig.rulesScriptLists = [];
        },
        getAvalonWatch: function () {
            return null;
        },
        vmDefineDoneCallback: function () {
            RuleSourceComponent.superclass.vmDefineDoneCallback.apply(this, arguments);
        },
        getRestData: function () {
            wfdata.dataProxy.getCustomRuleList().done(function (data) {
                try {
                    wfdata.swapValue.avaWf.rulesScriptLists = JSON.parse(data.content);
                }catch(err){
                    wfdata.swapValue.avaWf.rulesScriptLists = [];
                }
            });
        },
        setValue: function () {

        }
    });

    /**
     * sql输入组件
     * @constructor
     */
    var sqlInputAreaTemplate;

    function SqlInputComponent(avaConfig, config) {
        if (!sqlInputAreaTemplate) {
            sqlInputAreaTemplate = etplEngine.compile($("#template_SqlInputComponent").html());
        }
        this.etplIns = sqlInputAreaTemplate;

        var c1 = config.split(",");
        config = _.create(null);
        _.each(c1, function (value) {
            config[value.split(":")[0]] = value.split(":")[1];
        });
        this.config = config;

        SqlInputComponent.superclass.constructor.apply(this, arguments);
    }

    _.extend(SqlInputComponent.prototype, {
        initAvalonConfig: function () {
            this.avaConfig[this.config.mappingProp] = "";
        },
        vmDefineDoneCallback: function (vm, EE) {

        }
    });

    /**
     * 普通输入组件
     * @constructor
     */
    var commonTextInputTemplate;

    function CommonTextInputComponent(config, avaConfig) {
        if (!commonTextInputTemplate) {
            commonTextInputTemplate = etplEngine.compile($("#template_CommonTextInputComponent").html());
        }
        var c1 = config.split(",");
        config = _.create(null);
        _.each(c1, function (value) {
            config[value.split(":")[0]] = value.split(":")[1];
        });
        this.etplIns = commonTextInputTemplate;
        this.config = config;
        this.avaConfig = avaConfig;
        this.init();
    }

    _.extend(CommonTextInputComponent.prototype, {
        initAvalonConfig: function () {
            CommonTextInputComponent.superclass.initAvalonConfig.apply(this, arguments);
            !this.avaConfig[this.config.mappingProp] && (this.avaConfig[this.config.mappingProp] = "");
        }
    });


    var singleInVarTemplate;

    function SingleInVarComponent(config, avaConfig) {
        if (!singleInVarTemplate) {
            singleInVarTemplate = etplEngine.compile($("#template_SingleInVarComponent").html());
        }
        if (config) {
            var c1 = config.split(",");
            config = _.create(null);
            _.each(c1, function (value) {
                config[value.split(":")[0]] = value.split(":")[1];
            });
            this.config = config;
        } else {
            this.config = _.create(null);
        }

        this.etplIns = singleInVarTemplate;
        this.avaConfig = avaConfig;
        this.init();
    }

    _.extend(SingleInVarComponent.prototype, {
        initAvalonConfig: function () {
            SingleInVarComponent.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.inValue = "";
            this.avaConfig.inVarLists = [];
        }
    });


    var multiInVarTemplate;

    function MultiInVarComponent(config, avaConfig) {
        if (!multiInVarTemplate) {
            multiInVarTemplate = etplEngine.compile($("#template_MultiInVarComponent").html());
        }
        this.etplIns = multiInVarTemplate;
        this.avaConfig = avaConfig;
        this.init();
    }

    _.extend(MultiInVarComponent.prototype, {
        initAvalonConfig: function () {
            MultiInVarComponent.superclass.initAvalonConfig.apply(this, arguments);
            this.avaConfig.isShowInVarSelect = false;
            this.avaConfig.inValue = "";
            this.avaConfig.inVarLists = [];
            this.avaConfig.inVarInputClick = function () {
                wfdata.swapValue.avaWf.isShowInVarSelect = true;
            };
            this.avaConfig.inVarSelectClick = function () {
                var arr2 = [];
                $("#div_inVar123").find("input[name='inVarChks']").each(function () {
                    if ($(this).prop("checked")) {
                        arr2.push($(this).val());
                    }
                });
                wfdata.swapValue.avaWf.inValue = arr2.join(",");
            }
        }
    });


    /**
     * 弹出表选择组件
     * @constructor
     */
    var treeTemplate;

    function TreeComponent(config) {
        if (!treeTemplate) {
            treeTemplate = etplEngine.compile($("#template_TreeComponent").html());
        }
        this.etplIns = treeTemplate;
        this.config = config;
        this.init();
    }

    _.extend(TreeComponent.prototype, {
        init: function () {
            this.getRestData();
        },
        getRestData: function () {
            var $this = this;
            wfdata.dataProxy.getDataSourceTables(wfdata.swapValue.avaWf.dsId).done(function (data) {
                $this.tree = $.fn.zTree.init($($this.config.element), {
                    check: {
                        enable: true
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: null
                    }
                }, JSON.parse(data.content));
            })
        }
    });

    base.extend(DataSourceComponent, BaseComponent);
    base.extend(SqlInputComponent, BaseComponent);
    base.extend(CommonTextInputComponent, BaseComponent);
    base.extend(TreeComponent, BaseComponent);
    base.extend(SingleInVarComponent, BaseComponent);
    base.extend(MultiInVarComponent, BaseComponent);
    base.extend(FileSourceComponent, BaseComponent);
    base.extend(FileComponent, BaseComponent);
    base.extend(FileSourceComponent_EX, BaseComponent);
    base.extend(DataSourceComponent_ES, BaseComponent);
    base.extend(RuleSourceComponent, BaseComponent);


    var Tab = (function ($, _) {

        Tab.defaults = {
            element: ".nav-tabs",
            tabsContentSelector: ".tab-content",
            callback_tabChange: null
        };

        function Tab(config) {
            this.config = $.extend(true, {}, Tab.defaults, config);
            this.init();
        }

        _.extend(Tab.prototype, {
            constructor: Tab,
            init: function () {
                if (!this.config.tabsContentSelector) {
                    throw new Error("请设置tab切换内容容器的tabsContentSelector配置");
                }

                this.element = $(this.config.element);

                this.$tabsContentSelector = $(this.config.tabsContentSelector).children();
                this.navTabs = this.element.find("li");
                this.element.delegate("li", "click", _.bind(this._tabHandler, this));
            },
            _tabHandler: function (e) {
                //当loading时，阻止切换tab动作。
                if(!$(".sk-rotating-plane").is(":hidden")){
                    e.preventDefault();
                    return;
                };

                var $currTarLi = $(e.currentTarget);
                var currLiIndex = $currTarLi.index();

                this.navTabs.removeClass("active");
                $currTarLi.addClass("active");

                $(this.config.tabsContentSelector).find(".active").removeClass("active");
                this.$tabsContentSelector.eq(currLiIndex).addClass("active");

                var cb = this.config.callback_tabChange;
                if (cb) {
                    cb.call(this, $currTarLi, currLiIndex);
                }
                cb = null;
            },
        });

        return Tab;

    })($, _);

    return {
        DataSourceComponent: DataSourceComponent,
        SqlInputComponent: SqlInputComponent,
        CommonTextInputComponent: CommonTextInputComponent,
        SingleInVarComponent: SingleInVarComponent,
        MultiInVarComponent: MultiInVarComponent,
        FileSourceComponent: FileSourceComponent,
        FileSourceComponent_EX: FileSourceComponent_EX,
        DataSourceComponent_ES:DataSourceComponent_ES,
        FileComponent: FileComponent,
        RuleSourceComponent:RuleSourceComponent,
        Tab: Tab
    }
});

/**
 * Created by momo on 2015/4/24.
 */
define(["jquery", "underscore", "MOMO",
    "avalon", "bootstrap-dialog",
    "dialog-plus", "avalon_filter",
    "css", "bootstrap", "scroll", "json2",
    "css!dialog-plus-css", "noty"], function ($, util, M, avalon, dialog, dialogPlus) {
    var objectPool_gc = [], globalPath = window.contentPath + "/",
        clude_avalonid = ["avalon-leftmenu", "menuTopFusion"],
        currentUrl = "";//当前点击url

    /**
     * 初始化菜单
     * @param op
     */
    function baseIndex(op) {
        this.options = util.extend({}, baseIndex.DEFAULTS, op);
    }

    baseIndex.DEFAULTS = {
        "menu_url": "resourcelib/javascript/data/menu_data.json",//默认菜单url
        "pageContent_url": "../data/home.html",//默认初始化加载页面url
        "content": $("#content")
    };
    function animationList(target) {
        $.each(target, function () {
            this.target.stop().animate(this.prop, 200);
        });
    }

    baseIndex.prototype = {
        init: function (op) {
            var $this = this;
            $this.leftmu_vm = avalon.define("avalon-leftmenu", function (vm) {
                vm.menu_data = [];
                vm.currentIndex = 0;
                vm.flag = true;
                vm.fusionframeUrl = "";

                //加载内容区的页面
                vm.toggle = function (index, url) {
                    var _this = $(this);

                    function activeList(target) {
                        //获取链接的父级UL
                        var lv2Ul = target.parent(),
                            lv1Ul = lv2Ul.parent();

                        //非第一级UL时添加菜单激活样式
                        if (lv1Ul.hasClass("menu-level1") === false) {
                            var thisSiblings = lv2Ul.siblings();

                            target.addClass("on");
                            lv2Ul.prepend("<span class=\"dot\"></span>");
                            thisSiblings.find("span.dot").remove();
                            thisSiblings.find("a").removeClass("on");

                            var lv1Siblings = lv1Ul.parent().siblings();
                            lv1Siblings.find("ul>li>span.dot").remove();
                            lv1Siblings.find("ul>li>a").removeClass("on");
                        } else {
                            if (lv1Ul.find("ul").length === 0) {
                                var thisSiblings = lv1Ul.siblings();
                                thisSiblings.find("li span.dot").remove();
                                thisSiblings.find("ul>li>a").removeClass("on");
                            }
                        }
                    }

                    if (index !== null) {
                        vm.currentIndex = index;
                    }

                    if (url !== "") {
                        $this.loadPageHtml(url);
                        activeList(_this);
                    }
                };

                vm.trigger = true;

                //对菜单展开和显示
                vm.navsliderClick = function () {
                    var navslider = $("#navslider"),
                        navside = navslider.parent(),
                        menus = navslider.nextAll(".menu-level1"),
                        container = $(".tranform-box"),
                        animatedObj;

                    if (vm.trigger === true) {
                        vm.flag = false;

                        animatedObj = {
                            obj1: {
                                "target": navside,
                                "prop": {
                                    "width": 50
                                }
                            }, obj3: {
                                "target": container,
                                "prop": {
                                    "left": 50
                                }
                            },
                            obj6: {
                                "target": navslider,
                                "prop": {
                                    "width": 50
                                }
                            }
                        };

                        navside.css("overflow", "visible");
                        navslider.find("span").attr("class", "trueicon trueicon-fast-forward2 pull-right");
                        menus.addClass("menus-close");
                        menus.find(".links-lv1").addClass("onlyicon");
                        animationList(animatedObj);
                        container.addClass("navside-close");

                        $("#navslider").parent().getNiceScroll().hide();
                        vm.trigger = false;

                    } else {
                        vm.flag = true;

                        animatedObj = {
                            obj1: {
                                "target": container,
                                "prop": {
                                    "left": 200
                                }
                            },
                            obj5: {
                                "target": navslider,
                                "prop": {
                                    "width": 200
                                }
                            }
                        };

                        navside.css("overflow", "hidden");
                        navside.stop().animate({"width": 200}, 200, function () {
                            menus.removeClass("menus-close");
                            menus.find(".links-lv1").removeClass("onlyicon");
                            navslider.find("span").attr("class", "trueicon trueicon-fast-rewind pull-right");
                            $("#navslider").parent().getNiceScroll().resize().show();
                        });
                        animationList(animatedObj);
                        container.removeClass("navside-close");
                        vm.trigger = true;
                    }
                    setTimeout(function () {
                        refreshTableLayout();
                    }, 1000);
                };

                vm.menuTrigger = function () {
                    var that = $(this),
                        childUl = that.find("ul"),
                        siblings = that.siblings("ul"),
                        icon = that.find(".icon"),
                        offClass = "trueicon-angle-down",
                        onClass = "trueicon-angle-up",
                        navside = $("#navslider").parent();

                    if (childUl.length !== 0) {
                        icon.removeClass(offClass).addClass(onClass);
                    }

                    $.each(siblings, function () {
                        if ($(this).find("ul").length !== 0) {
                            $(this).find(".icon").removeClass(onClass).addClass(offClass);
                        }
                    });
                    navside.getNiceScroll().resize();
                };
                vm.openPage = function (url) {
                    !util.isEmpty(url) && $this.loadPageHtml(url);
                };
                vm.changeMenu = function (data) {
                    vm.menu_data = data;
                };
            });
            avalon.scan($("#navside")[0]);

            /**
             * 初始化菜单
             */
            var menuDataDeferred = $.getJSON(globalPath + this.options.menu_url);
            $.when(menuDataDeferred).done(function (menudata) {
                if (menudata.content) {
                    $this.leftmu_vm.menu_data = JSON.parse(menudata.content);
                } else {
                    $this.leftmu_vm.menu_data = menudata;
                }
                var dif = $this.options.menu_url.indexOf("?iframe=true") > -1 ? 44 : 20;
                if (window.autosizeHeaderHeight) {
                    dif = window.autosizeHeaderHeight;
                }
                autoLayout.updateSize($(".navside"), dif, false, {cursorcolor: "#fff", autohidemode: false});
                $(window).resize(_.throttle(function () {
                    autoLayout.updateSize($(".navside"), dif, false, {cursorcolor: "#fff", autohidemode: false})
                }, 1000));
            });

            //加载默认菜单
            this.loadPageHtml(this.options.pageContent_url);
        },
        loadPageHtml: function (url) {
            var $this = this;
            //监测是否是内嵌iframe调用不同的方法
            if (url.indexOf("&iframe=true") > -1) {
                $("#fusionframe").attr("src", url);
            } else {
                $this.gcAllObject();
                M.fire("pageSwitch");
                $.ajax({url: url, type: "GET", dataType: "html", cache: false}).done(function (data) {
                    currentUrl = url;
                    $this.options.content.html(data);
                    if ($("#fusionframe").length === 1) {
                        autoLayout.addAutoLayoutObj($("#fusionframe"), 46, false);
                    }
                });
            }
        },
        /**
         * 页面切换时候，gc页面里可以回收的对象
         */
        gcAllObject: function () {
            _.each(pageAutoLayoutList, function (value) {
                value.el = null;
            });
            pageAutoLayoutList.length = 0;

            $.nicescroll.each(function () {
                if (this.me && this.me[0] !== $(".navside")[0]) {
                    this.remove();
                }
            });
            util.each(objectPool_gc, function (value) {
                value.ins.iscangc && value.ins.destory && value.ins.destory();
            });
            objectPool_gc.length = 0;
            this.options.content.html("");

            //手动清除所有的除去clude_avalonid的对象
            util.each(avalon.vmodels, function (value, key) {
                if (util.isObject(value) && (util.indexOf(clude_avalonid, key) < 0)) {
                    util.each(avalon.vmodels[key], function (value1, key1) {
                        if (util.isObject(value1) && (!util.isFunction(value1))) {
                            delete avalon.vmodels[key][key1];
                        }
                    });
                    delete avalon.vmodels[key];
                }
            });
            $.fn.zTree && $.fn.zTree.destroy();

            //销毁select2
            $(".select2").each(function () {
                $(this).data('select2').destroy();
            })
        }
    };

    /**
     * gc avalon对象
     * @param vmid
     */
    function gcAvalonVm(vmid) {
        var vm = avalon.vmodels[vmid];
        if (!vm)return;
        util.each(vm, function (value1, key1) {
            if (util.isObject(value1) && (!util.isFunction(value1))) {
                delete vm[key1];
            }
        });
        delete avalon.vmodels[vmid];
    }

    /**
     * post方式发送请求
     * @param url 请求url
     * @param param 请求参数
     * @returns {*}
     */
    function doPostData(url, param, timeout) {
        var ajaxobj = {
            type: "POST",
            url: url,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            cache: false,
            data: param
        }
        if (timeout) {
            ajaxobj.timeout = 0;
        }
        var deferred = $.ajax(ajaxobj);
        return deferred;
    }

    /**
     * get方式发送请求
     * @param url
     * @param param
     * @returns {*}
     */
    function doGetData(url, param) {
        return $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            cache: false,
            data: param
        });
    }

    /**
     * get方式发送请求
     * @param url
     * @param param
     * @returns {*}
     */
    function doGetDataAsync(url, param, async) {
        return $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: async,
            contentType: "application/json;charset=utf-8",
            cache: false,
            data: param
        });
    }


    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    function deferredFail() {
        //throw new Error("操作失败，请检查服务端");
        console.log && console.log("操作失败，请检查服务端!");
        //$.confirm({text:"操作失败，请检查服务端!"});
    }

    /**
     * 打开html文件
     * @param title
     * @param url
     * @param param
     * @param width
     */
    function openModal(title, url, param, width, height) {
        var modalconfig = {title: title, data: param, width: (width ? width : 600)};
        if (height) {
            modalconfig.height = height;
        } else {
            modalconfig.height = $(window).height() - 50;
        }
        $.ajax({url: url, type: "GET", dataType: "html", cache: false}).done(function (data) {
            param = $.extend({content: data}, modalconfig);
            new dialog.ModalDialog(param);
        }).fail(deferredFail);
    }

    /**
     * 打开窗口
     * @param title 弹出框标题
     * @param content 弹出内容
     * @param param 弹出传参
     * @param callback 回调参数{onCreateDone:,onClose:}
     * @param width modal宽度
     */
    function openModalByContent(title, content1, param, callback, width) {
        param = $.extend({content: content1},
            {callback_CreateDone: callback.onCreateDone, callbackClose: callback.onClose, title: title, data: param});
        if (width) {
            param.width = width;
        }
        return new dialog.ModalDialog(param);
    }

    function openArtDialog(title, url, param, width) {
        url += "?";
        var i = -1;
        _.each(param, function (value, key) {
            i++;
            if (i > 0) {
                url += "&" + key + "=" + value;
            } else {
                url += key + "=" + value;
            }
        })
        var d = dialogPlus({
            title: title,
            url: url,
            width: width,
            height: 600
        });
        d.show();
    }

    //仅仅为新增类型时候才会执行此函数，修改时候反选,统一从服务端获取数据，回调函数大概格式为function(){vm.parentId=tree.ztree.getSelectNodes()[0].id}
    function selectTreeFunc(type, callfunc) {
        if (type == "add") {
            callfunc && util.isFunction(callfunc) && callfunc();
        }
    }

    function notTreeRootUpdate(pId, avalonType) {
        if ((pId === null && avalonType === "add") || pId !== null) {
            return true;
        } else {
            return false;
        }
    }

    function UUID() {
    }

    UUID.generate = function () {
        var rand = UUID._gri, hex = UUID._ha;
        var s = hex(rand(32), 8)
            + ""
            + hex(rand(16), 4)
            + ""
            + hex(0x4000 | rand(12), 4)
            + ""
            + hex(0x8000 | rand(14), 4)
            + ""
            + hex(rand(48), 12);
        return s.toUpperCase();
    };
    UUID._gri = function (x) {
        if (x < 0) return NaN;
        if (x <= 30) return (0 | Math.random() * (1 << x));
        if (x <= 53) return (0 | Math.random() * (1 << 30))
            + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
        return NaN;
    };

    UUID._ha = function (num, length) {  // _hexAligner
        var str = num.toString(16), i = length - str.length, z = "0";
        for (; i > 0; i >>>= 1, z += z) {
            if (i & 1) {
                str = z + str;
            }
        }
        return str;
    };
    function getCurrentUrl() {
        return currentUrl;
    }

    /**
     * oo class lib
     */
    function _Empty() {
    }

    var objectCreate = Object.create, MIX_CIRCULAR_DETECTION = '__MIX_CIRCULAR', TRUE = true, EMPTY = '';

    /**
     *原型继承
     *r:子类
     *s:super父类
     */
    function extend(r, s, px, sx) {
        var sp = s.prototype,
            rp;
        sp.constructor = s;
        rp = createObject(sp, r);
        r.prototype = mix(rp, r.prototype);
        r.superclass = sp;
        if (px) {
            mix(rp, px);
        }

        if (sx) {
            mix(r, sx);
        }

        return r;
    }

    function createObject(proto, constructor) {
        var newProto;
        if (objectCreate) {
            newProto = objectCreate(proto);
        } else {
            _Empty.prototype = proto;
            newProto = new _Empty();
        }
        newProto.constructor = constructor;
        return newProto;
    }

    function mix(r, s, ov, wl, deep) {
        if (typeof ov === 'object') {
            wl = ov.whitelist;
            deep = ov.deep;
            ov = ov.overwrite;
        }
        if (wl && (typeof wl !== 'function')) {
            var originalWl = wl;
            wl = function (name, val) {
                return inArray(name, originalWl) ? val : undefined;
            };
        }

        if (ov === undefined) {
            ov = TRUE;
        }

        var cache = [],
            c,
            i = 0;
        mixInternal(r, s, ov, wl, deep, cache);
        while ((c = cache[i++])) {
            delete c[MIX_CIRCULAR_DETECTION];
        }
        return r;
    }

    function mixInternal(r, s, ov, wl, deep, cache) {
        if (!s || !r) {
            return r;
        }
        var i, p, keys, len;

        s[MIX_CIRCULAR_DETECTION] = r;
        cache.push(s);
        keys = _.keys(s);
        len = keys.length;
        for (i = 0; i < len; i++) {
            p = keys[i];
            if (p !== MIX_CIRCULAR_DETECTION) {
                _mix(p, r, s, ov, wl, deep, cache);
            }
        }

        return r;
    }

    function _mix(p, r, s, ov, wl, deep, cache) {
        // 要求覆盖
        // 或者目的不存在
        // 或者深度mix
        if (ov || !(p in r) || deep) {
            var target = r[p],
                src = s[p];
            // prevent never-end loop
            if (target === src) {
                // S.mix({},{x:undefined})
                if (target === undefined) {
                    r[p] = target;
                }
                return;
            }
            if (wl) {
                src = wl.call(s, p, src);
            }
            // 来源是数组和对象，并且要求深度 mix
            if (deep && src && (_.isArray(src) || _.isObject(src))) {
                if (src[MIX_CIRCULAR_DETECTION]) {
                    r[p] = src[MIX_CIRCULAR_DETECTION];
                } else {
                    // 目标值为对象或数组，直接 mix
                    // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                    var clone = target && (_.isArray(target) || _.isObject(target)) ?
                        target :
                        (_.isArray(src) ? [] : {});
                    r[p] = clone;
                    mixInternal(clone, src, ov, wl, TRUE, cache);
                }
            } else if (src !== undefined && (ov || !(p in r))) {
                r[p] = src;
            }
        }
    }

    function inArray(item, arr) {
        return _.indexOf(arr, item);
    }

    /**
     * 自适应
     */
    var autosizeConfig = {
        top: 44//头部高度.navbar
    };
    /**
     * 页面度量
     *
     */
    var const_pageMeasure = {
        topHei: 44,//头部高度.navbar
        content_barHei: 42,//某些内容页面会有.content-bar,也就是操作列,
        "treeOperationHei": 32,//树操作组的宽度
        vertical_space: 15,//竖向间隔
        "bootstrap_table_footerHei": 63,//表格尾部(分页+操作栏目)竖向距离row fixed-pagination table-foot = 63,
        "bootstrap_table_headerhei": 36,
        horizontal_space: 15
    }
    var diff = 0;
    _.each(autosizeConfig, function (value) {
        diff += value;
    })
    //页面自定义缩放对象
    var pageAutoLayoutList = [];
    var autoLayout = {
        /**
         *
         * @param $el jquery对象
         * @param h 要减去的高度
         * @param ignoreDiff 是否忽略autosizeConfig里的高度
         * @param 滚动配置
         */
        updateSize: function ($el, h, ignoreDiff, scroll) {
            if ($el.length == 0) {
                return;
            }
            if (ignoreDiff === undefined) {
                ignoreDiff = false;
            }
            $el.css("height", $(window).height() - (ignoreDiff ? 0 : diff) - h);
            if (scroll) {
                if ($el.getNiceScroll().length > 0) {
                    $el.getNiceScroll().resize();
                } else {
                    $el.niceScroll(scroll);
                }
            }
        },
        addAutoLayoutObj: function ($el, diff1) {
            pageAutoLayoutList.push({el: $el, diff: diff1});
            $el.css("height", $(window).height() - diff - diff1);
            $el.niceScroll({cursorcolor: "#000"});
        },
        /**
         * 给jquery对象加滚动条
         * @param $el
         * @param height
         */
        scrollObj: function ($el, height) {
            if (height) {
                $el.css("height", height);
            }
            $el.niceScroll({cursorcolor: "#000"});
        },
        /**
         * 去除滚动条
         * @param $el
         */
        removeScroll: function ($el) {
            if ($el.getNiceScroll().length > 0) {
                $el.getNiceScroll().remove();
            }
        }
    };

    function refreshTableLayout() {
        _.each(objectPool_gc, function (value) {
            !value.ins.inPopupDialog && value.ins.autoLayout && value.ins.autoLayout();
        });
    }

    function resize() {
        refreshTableLayout();
        _.each(pageAutoLayoutList, function (value) {
            value.el.css("height", $(window).height() - diff - value.diff);
            if (value.el.getNiceScroll().length > 0) {
                value.el.getNiceScroll().resize();
            }
            else {
                value.el.niceScroll({cursorcolor: "#000"});
            }
        });
    }

    (function () {
        $(window).resize(_.throttle(resize, 1000));
        //$(document).change(_.throttle(resize, 1000));
    })();

    function sprintf(str) {
        var args = arguments, flag = true, i = 1;
        str = str.replace(/%s/g, function () {
            var arg = args[i++];
            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    }

    /**
     * 判断是否为空object,例如{]
     * @param o
     * @returns {boolean}
     */
    function isEmptyObject(o) {
        for (var p in o) {
            if (p !== undefined) {
                return false;
            }
        }
        return true;
    }

    /*解析url中的参数，获取其中的某个参数的值*/

    String.prototype.getQuery = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = this.substr(this.indexOf("\?") + 1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    function _alert(text) {
        noty({
            layout: "center",
            timeout: 2000,
            text: text
        });
    }


    return {
        "baseIndex": baseIndex,
        "objectPool_gc": objectPool_gc,
        "getCurrentUrl": getCurrentUrl,
        "globalPath": globalPath,
        "doPostData": doPostData,
        "deferredFail": deferredFail,
        "doGetData": doGetData,
        "doGetDataAsync": doGetDataAsync,
        "getCurrentPageAllObject": undefined,
        "uuid": UUID,
        "gcAvalonVm": gcAvalonVm,
        "selectTreeFunc": selectTreeFunc,
        "notTreeRootUpdate": notTreeRootUpdate,
        "openModal": openModal,
        openModalByContent: openModalByContent,
        "getURLParameter": getURLParameter,
        extend: extend,
        autoLayout: autoLayout,
        sprintf: sprintf,
        isEmptyObject: isEmptyObject,
        const_pageMeasure: const_pageMeasure,
        openArtDialog: openArtDialog,
        _alert: _alert,
        EmptyFun: function () {

        }
    }
});
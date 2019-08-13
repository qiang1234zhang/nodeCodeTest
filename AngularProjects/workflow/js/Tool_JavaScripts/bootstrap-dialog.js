define(["jquery", "underscore", "etpl", "leador"], function ($, _, etpl, leador) {
    var Widget = leador.Widget,
        mask = leador.Overlay.Mask;
    $.fn.drags = function (b) {
        b = $.extend({handle: "", cursor: "move"}, b);
        var c, d;
        return c = "" === b.handle ? this : this.find(b.handle), c.css("cursor", b.cursor).on("mousedown", function (c) {
            d = "" === b.handle ? a(this).addClass("draggable") : $(this).addClass("active-handle").parent().addClass("draggable");
            var e = d.css("z-index"), f = d.outerHeight(), g = d.outerWidth(), h = d.offset().top + f - c.pageY, i = d.offset().left + g - c.pageX;
            d.css("z-index", 5100).parents().on("mousemove", function (b) {
                $(".draggable").offset({top: b.pageY + h - f, left: b.pageX + i - g}).on("mouseup", function () {
                    $(this).removeClass("draggable").css("z-index", e)
                })
            }), c.preventDefault()
        }).on("mouseup", function (e) {
            "" === b.handle ? $(this).removeClass("draggable") : $(this).removeClass("active-handle").parent().removeClass("draggable");
            $(e.currentTarget).parent().find(".modal-content").getNiceScroll().resize();
            $(".ui-poptip").hide();
        })
    };
    var ModalDialog = leador.Overlay.extend({
        attrs: {
            id: undefined,
            data: undefined,
            content: undefined,
            template: ['<div class="leadormodal">',
                '<div class="modal-header">', "<h4 style='margin-top: 5px;margin-bottom: 5px;font-size: 14px;'>", "{{TITLE}}", '<a href="javascript:void(0)" class="close">',
                '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>', "</a>", "</h4>", "</div>", '<div class="modal-content"></div>',
                '<div class="loading-svg"><span style="position: absolute;top:24px;font-size:12px;left:8px;">正在提交</span></div>',
                "</div>"].join(""),
            title: undefined,
            width: 600,
            className: "",
            callback_CreateDone: undefined,//dialog构造完毕后的回调
            callbackClose: undefined,
            draggable: !0,
            zIndex: 1000
        },
        setup: function () {
            //弹窗模板
            this.$tmpl = $(this.get("template").replace("{{TITLE}}", this.get("title")));
            //dialog id
            this.dialogid = this.get("id") ? this.get("id") : this._genCid();
            this.isShown = !1;
            this.$tmpl.appendTo(document.body).addClass(this.get("className"))
                .attr("id", this.dialogid)
                .data("modaldata", this.get("data"))//设置传递过来的数据
                .find(".modal-content")
                .html(this.get("content"))
                .end()
                .on("click", "a.close, .btn-cancel", $.proxy(this.close, this))
                .on("modalclose", $.proxy(this.close, this));
            /**
             * 可否拖拽
             */
            this.get("draggable") && this.$tmpl.drags({handle: ".modal-header"});
            //打开之后的回调
            this.get("callback_CreateDone") && this.get("callback_CreateDone").call(this, this.get("data"));
            /**
             * 创建遮罩
             */
            this._setupMask();
            this._show();
        },
        // 绑定遮罩层事件
        _setupMask: function () {
            var $this = this;
            this.after('_show', function () {
                mask.set('zIndex', $this.get('zIndex')).show();
                mask.element.insertBefore($this.$tmpl);

            });
        },
        // 隐藏 mask
        _hideMask: function () {
            mask.hide();
        },
        render: function () {
            return this;
        },
        _show: function () {
            this.$tmpl.show();
            this._position();
            this.set("isShown", !0);
        },
        close: function (e) {
            e && e.preventDefault(), this.get("callbackClose") && this.get("callbackClose").call(this), this.set("isShown", !1);
            //这里是diaolog关联formtemplate对象，主要用于关闭modal时候回收form里面所有的资源
            var formIns = this.$tmpl.data("formIns");
            //销毁遮罩
            this._hideMask();
            this.$tmpl.data("formIns", null);
            if (formIns) {
                formIns.destory();
                formIns = null;
            }
            this.$tmpl.off();
            this.$tmpl.remove();
            this.$tmpl.find(".modal-content").getNiceScroll().remove();
            this.destroy();
        },
        _position: function () {
            var c = this.get("width"), d = this.get("height"), e = d ? "-" + d / 2 + "px" : "-280px";
            this.$tmpl
                .css({
                    width: c + "px",
                    height: "auto",
                    "margin-left": "-" + c / 2 + "px",
                    top: "10px",
                    left: this.get("left") || "52%"
                });
            this.$tmpl.find(".modal-content").css("max-height", d).niceScroll({
                cursorcolor: "#000",
                cursorwidth: "8px"
            });
        },
        _genCid: function () {
            var a = new Date, b = parseInt(1e3 * Math.random());
            return a.getTime() + b
        },
        getContentDom: function () {
            return this.$tmpl.find(".modal-content");
        }
    });

    $.fn.confirm = function (options) {
        if (typeof options === 'undefined') {
            options = {};
        }

        this.click(function (e) {
            e.preventDefault();

            var newOptions = $.extend({
                button: $(this)
            }, options);

            $.confirm(newOptions, e);
        });

        return this;
    };

    $.confirm = function (options, e) {
        if ($('.confirmation-modal').length > 0) {
            return;
        }
        var dataOptions = {};
        if (options.button) {
            var dataOptionsMapping = {
                'title': 'title',
                'text': 'text',
                'confirm-button': 'confirmButton',
                'cancel-button': 'cancelButton',
                'confirm-button-class': 'confirmButtonClass',
                'cancel-button-class': 'cancelButtonClass',
                'dialog-class': 'dialogClass'
            };
            $.each(dataOptionsMapping, function (attributeName, optionName) {
                var value = options.button.data(attributeName);
                if (value) {
                    dataOptions[optionName] = value;
                }
            });
        }

        var settings = $.extend({}, $.confirm.options, {
            confirm: function () {
            },
            cancel: function (o) {
            },
            button: null
        }, dataOptions, options);

        var modalHeader = '';
        if (settings.title !== '') {
            modalHeader =
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title">' + settings.title + '</h4>' +
                '</div>';
        }
        var modalHTML =
            '<div class="window-overlay">' +
            '<div style="width:400px;position:absolute;top:50%;left:50%;z-index:6000">' +
            '<div class="' + settings.dialogClass + '" style="width:100%;">' +
            '<div class="modal-content">' +
            modalHeader +
            '<div class="modal-body">' + settings.text + '</div>' +
            '<div class="modal-footer" style="border:0;">' +
            '<button class="confirm btn ' + settings.confirmButtonClass + '" type="button" data-dismiss="modal">' +
            settings.confirmButton +
            '</button>' +
            '<button class="cancel btn ' + settings.cancelButtonClass + '" type="button" data-dismiss="modal">' +
            settings.cancelButton +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div></div>';

        var modal = $(modalHTML);

        modal.on('shown.bs.modal', function () {
            modal.find(".btn-primary:first").focus();
        });
        modal.on('hidden.bs.modal', function () {
            modal.remove();
        });
        modal.find(".confirm").click(function () {
            settings.confirm(settings.button);
        });
        modal.find(".cancel").click(function () {
            settings.cancel(settings.button);
        });

        $(document.body).append(modal);
        var c12 = 400, e12 = "-200px";
        modal.modal('show').children().eq(0).css({"margin-left": "-" + c12 / 2 + "px", "margin-top": e12, top: "50%"});
    };

    $.confirm.options = {
        text: "操作成功",
        title: "",
        confirmButton: "确定",
        cancelButton: "关闭",
        confirmButtonClass: "btn-primary",
        cancelButtonClass: "btn-default",
        dialogClass: "modal-dialog"
    }

    return {
        ModalDialog: ModalDialog
    };
});
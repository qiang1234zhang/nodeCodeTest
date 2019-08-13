define(["jquery", "underscore", "etpl"], function ($, _, etpl) {
    var Class = (function () {
        function Class(o) {
            if (!(this instanceof Class) && _.isFunction(o)) {
                return classify(o)
            }
        }

        Class.create = function (parent, properties) {
            if (!_.isFunction(parent)) {
                properties = parent;
                parent = null;
            }
            properties || (properties = {});
            parent || (parent = properties.Extends || Class);
            properties.Extends = parent;


            function SubClass() {
                parent.apply(this, arguments);
                if (this.constructor === SubClass && this.initialize) {
                    this.initialize.apply(this, arguments)
                }
            }

            if (parent !== Class) {
                mix(SubClass, parent, parent.StaticsWhiteList)
            }
            implement.call(SubClass, properties);
            return classify(SubClass);
        }
        function implement(properties) {
            var key, value;

            for (key in properties) {
                value = properties[key];

                if (Class.Mutators.hasOwnProperty(key)) {
                    Class.Mutators[key].call(this, value)
                } else {
                    this.prototype[key] = value
                }
            }
        }

        Class.extend = function (properties) {
            properties || (properties = {});
            properties.Extends = this;

            return Class.create(properties);
        }
        function classify(cls) {
            cls.extend = Class.extend;
            cls.implement = implement;
            return cls
        }

        Class.Mutators = {
            'Extends': function (parent) {
                var existed = this.prototype;
                var proto = createProto(parent.prototype);
                mix(proto, existed);
                proto.constructor = this;
                this.prototype = proto;
                this.superclass = parent.prototype;
            },

            'Implements': function (items) {
                _.isArray(items) || (items = [items]);
                var proto = this.prototype, item;
                while (item = items.shift()) {
                    mix(proto, item.prototype || item)
                }
            },

            'Statics': function (staticProperties) {
                mix(this, staticProperties);
            }
        }
        function Ctor() {
        }

        function mix(r, s, wl) {
            for (var p in s) {
                if (s.hasOwnProperty(p)) {
                    if (wl && _.indexOf(wl, p) === -1) continue;

                    if (p !== 'prototype') {
                        r[p] = s[p]
                    }
                }
            }
        }

        var createProto = Object.__proto__ ?
            function (proto) {
                return {__proto__: proto}
            } :
            function (proto) {
                Ctor.prototype = proto
                return new Ctor()
            };

        return Class;
    })();

    var Events = (function () {

        var eventSplitter = /\s+/

        function Events() {
        }

        Events.prototype.on = function (events, callback, context) {
            var cache, event, list
            if (!callback) return this

            cache = this.__events || (this.__events = {})
            events = events.split(eventSplitter)

            while (event = events.shift()) {
                list = cache[event] || (cache[event] = [])
                list.push(callback, context)
            }

            return this
        }

        Events.prototype.once = function (events, callback, context) {
            var that = this
            var cb = function () {
                that.off(events, cb)
                callback.apply(context || that, arguments)
            }
            return this.on(events, cb, context)
        }

        Events.prototype.off = function (events, callback, context) {
            var cache, event, list, i


            if (!(cache = this.__events)) return this
            if (!(events || callback || context)) {
                delete this.__events;
                return this;
            }

            events = events ? events.split(eventSplitter) : keys(cache)


            while (event = events.shift()) {
                list = cache[event]
                if (!list) continue

                if (!(callback || context)) {
                    delete cache[event];
                    continue;
                }

                for (i = list.length - 2; i >= 0; i -= 2) {
                    if (!(callback && list[i] !== callback ||
                        context && list[i + 1] !== context)) {
                        list.splice(i, 2)
                    }
                }
            }

            return this
        }

        Events.prototype.trigger = function (events) {
            var cache, event, all, list, i, len, rest = [], args, returned = true;
            if (!(cache = this.__events)) return this;

            events = events.split(eventSplitter);

            for (i = 1, len = arguments.length; i < len; i++) {
                rest[i - 1] = arguments[i]
            }


            while (event = events.shift()) {

                if (all = cache.all) all = all.slice();
                if (list = cache[event]) list = list.slice();


                if (event !== 'all') {
                    returned = triggerEvents(list, rest, this) && returned;
                }

                returned = triggerEvents(all, [event].concat(rest), this) && returned;
            }

            return returned
        }

        Events.prototype.emit = Events.prototype.trigger

        Events.mixTo = function (receiver) {
            var proto = Events.prototype;

            if (_.isFunction(receiver)) {
                for (var key in proto) {
                    if (proto.hasOwnProperty(key)) {
                        receiver.prototype[key] = proto[key]
                    }
                }
                _.keys(proto).each(function (key) {
                    receiver.prototype[key] = proto[key]
                })
            }
            else {
                var event = new Events
                for (var key in proto) {
                    if (proto.hasOwnProperty(key)) {
                        copyProto(key)
                    }
                }
            }

            function copyProto(key) {
                receiver[key] = function () {
                    proto[key].apply(event, Array.prototype.slice.call(arguments));
                    return this;
                }
            }
        }

        function triggerEvents(list, args, context) {
            var pass = true;

            if (list) {
                var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2]

                switch (args.length) {
                    case 0:
                        for (; i < l; i += 2) {
                            pass = list[i].call(list[i + 1] || context) !== false && pass
                        }
                        break;
                    case 1:
                        for (; i < l; i += 2) {
                            pass = list[i].call(list[i + 1] || context, a1) !== false && pass
                        }
                        break;
                    case 2:
                        for (; i < l; i += 2) {
                            pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass
                        }
                        break;
                    case 3:
                        for (; i < l; i += 2) {
                            pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass
                        }
                        break;
                    default:
                        for (; i < l; i += 2) {
                            pass = list[i].apply(list[i + 1] || context, args) !== false && pass
                        }
                        break;
                }
            }

            return pass;
        }

        return Events;
    })();

    var Base = (function () {
        var Aspect = (function () {
            function before(methodName, callback, context) {
                return weave.call(this, 'before', methodName, callback, context);
            }

            function after(methodName, callback, context) {
                return weave.call(this, 'after', methodName, callback, context);
            }

            var eventSplitter = /\s+/;

            function weave(when, methodName, callback, context) {
                var names = methodName.split(eventSplitter);
                var name, method;

                while (name = names.shift()) {
                    method = getMethod(this, name);
                    if (!method.__isAspected) {
                        wrap.call(this, name);
                    }
                    this.on(when + ':' + name, callback, context);
                }

                return this;
            }


            function getMethod(host, methodName) {
                var method = host[methodName];
                if (!method) {
                    throw new Error('Invalid method name: ' + methodName);
                }
                return method;
            }


            function wrap(methodName) {
                var old = this[methodName];

                this[methodName] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    var beforeArgs = ['before:' + methodName].concat(args);


                    if (this.trigger.apply(this, beforeArgs) === false) return;

                    var ret = old.apply(this, arguments);
                    var afterArgs = ['after:' + methodName, ret].concat(args);
                    this.trigger.apply(this, afterArgs);

                    return ret;
                };
                this[methodName].__isAspected = true;
            }

            return {
                before: before,
                after: after
            }
        })();
        var Attribute = (function () {
            function initAttrs(config) {
                // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs，不存在覆盖问题
                var attrs = this.attrs = {};


                var specialProps = this.propsInAttrs || [];
                mergeInheritedAttrs(attrs, this, specialProps);

                if (config) {
                    mergeUserValue(attrs, config);
                }

                // 对于有 setter 的属性，要用初始值 set 一下，以保证关联属性也一同初始化
                setSetterAttrs(this, attrs, config);

                parseEventsFromAttrs(this, attrs);

                copySpecialProps(specialProps, this, attrs, true);
            }

            function get(key) {
                var attr = this.attrs[key] || {};
                var val = attr.value;
                return attr.getter ? attr.getter.call(this, val, key) : val;
            }

            function set(key, val, options) {
                var attrs = {};

                if (_.isString(key)) {
                    attrs[key] = val;
                } else {
                    attrs = key;
                    options = val;
                }

                options || (options = {});
                var silent = options.silent;
                var override = options.override;

                var now = this.attrs;
                var changed = this.__changedAttrs || (this.__changedAttrs = {});

                for (key in attrs) {
                    if (!attrs.hasOwnProperty(key)) continue;

                    var attr = now[key] || (now[key] = {});
                    val = attrs[key];

                    if (attr.readOnly) {
                        throw new Error('This attribute is readOnly: ' + key);
                    }

                    if (attr.setter) {
                        val = attr.setter.call(this, val, key);
                    }

                    // 获取设置前的 prev 值
                    var prev = this.get(key);

                    // 获取需要设置的 val 值
                    // 如果设置了 override 为 true，表示要强制覆盖，就不去 merge 了
                    // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
                    if (!override && isPlainObject(prev) && isPlainObject(val)) {
                        val = merge(merge({}, prev), val);
                    }

                    now[key].value = val;

                    // invoke change event
                    // 初始化时对 set 的调用，不触发任何事件
                    if (!this.__initializingAttrs && !isEqual(prev, val)) {
                        if (silent) {
                            changed[key] = [val, prev];
                        }
                        else {
                            this.trigger('change:' + key, val, prev, key);
                        }
                    }
                }

                return this;
            }

            function change() {
                var changed = this.__changedAttrs;

                if (changed) {
                    for (var key in changed) {
                        if (changed.hasOwnProperty(key)) {
                            var args = changed[key];
                            this.trigger('change:' + key, args[0], args[1], key);
                        }
                    }
                    delete this.__changedAttrs;
                }

                return this;
            }


            var toString = Object.prototype.toString;
            var hasOwn = Object.prototype.hasOwnProperty;


            var iteratesOwnLast;
            (function () {
                var props = [];

                function Ctor() {
                    this.x = 1;
                }

                Ctor.prototype = {'valueOf': 1, 'y': 1};
                for (var prop in new Ctor()) {
                    props.push(prop);
                }
                iteratesOwnLast = props[0] !== 'x';
            }());

            function isWindow(o) {
                return o != null && o == o.window;
            }

            function isPlainObject(o) {
                if (!o || toString.call(o) !== "[object Object]" ||
                    o.nodeType || isWindow(o)) {
                    return false;
                }

                try {
                    if (o.constructor && !hasOwn.call(o, "constructor") && !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
                        return false;
                    }
                } catch (e) {
                    return false;
                }

                var key;
                if (iteratesOwnLast) {
                    for (key in o) {
                        return hasOwn.call(o, key);
                    }
                }

                for (key in o) {
                }

                return key === undefined || hasOwn.call(o, key);
            }

            function isEmptyObject(o) {
                if (!o || toString.call(o) !== "[object Object]" ||
                    o.nodeType || isWindow(o) || !o.hasOwnProperty) {
                    return false;
                }

                for (var p in o) {
                    if (o.hasOwnProperty(p)) return false;
                }
                return true;
            }

            function merge(receiver, supplier) {
                var key, value;

                for (key in supplier) {
                    if (supplier.hasOwnProperty(key)) {
                        receiver[key] = cloneValue(supplier[key], receiver[key]);
                    }
                }

                return receiver;
            }

            function cloneValue(value, prev) {
                if (_.isArray(value)) {
                    value = value.slice();
                }
                else if (isPlainObject(value)) {
                    isPlainObject(prev) || (prev = {});

                    value = merge(prev, value);
                }

                return value;
            }


            function mergeInheritedAttrs(attrs, instance, specialProps) {
                var inherited = [];
                var proto = instance.constructor.prototype;

                while (proto) {
                    // 不要拿到 prototype 上的
                    if (!proto.hasOwnProperty('attrs')) {
                        proto.attrs = {};
                    }

                    // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并
                    copySpecialProps(specialProps, proto.attrs, proto);

                    // 为空时不添加
                    if (!isEmptyObject(proto.attrs)) {
                        inherited.unshift(proto.attrs);
                    }

                    // 向上回溯一级
                    proto = proto.constructor.superclass;
                }

                // Merge and clone default values to instance.
                for (var i = 0, len = inherited.length; i < len; i++) {
                    mergeAttrs(attrs, normalize(inherited[i]));
                }
            }

            function mergeUserValue(attrs, config) {
                mergeAttrs(attrs, normalize(config, true), true);
            }

            function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
                for (var i = 0, len = specialProps.length; i < len; i++) {
                    var key = specialProps[i];

                    if (supplier.hasOwnProperty(key)) {
                        receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
                    }
                }
            }


            var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
            var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;

            function parseEventsFromAttrs(host, attrs) {
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        var value = attrs[key].value, m;

                        if (_.isFunction(value) && (m = key.match(EVENT_PATTERN))) {
                            host[m[1]](getEventName(m[2]), value);
                            delete attrs[key];
                        }
                    }
                }
            }

            function getEventName(name) {
                var m = name.match(EVENT_NAME_PATTERN);
                var ret = m[1] ? 'change:' : '';
                ret += m[2].toLowerCase() + m[3];
                return ret;
            }


            function setSetterAttrs(host, attrs, config) {
                var options = {silent: true};
                host.__initializingAttrs = true;

                for (var key in config) {
                    if (config.hasOwnProperty(key)) {
                        if (attrs[key].setter) {
                            host.set(key, config[key], options);
                        }
                    }
                }

                delete host.__initializingAttrs;
            }

            var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'readOnly'];

            function normalize(attrs, isUserValue) {
                var newAttrs = {};

                for (var key in attrs) {
                    var attr = attrs[key];

                    if (!isUserValue &&
                        isPlainObject(attr) &&
                        hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
                        newAttrs[key] = attr;
                        continue;
                    }

                    newAttrs[key] = {
                        value: attr
                    };
                }

                return newAttrs;
            }

            function hasOwnProperties(object, properties) {
                for (var i = 0, len = properties.length; i < len; i++) {
                    if (object.hasOwnProperty(properties[i])) {
                        return true;
                    }
                }
                return false;
            }

            var ATTR_OPTIONS = ['setter', 'getter', 'readOnly'];
            // 专用于 attrs 的 merge 方法
            function mergeAttrs(attrs, inheritedAttrs, isUserValue) {
                var key, value;
                var attr;

                for (key in inheritedAttrs) {
                    if (inheritedAttrs.hasOwnProperty(key)) {
                        value = inheritedAttrs[key];
                        attr = attrs[key];

                        if (!attr) {
                            attr = attrs[key] = {};
                        }

                        // 从严谨上来说，遍历 ATTR_SPECIAL_KEYS 更好
                        // 从性能来说，直接 人肉赋值 更快
                        // 这里还是选择 性能优先

                        // 只有 value 要复制原值，其他的直接覆盖即可
                        (value['value'] !== undefined) && (attr['value'] = cloneValue(value['value'], attr['value']));

                        // 如果是用户赋值，只要考虑value
                        if (isUserValue) continue;

                        for (var i in ATTR_OPTIONS) {
                            var option = ATTR_OPTIONS[i];
                            if (value[option] !== undefined) {
                                attr[option] = value[option];
                            }
                        }
                    }
                }

                return attrs;
            }

            // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
            function isEmptyAttrValue(o) {
                return o == null || // null, undefined
                    (_.isString(o) || _.isArray(o)) && o.length === 0 || // '', []
                    isEmptyObject(o); // {}
            }

            // 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
            function isEqual(a, b) {
                if (a === b) return true;

                if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;

                var className = toString.call(a);
                if (className != toString.call(b)) return false;

                switch (className) {
                    case '[object String]':
                        return a == String(b);

                    case '[object Number]':
                        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);

                    case '[object Date]':
                    case '[object Boolean]':
                        return +a == +b;
                    case '[object RegExp]':
                        return a.source == b.source &&
                            a.global == b.global &&
                            a.multiline == b.multiline &&
                            a.ignoreCase == b.ignoreCase;

                    // 简单判断数组包含的 primitive 值是否相等
                    case '[object Array]':
                        var aString = a.toString();
                        var bString = b.toString();

                        // 只要包含非 primitive 值，为了稳妥起见，都返回 false
                        return aString.indexOf('[object') === -1 &&
                            bString.indexOf('[object') === -1 &&
                            aString === bString;
                }

                if (typeof a != 'object' || typeof b != 'object') return false;

                // 简单判断两个对象是否相等，只判断第一层
                if (isPlainObject(a) && isPlainObject(b)) {

                    // 键值不相等，立刻返回 false
                    if (!isEqual(_.keys(a), _.keys(b))) {
                        return false;
                    }

                    // 键相同，但有值不等，立刻返回 false
                    for (var p in a) {
                        if (a[p] !== b[p]) return false;
                    }

                    return true;
                }

                // 其他情况返回 false, 以避免误判导致 change 事件没发生
                return false;
            }

            return {
                initAttrs: initAttrs,
                get: get,
                set: set,
                change: change,
                _isPlainObject: isPlainObject
            }
        })();

        function parseEventsFromInstance(host, attrs) {
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    var m = '_onChange' + ucfirst(attr);
                    if (host[m]) {
                        host.on('change:' + attr, host[m]);
                    }
                }
            }
        }

        function ucfirst(str) {
            return str.charAt(0).toUpperCase() + str.substring(1);
        }

        return Class.create({
            Implements: [Events, Aspect, Attribute],

            initialize: function (config) {
                this.initAttrs(config);
                parseEventsFromInstance(this, this.attrs);
            },

            destroy: function () {
                this.off();

                for (var p in this) {
                    if (this.hasOwnProperty(p)) {
                        delete this[p];
                    }
                }
                this.destroy = function () {
                };
            }
        });
    })();

    var Widget = (function () {

        // Widget
        // ---------
        // Widget 是与 DOM 元素相关联的非工具类组件，主要负责 View 层的管理。
        // Widget 组件具有四个要素：描述状态的 attributes 和 properties，描述行为的 events
        // 和 methods。Widget 基类约定了这四要素创建时的基本流程和最佳实践。

        var DELEGATE_EVENT_NS = '.delegate-events-';
        var ON_RENDER = '_onRender';
        var DATA_WIDGET_CID = 'data-widget-cid';

        // 所有初始化过的 Widget 实例
        var cachedInstances = {}

        var Widget = Base.extend({

            // config 中的这些键值会直接添加到实例上，转换成 properties
            propsInAttrs: ['initElement', 'element', 'events'],

            // 与 widget 关联的 DOM 元素
            element: null,

            // 事件代理，格式为：
            //   {
            //     'mousedown .title': 'edit',
            //     'click {{attrs.saveButton}}': 'save'
            //     'click .open': function(ev) { ... }
            //   }
            events: null,

            // 属性列表
            attrs: {
                // 基本属性
                id: null,
                className: null,
                style: null,

                // 默认模板
                template: '<div></div>',

                // 默认数据模型
                model: null,

                // 组件的默认父节点
                parentNode: document.body
            },

            // 初始化方法，确定组件创建时的基本流程：
            // 初始化 attrs --》 初始化 props --》 初始化 events --》 子类的初始化
            initialize: function (config) {
                this.cid = uniqueCid();

                // 初始化 attrs
                Widget.superclass.initialize.call(this, config);

                // 初始化 props
                this.parseElement();
                this.initProps();

                // 初始化 events
                this.delegateEvents();

                // 子类自定义的初始化
                this.setup();

                // 保存实例信息
                this._stamp();

                // 是否由 template 初始化
                this._isTemplate = !(config && config.element)
            },


            // 构建 this.element
            parseElement: function () {
                var element = this.element

                if (element) {
                    this.element = $(element)
                }
                // 未传入 element 时，从 template 构建
                else if (this.get('template')) {
                    this.parseElementFromTemplate()
                }

                // 如果对应的 DOM 元素不存在，则报错
                if (!this.element || !this.element[0]) {
                    throw new Error('element is invalid')
                }
            },

            // 从模板中构建 this.element
            parseElementFromTemplate: function () {
                this.element = $(this.get('template'))
            },

            // 负责 properties 的初始化，提供给子类覆盖
            initProps: function () {
            },

            // 注册事件代理
            delegateEvents: function (element, events, handler) {
                var argus = trimRightUndefine(Array.prototype.slice.call(arguments))

                // widget.delegateEvents()
                if (argus.length === 0) {
                    events = getEvents(this);
                    element = this.element;
                }

                // widget.delegateEvents({
                //   'click p': 'fn1',
                //   'click li': 'fn2'
                // })
                else if (argus.length === 1) {
                    events = element;
                    element = this.element;
                }

                // widget.delegateEvents('click p', function(ev) { ... })
                else if (argus.length === 2) {
                    handler = events;
                    events = element;
                    element = this.element;
                }

                // widget.delegateEvents(element, 'click p', function(ev) { ... })
                else {
                    element || (element = this.element);
                    this._delegateElements || (this._delegateElements = []);
                    this._delegateElements.push($(element));
                }

                // 'click p' => {'click p': handler}
                if (_.isString(events) && _.isFunction(handler)) {
                    var o = {};
                    o[events] = handler;
                    events = o;
                }

                // key 为 'event selector'
                for (var key in events) {
                    if (!events.hasOwnProperty(key)) continue;

                    var args = parseEventKey(key, this);
                    var eventType = args.type;
                    var selector = args.selector

                        ;
                    (function (handler, widget) {

                        var callback = function (ev) {
                            if (_.isFunction(handler)) {
                                handler.call(widget, ev)
                            } else {
                                widget[handler](ev)
                            }
                        }

                        // delegate
                        if (selector) {
                            $(element).on(eventType, selector, callback)
                        }
                        // normal bind
                        // 分开写是为了兼容 zepto，zepto 的判断不如 jquery 强劲有力
                        else {
                            $(element).on(eventType, callback)
                        }

                    })(events[key], this)
                }

                return this
            },

            // 卸载事件代理
            undelegateEvents: function (element, eventKey) {
                var argus = trimRightUndefine(Array.prototype.slice.call(arguments))

                if (!eventKey) {
                    eventKey = element
                    element = null
                }

                // 卸载所有
                // .undelegateEvents()
                if (argus.length === 0) {
                    var type = DELEGATE_EVENT_NS + this.cid

                    this.element && this.element.off(type)

                    // 卸载所有外部传入的 element
                    if (this._delegateElements) {
                        for (var de in this._delegateElements) {
                            if (!this._delegateElements.hasOwnProperty(de)) continue
                            this._delegateElements[de].off(type)
                        }
                    }

                } else {
                    var args = parseEventKey(eventKey, this)

                    // 卸载 this.element
                    // .undelegateEvents(events)
                    if (!element) {
                        this.element && this.element.off(args.type, args.selector)
                    }

                    // 卸载外部 element
                    // .undelegateEvents(element, events)
                    else {
                        $(element).off(args.type, args.selector)
                    }
                }
                return this
            },

            // 提供给子类覆盖的初始化方法
            setup: function () {
            },

            // 将 widget 渲染到页面上
            // 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
            // 约定：子类覆盖时，需保持 `return this`
            render: function () {

                // 让渲染相关属性的初始值生效，并绑定到 change 事件
                if (!this.rendered) {
                    this._renderAndBindAttrs()
                    this.rendered = true
                }

                // 插入到文档流中
                var parentNode = this.get('parentNode')
                if (parentNode && !isInDocument(this.element[0])) {
                    // 隔离样式，添加统一的命名空间
                    // https://github.com/aliceui/aliceui.org/issues/9
                    var outerBoxClass = this.constructor.outerBoxClass
                    if (outerBoxClass) {
                        var outerBox = this._outerBox = $('<div></div>').addClass(outerBoxClass)
                        outerBox.append(this.element).appendTo(parentNode)
                    } else {
                        this.element.appendTo(parentNode)
                    }
                }

                return this
            },

            // 让属性的初始值生效，并绑定到 change:attr 事件上
            _renderAndBindAttrs: function () {
                var widget = this;
                var attrs = widget.attrs;

                for (var attr in attrs) {
                    if (!attrs.hasOwnProperty(attr)) continue;
                    var m = ON_RENDER + ucfirst(attr);

                    if (this[m]) {
                        var val = this.get(attr);

                        // 让属性的初始值生效。注：默认空值不触发
                        if (!isEmptyAttrValue(val)) {
                            this[m](val, undefined, attr);
                        }

                        // 将 _onRenderXx 自动绑定到 change:xx 事件上
                        (function (m) {
                            widget.on('change:' + attr, function (val, prev, key) {
                                widget[m](val, prev, key);
                            })
                        })(m)
                    }
                }
            },

            _onRenderId: function (val) {
                this.element.attr('id', val)
            },

            _onRenderClassName: function (val) {
                this.element.addClass(val)
            },

            _onRenderStyle: function (val) {
                this.element.css(val)
            },

            // 让 element 与 Widget 实例建立关联
            _stamp: function () {
                var cid = this.cid
                    ;
                (this.initElement || this.element).attr(DATA_WIDGET_CID, cid);
                cachedInstances[cid] = this
            },

            // 在 this.element 内寻找匹配节点
            $: function (selector) {
                return this.element.find(selector);
            },

            destroy: function () {
                this.undelegateEvents();
                delete cachedInstances[this.cid];

                // For memory leak
                if (this.element && this._isTemplate) {
                    this.element.off();
                    // 如果是 widget 生成的 element 则去除
                    if (this._outerBox) {
                        this._outerBox.remove();
                    } else {
                        this.element.remove();
                    }
                }
                this.element = null;
                Widget.superclass.destroy.call(this);
            }
        })

        //gc回收资源
        $(window).unload(function () {
            for (var cid in cachedInstances) {
                cachedInstances[cid].destroy()
            }
        })

        // 查询与 selector 匹配的第一个 DOM 节点，得到与该 DOM 节点相关联的 Widget 实例
        Widget.query = function (selector) {
            var element = $(selector).eq(0)
            var cid

            element && (cid = element.attr(DATA_WIDGET_CID))
            return cachedInstances[cid]
        }

        // 工具类
        var cidCounter = 0

        function uniqueCid() {
            return 'widget-' + cidCounter++
        }

        // Zepto 上没有 contains 方法
        var contains = $.contains || function (a, b) {
                //noinspection JSBitwiseOperatorUsage
                return !!(a.compareDocumentPosition(b) & 16)
            }

        function isInDocument(element) {
            return contains(document.documentElement, element)
        }

        function ucfirst(str) {
            return str.charAt(0).toUpperCase() + str.substring(1)
        }


        var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/
        var EXPRESSION_FLAG = /{{([^}]+)}}/g
        var INVALID_SELECTOR = 'INVALID_SELECTOR'

        function getEvents(widget) {
            if (_.isFunction(widget.events)) {
                widget.events = widget.events()
            }
            return widget.events
        }

        function parseEventKey(eventKey, widget) {
            var match = eventKey.match(EVENT_KEY_SPLITTER)
            var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid

            // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
            var selector = match[2] || undefined

            if (selector && selector.indexOf('{{') > -1) {
                selector = parseExpressionInEventKey(selector, widget)
            }

            return {
                type: eventType,
                selector: selector
            }
        }

        // 解析 eventKey 中的 {{xx}}, {{yy}}
        function parseExpressionInEventKey(selector, widget) {

            return selector.replace(EXPRESSION_FLAG, function (m, name) {
                var parts = name.split('.')
                var point = widget, part

                while (part = parts.shift()) {
                    if (point === widget.attrs) {
                        point = widget.get(part)
                    } else {
                        point = point[part]
                    }
                }

                // 已经是 className，比如来自 dataset 的
                if (_.isString(point)) {
                    return point
                }

                // 不能识别的，返回无效标识
                return INVALID_SELECTOR
            })
        }


        // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined
        function isEmptyAttrValue(o) {
            return o == null || o === undefined
        }

        function trimRightUndefine(argus) {
            for (var i = argus.length - 1; i >= 0; i--) {
                if (argus[i] === undefined) {
                    argus.pop()
                } else {
                    break
                }
            }
            return argus
        }

        return Widget;

    })();

    //模板辅助类
    var Templatable = {
        parseElementFromTemplate: function () {
            var t, template = this.get('template');
            if (/^#/.test(template) && (t = document.getElementById(template.substring(1)))) {
                template = t.innerHTML;
                this.set('template', template);
            }
            this.template_etpl = etpl.compile(this.get("template"));
            this.element = $(this.template_etpl(this.get("model")));
        },
        renderPartial: function (selector) {
            var all = this.template_etpl(this.get("model"));
            this.element.html(all);
        }
    }


    //定位基础组件
    var Position = (function ($) {
        var Position = {},
            VIEWPORT = {_id: 'VIEWPORT', nodeType: 1},
            isPinFixed = false,
            ua = (window.navigator.userAgent || "").toLowerCase(),
            isIE6 = ua.indexOf("msie 6") !== -1;
        // 将目标元素相对于基准元素进行定位
        // 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
        Position.pin = function (pinObject, baseObject) {
            // 将两个参数转换成标准定位对象 { element: a, x: 0, y: 0 }
            pinObject = normalize(pinObject);
            baseObject = normalize(baseObject);

            // if pinObject.element is not present
            // https://github.com/aralejs/position/pull/11
            if (pinObject.element === VIEWPORT ||
                pinObject.element._id === 'VIEWPORT') {
                return;
            }

            // 设定目标元素的 position 为绝对定位
            // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
            var pinElement = $(pinObject.element);

            if (pinElement.css('position') !== 'fixed' || isIE6) {
                pinElement.css('position', 'absolute');
                isPinFixed = false;
            }
            else {
                // 定位 fixed 元素的标志位，下面有特殊处理
                isPinFixed = true;
            }

            // 将位置属性归一化为数值
            // 注：必须放在上面这句 `css('position', 'absolute')` 之后，
            //    否则获取的宽高有可能不对
            posConverter(pinObject);
            posConverter(baseObject);

            var parentOffset = getParentOffset(pinElement);
            var baseOffset = baseObject.offset();

            // 计算目标元素的位置
            var top = baseOffset.top + baseObject.y -
                pinObject.y - parentOffset.top;

            var left = baseOffset.left + baseObject.x -
                pinObject.x - parentOffset.left;

            // 定位目标元素
            pinElement.css({left: left, top: top});
        };


        // 将目标元素相对于基准元素进行居中定位
        // 接受两个参数，分别为目标元素和定位的基准元素，都是 DOM 节点类型
        Position.center = function (pinElement, baseElement) {
            Position.pin({
                element: pinElement,
                x: '50%',
                y: '50%'
            }, {
                element: baseElement,
                x: '50%',
                y: '50%'
            });
        };


        // 这是当前可视区域的伪 DOM 节点
        // 需要相对于当前可视区域定位时，可传入此对象作为 element 参数
        Position.VIEWPORT = VIEWPORT;

        // 将参数包装成标准的定位对象，形似 { element: a, x: 0, y: 0 }
        function normalize(posObject) {
            posObject = toElement(posObject) || {};

            if (posObject.nodeType) {
                posObject = {element: posObject};
            }

            var element = toElement(posObject.element) || VIEWPORT;
            if (element.nodeType !== 1) {
                throw new Error('posObject.element is invalid.');
            }

            var result = {
                element: element,
                x: posObject.x || 0,
                y: posObject.y || 0
            };

            // config 的深度克隆会替换掉 Position.VIEWPORT, 导致直接比较为 false
            var isVIEWPORT = (element === VIEWPORT || element._id === 'VIEWPORT');

            // 归一化 offset
            result.offset = function () {
                // 若定位 fixed 元素，则父元素的 offset 没有意义
                if (isPinFixed) {
                    return {
                        left: 0,
                        top: 0
                    };
                }
                else if (isVIEWPORT) {
                    return {
                        left: $(document).scrollLeft(),
                        top: $(document).scrollTop()
                    };
                }
                else {
                    return getOffset($(element)[0]);
                }
            };

            // 归一化 size, 含 padding 和 border
            result.size = function () {
                var el = isVIEWPORT ? $(window) : $(element);
                return {
                    width: el.outerWidth(),
                    height: el.outerHeight()
                };
            };

            return result;
        }

        // 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
        function posConverter(pinObject) {
            pinObject.x = xyConverter(pinObject.x, pinObject, 'width');
            pinObject.y = xyConverter(pinObject.y, pinObject, 'height');
        }

        // 处理 x, y 值，都转化为数字
        function xyConverter(x, pinObject, type) {
            // 先转成字符串再说！好处理
            x = x + '';

            // 处理 px
            x = x.replace(/px/gi, '');

            // 处理 alias
            if (/\D/.test(x)) {
                x = x.replace(/(?:top|left)/gi, '0%')
                    .replace(/center/gi, '50%')
                    .replace(/(?:bottom|right)/gi, '100%');
            }

            // 将百分比转为像素值
            if (x.indexOf('%') !== -1) {
                //支持小数
                x = x.replace(/(\d+(?:\.\d+)?)%/gi, function (m, d) {
                    return pinObject.size()[type] * (d / 100.0);
                });
            }

            // 处理类似 100%+20px 的情况
            if (/[+\-*\/]/.test(x)) {
                try {
                    // eval 会影响压缩
                    // new Function 方法效率高于 for 循环拆字符串的方法
                    // 参照：http://jsperf.com/eval-newfunction-for
                    x = (new Function('return ' + x))();
                } catch (e) {
                    throw new Error('Invalid position value: ' + x);
                }
            }

            // 转回为数字
            return numberize(x);
        }

        // 获取 offsetParent 的位置
        function getParentOffset(element) {
            var parent = element.offsetParent();

            // IE7 下，body 子节点的 offsetParent 为 html 元素，其 offset 为
            // { top: 2, left: 2 }，会导致定位差 2 像素，所以这里将 parent
            // 转为 document.body
            if (parent[0] === document.documentElement) {
                parent = $(document.body);
            }

            // 修正 ie6 下 absolute 定位不准的 bug
            if (isIE6) {
                parent.css('zoom', 1);
            }

            // 获取 offsetParent 的 offset
            var offset;

            // 当 offsetParent 为 body，
            // 而且 body 的 position 是 static 时
            // 元素并不按照 body 来定位，而是按 document 定位
            // http://jsfiddle.net/afc163/hN9Tc/2/
            // 因此这里的偏移值直接设为 0 0
            if (parent[0] === document.body &&
                parent.css('position') === 'static') {
                offset = {top: 0, left: 0};
            } else {
                offset = getOffset(parent[0]);
            }

            // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
            offset.top += numberize(parent.css('border-top-width'));
            offset.left += numberize(parent.css('border-left-width'));

            return offset;
        }

        function numberize(s) {
            return parseFloat(s, 10) || 0;
        }

        function toElement(element) {
            return $(element)[0];
        }

        // fix jQuery 1.7.2 offset
        // document.body 的 position 是 absolute 或 relative 时
        // jQuery.offset 方法无法正确获取 body 的偏移值
        //   -> http://jsfiddle.net/afc163/gMAcp/
        // jQuery 1.9.1 已经修正了这个问题
        //   -> http://jsfiddle.net/afc163/gMAcp/1/
        // 这里先实现一份
        // 参照 kissy 和 jquery 1.9.1
        //   -> https://github.com/kissyteam/kissy/blob/master/src/dom/sub-modules/base/src/base/offset.js#L366
        //   -> https://github.com/jquery/jquery/blob/1.9.1/src/offset.js#L28
        function getOffset(element) {
            var box = element.getBoundingClientRect(),
                docElem = document.documentElement;

            // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
            return {
                left: box.left + (window.pageXOffset || docElem.scrollLeft) -
                (docElem.clientLeft || document.body.clientLeft || 0),
                top: box.top + (window.pageYOffset || docElem.scrollTop) -
                (docElem.clientTop || document.body.clientTop || 0)
            };
        }

        return Position;
    })($);
    //定位基础组件

    //iframe组件
    var IframeShim = (function ($, Position) {
        var isIE6 = (window.navigator.userAgent || '').toLowerCase().indexOf('msie 6') !== -1;

        // target 是需要添加垫片的目标元素，可以传 `DOM Element` 或 `Selector`
        function Shim(target) {
            // 如果选择器选了多个 DOM，则只取第一个
            this.target = $(target).eq(0);
        }

        // 根据目标元素计算 iframe 的显隐、宽高、定位
        Shim.prototype.sync = function () {
            var target = this.target;
            var iframe = this.iframe;

            // 如果未传 target 则不处理
            if (!target.length) return this;

            var height = target.outerHeight();
            var width = target.outerWidth();

            // 如果目标元素隐藏，则 iframe 也隐藏
            // jquery 判断宽高同时为 0 才算隐藏，这里判断宽高其中一个为 0 就隐藏
            // http://api.jquery.com/hidden-selector/
            if (!height || !width || target.is(':hidden')) {
                iframe && iframe.hide();
            } else {
                // 第一次显示时才创建：as lazy as possible
                iframe || (iframe = this.iframe = createIframe(target));

                iframe.css({
                    'height': height,
                    'width': width
                });

                Position.pin(iframe[0], target[0]);
                iframe.show();
            }

            return this;
        };

        // 销毁 iframe 等
        Shim.prototype.destroy = function () {
            if (this.iframe) {
                this.iframe.remove();
                delete this.iframe;
            }
            delete this.target;
        };


        // 在 target 之前创建 iframe，这样就没有 z-index 问题
        // iframe 永远在 target 下方
        function createIframe(target) {
            var css = {
                display: 'none',
                border: 'none',
                opacity: 0,
                position: 'absolute'
            };

            // 如果 target 存在 zIndex 则设置
            var zIndex = target.css('zIndex');
            if (zIndex && zIndex > 0) {
                css.zIndex = zIndex - 1;
            }

            return $('<iframe>', {
                src: 'javascript:\'\'', // 不加的话，https 下会弹警告
                frameborder: 0,
                css: css
            }).insertBefore(target);
        }

        if (isIE6) {
            return Shim;
        } else {
            // 除了 IE6 都返回空函数
            function Noop() {
            }

            Noop.prototype.sync = function () {
                return this
            };
            Noop.prototype.destroy = Noop;

            return Noop;
        }
    })($, Position);
    //iframe组件

    var Over = (function ($, Position, Shim, Widget) {
        // Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable）
        // 是一切悬浮类 UI 组件的基类
        var Overlay = Widget.extend({

            attrs: {
                // 基本属性
                width: null,
                height: null,
                zIndex: 5100,
                visible: false,

                // 定位配置
                align: {
                    // element 的定位点，默认为左上角
                    selfXY: [0, 0],
                    // 基准定位元素，默认为当前可视区域
                    baseElement: Position.VIEWPORT,
                    // 基准定位元素的定位点，默认为左上角
                    baseXY: [0, 0]
                },

                // 父元素
                parentNode: document.body
            },

            show: function () {
                // 若从未渲染，则调用 render
                if (!this.rendered) {
                    this.render();
                }
                this.set('visible', true);
                return this;
            },

            hide: function () {
                this.set('visible', false);
                return this;
            },

            setup: function () {
                var $this = this;
                // 加载 iframe 遮罩层并与 overlay 保持同步
                this._setupShim();
                // 窗口resize时，重新定位浮层
                this._setupResize();

                this.after('render', function () {
                    var _pos = $this.element.css('position');
                    if (_pos === 'static' || _pos === 'relative') {
                        $this.element.css({
                            position: 'absolute',
                            left: '-9999px',
                            top: '-9999px'
                        });
                    }
                });
                // 统一在显示之后重新设定位置
                this.after('show', function () {
                    $this._setPosition();
                });
            },

            destroy: function () {
                // 销毁两个静态数组中的实例
                erase(this, Overlay.allOverlays);
                erase(this, Overlay.blurOverlays);
                return Overlay.superclass.destroy.call(this);
            },

            // 进行定位
            _setPosition: function (align) {
                // 不在文档流中，定位无效
                if (!isInDocument(this.element[0])) return;

                align || (align = this.get('align'));

                // 如果align为空，表示不需要使用js对齐
                if (!align) return;

                var isHidden = this.element.css('display') === 'none';

                // 在定位时，为避免元素高度不定，先显示出来
                if (isHidden) {
                    this.element.css({
                        visibility: 'hidden',
                        display: 'block'
                    });
                }

                Position.pin({
                    element: this.element,
                    x: align.selfXY[0],
                    y: align.selfXY[1]
                }, {
                    element: align.baseElement,
                    x: align.baseXY[0],
                    y: align.baseXY[1]
                });

                // 定位完成后，还原
                if (isHidden) {
                    this.element.css({
                        visibility: '',
                        display: 'none'
                    });
                }

                return this;
            },

            // 加载 iframe 遮罩层并与 overlay 保持同步
            _setupShim: function () {
                var shim = new Shim(this.element);

                // 在隐藏和设置位置后，要重新定位
                // 显示后会设置位置，所以不用绑定 shim.sync
                this.after('hide _setPosition', shim.sync, shim);

                // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
                var attrs = ['width', 'height'];
                for (var attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        this.on('change:' + attr, shim.sync, shim);
                    }
                }

                // 在销魂自身前要销毁 shim
                this.before('destroy', shim.destroy, shim);
            },

            // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
            _setupResize: function () {
                Overlay.allOverlays.push(this);
            },

            // 除了 element 和 relativeElements，点击 body 后都会隐藏 element
            _blurHide: function (arr) {
                arr = $.makeArray(arr);
                arr.push(this.element);
                this._relativeElements = arr;
                Overlay.blurOverlays.push(this);
            },

            // 用于 set 属性后的界面更新
            _onRenderWidth: function (val) {
                this.element.css('width', val);
            },

            _onRenderHeight: function (val) {
                this.element.css('height', val);
            },

            _onRenderZIndex: function (val) {
                this.element.css('zIndex', val);
            },

            _onRenderAlign: function (val) {
                this._setPosition(val);
            },

            _onRenderVisible: function (val) {
                this.element[val ? 'show' : 'hide']();
            }

        });

        // 绑定 blur 隐藏事件
        Overlay.blurOverlays = [];
        $(document).on('click', function (e) {
            hideBlurOverlays(e);
        });

        // 绑定 resize 重新定位事件
        var timeout;
        var winWidth = $(window).width();
        var winHeight = $(window).height();
        Overlay.allOverlays = [];

        $(window).resize(function () {
            timeout && clearTimeout(timeout);
            timeout = setTimeout(function () {
                var winNewWidth = $(window).width();
                var winNewHeight = $(window).height();

                // IE678 莫名其妙触发 resize
                // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
                if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
                    $(Overlay.allOverlays).each(function (i, item) {
                        // 当实例为空或隐藏时，不处理
                        if (!item || !item.get('visible')) {
                            return;
                        }
                        item._setPosition();
                    });
                }

                winWidth = winNewWidth;
                winHeight = winNewHeight;
            }, 500);
        });

        function isInDocument(element) {
            return $.contains(document.documentElement, element);
        }

        function hideBlurOverlays(e) {
            $(Overlay.blurOverlays).each(function (index, item) {
                // 当实例为空或隐藏时，不处理
                if (!item || !item.get('visible')) {
                    return;
                }

                // 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
                for (var i = 0; i < item._relativeElements.length; i++) {
                    var el = $(item._relativeElements[i])[0];
                    if (el === e.target || $.contains(el, e.target)) {
                        return;
                    }
                }

                // 到这里，判断触发了元素的 blur 事件，隐藏元素
                item.hide();
            });
        }

        // 从数组中删除对应元素
        function erase(target, array) {
            for (var i = 0; i < array.length; i++) {
                if (target === array[i]) {
                    array.splice(i, 1);
                    return array;
                }
            }
        }

        return Overlay;
    })($, Position, IframeShim, Widget);

    var Mask = (function ($, Position, Over) {
        var ua = (window.navigator.userAgent || "").toLowerCase(),
            isIE6 = ua.indexOf("msie 6") !== -1,
            body = $(document.body),
            doc = $(document);


        // Mask
        // ----------
        // 全屏遮罩层组件
        var Mask = Over.extend({
            attrs: {
                width: isIE6 ? doc.outerWidth(true) : '100%',
                height: isIE6 ? doc.outerHeight(true) : '100%',

                className: 'ui-mask',
                opacity: 0.2,
                backgroundColor: '#000',
                style: {
                    position: isIE6 ? 'absolute' : 'fixed',
                    top: 0,
                    left: 0
                },

                align: {
                    // undefined 表示相对于当前可视范围定位
                    baseElement: isIE6 ? body : undefined
                }
            },

            show: function () {
                if (isIE6) {
                    this.set('width', doc.outerWidth(true));
                    this.set('height', doc.outerHeight(true));
                }
                return Mask.superclass.show.call(this);
            },

            _onRenderBackgroundColor: function (val) {
                this.element.css('backgroundColor', val);
            },

            _onRenderOpacity: function (val) {
                this.element.css('opacity', val);
            }
        });

        // 单例
        return new Mask();
    })($, Position, Over);

    var Overlay = (function (over, mask) {
        over.Mask = mask;
        return over;
    })(Over, Mask);


    var Popup = (function ($, Overlay) {
        // Popup 是可触发 Overlay 型 UI 组件
        var Popup = Overlay.extend({
            attrs: {
                // 触发元素
                trigger: {
                    value: null,
                    // required
                    getter: function (val) {
                        return $(val);
                    }
                },

                // 触发类型
                triggerType: 'hover',
                // or click or focus
                // 触发事件委托的对象
                delegateNode: {
                    value: null,
                    getter: function (val) {
                        return $(val);
                    }
                },

                // 默认的定位参数
                align: {
                    value: {
                        baseXY: [0, '100%'],
                        selfXY: [0, 0]
                    },
                    setter: function (val) {
                        if (!val) {
                            return;
                        }
                        if (val.baseElement) {
                            this._specifiedBaseElement = true;
                        } else if (this.activeTrigger) {
                            // 若给的定位元素未指定基准元素
                            // 就给一个...
                            val.baseElement = this.activeTrigger;
                        }
                        return val;
                    },
                    getter: function (val) {
                        // 若未指定基准元素，则按照当前的触发元素进行定位
                        return $.extend({}, val, this._specifiedBaseElement ? {} : {
                            baseElement: this.activeTrigger
                        });
                    }
                },

                // 延迟触发和隐藏时间
                delay: 70,

                // 是否能够触发
                // 可以通过set('disabled', true)关闭
                disabled: false,

                // 基本的动画效果，可选 fade|slide
                effect: '',

                // 动画的持续时间
                duration: 250

            },

            setup: function () {
                Popup.superclass.setup.call(this);
                this._bindTrigger();
                this._blurHide(this.get('trigger'));

                // 默认绑定activeTrigger为第一个元素
                // for https://github.com/aralejs/popup/issues/6
                this.activeTrigger = this.get('trigger').eq(0);

                // 当使用委托事件时，_blurHide 方法对于新添加的节点会失效
                // 这时需要重新绑定
                var that = this;
                if (this.get('delegateNode')) {
                    this.before('show', function () {
                        that._relativeElements = that.get('trigger');
                        that._relativeElements.push(that.element);
                    });
                }
            },

            render: function () {
                Popup.superclass.render.call(this);

                // 通过 template 生成的元素默认也应该是不可见的
                // 所以插入元素前强制隐藏元素，#20
                this.element.hide();
                return this;
            },

            show: function () {
                if (this.get('disabled')) {
                    return;
                }
                return Popup.superclass.show.call(this);
            },

            // triggerShimSync 为 true 时
            // 表示什么都不做，只是触发 hide 的 before/after 绑定方法
            hide: function (triggerShimSync) {
                if (!triggerShimSync) {
                    return Popup.superclass.hide.call(this);
                }
                return this;
            },

            _bindTrigger: function () {
                var triggerType = this.get('triggerType');

                if (triggerType === 'click') {
                    this._bindClick();
                } else if (triggerType === 'focus') {
                    this._bindFocus();
                } else {
                    // 默认是 hover
                    this._bindHover();
                }
            },

            _bindClick: function () {
                var that = this;

                bindEvent('click', this.get('trigger'), function (e) {
                    // this._active 这个变量表明了当前触发元素是激活状态
                    if (this._active === true) {
                        that.hide();
                    } else {
                        // 将当前trigger标为激活状态
                        makeActive(this);
                        that.show();
                    }
                }, this.get('delegateNode'), this);

                // 隐藏前清空激活状态
                this.before('hide', function () {
                    makeActive();
                });

                // 处理所有trigger的激活状态
                // 若 trigger 为空，相当于清除所有元素的激活状态
                function makeActive(trigger) {
                    if (that.get('disabled')) {
                        return;
                    }
                    that.get('trigger').each(function (i, item) {
                        if (trigger == item) {
                            item._active = true;
                            // 标识当前点击的元素
                            that.activeTrigger = $(item);
                        } else {
                            item._active = false;
                        }
                    });
                }
            },

            _bindFocus: function () {
                var that = this;

                bindEvent('focus', this.get('trigger'), function () {
                    // 标识当前点击的元素
                    that.activeTrigger = $(this);
                    that.show();
                }, this.get('delegateNode'), this);

                bindEvent('blur', this.get('trigger'), function () {
                    var blurTrigger = this;
                    setTimeout(function () {
                        // 当 blur 的触发元素和当前的 activeTrigger 一样时才能干掉
                        // 修复 https://github.com/aralejs/popup/issues/27
                        if (!that._downOnElement && that.activeTrigger[0] === blurTrigger) {
                            that.hide();
                        }
                        that._downOnElement = false;
                    }, that.get('delay'));
                }, this.get('delegateNode'), this);

                // 为了当input blur时能够选择和操作弹出层上的内容
                this.delegateEvents("mousedown", function (e) {
                    this._downOnElement = true;
                });
            },

            _bindHover: function () {
                var trigger = this.get('trigger');
                var delegateNode = this.get('delegateNode');
                var delay = this.get('delay');

                var showTimer, hideTimer;
                var that = this;

                // 当 delay 为负数时
                // popup 变成 tooltip 的效果
                if (delay < 0) {
                    this._bindTooltip();
                    return;
                }

                bindEvent('mouseenter', trigger, function () {
                    clearTimeout(hideTimer);
                    hideTimer = null;

                    // 标识当前点击的元素
                    that.activeTrigger = $(this);
                    showTimer = setTimeout(function () {
                        that.show();
                    }, delay);
                }, delegateNode, this);

                bindEvent('mouseleave', trigger, leaveHandler, delegateNode, this);

                // 鼠标在悬浮层上时不消失
                this.delegateEvents("mouseenter", function () {
                    clearTimeout(hideTimer);
                });
                this.delegateEvents("mouseleave", leaveHandler);

                this.element.on('mouseleave', 'select', function (e) {
                    e.stopPropagation();
                });

                function leaveHandler(e) {
                    clearTimeout(showTimer);
                    showTimer = null;

                    if (that.get('visible')) {
                        hideTimer = setTimeout(function () {
                            that.hide();
                        }, delay);
                    }
                }
            },

            _bindTooltip: function () {
                var trigger = this.get('trigger');
                var delegateNode = this.get('delegateNode');
                var that = this;

                bindEvent('mouseenter', trigger, function () {
                    // 标识当前点击的元素
                    that.activeTrigger = $(this);
                    that.show();
                }, delegateNode, this);

                bindEvent('mouseleave', trigger, function () {
                    that.hide();
                }, delegateNode, this);
            },

            _onRenderVisible: function (val, originVal) {
                // originVal 为 undefined 时不继续执行
                if (val === !!originVal) {
                    return;
                }

                var fade = (this.get('effect').indexOf('fade') !== -1);
                var slide = (this.get('effect').indexOf('slide') !== -1);
                var animConfig = {};
                slide && (animConfig.height = (val ? 'show' : 'hide'));
                fade && (animConfig.opacity = (val ? 'show' : 'hide'));

                // 需要在回调时强制调一下 hide
                // 来触发 iframe-shim 的 sync 方法
                // 修复 ie6 下 shim 未隐藏的问题
                // visible 只有从 true 变为 false 时，才调用这个 hide
                var that = this;
                var hideComplete = val ?
                    function () {
                        that.trigger('animated');
                    } : function () {
                    // 参数 true 代表只是为了触发 shim 方法
                    that.hide(true);
                    that.trigger('animated');
                };

                if (fade || slide) {
                    this.element.stop(true, true).animate(animConfig, this.get('duration'), hideComplete).css({
                        'visibility': 'visible'
                    });
                } else {
                    this.element[val ? 'show' : 'hide']();
                }
            }

        });

        // 一个绑定事件的简单封装
        function bindEvent(type, element, fn, delegateNode, context) {
            var hasDelegateNode = delegateNode && delegateNode[0];

            context.delegateEvents(
                hasDelegateNode ? delegateNode : element, hasDelegateNode ? type + " " + element.selector : type, function (e) {
                    fn.call(e.currentTarget, e);
                });
        }

        return Popup;
    })($, Overlay);

    var BasicTip = Popup.extend({
        attrs: {
            // 提示内容
            content: null,

            // 提示框在目标的位置方向 [up|down|left|right]
            direction: 'up',

            // 提示框离目标距离(px)
            distance: 8,

            // 箭头偏移位置(px)，负数表示箭头位置从最右边或最下边开始算
            arrowShift: 22,

            // 箭头指向 trigger 的水平或垂直的位置
            pointPos: '50%'
        },

        _setAlign: function () {
            var alignObject = {},
                arrowShift = this.get('arrowShift'),
                distance = this.get('distance'),
                pointPos = this.get('pointPos'),
                direction = this.get('direction');

            if (arrowShift < 0) {
                arrowShift = '100%' + arrowShift;
            }

            if (direction === 'up') {
                alignObject.baseXY = [pointPos, 0];
                alignObject.selfXY = [arrowShift, '100%+' + distance];
            } else if (direction === 'down') {
                alignObject.baseXY = [pointPos, '100%+' + distance];
                alignObject.selfXY = [arrowShift, 0];
            } else if (direction === 'left') {
                alignObject.baseXY = [0, pointPos];
                alignObject.selfXY = ['100%+' + distance, arrowShift];
            } else if (direction === 'right') {
                alignObject.baseXY = ['100%+' + distance, pointPos];
                alignObject.selfXY = [0, arrowShift];
            }

            alignObject.comeFromArrowPosition = true;
            this.set('align', alignObject);
        },

        // 用于 set 属性后的界面更新
        _onRenderContent: function (val) {
            var ctn = this.$('[data-role="content"]');
            if (typeof val !== 'string') {
                val = val.call(this);
            }
            ctn && ctn.html(val);
        }

    });

    var TipTemplate = '<div class="ui-poptip"><div class="ui-poptip-shadow"><div class="ui-poptip-container"><div class="ui-poptip-arrow"><em></em><span></span> </div><div class="ui-poptip-content" data-role="content"></div></div></div></div>';

    // 气泡提示弹出组件
    var Tip = BasicTip.extend({

        attrs: {
            template: TipTemplate,

            // 提示内容
            content: 'A TIP BOX',

            // 箭头位置
            // 按钟表点位置，目前支持1、2、5、7、10、11点位置
            arrowPosition: 7,

            align: {
                setter: function (val) {
                    // 用户初始化时主动设置了 align
                    // 且并非来自 arrowPosition 的设置
                    if (val && !val.comeFromArrowPosition) {
                        this._specifiedAlign = true;
                    }
                    return val;
                }
            },

            // 颜色 [yellow|blue|white]
            theme: 'yellow',

            // 当弹出层显示在屏幕外时，是否自动转换浮层位置
            inViewport: false
        },

        setup: function () {
            BasicTip.superclass.setup.call(this);
            this._originArrowPosition = this.get('arrowPosition');

            this.after('show', function () {
                this._makesureInViewport();
            });
        },

        _makesureInViewport: function () {
            if (!this.get('inViewport')) {
                return;
            }
            var ap = this._originArrowPosition,
                scrollTop = $(window).scrollTop(),
                viewportHeight = $(window).outerHeight(),
                elemHeight = this.element.height() + this.get('distance'),
                triggerTop = this.get('trigger').offset().top,
                triggerHeight = this.get('trigger').height(),
                arrowMap = {
                    '1': 5,
                    '5': 1,
                    '7': 11,
                    '11': 7
                };

            if ((ap == 11 || ap == 1) && (triggerTop + triggerHeight > scrollTop + viewportHeight - elemHeight)) {
                // tip 溢出屏幕下方
                this.set('arrowPosition', arrowMap[ap]);
            } else if ((ap == 7 || ap == 5) && (triggerTop < scrollTop + elemHeight)) {
                // tip 溢出屏幕上方
                this.set('arrowPosition', arrowMap[ap]);
            } else {
                // 复原
                this.set('arrowPosition', this._originArrowPosition);
            }
        },

        // 用于 set 属性后的界面更新
        _onRenderArrowPosition: function (val, prev) {
            val = parseInt(val, 10);
            var arrow = this.$('.ui-poptip-arrow');
            arrow.removeClass('ui-poptip-arrow-' + prev).addClass('ui-poptip-arrow-' + val);

            // 用户设置了 align
            // 则直接使用 align 表示的位置信息，忽略 arrowPosition
            if (this._specifiedAlign) {
                return;
            }

            var direction = '',
                arrowShift = 0;
            if (val === 10) {
                direction = 'right';
                arrowShift = 20;
            }
            else if (val === 11) {
                direction = 'down';
                arrowShift = 22;
            }
            else if (val === 1) {
                direction = 'down';
                arrowShift = -22;
            }
            else if (val === 2) {
                direction = 'left';
                arrowShift = 20;
            }
            else if (val === 5) {
                direction = 'up';
                arrowShift = -22;
            }
            else if (val === 7) {
                direction = 'up';
                arrowShift = 22;
            }
            this.set('direction', direction);
            this.set('arrowShift', arrowShift);
            this._setAlign();
        },

        _onRenderWidth: function (val) {
            this.$('[data-role="content"]').css('width', val);
        },

        _onRenderHeight: function (val) {
            this.$('[data-role="content"]').css('height', val);
        },

        _onRenderTheme: function (val, prev) {
            this.element.removeClass('ui-poptip-' + prev);
            this.element.addClass('ui-poptip-' + val);
        }

    });

    var AdvanceTip = Overlay.extend({
        attrs: {
            template: TipTemplate,
            // 提示内容
            content: 'A TIP BOX',
            // 箭头位置
            // 按钟表点位置，目前支持1、2、5、7、10、11点位置
            arrowPosition: 11,
            align: {
                value: {
                    baseXY: [0, '100%'],
                    selfXY: [0, 0]
                },
                getter: function (val) {
                    // 若未指定基准元素，则按照当前的触发元素进行定位
                    return $.extend({}, val, {baseElement: this.$el});
                }
            },
            // 颜色 [yellow|blue|white]
            theme: 'yellow',

            // 提示框在目标的位置方向 [up|down|left|right]
            direction: 'up',

            // 提示框离目标距离(px)
            distance: 8,

            // 箭头偏移位置(px)，负数表示箭头位置从最右边或最下边开始算
            arrowShift: 22,

            // 箭头指向 trigger 的水平或垂直的位置
            pointPos: '50%',

            // 当弹出层显示在屏幕外时，是否自动转换浮层位置
            inViewport: false
        },

        setup: function () {
            AdvanceTip.superclass.setup.call(this);
            this._originArrowPosition = this.get('arrowPosition');

            this.after('show', function () {
                this._makesureInViewport();
            });
        },
        tip: function ($el) {
            this.$el = $el;
            var tipinfo = $el.data("tipinfo");
            if (tipinfo) {
                var tipinfo1 = $el.attr("data-tipinfo");
                this.set("content", (tipinfo1?tipinfo1 : tipinfo)  + "");
                this.show();
            } else {
                this.hide();
            }
        },
        render: function () {
            AdvanceTip.superclass.render.call(this);
            this.element.hide();
            return this;
        },
        _setAlign: function () {
            var alignObject = {},
                arrowShift = this.get('arrowShift'),
                distance = this.get('distance'),
                pointPos = this.get('pointPos'),
                direction = this.get('direction');

            if (arrowShift < 0) {
                arrowShift = '100%' + arrowShift;
            }

            if (direction === 'up') {
                alignObject.baseXY = [pointPos, 0];
                alignObject.selfXY = [arrowShift, '100%+' + distance];
            }
            else if (direction === 'down') {
                alignObject.baseXY = [pointPos, '100%+' + distance];
                alignObject.selfXY = [arrowShift, 0];
            }
            else if (direction === 'left') {
                alignObject.baseXY = [0, pointPos];
                alignObject.selfXY = ['100%+' + distance, arrowShift];
            }
            else if (direction === 'right') {
                alignObject.baseXY = ['100%+' + distance, pointPos];
                alignObject.selfXY = [0, arrowShift];
            }

            alignObject.comeFromArrowPosition = true;
            this.set('align', alignObject);
        },

        // 用于 set 属性后的界面更新
        _onRenderContent: function (val) {
            var ctn = this.$('[data-role="content"]');
            if (typeof val !== 'string') {
                val = val.call(this);
            }
            ctn && ctn.html(val);
        },
        _makesureInViewport: function () {
            if (!this.get('inViewport')) {
                return;
            }
            var ap = this._originArrowPosition,
                scrollTop = $(window).scrollTop(),
                viewportHeight = $(window).outerHeight(),
                elemHeight = this.element.height() + this.get('distance'),
                triggerTop = this.$el.offset().top,
                triggerHeight = this.$el.height(),
                arrowMap = {
                    '1': 5,
                    '5': 1,
                    '7': 11,
                    '11': 7
                };

            if ((ap == 11 || ap == 1) && (triggerTop + triggerHeight > scrollTop + viewportHeight - elemHeight)) {
                // tip 溢出屏幕下方
                this.set('arrowPosition', arrowMap[ap]);
            } else if ((ap == 7 || ap == 5) && (triggerTop < scrollTop + elemHeight)) {
                // tip 溢出屏幕上方
                this.set('arrowPosition', arrowMap[ap]);
            } else {
                // 复原
                this.set('arrowPosition', this._originArrowPosition);
            }
        },

        // 用于 set 属性后的界面更新
        _onRenderArrowPosition: function (val, prev) {
            val = parseInt(val, 10);
            var arrow = this.$('.ui-poptip-arrow');
            arrow.removeClass('ui-poptip-arrow-' + prev).addClass('ui-poptip-arrow-' + val);

            // 用户设置了 align
            // 则直接使用 align 表示的位置信息，忽略 arrowPosition
            if (this._specifiedAlign) {
                return;
            }

            var direction = '',
                arrowShift = 0;
            if (val === 10) {
                direction = 'right';
                arrowShift = 20;
            }
            else if (val === 11) {
                direction = 'down';
                arrowShift = 22;
            }
            else if (val === 1) {
                direction = 'down';
                arrowShift = -22;
            }
            else if (val === 2) {
                direction = 'left';
                arrowShift = 20;
            }
            else if (val === 5) {
                direction = 'up';
                arrowShift = -22;
            }
            else if (val === 7) {
                direction = 'up';
                arrowShift = 22;
            }
            this.set('direction', direction);
            this.set('arrowShift', arrowShift);
            this._setAlign();
        },

        _onRenderWidth: function (val) {
            this.$('[data-role="content"]').css('width', val);
        },

        _onRenderHeight: function (val) {
            this.$('[data-role="content"]').css('height', val);
        },
        _onRenderTheme: function (val, prev) {
            this.element.removeClass('ui-poptip-' + prev);
            this.element.addClass('ui-poptip-' + val);
        }
    });

    return {
        Class: Class,
        Events: Events,
        Base: Base,
        Widget: Widget,
        Templatable: Templatable,
        Position: Position,
        IframeShim: IframeShim,
        Overlay: Overlay,
        Popup: Popup,
        Tip: Tip,
        AdvanceTip: AdvanceTip
    }
})
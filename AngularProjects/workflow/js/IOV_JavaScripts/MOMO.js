/**
 * Created by weimo on 2016/3/8.
 */
define(["underscore", "jquery", "etpl"], function (_, $, etpl) {
    var M;

    var hasOwn = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        OP = Object.prototype,
        Native = Array.prototype,
        NATIVE_FN_REGEX = /\{\s*\[(?:native code|function)\]\s*\}/i,
        hasWin = (typeof window != 'undefined'),
        win = (hasWin) ? window : null,
        doc = (hasWin) ? win.document : null,
        UNDEFINED,
        PERIOD = '.',
        VERSION = "1.1.1";

    function MOMO() {
        var _M = this,
            instanceOf = function (o, type) {
                return (o && o.hasOwnProperty && (o instanceof type));
            };

        if (!(instanceOf(_M, MOMO))) {
            _M = new MOMO();
        } else {
            _M._init();
        }

        _M.instanceOf = instanceOf;

        return _M;
    };

    var proto = {
        _init: function () {
            var M = this,
                G_ENV = MOMO.Env,
                Env = M.Env,
                prop;

            if (!Env) {
                M.Env = {
                    _idx: 0,
                    _used: {},
                    _attached: {},
                    _exported: {},
                    _missed: [],
                    _yidx: 0,
                    _uidx: 0,
                    _guidp: 'm'
                };
                Env = M.Env;

                if (G_ENV && M !== MOMO) {
                    Env._yidx = ++G_ENV._yidx;
                    Env._guidp = ('momo_' + VERSION + '_' +
                    Env._yidx + '_' + _.now()).replace(/[^a-z0-9_]+/g, '_');
                } else if (MOMO._MOMO) {

                    G_ENV = MOMO._MOMO.Env;
                    Env._yidx += G_ENV._yidx;
                    Env._uidx += G_ENV._uidx;

                    for (prop in G_ENV) {
                        if (!(prop in Env)) {
                            Env[prop] = G_ENV[prop];
                        }
                    }

                    delete MOMO._MOMO;
                }

                M.id = M.stamp(M);
            }

            if (M !== MOMO) {
                M.constructor = MOMO;
            }

            M.config = M.config || {
                    bootstrap: true,
                    cacheUse: true,
                    debug: true,
                    doc: doc,
                    throwFail: true,
                    useBrowserConsole: true,
                    useNativeES5: true,
                    win: win
                };
        },
        stamp: function (o, readOnly) {
            var uid;
            if (!o) {
                return o;
            }

            if (o.uniqueID && o.nodeType && o.nodeType !== 9) {
                uid = o.uniqueID;
            } else {
                uid = (typeof o === 'string') ? o : o._yuid;
            }

            if (!uid) {
                uid = this.guid();
                if (!readOnly) {
                    try {
                        o._yuid = uid;
                    } catch (e) {
                        uid = null;
                    }
                }
            }
            return uid;
        },
        namespace: function () {
            var a = arguments, o, i = 0, j, d, arg;

            for (; i < a.length; i++) {
                o = this;
                arg = a[i];
                if (arg.indexOf(PERIOD) > -1) {
                    d = arg.split(PERIOD);
                    for (j = (d[0] == 'YAHOO') ? 1 : 0; j < d.length; j++) {
                        o[d[j]] = o[d[j]] || {};
                        o = o[d[j]];
                    }
                } else {
                    o[arg] = o[arg] || {};
                    o = o[arg];
                }
            }
            return o;
        },
        guid: function (pre) {
            var id = this.Env._guidp + '_' + (++this.Env._uidx);
            return (pre) ? (pre + id) : id;
        }
    };
    MOMO.prototype = proto;
    for (var prop in proto) {
        if (proto.hasOwnProperty(prop)) {
            MOMO[prop] = proto[prop];
        }
    }
    MOMO._init();
    M = MOMO();

    (function (_, M) {
        var TYPES = {
            'undefined': 'undefined',
            'number': 'number',
            'boolean': 'boolean',
            'string': 'string',
            '[object Function]': 'function',
            '[object RegExp]': 'regexp',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object Error]': 'error'
        };
        M.Lang = {
            _isNative: function (fn) {
                return !!(M.config.useNativeES5 && fn && NATIVE_FN_REGEX.test(fn));
            },
            isObject: function (o, failfn) {
                var t = typeof o;
                return (o && (t === 'object' ||
                    (!failfn && (t === 'function' || _.isFunction(o))))) || false;
            },
            type: function (o) {
                return TYPES[typeof o] || TYPES[toString.call(o)] || (o ? 'object' : 'null');
            }
        }
    })(_, M);

    /**
     * log日志管理
     */
    (function (_, M) {
        var INSTANCE = M,
            logarr = [];
        INSTANCE.log = function () {
            logarr.length = 0;
            for (var i = 0; i < arguments.length; i++) {
                logarr.push(arguments[i] + "    ");
            }
            if (console && console.log) {
                console.log(logarr.join(""));
            }
            return M;
        };

        INSTANCE.message = function () {
            return INSTANCE.log.apply(INSTANCE, arguments);
        };

    })(_, M);

    /**
     * Array
     */
    (function (_, M) {
        /**
         * 包装Array对象
         * @param thing
         * @param startIndex
         * @param force
         * @returns {*}
         * @constructor
         */
        function YArray(thing, startIndex, force) {
            var len, result;

            startIndex || (startIndex = 0);

            if (force || YArray.test(thing)) {
                try {
                    return Native.slice.call(thing, startIndex);
                } catch (ex) {
                    result = [];

                    for (len = thing.length; startIndex < len; ++startIndex) {
                        result.push(thing[startIndex]);
                    }

                    return result;
                }
            }

            return [thing];
        }

        M.Array = YArray;

        /**
         * 返回一个对象实例，根据2个数组
         * @exapmle
         * M.Array.hash(['a', 'b', 'c'], ['foo', 'bar']);=> {a: 'foo', b: 'bar', c: true}
         * @param keys key数组
         * @param values value数组
         * @returns {{}} object
         */
        YArray.hash = function (keys, values) {
            var hash = {},
                vlen = (values && values.length) || 0,
                i, len;

            for (i = 0, len = keys.length; i < len; ++i) {
                if (i in keys) {
                    hash[keys[i]] = vlen > i && i in values ? values[i] : true;
                }
            }

            return hash;
        };


        YArray.test = function (obj) {
            var result = 0;

            if (_.isArray(obj)) {
                result = 1;
            } else if (_.isObject(obj)) {
                try {
                    if ('length' in obj && !obj.tagName && !(obj.scrollTo && obj.document) && !obj.apply) {
                        result = 2;
                    }
                } catch (ex) {
                }
            }

            return result;
        };
    })(_, M);

    /**
     * m core
     */
    (function (_, M) {
        var CACHED_DELIMITER = '__';
        /**
         Returns a wrapper for a function which caches the return value of that function,
         keyed off of the combined string representation of the argument values provided
         when the wrapper is called.

         Calling this function again with the same arguments will return the cached value
         rather than executing the wrapped function.

         Note that since the cache is keyed off of the string representation of arguments
         passed to the wrapper function, arguments that aren't strings and don't provide
         a meaningful `toString()` method may result in unexpected caching behavior. For
         example, the objects `{}` and `{foo: 'bar'}` would both be converted to the
         string `[object Object]` when used as a cache key.

         @method cached
         @param {Function} source The function to memoize.
         @param {Object} [cache={}] Object in which to store cached values. You may seed
         this object with pre-existing cached values if desired.
         @param {any} [refetch] If supplied, this value is compared with the cached value
         using a `==` comparison. If the values are equal, the wrapped function is
         executed again even though a cached value exists.
         @return {Function} Wrapped function.
         @for YUI
         **/
        M.cached = function (source, cache, refetch) {
            cache || (cache = {});

            return function (arg) {
                var key = arguments.length > 1 ?
                    Array.prototype.join.call(arguments, CACHED_DELIMITER) :
                    String(arg);

                if (!(key in cache) || (refetch && cache[key] == refetch)) {
                    cache[key] = source.apply(source, arguments);
                }

                return cache[key];
            };
        };

        M.getLocation = function () {
            var win = M.config.win;
            return win && win.location;
        };

        /**
         * 返回一个全新的对象
         * @returns {{}}
         */
        M.merge = function () {
            var i = 0,
                len = arguments.length,
                result = {},
                key,
                obj;

            for (; i < len; ++i) {
                obj = arguments[i];

                for (key in obj) {
                    if (hasOwn.call(obj, key)) {
                        result[key] = obj[key];
                    }
                }
            }

            return result;
        };

        M.mix = function (receiver, supplier, overwrite, whitelist, mode, merge) {
            var alwaysOverwrite, exists, from, i, key, len, to;

            if (!receiver || !supplier) {
                return receiver || M;
            }

            if (mode) {
                if (mode === 2) {
                    M.mix(receiver.prototype, supplier.prototype, overwrite,
                        whitelist, 0, merge);
                }

                from = mode === 1 || mode === 3 ? supplier.prototype : supplier;
                to = mode === 1 || mode === 4 ? receiver.prototype : receiver;

                if (!from || !to) {
                    return receiver;
                }
            } else {
                from = supplier;
                to = receiver;
            }

            alwaysOverwrite = overwrite && !merge;

            if (whitelist) {
                for (i = 0, len = whitelist.length; i < len; ++i) {
                    key = whitelist[i];

                    if (!hasOwn.call(from, key)) {
                        continue;
                    }

                    exists = alwaysOverwrite ? false : key in to;

                    if (merge && exists && M.Lang.isObject(to[key], true)
                        && M.Lang.isObject(from[key], true)) {
                        M.mix(to[key], from[key], overwrite, null, 0, merge);
                    } else if (overwrite || !exists) {
                        to[key] = from[key];
                    }
                }
            } else {
                for (key in from) {
                    if (!hasOwn.call(from, key)) {
                        continue;
                    }

                    exists = alwaysOverwrite ? false : key in to;

                    if (merge && exists && M.Lang.isObject(to[key], true)
                        && M.Lang.isObject(from[key], true)) {
                        M.mix(to[key], from[key], overwrite, null, 0, merge);
                    } else if (overwrite || !exists) {
                        to[key] = from[key];
                    }
                }

                if (M.Object._hasEnumBug) {
                    M.mix(to, from, overwrite, M.Object._forceEnum, mode, merge);
                }
            }

            return receiver;
        };
    })(_, M);

    /**
     * object helper
     */
    (function (_, M) {
        var Lang = M.Lang;
        var O = M.Object = Lang._isNative(Object.create) ? function (obj) {
            return Object.create(obj);
        } : (function () {
            function F() {
            }

            return function (obj) {
                F.prototype = obj;
                return new F();
            };
        }());

        O._forceEnum = [
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'toLocaleString',
            'valueOf'
        ];

        O._hasEnumBug = !{valueOf: 0}.propertyIsEnumerable('valueOf');

        O._hasProtoEnumBug = (function () {
        }).propertyIsEnumerable('prototype');

        O.setValue = function (o, path, val) {
            var i,
                p = M.Array(path),
                leafIdx = p.length - 1,
                ref = o;

            if (leafIdx >= 0) {
                for (i = 0; ref !== UNDEFINED && i < leafIdx; i++) {
                    ref = ref[p[i]];
                }

                if (ref !== UNDEFINED) {
                    ref[p[i]] = val;
                } else {
                    return UNDEFINED;
                }
            }

            return o;
        };

        M.getValue = function (o, path) {
            if (!Lang.isObject(o)) {
                return UNDEFINED;
            }

            var i,
                p = M.Array(path),
                l = p.length;

            for (i = 0; o !== UNDEFINED && i < l; i++) {
                o = o[p[i]];
            }

            return o;
        };
    })(_, M);


    /**
     * oop 方法
     */
    (function (_, M) {
        var L = M.Lang,
            A = M.Array,
            CLONE_MARKER = '_~momom~_',
            toString = OP.toString;

        /**
         * 调用特定的_action_方法在,
         * @param o 数组或者对象
         * @param f  迭代器回调
         * @param c 当迭代时候的this作用于
         * @param proto 如果为true,则_o_的原型对象也会遍历
         * @param action 函数名称
         * @returns {*}
         */
        function dispatch(o, f, c, proto, action) {
            if (o && o[action] && o !== M) {
                return o[action].call(o, f, c);
            } else {
                switch (A.test(o)) {
                    case 1:
                        return A[action](o, f, c);//如果为数组
                    case 2:
                        return A[action](M.Array(o, 0, true), f, c);//如果为类数组类型
                    default:
                        return M.Object[action](o, f, c, proto);
                }
            }
        }

        /**
         * 组合
         * @param receiver
         * @param supplier
         * @param overwrite
         * @param whitelist
         * @param args
         * @returns {*}
         */
        M.augment = function (receiver, supplier, overwrite, whitelist, args) {
            var rProto = receiver.prototype,
                sequester = rProto && supplier,
                sProto = supplier.prototype,
                to = rProto || receiver,

                copy,
                newPrototype,
                replacements,
                sequestered,
                unsequester;

            args = args ? M.Array(args) : [];

            if (sequester) {
                newPrototype = {};
                replacements = {};
                sequestered = {};

                copy = function (value, key) {
                    if (overwrite || !(key in rProto)) {
                        if (toString.call(value) === '[object Function]') {
                            sequestered[key] = value;

                            newPrototype[key] = replacements[key] = function () {
                                return unsequester(this, value, arguments);
                            };
                        } else {
                            newPrototype[key] = value;
                        }
                    }
                };

                unsequester = function (instance, fn, fnArgs) {
                    for (var key in sequestered) {
                        if (hasOwn.call(sequestered, key)
                            && instance[key] === replacements[key]) {

                            instance[key] = sequestered[key];
                        }
                    }

                    supplier.apply(instance, args);

                    return fn.apply(instance, fnArgs);
                };

                if (whitelist) {
                    _.each(whitelist, function (name) {
                        if (name in sProto) {
                            copy(sProto[name], name);
                        }
                    });
                } else {
                    _.each(sProto, copy);
                }
            }

            M.mix(to, newPrototype || sProto, overwrite, whitelist);

            if (!sequester) {
                supplier.apply(to, args);
            }

            return receiver;
        };

        M.aggregate = function (r, s, ov, wl) {
            return M.mix(r, s, ov, wl, 0, true);
        };

        M.extend = function (r, s, px, sx) {
            if (!s || !r) {
                M.error('extend failed, verify dependencies');
            }

            var sp = s.prototype, rp = M.Object(sp);
            r.prototype = rp;

            rp.constructor = r;
            r.superclass = sp;

            if (s != Object && sp.constructor == OP.constructor) {
                sp.constructor = s;
            }

            if (px) {
                M.mix(rp, px, true);
            }

            if (sx) {
                M.mix(r, sx, true);
            }

            return r;
        };

        M.each = function (o, f, c, proto) {
            return dispatch(o, f, c, proto, 'each');
        };

        M.some = function (o, f, c, proto) {
            return dispatch(o, f, c, proto, 'some');
        };

        M.clone = function (o, safe, f, c, owner, cloned) {
            var o2, marked, stamp;

            if (!L.isObject(o) ||
                M.instanceOf(o, MOMO) ||
                (o.addEventListener || o.attachEvent)) {

                return o;
            }

            marked = cloned || {};

            switch (L.type(o)) {
                case 'date':
                    return new Date(o);
                case 'regexp':
                    return o;
                case 'function':
                    return o;
                case 'array':
                    o2 = [];
                    break;
                default:

                    if (o[CLONE_MARKER]) {
                        return marked[o[CLONE_MARKER]];
                    }

                    stamp = M.guid();

                    o2 = (safe) ? {} : M.Object(o);

                    o[CLONE_MARKER] = stamp;
                    marked[stamp] = o;
            }

            _.each(o, function (v, k) {
                if ((k || k === 0) && (!f || (f.call(c || this, v, k, this, o) !== false))) {
                    if (k !== CLONE_MARKER) {
                        if (k == 'prototype') {
                        } else {
                            this[k] =
                                M.clone(v, safe, f, c, owner || o, marked);
                        }
                    }
                }
            }, o2);

            if (!cloned) {
                _.each(marked, function (v, k) {
                    if (v[CLONE_MARKER]) {
                        try {
                            delete v[CLONE_MARKER];
                        } catch (e) {
                            v[CLONE_MARKER] = null;
                        }
                    }
                }, this);
                marked = null;
            }

            return o2;
        };

        M.bind = function (f, c) {
            var xargs = arguments.length > 2 ?
                M.Array(arguments, 2, true) : null;
            return function () {
                var fn = _.isString(f) ? c[f] : f,
                    args = (xargs) ?
                        xargs.concat(M.Array(arguments, 0, true)) : arguments;
                return fn.apply(c || fn, args);
            };
        };

        M.rbind = function (f, c) {
            var xargs = arguments.length > 2 ? M.Array(arguments, 2, true) : null;
            return function () {
                var fn = _.isString(f) ? c[f] : f,
                    args = (xargs) ?
                        M.Array(arguments, 0, true).concat(xargs) : arguments;
                return fn.apply(c || fn, args);
            };
        };

    })(_, M);

    /**
     * 自定义事件
     */
    (function (_, M) {
        M.Env.evt = {
            handles: {},
            plugins: {}
        };

        var DO_BEFORE = 0,//aop前置
            DO_AFTER = 1,//aop后置
            DO = {
                before: function (fn, obj, sFn, c) {
                    var f = fn, a;
                    if (c) {
                        a = [fn, c].concat(M.Array(arguments, 4, true));
                        f = M.rbind.apply(M, a);
                    }

                    return this._inject(DO_BEFORE, f, obj, sFn);
                },
                after: function (fn, obj, sFn, c) {
                    var f = fn, a;
                    if (c) {
                        a = [fn, c].concat(M.Array(arguments, 4, true));
                        f = M.rbind.apply(M, a);
                    }

                    return this._inject(DO_AFTER, f, obj, sFn);
                },

                _inject: function (when, fn, obj, sFn) {
                    var id = M.stamp(obj), o, sid;

                    if (!obj._momoaop) {
                        obj._momoaop = {};
                    }

                    o = obj._momoaop;

                    if (!o[sFn]) {
                        o[sFn] = new M.Do.Method(obj, sFn);

                        obj[sFn] = function () {
                            return o[sFn].exec.apply(o[sFn], arguments);
                        };
                    }

                    sid = id + M.stamp(fn) + sFn;

                    o[sFn].register(sid, fn, when);

                    return new M.EventHandle(o[sFn], sid);
                },

                detach: function (handle) {
                    if (handle.detach) {
                        handle.detach();
                    }
                }
            };

        M.Do = DO;


        DO.Method = function (obj, sFn) {
            this.obj = obj;
            this.methodName = sFn;
            this.method = obj[sFn];
            this.before = {};
            this.after = {};
        };

        DO.Method.prototype.register = function (sid, fn, when) {
            if (when) {
                this.after[sid] = fn;
            } else {
                this.before[sid] = fn;
            }
        };

        DO.Method.prototype._delete = function (sid) {
            delete this.before[sid];
            delete this.after[sid];
        };

        DO.Method.prototype.exec = function () {

            var args = M.Array(arguments, 0, true),
                i, ret, newRet,
                bf = this.before,
                af = this.after,
                prevented = false;

            for (i in bf) {
                if (bf.hasOwnProperty(i)) {
                    ret = bf[i].apply(this.obj, args);
                    if (ret) {
                        switch (ret.constructor) {
                            case DO.Halt:
                                return ret.retVal;
                            case DO.AlterArgs:
                                args = ret.newArgs;
                                break;
                            case DO.Prevent:
                                prevented = true;
                                break;
                            default:
                        }
                    }
                }
            }

            if (!prevented) {
                ret = this.method.apply(this.obj, args);
            }

            DO.originalRetVal = ret;
            DO.currentRetVal = ret;

            for (i in af) {
                if (af.hasOwnProperty(i)) {
                    newRet = af[i].apply(this.obj, args);
                    if (newRet && newRet.constructor === DO.Halt) {
                        return newRet.retVal;
                    } else if (newRet && newRet.constructor === DO.AlterReturn) {
                        ret = newRet.newRetVal;
                        DO.currentRetVal = ret;
                    }
                }
            }

            return ret;
        };

        DO.AlterArgs = function (msg, newArgs) {
            this.msg = msg;
            this.newArgs = newArgs;
        };

        DO.AlterReturn = function (msg, newRetVal) {
            this.msg = msg;
            this.newRetVal = newRetVal;
        };

        DO.Halt = function (msg, retVal) {
            this.msg = msg;
            this.retVal = retVal;
        };

        DO.Prevent = function (msg) {
            this.msg = msg;
        };

        DO.Error = DO.Halt;

        var YArray = M.Array,
            AFTER = 'after',
            CONFIGS = [
                'broadcast',
                'monitored',
                'bubbles',
                'context',
                'contextFn',
                'currentTarget',
                'defaultFn',
                'defaultTargetOnly',
                'details',
                'emitFacade',
                'fireOnce',
                'async',
                'host',
                'preventable',
                'preventedFn',
                'queuable',
                'silent',
                'stoppedFn',
                'target',
                'type'
            ],

            CONFIGS_HASH = YArray.hash(CONFIGS),

            nativeSlice = Array.prototype.slice,

            MOMO3_SIGNATURE = 9,
            MOMO_LOG = 'momo:log',

            mixConfigs = function (r, s, ov) {
                var p;

                for (p in s) {
                    if (CONFIGS_HASH[p] && (ov || !(p in r))) {
                        r[p] = s[p];
                    }
                }

                return r;
            };


        M.CustomEvent = function (type, defaults) {
            this.id = M.guid();
            this.type = type;
            this.silent = this.logSystem = (type === MOMO_LOG);

            if (defaults) {
                mixConfigs(this, defaults, true);
            }
        };

        M.CustomEvent.mixConfigs = mixConfigs;

        M.CustomEvent.prototype = {

            constructor: M.CustomEvent,
            signature: MOMO3_SIGNATURE,
            context: M,
            preventable: true,
            bubbles: true,
            hasSubs: function (when) {
                var s = 0,
                    a = 0,
                    subs = this._subscribers,
                    afters = this._afters,
                    sib = this.sibling;

                if (subs) {
                    s = subs.length;
                }

                if (afters) {
                    a = afters.length;
                }

                if (sib) {
                    subs = sib._subscribers;
                    afters = sib._afters;

                    if (subs) {
                        s += subs.length;
                    }

                    if (afters) {
                        a += afters.length;
                    }
                }

                if (when) {
                    return (when === 'after') ? a : s;
                }

                return (s + a);
            },
            monitor: function (what) {
                this.monitored = true;
                var type = this.id + '|' + this.type + '_' + what,
                    args = nativeSlice.call(arguments, 0);
                args[0] = type;
                return this.host.on.apply(this.host, args);
            },
            getSubs: function () {

                var sibling = this.sibling,
                    subs = this._subscribers,
                    afters = this._afters,
                    siblingSubs,
                    siblingAfters;

                if (sibling) {
                    siblingSubs = sibling._subscribers;
                    siblingAfters = sibling._afters;
                }

                if (siblingSubs) {
                    if (subs) {
                        subs = subs.concat(siblingSubs);
                    } else {
                        subs = siblingSubs.concat();
                    }
                } else {
                    if (subs) {
                        subs = subs.concat();
                    } else {
                        subs = [];
                    }
                }

                if (siblingAfters) {
                    if (afters) {
                        afters = afters.concat(siblingAfters);
                    } else {
                        afters = siblingAfters.concat();
                    }
                } else {
                    if (afters) {
                        afters = afters.concat();
                    } else {
                        afters = [];
                    }
                }

                return [subs, afters];
            },
            applyConfig: function (o, force) {
                mixConfigs(this, o, force);
            },
            _on: function (fn, context, args, when) {

                if (!fn) {
                    this.log('Invalid callback for CE: ' + this.type);
                }

                var s = new M.Subscriber(fn, context, args, when),
                    firedWith;

                if (this.fireOnce && this.fired) {

                    firedWith = this.firedWith;

                    if (this.emitFacade && this._addFacadeToArgs) {
                        this._addFacadeToArgs(firedWith);
                    }

                    if (this.async) {
                        setTimeout(M.bind(this._notify, this, s, firedWith), 0);
                    } else {
                        this._notify(s, firedWith);
                    }
                }

                if (when === AFTER) {
                    if (!this._afters) {
                        this._afters = [];
                    }
                    this._afters.push(s);
                } else {
                    if (!this._subscribers) {
                        this._subscribers = [];
                    }
                    this._subscribers.push(s);
                }

                return new M.EventHandle(this, s);
            },
            on: function (fn, context) {
                var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;

                if (this.monitored && this.host) {
                    this.host._monitor('attach', this, {
                        args: arguments
                    });
                }
                return this._on(fn, context, a, true);
            },

            after: function (fn, context) {
                var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
                return this._on(fn, context, a, AFTER);
            },

            detach: function (fn, context) {
                if (fn && fn.detach) {
                    return fn.detach();
                }

                var i, s,
                    found = 0,
                    subs = this._subscribers,
                    afters = this._afters;

                if (subs) {
                    for (i = subs.length; i >= 0; i--) {
                        s = subs[i];
                        if (s && (!fn || fn === s.fn)) {
                            this._delete(s, subs, i);
                            found++;
                        }
                    }
                }

                if (afters) {
                    for (i = afters.length; i >= 0; i--) {
                        s = afters[i];
                        if (s && (!fn || fn === s.fn)) {
                            this._delete(s, afters, i);
                            found++;
                        }
                    }
                }

                return found;
            },

            _notify: function (s, args, ef) {

                this.log(this.type + '->' + 'sub: ' + s.id);

                var ret;

                ret = s.notify(args, this);

                if (false === ret || this.stopped > 1) {
                    this.log(this.type + ' cancelled by subscriber');
                    return false;
                }

                return true;
            },

            log: function (msg, cat) {
                if (!this.silent) {
                    M.log(this.id + ': ' + msg, cat || 'info', 'event');
                }
            },

            fire: function () {
                var args = [];
                args.push.apply(args, arguments);

                return this._fire(args);
            },

            _fire: function (args) {

                if (this.fireOnce && this.fired) {
                    this.log('fireOnce event: ' + this.type + ' already fired');
                    return true;
                } else {
                    this.fired = true;

                    if (this.fireOnce) {
                        this.firedWith = args;
                    }

                    if (this.emitFacade) {
                        return this.fireComplex(args);
                    } else {
                        return this.fireSimple(args);
                    }
                }
            },

            fireSimple: function (args) {
                this.stopped = 0;
                this.prevented = 0;
                if (this.hasSubs()) {
                    var subs = this.getSubs();
                    this._procSubs(subs[0], args);
                    this._procSubs(subs[1], args);
                }
                if (this.broadcast) {
                    this._broadcast(args);
                }
                return this.stopped ? false : true;
            },

            fireComplex: function (args) {
                this.log('Missing event-custom-complex needed to emit a facade for: ' + this.type);
                args[0] = args[0] || {};
                return this.fireSimple(args);
            },

            _procSubs: function (subs, args, ef) {
                var s, i, l;

                for (i = 0, l = subs.length; i < l; i++) {
                    s = subs[i];
                    if (s && s.fn) {
                        if (false === this._notify(s, args, ef)) {
                            this.stopped = 2;
                        }
                        if (this.stopped === 2) {
                            return false;
                        }
                    }
                }

                return true;
            },

            _broadcast: function (args) {
                if (!this.stopped && this.broadcast) {

                    var a = args.concat();
                    a.unshift(this.type);

                    if (this.host !== M) {
                        M.fire.apply(M, a);
                    }
                }
            },

            detachAll: function () {
                return this.detach();
            },

            _delete: function (s, subs, i) {
                var when = s._when;

                if (!subs) {
                    subs = (when === AFTER) ? this._afters : this._subscribers;
                }

                if (subs) {
                    i = _.indexOf(subs, s, 0);

                    if (s && subs[i] === s) {
                        subs.splice(i, 1);
                    }
                }

                if (this.monitored && this.host) {
                    this.host._monitor('detach', this, {
                        ce: this,
                        sub: s
                    });
                }

                if (s) {
                    s.deleted = true;
                }
            }
        };
        M.Subscriber = function (fn, context, args, when) {

            this.fn = fn;

            this.context = context;

            this.id = M.guid();

            this.args = args;

            this._when = when;

        };

        M.Subscriber.prototype = {
            constructor: M.Subscriber,

            _notify: function (c, args, ce) {
                if (this.deleted && !this.postponed) {
                    if (this.postponed) {
                        delete this.fn;
                        delete this.context;
                    } else {
                        delete this.postponed;
                        return null;
                    }
                }
                var a = this.args, ret;
                switch (ce.signature) {
                    case 0:
                        ret = this.fn.call(c, ce.type, args, c);
                        break;
                    case 1:
                        ret = this.fn.call(c, args[0] || null, c);
                        break;
                    default:
                        if (a || args) {
                            args = args || [];
                            a = (a) ? args.concat(a) : args;
                            ret = this.fn.apply(c, a);
                        } else {
                            ret = this.fn.call(c);
                        }
                }

                if (this.once) {
                    ce._delete(this);
                }

                return ret;
            },

            notify: function (args, ce) {
                var c = this.context,
                    ret = true;

                if (!c) {
                    c = (ce.contextFn) ? ce.contextFn() : ce.context;
                }

                if (M.config && M.config.throwFail) {
                    ret = this._notify(c, args, ce);
                } else {
                    try {
                        ret = this._notify(c, args, ce);
                    } catch (e) {
                        M.error(this + ' failed: ' + e.message, e);
                    }
                }

                return ret;
            },

            contains: function (fn, context) {
                if (context) {
                    return ((this.fn === fn) && this.context === context);
                } else {
                    return (this.fn === fn);
                }
            },

            valueOf: function () {
                return this.id;
            }

        };
        M.EventHandle = function (evt, sub) {
            this.evt = evt;
            this.sub = sub;
        };

        M.EventHandle.prototype = {
            batch: function (f, c) {
                f.call(c || this, this);
                if (_.isArray(this.evt)) {
                    _.each(this.evt, function (h) {
                        h.batch.call(c || h, f);
                    });
                }
            },

            detach: function () {
                var evt = this.evt, detached = 0, i;
                if (evt) {
                    if (_.isArray(evt)) {
                        for (i = 0; i < evt.length; i++) {
                            detached += evt[i].detach();
                        }
                    } else {
                        evt._delete(this.sub);
                        detached = 1;
                    }

                }

                return detached;
            },

            monitor: function (what) {
                return this.evt.monitor.apply(this.evt, arguments);
            }
        };
        var L = M.Lang,
            PREFIX_DELIMITER = ':',//分隔符
            CATEGORY_DELIMITER = '|',
            AFTER_PREFIX = '~AFTER~',
            WILD_TYPE_RE = /(.*?)(:)(.*?)/,

            _wildType = M.cached(function (type) {
                return type.replace(WILD_TYPE_RE, "*$2$3");
            }),
            /**
             * If the instance has a prefix attribute and the
             * event type is not prefixed, the instance prefix is
             * applied to the supplied type.
             * @method _getType
             * @private
             */
            _getType = function (type, pre) {

                if (!pre || !type || type.indexOf(PREFIX_DELIMITER) > -1) {
                    return type;
                }

                return pre + PREFIX_DELIMITER + type;
            },

            _parseType = M.cached(function (type, pre) {

                var t = type, detachcategory, after, i;

                if (!_.isString(t)) {
                    return t;
                }

                i = t.indexOf(AFTER_PREFIX);

                if (i > -1) {
                    after = true;
                    t = t.substr(AFTER_PREFIX.length);
                }

                i = t.indexOf(CATEGORY_DELIMITER);

                if (i > -1) {
                    detachcategory = t.substr(0, (i));
                    t = t.substr(i + 1);
                    if (t === '*') {
                        t = null;
                    }
                }
                return [detachcategory, (pre) ? _getType(t, pre) : t, after, t];
            }),

            /**
             * EventTarget 自定义事件engine
             * EventTarget 提供了 对任何对象的自定义事件实现
             * 发布，订阅，触发事件的方法
             * @param opts  一个配置对象
             * @config emitFacade {boolean} if true, all events will emit event
             * facade payloads by default (default false)
             * @config prefix {String} the prefix to apply to non-prefixed event names
             * @constructor
             */
            ET = function (opts) {

                var etState = this._yuievt,
                    etConfig;

                if (!etState) {
                    etState = this._yuievt = {
                        events: {},
                        targets: null,
                        config: {
                            host: this,
                            context: this
                        },
                        chain: M.config.chain
                    };
                }

                etConfig = etState.config;

                if (opts) {
                    mixConfigs(etConfig, opts, true);

                    if (opts.chain !== undefined) {
                        etState.chain = opts.chain;
                    }

                    if (opts.prefix) {
                        etConfig.prefix = opts.prefix;
                    }
                }
            };

        ET.prototype = {

            constructor: ET,
            once: function () {
                var handle = this.on.apply(this, arguments);
                handle.batch(function (hand) {
                    if (hand.sub) {
                        hand.sub.once = true;
                    }
                });
                return handle;
            },

            onceAfter: function () {
                var handle = this.after.apply(this, arguments);
                handle.batch(function (hand) {
                    if (hand.sub) {
                        hand.sub.once = true;
                    }
                });
                return handle;
            },

            parseType: function (type, pre) {
                return _parseType(type, pre || this._yuievt.config.prefix);
            },

            on: function (type, fn, context) {

                var yuievt = this._yuievt,
                    parts = _parseType(type, yuievt.config.prefix),
                    f, c, args, ret, ce,
                    detachcategory, handle,
                    store = M.Env.evt.handles,
                    after, adapt, shorttype, isArr;

                this._monitor('attach', parts[1], {
                    args: arguments,
                    category: parts[0],
                    after: parts[2]
                });

                if (L.isObject(type)) {

                    if (_.isFunction(type)) {
                        return M.Do.before.apply(M.Do, arguments);
                    }

                    f = fn;
                    c = context;
                    args = nativeSlice.call(arguments, 0);
                    ret = [];

                    if (_.isArray(type)) {
                        isArr = true;
                    }

                    after = type._after;
                    delete type._after;

                    _.each(type, function (v, k) {

                        if (L.isObject(v)) {
                            f = v.fn || ((_.isFunction(v)) ? v : f);
                            c = v.context || c;
                        }

                        var nv = (after) ? AFTER_PREFIX : '';

                        args[0] = nv + ((isArr) ? v : k);
                        args[1] = f;
                        args[2] = c;

                        ret.push(this.on.apply(this, args));

                    }, this);

                    return (yuievt.chain) ? this : new M.EventHandle(ret);
                }

                detachcategory = parts[0];
                after = parts[2];
                shorttype = parts[3];

                type = parts[1];

                if (M.instanceOf(this, MOMO)) {

                    adapt = M.Env.evt.plugins[type];
                    args = nativeSlice.call(arguments, 0);
                    args[0] = shorttype;

                    if (adapt) {
                        handle = adapt.on.apply(M, args);
                    }

                }

                if (!handle) {
                    ce = yuievt.events[type] || this.publish(type);
                    handle = ce._on(fn, context, (arguments.length > 3) ? nativeSlice.call(arguments, 3) : null, (after) ? 'after' : true);

                    if (type.indexOf("*:") !== -1) {
                        this._hasSiblings = true;
                    }
                }

                if (detachcategory) {
                    store[detachcategory] = store[detachcategory] || {};
                    store[detachcategory][type] = store[detachcategory][type] || [];
                    store[detachcategory][type].push(handle);
                }

                return (yuievt.chain) ? this : handle;

            },

            detach: function (type, fn, context) {

                var evts = this._yuievt.events, i;

                if (!type && (this !== M)) {
                    for (i in evts) {
                        if (evts.hasOwnProperty(i)) {
                            evts[i].detach(fn, context);
                        }
                    }
                    return this;
                }

                var parts = _parseType(type, this._yuievt.config.prefix),
                    detachcategory = _.isArray(parts) ? parts[0] : null,
                    shorttype = (parts) ? parts[3] : null,
                    adapt, store = M.Env.evt.handles, detachhost, cat, args,
                    ce,

                    keyDetacher = function (lcat, ltype, host) {
                        var handles = lcat[ltype], ce, i;
                        if (handles) {
                            for (i = handles.length - 1; i >= 0; --i) {
                                ce = handles[i].evt;
                                if (ce.host === host || ce.el === host) {
                                    handles[i].detach();
                                }
                            }
                        }
                    };

                if (detachcategory) {

                    cat = store[detachcategory];
                    type = parts[1];
                    detachhost = this;

                    if (cat) {
                        if (type) {
                            keyDetacher(cat, type, detachhost);
                        } else {
                            for (i in cat) {
                                if (cat.hasOwnProperty(i)) {
                                    keyDetacher(cat, i, detachhost);
                                }
                            }
                        }

                        return this;
                    }

                } else if (L.isObject(type) && type.detach) {
                    type.detach();
                    return this;
                }

                adapt = M.Env.evt.plugins[shorttype];

                if (M.instanceOf(this, MOMO)) {
                    args = nativeSlice.call(arguments, 0);
                    if (adapt && adapt.detach) {
                        adapt.detach.apply(M, args);
                        return this;
                    }
                }

                ce = evts[parts[1]];
                if (ce) {
                    ce.detach(fn, context);
                }

                return this;
            },

            /**
             * Removes all listeners from the specified event.  If the event type
             * is not specified, all listeners from all hosted custom events will
             * be removed.
             * @method detachAll
             * @param type {String}   The type, or name of the event
             */
            detachAll: function (type) {
                return this.detach(type);
            },

            publish: function (type, opts) {

                var ret,
                    etState = this._yuievt,
                    etConfig = etState.config,
                    pre = etConfig.prefix;

                if (typeof type === "string") {
                    if (pre) {
                        type = _getType(type, pre);
                    }
                    ret = this._publish(type, etConfig, opts);
                } else {
                    ret = {};

                    _.each(type, function (v, k) {
                        if (pre) {
                            k = _getType(k, pre);
                        }
                        ret[k] = this._publish(k, etConfig, v || opts);
                    }, this);

                }

                return ret;
            },

            _getFullType: function (type) {

                var pre = this._yuievt.config.prefix;

                if (pre) {
                    return pre + PREFIX_DELIMITER + type;
                } else {
                    return type;
                }
            },

            _publish: function (fullType, etOpts, ceOpts) {

                var ce,
                    etState = this._yuievt,
                    etConfig = etState.config,
                    host = etConfig.host,
                    context = etConfig.context,
                    events = etState.events;

                ce = events[fullType];

                if ((etConfig.monitored && !ce) || (ce && ce.monitored)) {
                    this._monitor('publish', fullType, {
                        args: arguments
                    });
                }

                if (!ce) {
                    //此处创建自定义事件
                    ce = events[fullType] = new M.CustomEvent(fullType, etOpts);

                    if (!etOpts) {
                        ce.host = host;
                        ce.context = context;
                    }
                }

                if (ceOpts) {
                    mixConfigs(ce, ceOpts, true);
                }

                return ce;
            },

            _monitor: function (what, eventType, o) {
                var monitorevt, ce, type;

                if (eventType) {
                    if (typeof eventType === "string") {
                        type = eventType;
                        ce = this.getEvent(eventType, true);
                    } else {
                        ce = eventType;
                        type = eventType.type;
                    }

                    if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
                        monitorevt = type + '_' + what;
                        o.monitored = what;
                        this.fire.call(this, monitorevt, o);
                    }
                }
            },

            fire: function (type) {

                var typeIncluded = (typeof type === "string"),
                    argCount = arguments.length,
                    t = type,
                    yuievt = this._yuievt,
                    etConfig = yuievt.config,
                    pre = etConfig.prefix,
                    ret,
                    ce,
                    ce2,
                    args;

                if (typeIncluded && argCount <= 3) {

                    if (argCount === 2) {
                        args = [arguments[1]]; // fire("foo", {})
                    } else if (argCount === 3) {
                        args = [arguments[1], arguments[2]]; // fire("foo", {}, opts)
                    } else {
                        args = []; // fire("foo")
                    }

                } else {
                    args = nativeSlice.call(arguments, ((typeIncluded) ? 1 : 0));
                }

                if (!typeIncluded) {
                    t = (type && type.type);
                }

                if (pre) {
                    t = _getType(t, pre);
                }

                ce = yuievt.events[t];

                if (this._hasSiblings) {
                    ce2 = this.getSibling(t, ce);

                    if (ce2 && !ce) {
                        ce = this.publish(t);
                    }
                }

                if ((etConfig.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
                    this._monitor('fire', (ce || t), {
                        args: args
                    });
                }

                if (!ce) {
                    if (yuievt.hasTargets) {
                        return this.bubble({type: t}, args, this);
                    }

                    ret = true;
                } else {

                    if (ce2) {
                        ce.sibling = ce2;
                    }

                    ret = ce._fire(args);
                }

                return (yuievt.chain) ? this : ret;
            },

            getSibling: function (type, ce) {
                var ce2;

                if (type.indexOf(PREFIX_DELIMITER) > -1) {
                    type = _wildType(type);
                    ce2 = this.getEvent(type, true);
                    if (ce2) {
                        ce2.applyConfig(ce);
                        ce2.bubbles = false;
                        ce2.broadcast = 0;
                    }
                }

                return ce2;
            },
            /**
             * 返回提供的类型的自定义事件已经创建
             * Returns the custom event of the provided type has been created, a
             * falsy value otherwise
             * @method getEvent
             * @param type {String} the type, or name of the event
             * @param prefixed {String} if true, the type is prefixed already
             * @return {CustomEvent} the custom event or null
             */
            getEvent: function (type, prefixed) {
                var pre, e;

                if (!prefixed) {
                    pre = this._yuievt.config.prefix;
                    type = (pre) ? _getType(type, pre) : type;
                }
                e = this._yuievt.events;
                return e[type] || null;
            },
            /**
             * 订阅该对象的自定义事件。
             * 之后的任何监听通过订阅方法添加的提供的回调将执行，
             * 默认功能后，如果配置了事件，已执行。
             *
             * @method after
             * @param {String} type The name of the event 事件名称
             * @param {Function} fn The callback to execute in response to the event 回调响应于该事件执行
             * @param {Object} [context] Override `this` object in callback this作用于
             * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
             * @return {EventHandle} A subscription handle capable of detaching the
             *                       subscription
             */
            after: function (type, fn) {

                var a = nativeSlice.call(arguments, 0);

                switch (L.type(type)) {
                    case 'function':
                        return M.Do.after.apply(M.Do, arguments);
                    case 'array':
                    case 'object':
                        a[0]._after = true;
                        break;
                    default:
                        a[0] = AFTER_PREFIX + type;
                }

                return this.on.apply(this, a);

            },

            before: function () {
                return this.on.apply(this, arguments);
            }

        };

        M.EventTarget = ET;
        M.mix(M, ET.prototype);
        ET.call(M, {bubbles: false});

        //end EventTarget

        (function (_, M) {

            var FACADE,
                FACADE_KEYS,
                YObject = M.Object,
                key,
                EMPTY = {},
                CEProto = M.CustomEvent.prototype,
                ETProto = M.EventTarget.prototype,

                mixFacadeProps = function (facade, payload) {
                    var p;

                    for (p in payload) {
                        if (!(FACADE_KEYS.hasOwnProperty(p))) {
                            facade[p] = payload[p];
                        }
                    }
                };


            M.EventFacade = function (e, currentTarget) {
                if (!e) {
                    e = EMPTY;
                }
                this._event = e;
                this.details = e.details;
                this.type = e.type;
                this._type = e.type;
                this.target = e.target;
                this.currentTarget = currentTarget;
                this.relatedTarget = e.relatedTarget;

            };

            M.mix(M.EventFacade.prototype, {

                stopPropagation: function () {
                    this._event.stopPropagation();
                    this.stopped = 1;
                },

                stopImmediatePropagation: function () {
                    this._event.stopImmediatePropagation();
                    this.stopped = 2;
                },

                preventDefault: function () {
                    this._event.preventDefault();
                    this.prevented = 1;
                },

                halt: function (immediate) {
                    this._event.halt(immediate);
                    this.prevented = 1;
                    this.stopped = (immediate) ? 2 : 1;
                }

            });

            CEProto.fireComplex = function (args) {

                var es,
                    ef,
                    q,
                    queue,
                    ce,
                    ret = true,
                    events,
                    subs,
                    ons,
                    afters,
                    afterQueue,
                    postponed,
                    prevented,
                    preventedFn,
                    defaultFn,
                    self = this,
                    host = self.host || self,
                    next,
                    oldbubble,
                    stack = self.stack,
                    yuievt = host._yuievt,
                    hasPotentialSubscribers;

                if (stack) {

                    if (self.queuable && self.type !== stack.next.type) {
                        self.log('queue ' + self.type);

                        if (!stack.queue) {
                            stack.queue = [];
                        }
                        stack.queue.push([self, args]);

                        return true;
                    }
                }

                hasPotentialSubscribers = self.hasSubs() || yuievt.hasTargets || self.broadcast;

                self.target = self.target || host;
                self.currentTarget = host;

                self.details = args.concat();

                if (hasPotentialSubscribers) {

                    es = stack || {

                            id: self.id, // id of the first event in the stack
                            next: self,
                            silent: self.silent,
                            stopped: 0,
                            prevented: 0,
                            bubbling: null,
                            type: self.type,
                            // defaultFnQueue: new M.Queue(),
                            defaultTargetOnly: self.defaultTargetOnly

                        };

                    subs = self.getSubs();
                    ons = subs[0];
                    afters = subs[1];

                    self.stopped = (self.type !== es.type) ? 0 : es.stopped;
                    self.prevented = (self.type !== es.type) ? 0 : es.prevented;

                    if (self.stoppedFn) {
                        events = new M.EventTarget({
                            fireOnce: true,
                            context: host
                        });
                        self.events = events;
                        events.on('stopped', self.stoppedFn);
                    }

                    self.log("Firing " + self.type);

                    self._facade = null; // kill facade to eliminate stale properties

                    ef = self._createFacade(args);

                    if (ons) {
                        self._procSubs(ons, args, ef);
                    }

                    if (self.bubbles && host.bubble && !self.stopped) {
                        oldbubble = es.bubbling;

                        es.bubbling = self.type;

                        if (es.type !== self.type) {
                            es.stopped = 0;
                            es.prevented = 0;
                        }

                        ret = host.bubble(self, args, null, es);

                        self.stopped = Math.max(self.stopped, es.stopped);
                        self.prevented = Math.max(self.prevented, es.prevented);

                        es.bubbling = oldbubble;
                    }

                    prevented = self.prevented;

                    if (prevented) {
                        preventedFn = self.preventedFn;
                        if (preventedFn) {
                            preventedFn.apply(host, args);
                        }
                    } else {
                        defaultFn = self.defaultFn;

                        if (defaultFn && ((!self.defaultTargetOnly && !es.defaultTargetOnly) || host === ef.target)) {
                            defaultFn.apply(host, args);
                        }
                    }

                    if (self.broadcast) {
                        self._broadcast(args);
                    }

                    if (afters && !self.prevented && self.stopped < 2) {

                        // Queue the after
                        afterQueue = es.afterQueue;

                        if (es.id === self.id || self.type !== yuievt.bubbling) {

                            self._procSubs(afters, args, ef);

                            if (afterQueue) {
                                while ((next = afterQueue.last())) {
                                    next();
                                }
                            }
                        } else {
                            postponed = afters;

                            if (es.execDefaultCnt) {
                                postponed = M.merge(postponed);

                                M.each(postponed, function (s) {
                                    s.postponed = true;
                                });
                            }

                            if (!afterQueue) {
                                es.afterQueue = new M.Queue();
                            }

                            es.afterQueue.add(function () {
                                self._procSubs(postponed, args, ef);
                            });
                        }

                    }

                    self.target = null;

                    if (es.id === self.id) {

                        queue = es.queue;

                        if (queue) {
                            while (queue.length) {
                                q = queue.pop();
                                ce = q[0];
                                es.next = ce;
                                ce._fire(q[1]);
                            }
                        }

                        self.stack = null;
                    }

                    ret = !(self.stopped);

                    if (self.type !== yuievt.bubbling) {
                        es.stopped = 0;
                        es.prevented = 0;
                        self.stopped = 0;
                        self.prevented = 0;
                    }

                } else {
                    defaultFn = self.defaultFn;

                    if (defaultFn) {
                        ef = self._createFacade(args);

                        if ((!self.defaultTargetOnly) || (host === ef.target)) {
                            defaultFn.apply(host, args);
                        }
                    }
                }

                self._facade = null;

                return ret;
            };

            CEProto._hasPotentialSubscribers = function () {
                return this.hasSubs() || this.host._yuievt.hasTargets || this.broadcast;
            };


            CEProto._createFacade = CEProto._getFacade = function (fireArgs) {

                var userArgs = this.details,
                    firstArg = userArgs && userArgs[0],
                    firstArgIsObj = (firstArg && (typeof firstArg === "object")),
                    ef = this._facade;

                if (!ef) {
                    ef = new M.EventFacade(this, this.currentTarget);
                }

                if (firstArgIsObj) {
                    mixFacadeProps(ef, firstArg);

                    if (firstArg.type) {
                        ef.type = firstArg.type;
                    }

                    if (fireArgs) {
                        fireArgs[0] = ef;
                    }
                } else {
                    if (fireArgs) {
                        fireArgs.unshift(ef);
                    }
                }

                ef.details = this.details;

                ef.target = this.originalTarget || this.target;

                ef.currentTarget = this.currentTarget;
                ef.stopped = 0;
                ef.prevented = 0;

                this._facade = ef;

                return this._facade;
            };

            CEProto._addFacadeToArgs = function (args) {
                var e = args[0];

                // Trying not to use instanceof, just to avoid potential cross M edge case issues.
                if (!(e && e.halt && e.stopImmediatePropagation && e.stopPropagation && e._event)) {
                    this._createFacade(args);
                }
            };

            CEProto.stopPropagation = function () {
                this.stopped = 1;
                if (this.stack) {
                    this.stack.stopped = 1;
                }
                if (this.events) {
                    this.events.fire('stopped', this);
                }
            };

            CEProto.stopImmediatePropagation = function () {
                this.stopped = 2;
                if (this.stack) {
                    this.stack.stopped = 2;
                }
                if (this.events) {
                    this.events.fire('stopped', this);
                }
            };

            CEProto.preventDefault = function () {
                if (this.preventable) {
                    this.prevented = 1;
                    if (this.stack) {
                        this.stack.prevented = 1;
                    }
                }
            };

            CEProto.halt = function (immediate) {
                if (immediate) {
                    this.stopImmediatePropagation();
                } else {
                    this.stopPropagation();
                }
                this.preventDefault();
            };

            ETProto.addTarget = function (o) {
                var etState = this._yuievt;

                if (!etState.targets) {
                    etState.targets = {};
                }

                etState.targets[M.stamp(o)] = o;
                etState.hasTargets = true;

                return this;
            };

            ETProto.getTargets = function () {
                var targets = this._yuievt.targets;
                return targets ? YObject.values(targets) : [];
            };

            ETProto.removeTarget = function (o) {
                var targets = this._yuievt.targets;

                if (targets) {
                    delete targets[M.stamp(o, true)];

                    if (YObject.size(targets) === 0) {
                        this._yuievt.hasTargets = false;
                    }
                }

                return this;
            };

            ETProto.bubble = function (evt, args, target, es) {

                var targs = this._yuievt.targets,
                    ret = true,
                    t,
                    ce,
                    i,
                    bc,
                    ce2,
                    type = evt && evt.type,
                    originalTarget = target || (evt && evt.target) || this,
                    oldbubble;

                if (!evt || ((!evt.stopped) && targs)) {

                    for (i in targs) {
                        if (targs.hasOwnProperty(i)) {

                            t = targs[i];

                            ce = t._yuievt.events[type];

                            if (t._hasSiblings) {
                                ce2 = t.getSibling(type, ce);
                            }

                            if (ce2 && !ce) {
                                ce = t.publish(type);
                            }

                            oldbubble = t._yuievt.bubbling;
                            t._yuievt.bubbling = type;

                            if (!ce) {
                                if (t._yuievt.hasTargets) {
                                    t.bubble(evt, args, originalTarget, es);
                                }
                            } else {

                                if (ce2) {
                                    ce.sibling = ce2;
                                }

                                ce.target = originalTarget;
                                ce.originalTarget = originalTarget;
                                ce.currentTarget = t;
                                bc = ce.broadcast;
                                ce.broadcast = false;

                                ce.emitFacade = true;

                                ce.stack = es;

                                ret = ret && ce.fire.apply(ce, args || evt.details || []);

                                ce.broadcast = bc;
                                ce.originalTarget = null;

                                if (ce.stopped) {
                                    break;
                                }
                            }

                            t._yuievt.bubbling = oldbubble;
                        }
                    }
                }

                return ret;
            };

            ETProto._hasPotentialSubscribers = function (fullType) {

                var etState = this._yuievt,
                    e = etState.events[fullType];

                if (e) {
                    return e.hasSubs() || etState.hasTargets || e.broadcast;
                } else {
                    return false;
                }
            };

            FACADE = new M.EventFacade();
            FACADE_KEYS = {};

            for (key in FACADE) {
                FACADE_KEYS[key] = true;
            }
        })(_, M)
    })(_, M);

    /**
     * 属性管理
     */
    (function (_, M) {
        M.State = function () {
            this.data = {};
        };
        M.State.prototype = {

            add: function (name, key, val) {
                var item = this.data[name];

                if (!item) {
                    item = this.data[name] = {};
                }

                item[key] = val;
            },

            addAll: function (name, obj) {
                var item = this.data[name],
                    key;

                if (!item) {
                    item = this.data[name] = {};
                }

                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        item[key] = obj[key];
                    }
                }
            },

            remove: function (name, key) {
                var item = this.data[name];

                if (item) {
                    delete item[key];
                }
            },

            removeAll: function (name, obj) {
                var data;

                if (!obj) {
                    data = this.data;

                    if (name in data) {
                        delete data[name];
                    }
                } else {
                    M.each(obj, function (value, key) {
                        this.remove(name, typeof key === 'string' ? key : value);
                    }, this);
                }
            },

            get: function (name, key) {
                var item = this.data[name];

                if (item) {
                    return item[key];
                }
            },

            getAll: function (name, reference) {
                var item = this.data[name],
                    key, obj;

                if (reference) {
                    obj = item;
                } else if (item) {
                    obj = {};

                    for (key in item) {
                        if (item.hasOwnProperty(key)) {
                            obj[key] = item[key];
                        }
                    }
                }

                return obj;
            }
        };

        var O = M.Object,
            Lang = M.Lang,
            DOT = ".",
            GETTER = "getter",
            SETTER = "setter",
            READ_ONLY = "readOnly",
            WRITE_ONCE = "writeOnce",
            INIT_ONLY = "initOnly",
            VALIDATOR = "validator",
            VALUE = "value",
            VALUE_FN = "valueFn",
            LAZY_ADD = "lazyAdd",

            ADDED = "added",
            BYPASS_PROXY = "_bypassProxy",
            INIT_VALUE = "initValue",
            LAZY = "lazy",

            INVALID_VALUE;

        function AttributeCore(attrs, values, lazy) {
            this._yuievt = null;
            this._initAttrHost(attrs, values, lazy);
        }

        AttributeCore.INVALID_VALUE = {};
        INVALID_VALUE = AttributeCore.INVALID_VALUE;

        AttributeCore._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BYPASS_PROXY];

        AttributeCore.protectAttrs = function (attrs) {
            if (attrs) {
                attrs = M.merge(attrs);
                for (var attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        attrs[attr] = M.merge(attrs[attr]);
                    }
                }
            }

            return attrs;
        };

        AttributeCore.prototype = {

            _initAttrHost: function (attrs, values, lazy) {
                this._state = new M.State();
                this._initAttrs(attrs, values, lazy);
            },

            addAttr: function (name, config, lazy) {

                M.log('Adding attribute: ' + name, 'info', 'attribute');

                var host = this,
                    state = host._state,
                    data = state.data,
                    value,
                    added,
                    hasValue;

                config = config || {};

                if (LAZY_ADD in config) {
                    lazy = config[LAZY_ADD];
                }

                added = state.get(name, ADDED);

                if (lazy && !added) {
                    state.data[name] = {
                        lazy: config,
                        added: true
                    };
                } else {

                    if (added && !config.isLazyAdd) {
                        M.log('Attribute: ' + name + ' already exists. Cannot add it again without removing it first', 'warn', 'attribute');
                    }

                    if (!added || config.isLazyAdd) {

                        hasValue = (VALUE in config);

                        if (config.readOnly && !hasValue) {
                            M.log('readOnly attribute: ' + name + ', added without an initial value. Value will be set on initial call to set', 'warn', 'attribute');
                        }

                        if (hasValue) {

                            value = config.value;
                            config.value = undefined;
                        }

                        config.added = true;
                        config.initializing = true;

                        data[name] = config;

                        if (hasValue) {
                            host.set(name, value);
                        }

                        config.initializing = false;
                    }
                }

                return host;
            },

            attrAdded: function (name) {
                return !!(this._state.get(name, ADDED));
            },

            get: function (name) {
                return this._getAttr(name);
            },

            _isLazyAttr: function (name) {
                return this._state.get(name, LAZY);
            },

            _addLazyAttr: function (name, lazyCfg) {
                var state = this._state;

                lazyCfg = lazyCfg || state.get(name, LAZY);

                if (lazyCfg) {
                    state.data[name].lazy = undefined;
                    lazyCfg.isLazyAdd = true;
                    this.addAttr(name, lazyCfg);
                }
            },

            set: function (name, val, opts) {
                return this._setAttr(name, val, opts);
            },

            _set: function (name, val, opts) {
                return this._setAttr(name, val, opts, true);
            },

            _setAttr: function (name, val, opts, force) {
                var allowSet = true,
                    state = this._state,
                    stateProxy = this._stateProxy,
                    tCfgs = this._tCfgs,
                    cfg,
                    initialSet,
                    strPath,
                    path,
                    currVal,
                    writeOnce,
                    initializing;

                if (name.indexOf(DOT) !== -1) {
                    strPath = name;

                    path = name.split(DOT);
                    name = path.shift();
                }

                if (tCfgs && tCfgs[name]) {
                    this._addOutOfOrder(name, tCfgs[name]);
                }

                cfg = state.data[name] || {};

                if (cfg.lazy) {
                    cfg = cfg.lazy;
                    this._addLazyAttr(name, cfg);
                }

                initialSet = (cfg.value === undefined);

                if (stateProxy && name in stateProxy && !cfg._bypassProxy) {
                    initialSet = false;
                }

                writeOnce = cfg.writeOnce;
                initializing = cfg.initializing;

                if (!initialSet && !force) {

                    if (writeOnce) {
                        M.log('Set attribute:' + name + ', aborted; Attribute is writeOnce', 'warn', 'attribute');
                        allowSet = false;
                    }

                    if (cfg.readOnly) {
                        M.log('Set attribute:' + name + ', aborted; Attribute is readOnly', 'warn', 'attribute');
                        allowSet = false;
                    }
                }

                if (!initializing && !force && writeOnce === INIT_ONLY) {
                    M.log('Set attribute:' + name + ', aborted; Attribute is writeOnce: "initOnly"', 'warn', 'attribute');
                    allowSet = false;
                }

                if (allowSet) {
                    if (!initialSet) {
                        currVal = this.get(name);
                    }

                    if (path) {
                        val = O.setValue(M.clone(currVal), path, val);

                        if (val === undefined) {
                            M.log('Set attribute path:' + strPath + ', aborted; Path is invalid', 'warn', 'attribute');
                            allowSet = false;
                        }
                    }

                    if (allowSet) {
                        if (!this._fireAttrChange || initializing) {
                            this._setAttrVal(name, strPath, currVal, val, opts, cfg);
                        } else {
                            this._fireAttrChange(name, strPath, currVal, val, opts, cfg);
                        }
                    }
                }

                return this;
            },

            _addOutOfOrder: function (name, cfg) {

                var attrs = {};
                attrs[name] = cfg;

                delete this._tCfgs[name];
                this._addAttrs(attrs, this._tVals);
            },

            _getAttr: function (name) {
                var fullName = name,
                    tCfgs = this._tCfgs,
                    path,
                    getter,
                    val,
                    attrCfg;

                if (name.indexOf(DOT) !== -1) {
                    path = name.split(DOT);
                    name = path.shift();
                }

                if (tCfgs && tCfgs[name]) {
                    this._addOutOfOrder(name, tCfgs[name]);
                }

                attrCfg = this._state.data[name] || {};

                // Lazy Init
                if (attrCfg.lazy) {
                    attrCfg = attrCfg.lazy;
                    this._addLazyAttr(name, attrCfg);
                }

                val = this._getStateVal(name, attrCfg);

                getter = attrCfg.getter;

                if (getter && !getter.call) {
                    getter = this[getter];
                }

                val = (getter) ? getter.call(this, val, fullName) : val;
                val = (path) ? O.getValue(val, path) : val;

                return val;
            },

            _getStateVal: function (name, cfg) {
                var stateProxy = this._stateProxy;

                if (!cfg) {
                    cfg = this._state.getAll(name) || {};
                }

                return (stateProxy && (name in stateProxy) && !(cfg._bypassProxy)) ? stateProxy[name] : cfg.value;
            },

            _setStateVal: function (name, value) {
                var stateProxy = this._stateProxy;
                if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {
                    stateProxy[name] = value;
                } else {
                    this._state.add(name, VALUE, value);
                }
            },

            _setAttrVal: function (attrName, subAttrName, prevVal, newVal, opts, attrCfg) {

                var host = this,
                    allowSet = true,
                    cfg = attrCfg || this._state.data[attrName] || {},
                    validator = cfg.validator,
                    setter = cfg.setter,
                    initializing = cfg.initializing,
                    prevRawVal = this._getStateVal(attrName, cfg),
                    name = subAttrName || attrName,
                    retVal,
                    valid;

                if (validator) {
                    if (!validator.call) {
                        validator = this[validator];
                    }
                    if (validator) {
                        valid = validator.call(host, newVal, name, opts);

                        if (!valid && initializing) {
                            newVal = cfg.defaultValue;
                            valid = true;
                        }
                    }
                }

                if (!validator || valid) {
                    if (setter) {
                        if (!setter.call) {
                            setter = this[setter];
                        }
                        if (setter) {
                            retVal = setter.call(host, newVal, name, opts);

                            if (retVal === INVALID_VALUE) {
                                if (initializing) {
                                    M.log('Attribute: ' + attrName + ', setter returned Attribute.INVALID_VALUE for value:' + newVal + ', initializing to default value', 'warn', 'attribute');
                                    newVal = cfg.defaultValue;
                                } else {
                                    M.log('Attribute: ' + attrName + ', setter returned Attribute.INVALID_VALUE for value:' + newVal, 'warn', 'attribute');
                                    allowSet = false;
                                }
                            } else if (retVal !== undefined) {
                                M.log('Attribute: ' + attrName + ', raw value: ' + newVal + ' modified by setter to:' + retVal, 'info', 'attribute');
                                newVal = retVal;
                            }
                        }
                    }

                    if (allowSet) {
                        if (!subAttrName && (newVal === prevRawVal) && !Lang.isObject(newVal)) {
                            M.log('Attribute: ' + attrName + ', value unchanged:' + newVal, 'warn', 'attribute');
                            allowSet = false;
                        } else {
                            if (!(INIT_VALUE in cfg)) {
                                cfg.initValue = newVal;
                            }
                            host._setStateVal(attrName, newVal);
                        }
                    }

                } else {
                    M.log('Attribute:' + attrName + ', Validation failed for value:' + newVal, 'warn', 'attribute');
                    allowSet = false;
                }

                return allowSet;
            },

            setAttrs: function (attrs, opts) {
                return this._setAttrs(attrs, opts);
            },

            _setAttrs: function (attrs, opts) {
                var attr;
                for (attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        this.set(attr, attrs[attr], opts);
                    }
                }
                return this;
            },

            getAttrs: function (attrs) {
                return this._getAttrs(attrs);
            },

            _getAttrs: function (attrs) {
                var obj = {},
                    attr, i, len,
                    modifiedOnly = (attrs === true);

                if (!attrs || modifiedOnly) {
                    attrs = O.keys(this._state.data);
                }

                for (i = 0, len = attrs.length; i < len; i++) {
                    attr = attrs[i];

                    if (!modifiedOnly || this._getStateVal(attr) != this._state.get(attr, INIT_VALUE)) {
                        obj[attr] = this.get(attr);
                    }
                }

                return obj;
            },

            addAttrs: function (cfgs, values, lazy) {
                if (cfgs) {
                    this._tCfgs = cfgs;
                    this._tVals = (values) ? this._normAttrVals(values) : null;
                    this._addAttrs(cfgs, this._tVals, lazy);
                    this._tCfgs = this._tVals = null;
                }

                return this;
            },

            _addAttrs: function (cfgs, values, lazy) {
                var tCfgs = this._tCfgs,
                    tVals = this._tVals,
                    attr,
                    attrCfg,
                    value;

                for (attr in cfgs) {
                    if (cfgs.hasOwnProperty(attr)) {

                        attrCfg = cfgs[attr];
                        attrCfg.defaultValue = attrCfg.value;

                        value = this._getAttrInitVal(attr, attrCfg, tVals);

                        if (value !== undefined) {
                            attrCfg.value = value;
                        }

                        if (tCfgs[attr]) {
                            tCfgs[attr] = undefined;
                        }

                        this.addAttr(attr, attrCfg, lazy);
                    }
                }
            },

            _protectAttrs: AttributeCore.protectAttrs,

            _normAttrVals: function (valueHash) {
                var vals,
                    subvals,
                    path,
                    attr,
                    v, k;

                if (!valueHash) {
                    return null;
                }

                vals = {};

                for (k in valueHash) {
                    if (valueHash.hasOwnProperty(k)) {
                        if (k.indexOf(DOT) !== -1) {
                            path = k.split(DOT);
                            attr = path.shift();

                            subvals = subvals || {};

                            v = subvals[attr] = subvals[attr] || [];
                            v[v.length] = {
                                path: path,
                                value: valueHash[k]
                            };
                        } else {
                            vals[k] = valueHash[k];
                        }
                    }
                }

                return {simple: vals, complex: subvals};
            },

            _getAttrInitVal: function (attr, cfg, initValues) {
                var val = cfg.value,
                    valFn = cfg.valueFn,
                    tmpVal,
                    initValSet = false,
                    readOnly = cfg.readOnly,
                    simple,
                    complex,
                    i,
                    l,
                    path,
                    subval,
                    subvals;

                if (!readOnly && initValues) {
                    simple = initValues.simple;
                    if (simple && simple.hasOwnProperty(attr)) {
                        val = simple[attr];
                        initValSet = true;
                    }
                }

                if (valFn && !initValSet) {
                    if (!valFn.call) {
                        valFn = this[valFn];
                    }
                    if (valFn) {
                        tmpVal = valFn.call(this, attr);
                        val = tmpVal;
                    }
                }

                if (!readOnly && initValues) {

                    complex = initValues.complex;

                    if (complex && complex.hasOwnProperty(attr) && (val !== undefined) && (val !== null)) {
                        subvals = complex[attr];
                        for (i = 0, l = subvals.length; i < l; ++i) {
                            path = subvals[i].path;
                            subval = subvals[i].value;
                            O.setValue(val, path, subval);
                        }
                    }
                }

                return val;
            },

            _initAttrs: function (attrs, values, lazy) {
                attrs = attrs || this.constructor.ATTRS;

                var Base = M.Base,
                    BaseCore = M.BaseCore,
                    baseInst = (Base && M.instanceOf(this, Base)),
                    baseCoreInst = (!baseInst && BaseCore && M.instanceOf(this, BaseCore));

                if (attrs && !baseInst && !baseCoreInst) {
                    this.addAttrs(M.AttributeCore.protectAttrs(attrs), values, lazy);
                }
            }
        };

        M.AttributeCore = AttributeCore;

        (function (_, M) {
            var EventTarget = M.EventTarget,

                CHANGE = "Change",
                BROADCAST = "broadcast";

            function AttributeObservable() {
                this._ATTR_E_FACADE = {};
                EventTarget.call(this, {emitFacade: true});
            }

            AttributeObservable._ATTR_CFG = [BROADCAST];

            AttributeObservable.prototype = {

                set: function (name, val, opts) {
                    return this._setAttr(name, val, opts);
                },

                _set: function (name, val, opts) {
                    return this._setAttr(name, val, opts, true);
                },

                setAttrs: function (attrs, opts) {
                    return this._setAttrs(attrs, opts);
                },

                _setAttrs: function (attrs, opts) {
                    var attr;
                    for (attr in attrs) {
                        if (attrs.hasOwnProperty(attr)) {
                            this.set(attr, attrs[attr], opts);
                        }
                    }
                    return this;
                },

                _fireAttrChange: function (attrName, subAttrName, currVal, newVal, opts, cfg) {
                    var host = this,
                        eventName = this._getFullType(attrName + CHANGE),
                        state = host._state,
                        facade,
                        broadcast,
                        e;

                    if (!cfg) {
                        cfg = state.data[attrName] || {};
                    }

                    if (!cfg.published) {

                        e = host._publish(eventName);

                        e.emitFacade = true;
                        e.defaultTargetOnly = true;
                        e.defaultFn = host._defAttrChangeFn;

                        broadcast = cfg.broadcast;
                        if (broadcast !== undefined) {
                            e.broadcast = broadcast;
                        }

                        cfg.published = true;
                    }

                    if (opts) {
                        facade = M.merge(opts);
                        facade._attrOpts = opts;
                    } else {
                        facade = host._ATTR_E_FACADE;
                    }

                    facade.attrName = attrName;
                    facade.subAttrName = subAttrName;
                    facade.prevVal = currVal;
                    facade.newVal = newVal;

                    if (host._hasPotentialSubscribers(eventName)) {
                        host.fire(eventName, facade);
                    } else {
                        this._setAttrVal(attrName, subAttrName, currVal, newVal, opts, cfg);
                    }
                },

                _defAttrChangeFn: function (e, eventFastPath) {

                    var opts = e._attrOpts;
                    if (opts) {
                        delete e._attrOpts;
                    }

                    if (!this._setAttrVal(e.attrName, e.subAttrName, e.prevVal, e.newVal, opts)) {

                        M.log('State not updated and stopImmediatePropagation called for attribute: ' + e.attrName + ' , value:' + e.newVal, 'warn', 'attribute');

                        if (!eventFastPath) {
                            e.stopImmediatePropagation();
                        }

                    } else {
                        if (!eventFastPath) {
                            e.newVal = this.get(e.attrName);
                        }
                    }
                }
            };

            M.mix(AttributeObservable, EventTarget, false, null, 1);

            M.AttributeObservable = AttributeObservable;

            M.AttributeEvents = AttributeObservable;

        })(_, M);

        (function (_, M) {
            var BROADCAST = "broadcast",
                PUBLISHED = "published",
                INIT_VALUE = "initValue",

                MODIFIABLE = {
                    readOnly: 1,
                    writeOnce: 1,
                    getter: 1,
                    broadcast: 1
                };

            function AttributeExtras() {
            }

            AttributeExtras.prototype = {

                modifyAttr: function (name, config) {
                    var host = this,
                        prop, state;

                    if (host.attrAdded(name)) {

                        if (host._isLazyAttr(name)) {
                            host._addLazyAttr(name);
                        }

                        state = host._state;
                        for (prop in config) {
                            if (MODIFIABLE[prop] && config.hasOwnProperty(prop)) {
                                state.add(name, prop, config[prop]);

                                if (prop === BROADCAST) {
                                    state.remove(name, PUBLISHED);
                                }
                            }
                        }
                    } else {
                        M.log('Attribute modifyAttr:' + name + ' has not been added. Use addAttr to add the attribute', 'warn', 'attribute');
                    }
                },

                removeAttr: function (name) {
                    this._state.removeAll(name);
                },

                reset: function (name) {
                    var host = this;

                    if (name) {
                        if (host._isLazyAttr(name)) {
                            host._addLazyAttr(name);
                        }
                        host.set(name, host._state.get(name, INIT_VALUE));
                    } else {
                        _.each(host._state.data, function (v, n) {
                            host.reset(n);
                        });
                    }
                    return host;
                },

                _getAttrCfg: function (name) {
                    var o,
                        state = this._state;

                    if (name) {
                        o = state.getAll(name) || {};
                    } else {
                        o = {};
                        _.each(state.data, function (v, n) {
                            o[n] = state.getAll(n);
                        });
                    }

                    return o;
                }
            };

            M.AttributeExtras = AttributeExtras;

        })(_, M);

        (function (_, M) {
            function Attribute() {
                M.AttributeCore.apply(this, arguments);
                M.AttributeObservable.apply(this, arguments);
                M.AttributeExtras.apply(this, arguments);
            }

            M.mix(Attribute, M.AttributeCore, false, null, 1);
            M.mix(Attribute, M.AttributeExtras, false, null, 1);

            M.mix(Attribute, M.AttributeObservable, true, null, 1);

            Attribute.INVALID_VALUE = M.AttributeCore.INVALID_VALUE;

            Attribute._ATTR_CFG = M.AttributeCore._ATTR_CFG.concat(M.AttributeObservable._ATTR_CFG);

            Attribute.protectAttrs = M.AttributeCore.protectAttrs;

            M.Attribute = Attribute;

        })(_, M);


    })(_, M);

    /**
     * base
     */
    (function (_, M) {
        (function (_, M) {
            var O = M.Object,
                L = M.Lang,
                DOT = ".",
                INITIALIZED = "initialized",
                DESTROYED = "destroyed",
                INITIALIZER = "initializer",
                VALUE = "value",
                OBJECT_CONSTRUCTOR = Object.prototype.constructor,
                DEEP = "deep",
                SHALLOW = "shallow",
                DESTRUCTOR = "destructor",

                AttributeCore = M.AttributeCore,

                _wlmix = function (r, s, wlhash) {
                    var p;
                    for (p in s) {
                        if (wlhash[p]) {
                            r[p] = s[p];
                        }
                    }
                    return r;
                };

            function BaseCore(cfg) {
                if (!this._BaseInvoked) {
                    this._BaseInvoked = true;

                    this._initBase(cfg);
                }
                else {
                    M.log('Based constructor called more than once. Ignoring duplicate calls', 'life', 'base');
                }
            }

            BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat("cloneDefaultValue");

            BaseCore._NON_ATTRS_CFG = ["plugins"];

            BaseCore.NAME = "baseCore";

            BaseCore.ATTRS = {
                initialized: {
                    readOnly: true,
                    value: false
                },

                destroyed: {
                    readOnly: true,
                    value: false
                }
            };

            BaseCore.modifyAttrs = function (ctor, configs) {
                if (typeof ctor !== 'function') {
                    configs = ctor;
                    ctor = this;
                }

                var attrs, attr, name;

                attrs = ctor.ATTRS || (ctor.ATTRS = {});

                if (configs) {
                    ctor._CACHED_CLASS_DATA = null;

                    for (name in configs) {
                        if (configs.hasOwnProperty(name)) {
                            attr = attrs[name] || (attrs[name] = {});
                            M.mix(attr, configs[name], true);
                        }
                    }
                }
            };

            BaseCore.prototype = {

                _initBase: function (config) {
                    M.log('init called', 'life', 'base');

                    M.stamp(this);

                    this._initAttribute(config);

                    var PluginHost = M.Plugin && M.Plugin.Host;
                    if (this._initPlugins && PluginHost) {
                        PluginHost.call(this);
                    }

                    if (this._lazyAddAttrs !== false) {
                        this._lazyAddAttrs = true;
                    }

                    this.name = this.constructor.NAME;

                    this.init.apply(this, arguments);
                },

                _initAttribute: function () {
                    AttributeCore.call(this);
                },

                init: function (cfg) {
                    M.log('init called', 'life', 'base');

                    this._baseInit(cfg);

                    return this;
                },

                _baseInit: function (cfg) {
                    this._initHierarchy(cfg);

                    if (this._initPlugins) {
                        this._initPlugins(cfg);
                    }
                    this._set(INITIALIZED, true);
                },

                destroy: function () {
                    this._baseDestroy();
                    return this;
                },

                _baseDestroy: function () {
                    if (this._destroyPlugins) {
                        this._destroyPlugins();
                    }
                    this._destroyHierarchy();
                    this._set(DESTROYED, true);
                },

                _getClasses: function () {
                    if (!this._classes) {
                        this._initHierarchyData();
                    }
                    return this._classes;
                },

                _getAttrCfgs: function () {
                    if (!this._attrs) {
                        this._initHierarchyData();
                    }
                    return this._attrs;
                },

                _getInstanceAttrCfgs: function (allCfgs) {

                    var cfgs = {},
                        cfg,
                        val,
                        subAttr,
                        subAttrs,
                        subAttrPath,
                        attr,
                        attrCfg,
                        allSubAttrs = allCfgs._subAttrs,
                        attrCfgProperties = this._attrCfgHash();

                    for (attr in allCfgs) {

                        if (allCfgs.hasOwnProperty(attr) && attr !== "_subAttrs") {

                            attrCfg = allCfgs[attr];

                            cfg = cfgs[attr] = _wlmix({}, attrCfg, attrCfgProperties);

                            val = cfg.value;

                            if (val && (typeof val === "object")) {
                                this._cloneDefaultValue(attr, cfg);
                            }

                            if (allSubAttrs && allSubAttrs.hasOwnProperty(attr)) {
                                subAttrs = allCfgs._subAttrs[attr];

                                for (subAttrPath in subAttrs) {
                                    subAttr = subAttrs[subAttrPath];

                                    if (subAttr.path) {
                                        O.setValue(cfg.value, subAttr.path, subAttr.value);
                                    }
                                }
                            }
                        }
                    }

                    return cfgs;
                },

                _filterAdHocAttrs: function (allAttrs, userVals) {
                    var adHocs,
                        nonAttrs = this._nonAttrs,
                        attr;

                    if (userVals) {
                        adHocs = {};
                        for (attr in userVals) {
                            if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {
                                adHocs[attr] = {
                                    value: userVals[attr]
                                };
                            }
                        }
                    }

                    return adHocs;
                },

                _initHierarchyData: function () {

                    var ctor = this.constructor,
                        cachedClassData = ctor._CACHED_CLASS_DATA,
                        c,
                        i,
                        l,
                        attrCfg,
                        attrCfgHash,
                        needsAttrCfgHash = !ctor._ATTR_CFG_HASH,
                        nonAttrsCfg,
                        nonAttrs = {},
                        classes = [],
                        attrs = [];

                    c = ctor;

                    if (!cachedClassData) {

                        while (c) {
                            classes[classes.length] = c;

                            if (c.ATTRS) {
                                attrs[attrs.length] = c.ATTRS;
                            }

                            if (needsAttrCfgHash) {
                                attrCfg = c._ATTR_CFG;
                                attrCfgHash = attrCfgHash || {};

                                if (attrCfg) {
                                    for (i = 0, l = attrCfg.length; i < l; i += 1) {
                                        attrCfgHash[attrCfg[i]] = true;
                                    }
                                }
                            }

                            nonAttrsCfg = c._NON_ATTRS_CFG;
                            if (nonAttrsCfg) {
                                for (i = 0, l = nonAttrsCfg.length; i < l; i++) {
                                    nonAttrs[nonAttrsCfg[i]] = true;
                                }
                            }

                            c = c.superclass ? c.superclass.constructor : null;
                        }

                        if (needsAttrCfgHash) {
                            ctor._ATTR_CFG_HASH = attrCfgHash;
                        }

                        cachedClassData = ctor._CACHED_CLASS_DATA = {
                            classes: classes,
                            nonAttrs: nonAttrs,
                            attrs: this._aggregateAttrs(attrs)
                        };

                    }

                    this._classes = cachedClassData.classes;
                    this._attrs = cachedClassData.attrs;
                    this._nonAttrs = cachedClassData.nonAttrs;
                },

                _attrCfgHash: function () {
                    return this.constructor._ATTR_CFG_HASH;
                },

                _cloneDefaultValue: function (attr, cfg) {

                    var val = cfg.value,
                        clone = cfg.cloneDefaultValue;

                    if (clone === DEEP || clone === true) {
                        M.log('Cloning default value for attribute:' + attr, 'info', 'base');
                        cfg.value = M.clone(val);
                    } else if (clone === SHALLOW) {
                        M.log('Merging default value for attribute:' + attr, 'info', 'base');
                        cfg.value = M.merge(val);
                    } else if ((clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || _.isArray(val)))) {
                        cfg.value = M.clone(val);
                    }
                },

                _aggregateAttrs: function (allAttrs) {

                    var attr,
                        attrs,
                        subAttrsHash,
                        cfg,
                        path,
                        i,
                        cfgPropsHash = this._attrCfgHash(),
                        aggAttr,
                        aggAttrs = {};

                    if (allAttrs) {
                        for (i = allAttrs.length - 1; i >= 0; --i) {

                            attrs = allAttrs[i];

                            for (attr in attrs) {
                                if (attrs.hasOwnProperty(attr)) {

                                    cfg = _wlmix({}, attrs[attr], cfgPropsHash);

                                    path = null;
                                    if (attr.indexOf(DOT) !== -1) {
                                        path = attr.split(DOT);
                                        attr = path.shift();
                                    }

                                    aggAttr = aggAttrs[attr];

                                    if (path && aggAttr && aggAttr.value) {

                                        subAttrsHash = aggAttrs._subAttrs;

                                        if (!subAttrsHash) {
                                            subAttrsHash = aggAttrs._subAttrs = {};
                                        }

                                        if (!subAttrsHash[attr]) {
                                            subAttrsHash[attr] = {};
                                        }

                                        subAttrsHash[attr][path.join(DOT)] = {
                                            value: cfg.value,
                                            path: path
                                        };

                                    } else if (!path) {

                                        if (!aggAttr) {
                                            aggAttrs[attr] = cfg;
                                        } else {
                                            if (aggAttr.valueFn && VALUE in cfg) {
                                                aggAttr.valueFn = null;
                                            }

                                            _wlmix(aggAttr, cfg, cfgPropsHash);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return aggAttrs;
                },

                _initHierarchy: function (userVals) {

                    var lazy = this._lazyAddAttrs,
                        constr,
                        constrProto,
                        i,
                        l,
                        ci,
                        ei,
                        el,
                        ext,
                        extProto,
                        exts,
                        instanceAttrs,
                        initializers = [],
                        classes = this._getClasses(),
                        attrCfgs = this._getAttrCfgs(),
                        cl = classes.length - 1;

                    for (ci = cl; ci >= 0; ci--) {

                        constr = classes[ci];
                        constrProto = constr.prototype;
                        exts = constr._yuibuild && constr._yuibuild.exts;

                        if (constrProto.hasOwnProperty(INITIALIZER)) {
                            initializers[initializers.length] = constrProto.initializer;
                        }

                        if (exts) {
                            for (ei = 0, el = exts.length; ei < el; ei++) {

                                ext = exts[ei];

                                ext.apply(this, arguments);

                                extProto = ext.prototype;
                                if (extProto.hasOwnProperty(INITIALIZER)) {
                                    initializers[initializers.length] = extProto.initializer;
                                }
                            }
                        }
                    }

                    instanceAttrs = this._getInstanceAttrCfgs(attrCfgs);

                    if (this._preAddAttrs) {
                        this._preAddAttrs(instanceAttrs, userVals, lazy);
                    }

                    if (this._allowAdHocAttrs) {
                        this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);
                    }

                    this.addAttrs(instanceAttrs, userVals, lazy);

                    for (i = 0, l = initializers.length; i < l; i++) {
                        initializers[i].apply(this, arguments);
                    }
                },

                _destroyHierarchy: function () {
                    var constr,
                        constrProto,
                        ci, cl, ei, el, exts, extProto,
                        classes = this._getClasses();

                    for (ci = 0, cl = classes.length; ci < cl; ci++) {
                        constr = classes[ci];
                        constrProto = constr.prototype;
                        exts = constr._yuibuild && constr._yuibuild.exts;

                        if (exts) {
                            for (ei = 0, el = exts.length; ei < el; ei++) {
                                extProto = exts[ei].prototype;
                                if (extProto.hasOwnProperty(DESTRUCTOR)) {
                                    extProto.destructor.apply(this, arguments);
                                }
                            }
                        }

                        if (constrProto.hasOwnProperty(DESTRUCTOR)) {
                            constrProto.destructor.apply(this, arguments);
                        }
                    }
                },

                toString: function () {
                    return this.name + "[" + M.stamp(this, true) + "]";
                }
            };

            M.mix(BaseCore, AttributeCore, false, null, 1);

            BaseCore.prototype.constructor = BaseCore;

            M.BaseCore = BaseCore;

        })(_, M);

        /**
         * base-observable
         */
        (function (_, M) {
            var L = M.Lang,

                DESTROY = "destroy",
                INIT = "init",

                BUBBLETARGETS = "bubbleTargets",
                _BUBBLETARGETS = "_bubbleTargets",

                AttributeObservable = M.AttributeObservable,
                BaseCore = M.BaseCore;

            function BaseObservable() {
            }

            BaseObservable._ATTR_CFG = AttributeObservable._ATTR_CFG.concat();
            BaseObservable._NON_ATTRS_CFG = ["on", "after", "bubbleTargets"];

            BaseObservable.prototype = {

                _initAttribute: function () {
                    BaseCore.prototype._initAttribute.apply(this, arguments);
                    AttributeObservable.call(this);

                    this._eventPrefix = this.constructor.EVENT_PREFIX || this.constructor.NAME;
                    this._yuievt.config.prefix = this._eventPrefix;
                },

                init: function (config) {

                    var type = this._getFullType(INIT),
                        e = this._publish(type);

                    e.emitFacade = true;
                    e.fireOnce = true;
                    e.defaultTargetOnly = true;
                    e.defaultFn = this._defInitFn;

                    this._preInitEventCfg(config);

                    if (e._hasPotentialSubscribers()) {
                        this.fire(type, {cfg: config});
                    } else {

                        this._baseInit(config);

                        e.fired = true;
                        e.firedWith = [{cfg: config}];
                    }

                    return this;
                },

                _preInitEventCfg: function (config) {
                    if (config) {
                        if (config.on) {
                            this.on(config.on);
                        }
                        if (config.after) {
                            this.after(config.after);
                        }
                    }

                    var i, l, target,
                        userTargets = (config && BUBBLETARGETS in config);

                    if (userTargets || _BUBBLETARGETS in this) {
                        target = userTargets ? (config && config.bubbleTargets) : this._bubbleTargets;

                        if (_.isArray(target)) {
                            for (i = 0, l = target.length; i < l; i++) {
                                this.addTarget(target[i]);
                            }
                        } else if (target) {
                            this.addTarget(target);
                        }
                    }
                },

                destroy: function () {
                    M.log('destroy called', 'life', 'base');

                    this.publish(DESTROY, {
                        fireOnce: true,
                        defaultTargetOnly: true,
                        defaultFn: this._defDestroyFn
                    });
                    this.fire(DESTROY);

                    this.detachAll();
                    return this;
                },

                _defInitFn: function (e) {
                    this._baseInit(e.cfg);
                },

                _defDestroyFn: function (e) {
                    this._baseDestroy(e.cfg);
                }
            };

            M.mix(BaseObservable, AttributeObservable, false, null, 1);

            M.BaseObservable = BaseObservable;

        })(_, M);

        /**
         * base-base
         */
        (function (_, M) {

            var AttributeCore = M.AttributeCore,
                AttributeExtras = M.AttributeExtras,
                BaseCore = M.BaseCore,
                BaseObservable = M.BaseObservable;

            function Base() {
                BaseCore.apply(this, arguments);
                BaseObservable.apply(this, arguments);
                AttributeExtras.apply(this, arguments);
            }

            Base._ATTR_CFG = BaseCore._ATTR_CFG.concat(BaseObservable._ATTR_CFG);

            Base._NON_ATTRS_CFG = BaseCore._NON_ATTRS_CFG.concat(BaseObservable._NON_ATTRS_CFG);

            Base.NAME = 'base';

            Base.ATTRS = AttributeCore.protectAttrs(BaseCore.ATTRS);

            Base.modifyAttrs = BaseCore.modifyAttrs;

            M.mix(Base, BaseCore, false, null, 1);
            M.mix(Base, AttributeExtras, false, null, 1);

            M.mix(Base, BaseObservable, true, null, 1);

            Base.prototype.constructor = Base;

            M.Base = Base;

        })(_, M);


        /**
         * pluginhost-base
         */
        (function (_, M) {

            function PluginHost() {
                this._plugins = {};
            }

            PluginHost.prototype = {

                plug: function (Plugin, config) {
                    var i, ln, ns;

                    if (_.isArray(Plugin)) {
                        for (i = 0, ln = Plugin.length; i < ln; i++) {
                            this.plug(Plugin[i]);
                        }
                    } else {
                        if (Plugin && !_.isFunction(Plugin)) {
                            config = Plugin.cfg;
                            Plugin = Plugin.fn;
                        }

                        if (Plugin && Plugin.NS) {
                            ns = Plugin.NS;

                            config = config || {};
                            config.host = this;

                            if (this.hasPlugin(ns)) {
                                if (this[ns].setAttrs) {
                                    this[ns].setAttrs(config);
                                }
                                else {
                                    M.log("Attempt to replug an already attached plugin, and we can't setAttrs, because it's not Attribute based: " + ns, "warn", "PluginHost");
                                }
                            } else {
                                this[ns] = new Plugin(config);
                                this._plugins[ns] = Plugin;
                            }
                        }
                        else {
                            M.log("Attempt to plug in an invalid plugin. Host:" + this + ", Plugin:" + Plugin, "error", "PluginHost");
                        }
                    }
                    return this;
                },

                unplug: function (plugin) {
                    var ns = plugin,
                        plugins = this._plugins;

                    if (plugin) {
                        if (_.isFunction(plugin)) {
                            ns = plugin.NS;
                            if (ns && (!plugins[ns] || plugins[ns] !== plugin)) {
                                ns = null;
                            }
                        }

                        if (ns) {
                            if (this[ns]) {
                                if (this[ns].destroy) {
                                    this[ns].destroy();
                                }
                                delete this[ns];
                            }
                            if (plugins[ns]) {
                                delete plugins[ns];
                            }
                        }
                    } else {
                        for (ns in this._plugins) {
                            if (this._plugins.hasOwnProperty(ns)) {
                                this.unplug(ns);
                            }
                        }
                    }
                    return this;
                },

                hasPlugin: function (ns) {
                    return (this._plugins[ns] && this[ns]);
                },

                _initPlugins: function (config) {
                    this._plugins = this._plugins || {};

                    if (this._initConfigPlugins) {
                        this._initConfigPlugins(config);
                    }
                },
                _destroyPlugins: function () {
                    this.unplug();
                }
            };

            M.namespace("Plugin").Host = PluginHost;
        })(_, M);

        /**
         * base-pluginhost
         */
        (function (_, M) {

            var Base = M.Base,
                PluginHost = M.Plugin.Host;

            M.mix(Base, PluginHost, false, null, 1);

            Base.plug = PluginHost.plug;

            Base.unplug = PluginHost.unplug;

        })(_, M);


        /**
         * pluginhost-config
         */
        (function (_, M) {
            var PluginHost = M.Plugin.Host,
                L = M.Lang;

            PluginHost.prototype._initConfigPlugins = function (config) {

                var classes = (this._getClasses) ? this._getClasses() : [this.constructor],
                    plug = [],
                    unplug = {},
                    constructor, i, classPlug, classUnplug, pluginClassName;

                for (i = classes.length - 1; i >= 0; i--) {
                    constructor = classes[i];

                    classUnplug = constructor._UNPLUG;
                    if (classUnplug) {
                        M.mix(unplug, classUnplug, true);
                    }

                    classPlug = constructor._PLUG;
                    if (classPlug) {
                        M.mix(plug, classPlug, true);
                    }
                }

                for (pluginClassName in plug) {
                    if (plug.hasOwnProperty(pluginClassName)) {
                        if (!unplug[pluginClassName]) {
                            this.plug(plug[pluginClassName]);
                        }
                    }
                }

                if (config && config.plugins) {
                    this.plug(config.plugins);
                }
            };

            PluginHost.plug = function (hostClass, plugin, config) {
                var p, i, l, name;

                if (hostClass !== M.Base) {
                    hostClass._PLUG = hostClass._PLUG || {};

                    if (!_.isArray(plugin)) {
                        if (config) {
                            plugin = {fn: plugin, cfg: config};
                        }
                        plugin = [plugin];
                    }

                    for (i = 0, l = plugin.length; i < l; i++) {
                        p = plugin[i];
                        name = p.NAME || p.fn.NAME;
                        hostClass._PLUG[name] = p;
                    }
                }
            };

            PluginHost.unplug = function (hostClass, plugin) {
                var p, i, l, name;

                if (hostClass !== M.Base) {
                    hostClass._UNPLUG = hostClass._UNPLUG || {};

                    if (!_.isArray(plugin)) {
                        plugin = [plugin];
                    }

                    for (i = 0, l = plugin.length; i < l; i++) {
                        p = plugin[i];
                        name = p.NAME;
                        if (!hostClass._PLUG[name]) {
                            hostClass._UNPLUG[name] = p;
                        } else {
                            delete hostClass._PLUG[name];
                        }
                    }
                }
            };
        })(_, M);


        /**
         * base-build
         */
        (function (_, M) {
            var BaseCore = M.BaseCore,
                Base = M.Base,
                L = M.Lang,

                INITIALIZER = "initializer",
                DESTRUCTOR = "destructor",
                AGGREGATES = ["_PLUG", "_UNPLUG"],

                build;

            function arrayAggregator(prop, r, s) {
                if (s[prop]) {
                    r[prop] = (r[prop] || []).concat(s[prop]);
                }
            }

            function attrCfgAggregator(prop, r, s) {
                if (s._ATTR_CFG) {
                    r._ATTR_CFG_HASH = null;

                    arrayAggregator.apply(null, arguments);
                }
            }

            function attrsAggregator(prop, r, s) {
                BaseCore.modifyAttrs(r, s.ATTRS);
            }

            Base._build = function (name, main, extensions, px, sx, cfg) {

                var build = Base._build,

                    builtClass = build._ctor(main, cfg),
                    buildCfg = build._cfg(main, cfg, extensions),

                    _mixCust = build._mixCust,

                    dynamic = builtClass._yuibuild.dynamic,

                    i, l, extClass, extProto,
                    initializer,
                    destructor;

                for (i = 0, l = extensions.length; i < l; i++) {
                    extClass = extensions[i];

                    extProto = extClass.prototype;

                    initializer = extProto[INITIALIZER];
                    destructor = extProto[DESTRUCTOR];
                    delete extProto[INITIALIZER];
                    delete extProto[DESTRUCTOR];

                    M.mix(builtClass, extClass, true, null, 1);

                    _mixCust(builtClass, extClass, buildCfg);

                    if (initializer) {
                        extProto[INITIALIZER] = initializer;
                    }

                    if (destructor) {
                        extProto[DESTRUCTOR] = destructor;
                    }

                    builtClass._yuibuild.exts.push(extClass);
                }

                if (px) {
                    M.mix(builtClass.prototype, px, true);
                }

                if (sx) {
                    M.mix(builtClass, build._clean(sx, buildCfg), true);
                    _mixCust(builtClass, sx, buildCfg);
                }

                builtClass.prototype.hasImpl = build._impl;

                if (dynamic) {
                    builtClass.NAME = name;
                    builtClass.prototype.constructor = builtClass;

                    builtClass.modifyAttrs = main.modifyAttrs;
                }

                return builtClass;
            };

            build = Base._build;

            M.mix(build, {

                _mixCust: function (r, s, cfg) {

                    var aggregates,
                        custom,
                        statics,
                        aggr,
                        l,
                        i;

                    if (cfg) {
                        aggregates = cfg.aggregates;
                        custom = cfg.custom;
                        statics = cfg.statics;
                    }

                    if (statics) {
                        M.mix(r, s, true, statics);
                    }

                    if (aggregates) {
                        for (i = 0, l = aggregates.length; i < l; i++) {
                            aggr = aggregates[i];
                            if (!r.hasOwnProperty(aggr) && s.hasOwnProperty(aggr)) {
                                r[aggr] = _.isArray(s[aggr]) ? [] : {};
                            }
                            M.aggregate(r, s, true, [aggr]);
                        }
                    }

                    if (custom) {
                        for (i in custom) {
                            if (custom.hasOwnProperty(i)) {
                                custom[i](i, r, s);
                            }
                        }
                    }

                },

                _tmpl: function (main) {

                    function BuiltClass() {
                        BuiltClass.superclass.constructor.apply(this, arguments);
                    }

                    M.extend(BuiltClass, main);

                    return BuiltClass;
                },

                _impl: function (extClass) {
                    var classes = this._getClasses(), i, l, cls, exts, ll, j;
                    for (i = 0, l = classes.length; i < l; i++) {
                        cls = classes[i];
                        if (cls._yuibuild) {
                            exts = cls._yuibuild.exts;
                            ll = exts.length;

                            for (j = 0; j < ll; j++) {
                                if (exts[j] === extClass) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                },

                _ctor: function (main, cfg) {

                    var dynamic = (cfg && false === cfg.dynamic) ? false : true,
                        builtClass = (dynamic) ? build._tmpl(main) : main,
                        buildCfg = builtClass._yuibuild;

                    if (!buildCfg) {
                        buildCfg = builtClass._yuibuild = {};
                    }

                    buildCfg.id = buildCfg.id || null;
                    buildCfg.exts = buildCfg.exts || [];
                    buildCfg.dynamic = dynamic;

                    return builtClass;
                },

                _cfg: function (main, cfg, exts) {
                    var aggr = [],
                        cust = {},
                        statics = [],
                        buildCfg,
                        cfgAggr = (cfg && cfg.aggregates),
                        cfgCustBuild = (cfg && cfg.custom),
                        cfgStatics = (cfg && cfg.statics),
                        c = main,
                        i,
                        l;

                    while (c && c.prototype) {
                        buildCfg = c._buildCfg;
                        if (buildCfg) {
                            if (buildCfg.aggregates) {
                                aggr = aggr.concat(buildCfg.aggregates);
                            }
                            if (buildCfg.custom) {
                                M.mix(cust, buildCfg.custom, true);
                            }
                            if (buildCfg.statics) {
                                statics = statics.concat(buildCfg.statics);
                            }
                        }
                        c = c.superclass ? c.superclass.constructor : null;
                    }

                    // Exts
                    if (exts) {
                        for (i = 0, l = exts.length; i < l; i++) {
                            c = exts[i];
                            buildCfg = c._buildCfg;
                            if (buildCfg) {
                                if (buildCfg.aggregates) {
                                    aggr = aggr.concat(buildCfg.aggregates);
                                }
                                if (buildCfg.custom) {
                                    M.mix(cust, buildCfg.custom, true);
                                }
                                if (buildCfg.statics) {
                                    statics = statics.concat(buildCfg.statics);
                                }
                            }
                        }
                    }

                    if (cfgAggr) {
                        aggr = aggr.concat(cfgAggr);
                    }

                    if (cfgCustBuild) {
                        M.mix(cust, cfg.cfgBuild, true);
                    }

                    if (cfgStatics) {
                        statics = statics.concat(cfgStatics);
                    }

                    return {
                        aggregates: aggr,
                        custom: cust,
                        statics: statics
                    };
                },

                _clean: function (sx, cfg) {
                    var prop, i, l, sxclone = M.merge(sx),
                        aggregates = cfg.aggregates,
                        custom = cfg.custom;

                    for (prop in custom) {
                        if (sxclone.hasOwnProperty(prop)) {
                            delete sxclone[prop];
                        }
                    }

                    for (i = 0, l = aggregates.length; i < l; i++) {
                        prop = aggregates[i];
                        if (sxclone.hasOwnProperty(prop)) {
                            delete sxclone[prop];
                        }
                    }

                    return sxclone;
                }
            });

            Base.build = function (name, main, extensions, cfg) {
                return build(name, main, extensions, null, null, cfg);
            };

            Base.create = function (name, base, extensions, px, sx) {
                return build(name, base, extensions, px, sx);
            };

            Base.mix = function (main, extensions) {

                if (main._CACHED_CLASS_DATA) {
                    main._CACHED_CLASS_DATA = null;
                }

                return build(null, main, extensions, null, null, {dynamic: false});
            };

            BaseCore._buildCfg = {
                aggregates: AGGREGATES.concat(),

                custom: {
                    ATTRS: attrsAggregator,
                    _ATTR_CFG: attrCfgAggregator,
                    _NON_ATTRS_CFG: arrayAggregator
                }
            };

            Base._buildCfg = {
                aggregates: AGGREGATES.concat(),

                custom: {
                    ATTRS: attrsAggregator,
                    _ATTR_CFG: attrCfgAggregator,
                    _NON_ATTRS_CFG: arrayAggregator
                }
            };
        })(_, M);

    })(_, M);

    (function (_, M) {
        var ID = "id",
            RENDER = "render",
            RENDERED = "rendered",
            DESTROYED = "destroyed",
            EMPTY_FN = function () {
            },
            TRUE = true,
            FALSE = false,
            ATTRS = {};

        function Widget(config) {
            M.log('constructor called', 'life', 'widget');
            var widget = this;
            config = config || {};
            Widget.superclass.constructor.call(this, config);
            var render = widget.get(RENDER);

            if (render) {
                widget.render();
            }
        }

        Widget.NAME = "widget";

        Widget.ATTRS = ATTRS;

        ATTRS[ID] = {
            valueFn: "_guid",
            writeOnce: TRUE
        };

        ATTRS[RENDERED] = {
            value: FALSE,
            readOnly: TRUE
        };
        ATTRS[RENDER] = {
            value: FALSE,
            writeOnce: TRUE
        };

        M.extend(Widget, M.Base, {
            initializer: function (config) {
                M.log('initializer called', 'life', 'widget');
            },
            destructor: function () {
                M.log('destructor called', 'life', 'widget');
            },

            destroy: function () {
                return Widget.superclass.destroy.apply(this);
            },
            renderer: function () {
                var widget = this;

                widget.renderUI();

                widget.bindUI();

                widget.syncUI();
            },

            render: function () {
                if (this.get(DESTROYED)) {
                    M.log("Render failed; widget has been destroyed", "error", "widget");
                }

                if (!this.get(DESTROYED) && !this.get(RENDERED)) {
                    this.publish(RENDER, {
                        queuable: FALSE,
                        fireOnce: TRUE,
                        defaultTargetOnly: TRUE,
                        defaultFn: this._defRenderFn
                    });

                    this.fire(RENDER, null);
                }
                return this;
            },

            _defRenderFn: function (e) {
                this.renderer();
                this._set(RENDERED, TRUE);
            },

            bindUI: EMPTY_FN,

            renderUI: EMPTY_FN,

            syncUI: EMPTY_FN,

            toString: function () {
                return this.name + "[" + this.get(ID) + "]";
            },
            _guid: function () {
                return M.guid();
            }
        });

        M.Widget = Widget;

    })(_, M);

    return M;

})
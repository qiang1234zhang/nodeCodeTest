define([], function () {
    'use strict';

    var has = Object.prototype.hasOwnProperty;

    var prefix = typeof Object.create !== 'function' ? '~' : false;


    function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
    }


    function EventEmitter() { /* Nothing to set */
    }


    EventEmitter.prototype._events = undefined;


    EventEmitter.prototype.eventNames = function eventNames() {
        var events = this._events
            , names = []
            , name;

        if (!events) return names;

        for (name in events) {
            if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
        }

        if (Object.getOwnPropertySymbols) {
            return names.concat(Object.getOwnPropertySymbols(events));
        }

        return names;
    };


    EventEmitter.prototype.listeners = function listeners(event, exists) {
        var evt = prefix ? prefix + event : event
            , available = this._events && this._events[evt];

        if (exists) return !!available;
        if (!available) return [];
        if (available.fn) return [available.fn];

        for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
            ee[i] = available[i].fn;
        }

        return ee;
    };


    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;

        if (!this._events || !this._events[evt]) return false;

        var listeners = this._events[evt]
            , len = arguments.length
            , args
            , i;

        if ('function' === typeof listeners.fn) {
            if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

            switch (len) {
                case 1:
                    return listeners.fn.call(listeners.context), true;
                case 2:
                    return listeners.fn.call(listeners.context, a1), true;
                case 3:
                    return listeners.fn.call(listeners.context, a1, a2), true;
                case 4:
                    return listeners.fn.call(listeners.context, a1, a2, a3), true;
                case 5:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                case 6:
                    return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
            }

            for (i = 1, args = new Array(len - 1); i < len; i++) {
                args[i - 1] = arguments[i];
            }

            listeners.fn.apply(listeners.context, args);
        } else {
            var length = listeners.length
                , j;

            for (i = 0; i < length; i++) {
                if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

                switch (len) {
                    case 1:
                        listeners[i].fn.call(listeners[i].context);
                        break;
                    case 2:
                        listeners[i].fn.call(listeners[i].context, a1);
                        break;
                    case 3:
                        listeners[i].fn.call(listeners[i].context, a1, a2);
                        break;
                    default:
                        if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                            args[j - 1] = arguments[j];
                        }

                        listeners[i].fn.apply(listeners[i].context, args);
                }
            }
        }

        return true;
    };


    EventEmitter.prototype.on = function on(event, fn, context) {
        var listener = new EE(fn, context || this)
            , evt = prefix ? prefix + event : event;

        if (!this._events) this._events = prefix ? {} : Object.create(null);
        if (!this._events[evt]) this._events[evt] = listener;
        else {
            if (!this._events[evt].fn) this._events[evt].push(listener);
            else this._events[evt] = [
                this._events[evt], listener
            ];
        }

        return this;
    };


    EventEmitter.prototype.once = function once(event, fn, context) {
        var listener = new EE(fn, context || this, true)
            , evt = prefix ? prefix + event : event;

        if (!this._events) this._events = prefix ? {} : Object.create(null);
        if (!this._events[evt]) this._events[evt] = listener;
        else {
            if (!this._events[evt].fn) this._events[evt].push(listener);
            else this._events[evt] = [
                this._events[evt], listener
            ];
        }

        return this;
    };


    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;

        if (!this._events || !this._events[evt]) return this;

        var listeners = this._events[evt]
            , events = [];

        if (fn) {
            if (listeners.fn) {
                if (
                    listeners.fn !== fn
                    || (once && !listeners.once)
                    || (context && listeners.context !== context)
                ) {
                    events.push(listeners);
                }
            } else {
                for (var i = 0, length = listeners.length; i < length; i++) {
                    if (
                        listeners[i].fn !== fn
                        || (once && !listeners[i].once)
                        || (context && listeners[i].context !== context)
                    ) {
                        events.push(listeners[i]);
                    }
                }
            }
        }

        if (events.length) {
            this._events[evt] = events.length === 1 ? events[0] : events;
        } else {
            delete this._events[evt];
        }

        return this;
    };


    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
        if (!this._events) return this;

        if (event) delete this._events[prefix ? prefix + event : event];
        else this._events = prefix ? {} : Object.create(null);

        return this;
    };


    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
        return this;
    };
    EventEmitter.prefixed = prefix;

    return EventEmitter;
})
/*! angular-drag@0.0.1-beta | https://github.com/aui/angular-drag */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global require */
	
	'use strict';
	
	var Drag = __webpack_require__(1);
	var angular = __webpack_require__(2);
	
	var angularDrag = angular.module('angular-drag', []);
	
	angularDrag.directive('drag', function() {
	    return {
	        restrict: 'A',
	        link: function(scope, elem) {
	            var dragNode = elem[0];
	            var dragHandle = dragNode.querySelector('[drag-handle]');
	
	            if (!dragHandle) {
	                new Drag(dragNode);
	            }
	        }
	    };
	});
	
	angularDrag.directive('dragHandle', function() {
	    return {
	        restrict: 'A',
	        link: function(scope, elem) {
	            var dragNode = elem[0];
	
	            while (!dragNode.hasAttribute('drag')) {
	                dragNode = dragNode.parentNode;
	            }
	
	            elem.on(Drag.START, function(event) {
	                new Drag(dragNode, event);
	                event.preventDefault();
	            });
	        }
	    };
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* global require,module */
	'use strict';
	
	var $ = __webpack_require__(3);
	
	
	var $window = $(window);
	var $document = $(document);
	var isTouch = 'createTouch' in document;
	var html = document.documentElement;
	var isIE6 = !('minWidth' in html.style);
	var isLosecapture = !isIE6 && 'onlosecapture' in html;
	var isSetCapture = 'setCapture' in html;
	
	function noop() {}
	
	function preventDefault() {
	    return false;
	}
	
	var eventTypes = {
	    start: isTouch ? 'touchstart' : 'mousedown',
	    move: isTouch ? 'touchmove' : 'mousemove',
	    end: isTouch ? 'touchend' : 'mouseup'
	};
	
	var touchId = 0;
	var getEvent = isTouch ? function(event, touchId) {
	    return (event.touches || event.originalEvent.touches)[touchId];
	} : function(event) {
	    return event;
	};
	
	
	var supports = (function() {
	    var div = document.createElement('div');
	    var vendors = 'Khtml Ms O Moz Webkit'.split(' ');
	    var len = vendors.length;
	
	    return function(prop) {
	        if (prop in div.style) {
	            return prop;
	        }
	
	        prop = prop.replace(/^[a-z]/, function(val) {
	            return val.toUpperCase();
	        });
	
	        while (len--) {
	            if (vendors[len] + prop in div.style) {
	                return vendors[len] + prop;
	            }
	        }
	
	        return null;
	    };
	})();
	
	
	var transform = supports('transform');
	
	
	
	/**
	 * 拖拽事件类，解决浏览器兼容问题
	 * @constructor
	 */
	function Drag(elem, event, GPU) {
	
	    if (elem) {
	        return new Drag.create(elem, event, GPU);
	    }
	
	    this.start = $.proxy(this.start, this);
	    this.move = $.proxy(this.move, this);
	    this.end = $.proxy(this.end, this);
	}
	
	Drag.prototype = {
	
	    constructor: Drag,
	
	    start: function(event) {
	
	        this.touchId = touchId;
	        event = getEvent(event, touchId);
	        touchId++;
	
	        this.target = $(event.target);
	
	        $document
	            .on('selectstart', preventDefault)
	            .on('dblclick', this.end);
	
	        if (isLosecapture) {
	            this.target.on('losecapture', this.end);
	        } else {
	            $window.on('blur', this.end);
	        }
	
	        if (isSetCapture) {
	            this.target[0].setCapture();
	        }
	
	        $document
	            .on(eventTypes.move, this.move)
	            .on(eventTypes.end, this.end);
	
	        this.onstart(event);
	        return false;
	    },
	
	    move: function(event) {
	        event = getEvent(event, this.touchId);
	        this.onmove(event);
	        return false;
	    },
	
	    end: function(event) {
	        this.touchId = touchId;
	        event = getEvent(event, touchId);
	        touchId--;
	
	        $document
	            .off('selectstart', preventDefault)
	            .off('dblclick', this.end);
	
	        if (isLosecapture) {
	            this.target.off('losecapture', this.end);
	        } else {
	            $window.off('blur', this.end);
	        }
	
	        if (isSetCapture) {
	            this.target[0].releaseCapture();
	        }
	
	        $document
	            .off(eventTypes.move, this.move)
	            .off(eventTypes.end, this.end);
	
	        this.onend(event);
	        return false;
	    }
	
	};
	
	
	
	/**
	 * @constructor
	 * @param   {HTMLElement}   被拖拽的元素
	 * @param   {Event}         触发拖拽的事件对象。若无则监听 elem 的按下事件启动
	 */
	
	Drag.create = function(elem, event, GPU) {
	
	    var $elem = $(elem);
	    var drag = this;
	    var dragEvent = new Drag();
	
	    var x, y, minX, minY, maxX, maxY, startLeft, startTop, clientX, clientY;
	
	    if (typeof GPU === 'undefined') {
	        GPU = !!transform;
	    }
	
	    this.GPU = GPU;
	
	    dragEvent.onstart = function(event) {
	        var $wrap = elem.parentNode.nodeName === 'BODY' ?
	            $document : $elem.offsetParent();
	
	        var isFixed = $elem.css('position') === 'fixed';
	        var position = $elem.position();
	        var ww = $window.width();
	        var wh = $window.height();
	        var dl = $wrap.scrollLeft();
	        var dt = $wrap.scrollTop();
	        var dw = $wrap.width();
	        var dh = $wrap.height();
	        var w = $elem.outerWidth();
	        var h = $elem.outerHeight();
	        var l = position.left;
	        var t = position.top;
	
	        if (drag.GPU) {
	            minX = isFixed ? -l : -l - dl;
	            minY = isFixed ? -t : -t - dt;
	            maxX = isFixed ? ww - w - l : dw - w - l;
	            maxY = isFixed ? wh - h - t : dh - h - t;
	            x = 0;
	            y = 0;
	            startLeft = l;
	            startTop = t;
	        } else {
	            minX = 0;
	            minY = 0;
	            maxX = isFixed ? ww - w + minX : dw - w;
	            maxY = isFixed ? wh - h + minY : dh - h;
	            x = startLeft = l;
	            y = startTop = t;
	        }
	
	
	        clientX = event.clientX;
	        clientY = event.clientY;
	
	        drag.onstart(event);
	    };
	
	
	    dragEvent.onmove = function(event) {
	
	        var style = elem.style;
	
	        if (drag.GPU) {
	            x = event.clientX - clientX;
	            y = event.clientY - clientY;
	        } else {
	            x = event.clientX - clientX + startLeft;
	            y = event.clientY - clientY + startTop;
	        }
	
	        x = Math.max(minX, Math.min(maxX, x));
	        y = Math.max(minY, Math.min(maxY, y));
	
	
	        // 使用 GPU 加速
	        if (drag.GPU) {
	            style[transform] = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
	            // 使用传统的方式
	        } else {
	            style.left = x + 'px';
	            style.top = y + 'px';
	        }
	
	
	        drag.onmove(event);
	    };
	
	
	    dragEvent.onend = function(event) {
	        var style = elem.style;
	
	
	        if (drag.GPU) {
	            style[transform] = '';
	            style.left = x + startLeft + 'px';
	            style.top = y + startTop + 'px';
	        } else {
	            style.left = x + 'px';
	            style.top = y + 'px';
	        }
	
	        drag.onend(event);
	    };
	
	
	    if (event) {
	        // TODO onstart 事件此时可能还没注册
	        dragEvent.start(event);
	    } else {
	        $elem.on(Drag.START, dragEvent.start);
	        this.destroy = function() {
	            $elem.off(Drag.START, dragEvent.start);
	        };
	    }
	};
	
	
	Drag.START = eventTypes.start;
	Drag.MOVE = eventTypes.move;
	Drag.END = eventTypes.end;
	
	
	Drag.create.prototype = {
	    constructor: Drag.create,
	    onstart: noop,
	    onmove: noop,
	    onend: noop,
	    destroy: noop,
	};
	
	module.exports = Drag;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ }
/******/ ]);


/** WEBPACK FOOTER **
 ** angular-drag.js
 **/
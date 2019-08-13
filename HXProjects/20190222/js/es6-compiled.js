"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$("#div").html("This is new table");

var Test = function () {
	function Test(a, b) {
		_classCallCheck(this, Test);

		this.a = a;
		this.b = b;
	}

	_createClass(Test, [{
		key: "say",
		value: function say(y) {
			$("#div").html(y);
			console.log(y);
		}
	}]);

	return Test;
}();

;
var s = new Test("what", "is");
s.say(4343);

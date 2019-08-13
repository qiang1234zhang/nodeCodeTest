var Tstest = /** @class */ (function () {
    function Tstest(a, b) {
        this.a = a;
        this.b = b;
    }
    Tstest.prototype.say = function (y) {
        return y;
    };
    return Tstest;
}());
;
var s = new Tstest(6, "what");
console.log(s);
var r = s.say("is");

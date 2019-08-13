var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by ZHANGQIANG on 2018/10/8.
 */
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
//抽象类
var Animal = (function () {
    function Animal(name) {
        this.name = name;
    }
    return Animal;
})();
//抽象方法必须被子类实现
var Cat = (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        _super.apply(this, arguments);
    }
    Cat.prototype.sayHi = function () {
        console.log("Meow, My name is " + this.name);
    };
    return Cat;
})(Animal);
var cat = new Cat('Tom');
//类的类型
var Animals = (function () {
    function Animals(name) {
        this.name = name;
    }
    Animals.prototype.sayHi = function () {
        return "My name is " + this.name;
    };
    return Animals;
})();
var a = new Animals('Jack');
console.log(a.sayHi()); // My name is Jack
var Door = (function () {
    function Door() {
    }
    return Door;
})();
var SecurityDoor = (function (_super) {
    __extends(SecurityDoor, _super);
    function SecurityDoor() {
        _super.apply(this, arguments);
    }
    SecurityDoor.prototype.alert = function () {
        console.log('SecurityDoor alert');
    };
    return SecurityDoor;
})(Door);
var Car = (function () {
    function Car() {
    }
    Car.prototype.alert = function () {
        console.log('Car alert');
    };
    return Car;
})();
var Car = (function () {
    function Car() {
    }
    Car.prototype.alert = function () {
        console.log('Car alert');
    };
    Car.prototype.lightOn = function () {
        console.log('Car light on');
    };
    Car.prototype.lightOff = function () {
        console.log('Car light off');
    };
    return Car;
})();
//接口也可以继承类：
var Point = (function () {
    function Point() {
    }
    return Point;
})();
var point3d = { x: 1, y: 2, z: 3 };
//# sourceMappingURL=demo.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by ZHANGQIANG on 2018/10/8.
 */
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
////////////////////////////////////访问范围：
// public：己，子，外
// protected：己，子
// private：己
// 属性不加修饰符，默认是公有
//抽象类
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = name;
    }
    return Animal;
}());
//抽象方法必须被子类实现
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cat.prototype.sayHi = function () {
        console.log("Meow, My name is " + this.name);
    };
    return Cat;
}(Animal));
var cat = new Cat('Tom');
//类的类型：给变量、参数、和方法增加类型
var Animals = /** @class */ (function () {
    function Animals(names) {
        this.name = names;
    }
    Animals.prototype.sayHi = function () {
        return "My name is " + this.name;
    };
    return Animals;
}());
var a = new Animals('Jack');
console.log(a.sayHi()); // My name is Jack
var Door = /** @class */ (function () {
    function Door() {
    }
    return Door;
}());
var SecurityDoor = /** @class */ (function (_super) {
    __extends(SecurityDoor, _super);
    function SecurityDoor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecurityDoor.prototype.alert = function () {
        console.log('SecurityDoor alert');
    };
    return SecurityDoor;
}(Door));
var Car1 = /** @class */ (function () {
    function Car1() {
    }
    Car1.prototype.alert = function () {
        console.log('Car alert');
    };
    return Car1;
}());
var Car = /** @class */ (function () {
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
}());
//接口也可以继承类：
var Point = /** @class */ (function () {
    function Point() {
    }
    return Point;
}());
var point3d = { x: 1, y: 2, z: 3 };
///////////////////////////////////////////////////////////////
//"装饰器" (也叫 "注解")就是对一个 类/方法/属性/参数 的装饰。
//反射，就是在运行时动态获取一个对象的一切信息：方法/属性等等，特点在于动态类型反推导。

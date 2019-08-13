//给变量、方法参数、和方法增加类型
//////////////////////////////////
//修饰符修饰变量的访问范围：
// public：己，子，外
// protected：己，子
// private：己
// 属性不加修饰符，默认是公有
//////////////////////////////////////////////////
///getter和setter
// class Animalw {
//     constructor(name) {
//         this.name = name;
//     }
//     get name() {
//         return 'Jack';
//     }
//     set name(value) {
//         console.log('setter: ' + value);
//     }
// }
// let aa = new Animalw('Kitty'); // setter: Kitty
// aa.name = 'Tom'; // setter: Tom
// console.log(a.name); // Jack
var passcode = "secret passcode";
var Employee = /** @class */ (function () {
    function Employee() {
    }
    Object.defineProperty(Employee.prototype, "fullName", {
        get: function () {
            return this._fullName;
        },
        set: function (newName) {
            if (passcode && passcode == "secret passcode") {
                this._fullName = newName;
            }
            else {
                console.log("Error: Unauthorized update of employee!");
            }
        },
        enumerable: true,
        configurable: true
    });
    return Employee;
}());
var employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
////////////////////////////////////////////////
//只给变量、方法参数、和方法增加类型，构造函数不需要
var Person = /** @class */ (function () {
    function Person(name11) {
        this.name = name11;
    }
    ;
    Person.prototype.getName = function () {
        return this.name;
    };
    ;
    Person.prototype.setName = function (name2) {
        this.name = name2;
    };
    return Person;
}());
var p = new Person('宽真');
alert(p.getName());
p.setName('大神');
alert(p.getName());
/////////////////////////////////////////////构造函数不需加类型
var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
var users = new Student("Jane", "M.", "User");
document.body.innerHTML = greeter(users);
// 类
var TaSaid = /** @class */ (function () {
    function TaSaid() {
    }
    return TaSaid;
}());

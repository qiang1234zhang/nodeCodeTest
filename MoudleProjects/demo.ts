/**
 * Created by ZHANGQIANG on 2018/10/8.
 */
function sayHello(person: string) {
    return 'Hello, ' + person;
}
let user = 'Tom';
console.log(sayHello(user));
//抽象类
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}
//抽象方法必须被子类实现
class Cat extends Animal {
    public sayHi() {
        console.log(`Meow, My name is ${this.name}`);
    }
}
let cat = new Cat('Tom');
//类的类型
class Animals {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
        return `My name is ${this.name}`;
    }
}
let a: Animal = new Animals('Jack');
console.log(a.sayHi()); // My name is Jack
// 接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述。
// 一个类只能继承自另一个类，一个类可以实现多个接口。
//举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：
interface Alarm {
    alert();
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
//一个类实现多个接口 ， Car 实现了 Alarm 和 Light 接口，既能报警，也能开关车灯。
interface Alarm {
    alert();
}

interface Light {
    lightOn();
    lightOff();
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
//接口与接口之间可以是继承关系：

interface Alarm {
    alert();
}

interface LightableAlarm extends Alarm {
    lightOn();
    lightOff();
}
//接口也可以继承类：

class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
/**
 * Created by ZHANGQIANG on 2018/10/8.
 */
function sayHello(person: string) {
    return 'Hello, ' + person;
}
let user = 'Tom';
console.log(sayHello(user));
////////////////////////////////////访问范围：
// public：己，子，外

// protected：己，子

// private：己

// 属性不加修饰符，默认是公有
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
//类的类型：给变量、参数、和方法增加类型
class Animals {
    name: string;//name属性必须先声明
    constructor(names: string) {
        this.name = names;
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

class Car1 implements Alarm {
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
// 命名空间
declare namespace Models {
    type A = number
    // 子命名空间
    namespace Config {
      type A = object
      type B = string
    }
  }
  
  type C = Models.Config.A
///////////////////////////////////////////////////////////////
  //"装饰器" (也叫 "注解")就是对一个 类/方法/属性/参数 的装饰。
  //反射，就是在运行时动态获取一个对象的一切信息：方法/属性等等，特点在于动态类型反推导。
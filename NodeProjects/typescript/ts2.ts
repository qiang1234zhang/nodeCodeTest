
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

let passcode = "secret passcode";
class Employee {
    private _fullName: string; //外部不可直接访问该变量，只能由fullName（）去操作
    //new 时隐式创建构造函数
    get fullName(): string {//版本低 报错 es6支持
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
    employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
////////////////////////////////////////////////
//只给变量、方法参数、和方法增加类型，构造函数不需要
class Person{
    name:string;//属性必须先声明
    constructor(name11:string){//name属性必须先声明
        this.name=name11;
    }
    getName():string{
        return this.name;
    }
    setName(name2:string):void{//变量要写类型，这个容易忘，就是要靠多敲多练。
        this.name=name2;
    }
}
var p=new Person('宽真');
alert(p.getName());
p.setName('大神');
alert(p.getName());

/////////////////////////////////////////////构造函数不需加类型
class Student {
    fullNames: string; //字段
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullNames = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let users : Student= new Student("Jane", "M.", "User");

//document.body.innerHTML = greeter(users);
////////////////////////////////////////////////类型定义另一种写法
// 基本类型
type UserName = string

// 类型赋值
type WebSite = string
type Tsaid = WebSite

// 对象
type User = {
    name: string;
    age: number;
    website: WebSite;
  }
  
  // 方法
  type say = (age: number) => string
  
  // 类
  class TaSaid {
    website: string;
    say: (age: number) => string;
  }
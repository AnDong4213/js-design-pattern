#### `2-1 搭建开发环境`

> 23 种设计模式都是基于面向对象的

```java
  // 下划线转换驼峰
  function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
  }
  // 驼峰转换下划线
  function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
  }
```

#### `2-5 什么是面向对象`

> `面向对象基本特征`<br />
>
> 1. 继承：通过继承创建的新类称为“子类”或“派生类”。继承的过程，就是从一般到特殊的过程。<br />
> 2. 封装：也就是把客观事物封装成抽象的类，并且类可以把自己的数据和方法只让可信的类或者对象操作，对不可信的进行信息隐藏。<br />
> 3. 多态：对象的多功能，多方法，一个方法多种表现形式。<br />
> 4. Javascript 是一种基于对象（object-based）的语言。但是，它又不是一种真正的面向对象编程（OOP）语言，因为它的语法中没有 class（类）—–es6 以前是这样的。所以 es5 只有使用函数模拟的面向对象。

> 面向对象至少有两个概念，一个是类(即模板),第二个是对象(实例)
> `三要素。继承，子类继承父类；封装，数据的权限和保密；多态，同一接口不同实现`

```java
  class People {
    name: any
    age: any
    protected weight: number

    constructor(name: any, age: any) {
      this.name = name;
      this.age = age;
      this.weight = 120
    }

    eat() {
      console.log(`${this.name} eat sth`)
    }
  }

  class Student extends People {
    number: any
    private girlfriend: string

    constructor(name: any, age: any, number: any) {
      super(name, age)
      this.number = number;
      this.girlfriend = 'xiaoyu';
    }

    getWeight() {
      console.log(`weight ${this.weight}`)
    }
  }

  const xm = new Student('haha', '22', 'A1')
  console.log(xm.name)
  xm.getWeight()
```

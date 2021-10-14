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

### `第3章 设计原则`

`UML类图 (Unified Modeling Language) 统一建模语言`

> 何为设计？<br />
> 即按照哪一种思路或者标准来实现功能，功能相同可以有不同设计方案来实现，伴随着需求的增加设计的作用才能体现出来。

> `Linux/Unix 设计思想`<br />
>
> 1. 小即是美 <br />
> 2. 让每个程序只作好一件事 <br />
> 3. 快速建立原型 <br />
> 4. 舍弃高效率而取可移植性 <br />
> 5. 采用纯文本来存储数据 <br />
> 6. 充分利用软件的杠杆效应(软件复用) <br />
> 7. 使用 shell 脚本来提高杠杆效应和可移植性 <br />
> 8. 避免强制性的用户界面 <br />
> 9. 让每个程序都称为过滤器 <br />

```java
  <Linux/Unix 设计思想> - 小准则

  小准则1: 允许用户定制环境；
  小准则2: 尽量使操作系统内核小而轻量化；
  小准则3: 使用小写字母并尽量简短；
  小准则4: 沉默是金；
  小准则5: 各部分之和大于整体；
  小准则6: 寻求90%的解决方案；
```

#### `SOLID五大设计原则`

> 单一职责原则：一个程序只做好一件事，如果功能过于复杂就拆分开，每个部分保持独立。<br />
> 开放封闭原则：对扩展开放，对修改封闭。增加需求时，扩展新代码，而非修改已有代码。<br />
> 里氏置换原则：子类能覆盖父类，父类能出现的地方子类就能出现，JS 中使用较少(弱类型 & 继承使用较少)。<br />
> 接口独立原则：保持接口的单一独立，避免出现‘胖接口’；JS 中没有接口(TS 例外)，使用较少。<br />
> 依赖倒置原则：面向接口编程，依赖于抽象而不依赖于具体；使用方只关注接口而不关注具体类的实现；JS 中使用较少(弱类型 & 没有接口)。<br />
> 迪米特法则（最少知道原则）：一个对象应当尽量少的与其他对象之间发生相互作用，使得系统功能模块相对独立。类与类关系越密切，耦合度越大。

#### `设计模式的三大分类`

> 创建型模式(共五种)：工厂模式(工厂方法模式、抽象工厂模式、建造者模式)，单例模式、原型模式 <br />
> 结构型模式(共七种)：适配器模式、装饰器模式、代理模式、外观模式、(桥接模式、组合模式、享元模式) <br />
> 行为型模式(共十一种)：观察者模式、迭代器模式、策略模式、模板方法模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式

> 在设计的时候考虑两点，第一是扩展性，第二是抽象，外加设计能力 <br />

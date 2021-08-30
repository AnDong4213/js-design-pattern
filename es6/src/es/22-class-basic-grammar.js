console.log(888);
// ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
{
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    toString() {
      return "(" + this.x + ", " + this.y + ")";
    }

    getAge() {
      return 23;
    }
  }

  // constructor()方法，这就是构造方法，而this关键字则代表 实例对象。
  console.log(typeof Point); // function
  console.log(Point === Point.prototype.constructor); // true  prototype对象的constructor()属性，直接指向“类”的本身，这与 ES5 的行为是一致的。
  // 类的数据类型就是函数，类本身就指向构造函数。

  // 事实上，类的所有方法都定义在类的prototype属性上面，定义在Point.prototype上面。
  // 在类的实例上面调用方法，其实就是调用原型上的方法。
  const b = new Point();
  console.log(Object.getPrototypeOf(b) === Point.prototype); // true
  console.log(b.__proto__ === Point.prototype); // true
  console.log(b.constructor === Point); // true
  console.log(b.constructor === Point.prototype.constructor); // true
  // b是B类的实例，它的constructor()方法就是B类原型的constructor()方法。

  Object.assign(Point.prototype, {
    getSex() {
      return "1";
    }
  });

  // 类的内部所有定义的方法，都是不可枚举的（non-enumerable）。这一点与 ES5 的行为不一致。
  console.log(b.getAge());
  console.log(Object.keys(Point.prototype)); // ["getSex"]
  console.log(Object.getOwnPropertyNames(Point.prototype)); // ["constructor", "toString", "getAge", "getSex"]
  // Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。
  // Object的hasOwnProperty()方法返回一个布尔值，判断对象是否包含特定的自身（非继承）属性。
}

{
  console.log("-------------------------------------------");
  // constructor 方法

  // constructor()方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。

  // constructor()方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
  class Foo {
    constructor() {
      console.log(9);
      return Object.create(null);
    }
  }
  // console.log(new Foo() instanceof Foo); // false
  class Foo2 extends Foo {
    constructor() {
      console.log(67);
      super();
    }
  }
  console.log(new Foo2() instanceof Foo); // false
  console.log(Foo2.name); // Foo2
}
console.log("-------------------------------------------");
{
  // 取值函数（getter）和存值函数（setter）
  // 与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
  // 存值函数和取值函数是设置在属性的 Descriptor 对象上的。

  console.log(0);
  // 数据描述符和存取描述符4个特性的比较：
  // 两种描述符都有[[configurable]][[enumerable]]两种属性。默认值都为false；对于直接在对象上定义的属性，默认值为true。
  // 数据描述符另外具有[[writable]][[value]]两种属性；存取描述符另外具有[[get]][[set]]两种属性。

  // 采用 Class 表达式，可以写出立即执行的 Class。
  let person = new (class {
    constructor(name) {
      this.name = name;
    }

    sayName() {
      console.log(this.name);
    }
  })("张三");

  person.sayName();

  // this 的指向
  // 类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
  /* class Logger {
    printName(name = "there") {
      this.print(`Hello ${name}`);
    }

    print(text) {
      console.log(text);
    }
  }
  const logger = new Logger();
  logger.printName();

  const { printName } = logger; */ // 将这个方法提取出来单独使用，this会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是undefined），从而导致找不到print方法而报错。
  // printName(); // Uncaught TypeError: Cannot read property 'print' of undefined

  // 一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了。
  class Logger {
    constructor() {
      // bind与apply和call的最大的区别是：bind不会立即调用，而是返回一个新函数，称为绑定函数，其内的this指向为创建它时传入bind的第一个参数，而传入bind的第二个及以后的参数作为原函数的参数来调用原函数。
      // this.printName = this.printName.bind(this);

      // 箭头函数内部的this总是指向定义时所在的对象。代码中，箭头函数位于构造函数内部，它的定义生效的时候，是在构造函数执行的时候。这时，箭头函数所在的运行环境，肯定是实例对象，所以this会总是指向实例对象。
      this.printName = () => this;

      // 还有一种解决方法是使用Proxy，获取方法的时候，自动绑定this。
    }
    printName(name = "there") {
      this.print(`Hello ${name}`);
    }

    print(text) {
      console.log(text);
    }
  }
  const logger = new Logger();

  const { printName } = logger;
  printName();
}
console.log("-------------------------------------------");
{
  // 静态方法
  // 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
  // 如果静态方法包含this关键字，这个this指的是类，而不是实例，静态方法可以与非静态方法重名。
  // 父类的静态方法，可以被子类继承。

  // 静态方法也是可以从super对象上调用的。
  class Foo {
    static classMethod() {
      return "hello";
    }
  }
  class Bar extends Foo {
    static classMethod() {
      return super.classMethod() + ", too";
    }
  }

  console.log(Bar.classMethod());
}

console.log("-------------------------------------------");
{
  // 实例属性的新写法
  // 实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。
  class IncreasingCounter {
    _count = 0;
    get value1() {
      console.log("Getting the current value!");
      return this._count;
    }
    increment() {
      this._count++;
    }
  }

  const inq = new IncreasingCounter();
  inq.increment();
  // console.log(inq.value1); // 1
}

{
  // 静态属性
  // 静态属性指的是 Class 本身的属性，即 Class.propName，而不是定义在实例对象（this）上的属性。
  class Foo {}
  Foo.prop = 1;
  // 上面的写法为Foo类定义了一个静态属性prop。
  console.log(Foo.prop);

  // 目前，只有这种写法可行，因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上static关键字。
  class MyClass {
    static myStaticProp = 42;
    static age = 23;

    constructor() {
      console.log(MyClass.myStaticProp); // 42
    }
  }
  console.log(MyClass.age); // 23
  const aa = new MyClass();
  console.log(aa.age); // undefined
}

console.log("-------------------------------------------");
{
  // 私有方法和私有属性
  // 私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。这是常见需求，有利于代码的封装，但 ES6 不提供，只能通过变通方法模拟实现。
}

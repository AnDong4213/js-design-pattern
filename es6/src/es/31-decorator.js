//装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。
// 装饰器是一种函数，写成 @ + 函数名。它可以放在类和类方法的定义前面。

{
  @testable
  class MyTestableClass {
    static age = 9;
  }

  function testable(target) {
    console.log(target); // 装饰器是一个对类进行处理的函数。装饰器函数的第一个参数，就是所要装饰的目标类。
    target.isTestable = true;
  }

  console.log(MyTestableClass.isTestable);
  console.log(MyTestableClass.age); // 9

  let log = (type) => {
    return function (target, name, descriptor) {
      let src_method = descriptor.value;
      descriptor.value = (...arg) => {
        src_method.apply(target, arg);
        console.info(`log ${type}`);
      };
    };
  };
  class AD {
    @log("show")
    show() {
      console.info("ad is show");
    }
    @log("click")
    click() {
      console.info("ad is click");
    }
  }
  let ad = new AD();
  ad.show();
  ad.click();
}
console.log("------------========---------------");

{
  // 如果觉得一个参数不够用，可以在装饰器外面再封装一层函数。
  // 装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。
  // 是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的prototype对象操作。
  function testable(isTestable) {
    return function (target) {
      target.bool = isTestable;
      target.prototype.sex = "female";
    };
  }
  @testable(false)
  class MyTestableClass {
    static age = 9;
  }
  console.log(MyTestableClass.bool);
  console.log(MyTestableClass.sex); // undefined
  console.log(new MyTestableClass().sex); // female
}

console.log("------------========-------------");

{
  function mixins(...list) {
    return function (target) {
      Object.assign(target.prototype, ...list);
    };
  }

  const Foo = {
    foo() {
      console.log("foo");
    },
    age: 99
  };
  @mixins(Foo)
  class MyClass {}
  let obj = new MyClass();
  obj.foo();
  console.log(obj.age); // 99
  obj.age = 101;
  console.log(obj.age); // 101
}
console.log("------------========-------------");
{
  // 2, 方法的装饰

  // 装饰器不仅可以装饰类，还可以装饰类的属性。
  function readonly(target, name, descriptor) {
    descriptor.writable = false;
    console.log("++++", descriptor.value);
    return descriptor;
  }
  function nonenumerable(target, name, descriptor) {
    descriptor.enumerable = false;
    return descriptor;
  }
  class Person {
    constructor() {
      this.data = [99, 77];
    }
    @readonly
    name = "toy";
    @readonly
    age() {
      return 23;
    }
    @nonenumerable
    get kidCount() {
      return this.data;
    }
  }
  const p = new Person();
  p.name = "22";
  console.log(p.name); // toy
  console.log(p.kidCount); //  [99, 77]
  // 装饰器第一个参数是类的原型对象，上例是Person.prototype，装饰器的本意是要“装饰”类的实例，但是这个时候实例还没生成，所以只能去装饰原型（这不同于类的装饰，那种情况时target参数指的是类本身）；第二个参数是所要装饰的属性名，第三个参数是该属性的描述对象。
}
console.log("------------========-------------");
{
  function log(target, name, descriptor) {
    var oldValue = descriptor.value;

    descriptor.value = function (...args) {
      console.log(`Calling ${name} with`, args);
      return oldValue.apply(this, args);
    };
  }

  class Math {
    @log
    add(a, b) {
      return a + b;
    }
  }
  const math = new Math();
  console.log(math.add(2, 4));
}

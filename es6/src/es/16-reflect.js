"use strict";
// Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个

// （1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
// （2） 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
const obj = {};
if (
  Reflect.defineProperty(obj, "age", {
    value: 25
  })
) {
  console.log(obj); // {age: 25}
}
// （3） 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
console.log(Reflect.has(obj, "age")); // true
// （4）Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
const proxy = new Proxy(obj, {
  set(target, name, value, receiver) {
    let success = Reflect.set(target, name, value, receiver);
    if (success) {
      console.log(
        "property " +
          name +
          " on " +
          JSON.stringify(target) +
          " set to " +
          value
      );
    }
    return success;
  }
});
proxy.sex = "f";
console.log(obj);
// Proxy方法拦截target对象的属性赋值行为。它采用Reflect.set方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。

// 静态方法。Reflect对象一共有 13 个静态方法

{
  // Reflect.get(target, name, receiver)  Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
  var myObject = {
    foo: 1,
    bar: 2,
    get baz() {
      return this.foo + this.bar;
    }
  };
  console.log(Reflect.get(myObject, "baz")); // 3
  // 如果name属性部署了读取函数（getter），则读取函数的this绑定receiver。
  console.log(Reflect.get(myObject, "foo", { foo: 6, bar: 7 }));
  console.log(Reflect.get(myObject, "baz", { foo: 4, bar: 4 })); // 8

  // Reflect.get(1, "foo"); // 如果第一个参数不是对象，Reflect.get方法会报错。
}
console.log("--------------------");
{
  // Reflect.set(target, name, value, receiver)  Reflect.set方法设置target对象的name属性等于value。
  // Reflect.set一旦传入receiver，就会将属性赋值到receiver上面（即obj），导致触发defineProperty拦截。
  /* var myObject = {
    foo: 1,
    set bar(value) {
      return (this.foo = value);
    }
    // get bar() {
    //   return this.foo;
    // }
  };
  console.log(myObject.foo); // 1

  Reflect.set(myObject, "foo", 3);
  console.log(myObject.foo); // 3

  Reflect.set(myObject, "bar", 5);
  console.log(myObject.foo); // 5
  console.log(myObject.bar); // undefined */

  // 如果name属性设置了赋值函数，则赋值函数的this绑定receiver。
  var myObject = {
    foo: 45,
    set bar(value) {
      return (this.foo = value);
    }
  };

  var myReceiverObject = {
    fooo: 0,
    aa: 99
  };
  // Reflect.set(myObject, "bar", 1);
  // console.log(myObject.foo); // 1
  // console.log(myReceiverObject.foo); // 0

  const re = Reflect.set(myObject, "foo", 12, myReceiverObject); // 一旦设置了receiver， receiver里的属性值就是Reflect.set设置的值，myObject里的相同属性的值不会改变了
  console.log(re); // true
  console.log(myObject.foo); // 45
  console.log(myReceiverObject); // {fooo: 0, aa: 99, foo: 12}
  console.log(myReceiverObject.foo); // 12

  // 如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。
  let p = {
    a: "a"
  };
  let handler = {
    set(target, key, value, receiver) {
      console.log("set");
      const result = Reflect.set(target, key, value, receiver);
      console.log(result); // false 如果没有设置defineProperty这个拦截，是true。
      return true;
    },
    defineProperty(target, key, attribute) {
      console.log("defineProperty");
      Reflect.defineProperty(target, key, attribute);
    }
  };

  let obj = new Proxy(p, handler);
  obj.a = "A";
  console.log(obj.a);
  // Proxy.set拦截里面使用了Reflect.set，而且传入了receiver，导致触发Proxy.defineProperty拦截。这是因为Proxy.set的receiver参数总是指向当前的 Proxy实例（即上例的obj），而Reflect.set一旦传入receiver，就会将属性赋值到receiver上面（即obj），导致触发defineProperty拦截。如果Reflect.set没有传入receiver，那么就不会触发defineProperty拦截。

  // Reflect.set如果第一个参数不是对象，Reflect.set会报错。
}

{
  // Reflect.has(obj, name)。Reflect.has方法对应name in obj里面的in运算符。
  // 如果Reflect.has()方法的第一个参数不是对象，会报错。
}
console.log("--------------------");
{
  // Reflect.deleteProperty(obj, name)。Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。
  // 该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false。
  // 如果Reflect.deleteProperty()方法的第一个参数不是对象，会报错。
  const obj = {
    age: 2
  };
  console.log(Reflect.deleteProperty(obj, "a")); // true
}
console.log("--------------------");
{
  // Reflect.construct(target, args)。
  // Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。
  class Greeting {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    getAge() {
      return this.age;
    }
  }

  const instance = new Greeting("张三", 23);
  console.log(instance.age);

  const instance2 = Reflect.construct(Greeting, ["", 99]);
  console.log(instance2);
  console.log(instance2.age); // 99
  // 如果Reflect.construct()方法的第一个参数不是函数，会报错。

  console.log(instance2.__proto__ === Greeting.prototype); // true
  console.log(instance2.__proto__ === Reflect.getPrototypeOf(instance2)); // true
  // Reflect.getPrototypeOf(obj)，，Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。
  console.log(Reflect.getPrototypeOf(instance2)); // {constructor: ƒ, getAge: ƒ}
  // Reflect.getPrototypeOf和Object.getPrototypeOf的一个区别是，如果参数不是对象，Object.getPrototypeOf会将这个参数转为对象，然后再运行，而Reflect.getPrototypeOf会报错。
  // console.log(Reflect.getPrototypeOf(1));
}

console.log("--------------------");

{
  // Reflect.setPrototypeOf(obj, newProto)
  // Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。

  // 如果无法设置目标对象的原型（比如，目标对象禁止扩展），Reflect.setPrototypeOf方法返回false。
  console.log(Reflect.setPrototypeOf({}, null)); // true
  console.log(Reflect.setPrototypeOf(Object.freeze({}), null)); // false

  // 如果第一个参数不是对象，Object.setPrototypeOf会返回第一个参数本身，而Reflect.setPrototypeOf会报错。
  // 如果第一个参数是undefined或null，Object.setPrototypeOf和Reflect.setPrototypeOf都会报错。
}

console.log("--------------------");

{
  // Reflect.apply(func, thisArg, args)
  // Reflect.apply方法等同于 Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。
  // 一般来说，如果要绑定一个函数的this对象，可以这样写 fn.apply(obj, args)，但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作。
  const ages = [11, 33, 12, 54, 18, 9, 96];
  // 旧写法
  const youngest = Math.min.apply(null, ages);
  console.log(youngest);
  const type = Object.prototype.toString.call(youngest);
  console.log(type);

  // 新写法
  console.log(Reflect.apply(Math.min, null, ages)); // 9
  console.log(Reflect.apply(Object.prototype.toString, youngest, [])); // [object Number]
}

console.log("--------------------");

{
  // Reflect.defineProperty(target, propertyKey, attributes)
  // Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。
  // 如果Reflect.defineProperty的第一个参数不是对象，就会抛出错误，

  // 这个方法可以与Proxy.defineProperty配合使用。
  const p = new Proxy(
    {},
    {
      defineProperty(target, prop, descriptor) {
        console.log(descriptor);
        return Reflect.defineProperty(target, prop, descriptor);
      }
    }
  );
  p.foo = "bar";
  console.log(p.foo);
  // Proxy.defineProperty对属性赋值设置了拦截，然后使用Reflect.defineProperty完成了赋值。
}
console.log("--------------------");
{
  // Reflect.getOwnPropertyDescriptor(target, propertyKey)
  // Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。
  var myObject = {};
  Reflect.defineProperty(myObject, "hidden", {
    value: true,
    enumerable: false
  });
  console.log(Reflect.getOwnPropertyDescriptor(myObject, "hidden")); // {value: true, writable: false, enumerable: false, configurable: false}

  // 一个区别 如果第一个参数不是对象，Object.getOwnPropertyDescriptor(1, 'foo')不报错，返回undefined，而Reflect.getOwnPropertyDescriptor(1, 'foo')会抛出错误，表示参数非法。
}
console.log("--------------------");
{
  // 默认情况下，对象是可扩展的：即可以为他们添加新的属性。以及它们的 __proto__ 属性可以被更改。Object.preventExtensions，Object.seal(密封对象) 或 Object.freeze(冻结对象) 方法都可以标记一个对象为不可扩展（non-extensible）。

  // Reflect.isExtensible (target)  // Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。
  const myObject = {};
  // Object.seal(myObject);
  console.log(Object.isExtensible(myObject)); // true
  console.log(Reflect.isExtensible(myObject));

  // 如果参数不是对象，Object.isExtensible会返回false，因为非对象本来就是不可扩展的，而Reflect.isExtensible会报错。

  // Reflect.preventExtensions(target)
  // Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。
}

{
  // Reflect.ownKeys (target)
  // Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
  /* var myObject = {
    foo: 1,
    bar: 2,
    [Symbol.for("baz")]: 3,
    [Symbol.for("bing")]: 4
  };
  console.log(Reflect.ownKeys(myObject)); // ["foo", "bar", Symbol(baz), Symbol(bing)] */
}
console.log("--------------------");
{
  // 实例：使用 Proxy 实现观察者模式  观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

  // 思路是observable函数返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数。

  const queuedObservers = new Set();
  const observe = (fn) => queuedObservers.add(fn);
  const observable = (obj) => new Proxy(obj, { set });

  function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach((observer) => observer());
    return result;
  }

  const person = observable({
    name: "张三",
    age: 20
  });
  function print() {
    console.log(`${person.name}, ${person.age}`);
  }
  observe(print);
  person.name = "李四";
  // person.age = 25;
}

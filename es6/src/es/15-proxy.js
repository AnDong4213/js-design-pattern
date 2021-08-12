// Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”

// ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。
// var proxy = new Proxy(target, handler);
// Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

// 2，Proxy 实例的方法

// get() ----
// get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。
/* var person = {
  name: "张三"
};
var proxy = new Proxy(person, {
  get: function (target, propKey, p) {
    console.log(p); // Proxy {name: "张三"}
    if (propKey in target) {
      return target[propKey];
    } else {
      throw new ReferenceError('Prop name "' + propKey + '" does not exist.');
    }
  }
});
proxy.name; // "张三"
// proxy.age; // Uncaught ReferenceError: Prop name "age" does not exist.
 */

// get方法可以继承。
/* let proto = new Proxy(
  {},
  {
    get(target, propertyKey, receiver) {
      console.log("GET " + propertyKey);
      return target[propertyKey] ? target[propertyKey] : `GET ${propertyKey}`;
    }
  }
);
let obj = Object.create(proto);
console.log(obj.foo); */ // "GET foo"
// 拦截操作定义在Prototype对象上面，所以如果读取obj对象继承的属性时，拦截会生效。

// 使用get拦截，实现数组读取负数的索引
/* function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      console.log(receiver); // Proxy {0: "a", 1: "b", 2: "c"}
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };
  let target = [];
  target.push(...elements);
  console.log(target);
  return new Proxy(target, handler);
}

let arr = createArray("a", "b", "c");
console.log(arr[-1]); */ // c

// console.log(Reflect.get(["a", "b", { d: 8 }], "2")); // {d: 8}

// 利用 Proxy，可以将读取属性的操作（get），转变为执行某个函数，从而实现属性的链式操作  (见15-proxy.html)

// 利用get拦截，实现一个生成各种 DOM 节点的通用函数dom。
/* const dom = new Proxy(
  {},
  {
    get(target, property) {
      return function (attrs = {}, ...children) {
        const el = document.createElement(property);
        for (let prop of Object.keys(attrs)) {
          el.setAttribute(prop, attrs[prop]);
        }
        for (let child of children) {
          if (typeof child === "string") {
            child = document.createTextNode(child);
          }
          el.appendChild(child);
        }
        return el;
      };
    }
  }
);
const el = dom.div(
  {},
  "Hello, my name is ",
  dom.a({ href: "//example.com" }, "Mark"),
  ". I like:",
  dom.ul(
    {},
    dom.li({}, "The web"),
    dom.li({}, "Food"),
    dom.li({}, "…actually that's it")
  )
);
document.body.appendChild(el); */

// get方法的第三个参数的例子，它总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例。
/* const proxy = new Proxy(
  {},
  {
    get: function (target, key, receiver) {
      return receiver;
    }
  }
);
console.log(proxy.getReceiver === proxy); */ // true
// proxy对象的getReceiver属性是由proxy对象提供的，所以receiver指向proxy对象。

// set() ----
// set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。
/* const handler = {
  get(target, key) {
    invariant(key, "get");
    return target[key];
  },
  set(target, key, value) {
    invariant(key, "set");
    target[key] = value;
    return true;
  }
};
function invariant(key, action) {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy.ww = "99";
console.log(proxy.ww); */
// proxy._name; // Uncaught Error: Invalid attempt to get private "_name" property
// proxy._prop = "c";
// 只要读写的属性名的第一个字符是下划线，一律抛错，从而达到禁止读写内部属性的目的。

// 注意，如果目标对象自身的某个属性不可写，那么set方法将不起作用。
// 注意，set代理应当返回一个布尔值。严格模式下，set代理如果没有返回true，就会报错

// apply() ----
// apply方法拦截函数的调用、call和apply操作。
// apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。
/* var handler = {
  apply(target, ctx, args) {
    return Reflect.apply(...arguments);
  }
}; */

/* var target = function () {
  return "I am the target";
};
var handler = {
  apply() {
    return "I am the proxy";
  }
};
var p = new Proxy(target, handler);
console.log(p()); */ // I am the proxy
// 变量p是 Proxy 的实例，当它作为函数调用时（p()），就会被apply方法拦截，返回一个新字符串。

/* const obj = { a: 2 };
var twice = {
  apply(target, ctx, args) {
    console.log([...arguments]);
    // return Reflect.apply(target, ctx, args) * 2;
    return Reflect.apply(...arguments) * 2;
  }
};
function sum(left, right) {
  return left + right;
}
var proxy = new Proxy(sum, twice);
console.log(proxy(1, 2));
console.log(proxy.call(obj, 5, 6));
console.log(proxy.apply(obj, [15, 6])); // 42
// 每当执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截。

console.log(Reflect.apply(proxy, null, [9, 10])); // 38
// 直接调用Reflect.apply方法，也会被拦截。 */

// has() ----
// has()方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。
// 可以接受两个参数，分别是目标对象、需查询的属性名。
/* var handlerHas = {
  has(target, key) {
    if (key[0] === "_") {
      return false;
    }
    return key in target;
  }
};
var targetHas = { _prop: "foo", prop: "foo" };
var proxy1 = new Proxy(targetHas, handlerHas);
console.log("_prop" in proxy1); // false
console.log("prop" in proxy1);  */ // true

// 如果原对象不可配置或者禁止扩展，这时has()拦截会报错。
/* var obj = { a: 10 };
Object.preventExtensions(obj);

var p = new Proxy(obj, {
  has: function (target, prop) {
    return false; // 返回true可以，返回false报错
  }
});
console.log("a" in p); */ // Uncaught TypeError: 'has' on proxy: trap returned falsish for property 'a' but the proxy target is not extensible
// obj对象禁止扩展，结果使用has拦截就会报错。也就是说，如果某个属性不可配置（或者目标对象不可扩展），则has()方法就不得“隐藏”（即返回false）目标对象的该属性。

// has()方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has()方法不判断一个属性是对象自身的属性，还是继承的属性。
// 另外，虽然for...in循环也用到了in运算符，但是has()拦截对for...in循环不生效。

// construct() ----
// construct()方法用于拦截new命令，下面是拦截对象的写法。
/* const handler = {
  construct(target, args, newTarget) {
    return new target(...args);
  }
}; */
/* const handler = {
  construct: function (target, args) {
    console.log(this === handler); // true
    console.log(args);
    console.log("called: " + args.join(" "));
    return { value: args[0] * 10 };
  },
  get() {}
};
const p = new Proxy(function () {}, handler);
console.log(new p(1).value); */ // 10

// deleteProperty() ---
// deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
/* var handler = {
  deleteProperty(target, key) {
    invariant(key, "delete");
    delete target[key];
    return true;
  }
};
function invariant(key, action) {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: "foo", prop: "foo" };
var proxy = new Proxy(target, handler);
delete proxy._prop; */
// 注意，目标对象自身的不可配置（configurable）的属性，不能被deleteProperty方法删除，否则报错。

// defineProperty() ----
// defineProperty()方法拦截了Object.defineProperty()操作。
/* var handler = {
  defineProperty(target, key, descriptor) {
    // return Object.defineProperty(target, key, descriptor);
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = "bar";
proxy.yy = "yy";
console.log(proxy.foo);
console.log(Object.getOwnPropertyDescriptors(proxy)); */ // {foo: {…}, yy: {…}}
// 如果目标对象不可扩展（non-extensible），则defineProperty()不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty()方法不得改变这两个设置。

// getOwnPropertyDescriptor() ----
// getOwnPropertyDescriptor()方法拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。
/* var handler = {
  getOwnPropertyDescriptor(target, key) {
    if (key[0] === "_") {
      return;
    }
    return Object.getOwnPropertyDescriptor(target, key);
  }
};
var target = { _foo: "bar", baz: "tar" };
var proxy = new Proxy(target, handler);
console.log(Object.getOwnPropertyDescriptor(proxy, "baz")); // {value: "tar", writable: true, enumerable: true, configurable: true}
console.log(Object.getOwnPropertyDescriptor(proxy, "_foo")); // undefined
console.log(Object.getOwnPropertyDescriptor(proxy, "aa")); */ // undefined
// handler.getOwnPropertyDescriptor()方法对于第一个字符为下划线的属性名会返回undefined。

// getPrototypeOf() ----
// getPrototypeOf()方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。
/* Object.prototype.__proto__
Object.prototype.isPrototypeOf()
Object.getPrototypeOf()
Reflect.getPrototypeOf()
instanceof */

// isExtensible() ----
// isExtensible()方法拦截Object.isExtensible()操作。

// ownKeys() ----
/* ownKeys()方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。
  Object.getOwnPropertyNames()
  Object.getOwnPropertySymbols()
  Object.keys()
  for...in循环 
*/
/* let target = {
  _bar: "foo",
  _prop: "bar",
  prop: "baz"
};
let handler = {
  ownKeys(target) {
    return Reflect.ownKeys(target).filter((key) => key[0] !== "_");
  }
};
let proxy = new Proxy(target, handler);
console.log(proxy); // Proxy {_bar: "foo", _prop: "bar", prop: "baz"}
console.log(Object.keys(proxy)); */ // ["prop"]

// 使用Object.keys()方法时，有三类属性会被ownKeys()方法自动过滤，不会返回。
/*   目标对象上不存在的属性
  属性名为 Symbol 值
  不可遍历（enumerable）的属性 */
// 示例见 other.html

// for...in循环也受到ownKeys()方法的拦截。
/* const obj = { hello: "world" };
const proxy = new Proxy(obj, {
  ownKeys: function () {
    return ["a", "b"];
  }
});
for (let key in proxy) {
  console.log(key); // 没有任何输出
} */

// ownKeys()方法返回的数组成员，只能是字符串或 Symbol 值。如果有其他类型的值，或者返回的根本不是数组，就会报错。

// 如果目标对象自身包含不可配置的属性，则该属性必须被ownKeys()方法返回，否则报错。
/* var obj = {};
Object.defineProperty(obj, "a", {
  configurable: false,
  enumerable: true,
  value: 10
});
var p = new Proxy(obj, {
  ownKeys: function (target) {
    return ["b"];
  }
});
console.log(Object.getOwnPropertyNames(p)); */
// 上面代码中，obj对象的a属性是不可配置的，这时ownKeys()方法返回的数组之中，必须包含a，否则会报错。

// 另外，如果目标对象是不可扩展的（non-extensible），这时ownKeys()方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。

// preventExtensions() ----
// preventExtensions()方法拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值。

// setPrototypeOf() ----   setPrototypeOf()方法主要用来拦截Object.setPrototypeOf()方法。
/* var handler = {
  setPrototypeOf(target, proto) {
    throw new Error("Changing the prototype is forbidden");
  }
};
var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto);
console.log(Object.getPrototypeOf(proxy)); */
// 该方法只能返回布尔值，否则会被自动转为布尔值。另外，如果目标对象不可扩展（non-extensible），setPrototypeOf()方法不得改变目标对象的原型。

// 3,Proxy.revocable()   Proxy.revocable()方法返回一个可取消的 Proxy 实例。
/* let target = {};
let handler = {};

let { proxy, revoke } = Proxy.revocable(target, handler);

proxy.foo = 123;
console.log(proxy.foo); // 123

revoke();
console.log(proxy.foo); */
// Proxy.revocable()方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。上面代码中，当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误。

// 4, this 问题
// 虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理
/* const target = {
  m: function () {
    console.log(this === proxy1);
  }
};
const handler = {};
const proxy1 = new Proxy(target, handler);

target.m(); // false
proxy1.m(); */ // true
// 一旦proxy代理target，target.m()内部的this就是指向proxy，而不是target。

// 由于this指向的变化，导致 Proxy 无法代理目标对象。
/* const _name = new WeakMap();
class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get(this);
  }
}

const jane = new Person("Jane");
console.log(jane.name); // 'Jane'

const proxy = new Proxy(jane, {});
console.log(proxy.name); */ // undefined
// 目标对象jane的name属性，实际保存在外部WeakMap对象_name上面，通过this键区分。由于通过proxy.name访问时，this指向proxy，导致无法取到值，所以返回undefined。

/* const handler = {
  get: function (target, key, receiver) {
    console.log(this === handler);
    return "Hello, " + key;
  },
  set: function (target, key, value) {
    console.log(this === handler);
    target[key] = value;
    return true;
  }
};
const proxy = new Proxy({}, handler);
console.log(proxy.foo); // Hello, foo
proxy.foo = 1;
console.log(proxy.foo); */ // Hello, foo

// 5，实例：Web 服务的客户端
// Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端

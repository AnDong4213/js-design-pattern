// ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。
// var proxy = new Proxy(target, handler);
// Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

// 2，Proxy 实例的方法
// get()
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
const proxy = new Proxy(
  {},
  {
    get: function (target, key, receiver) {
      return receiver;
    }
  }
);
console.log(proxy.getReceiver === proxy); // true

// set()
// set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

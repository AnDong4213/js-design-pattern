const eobj = {
  a: 1
};
function efunc() {
  console.log(this);
}

/* function a(para) {
  console.log(this + 1);
  console.log(para);
}
const b = { c: 1 };

// this会暂时绑定call和apply的第一个参数。传递null和undefined，this将绑定到全局对象 Window。后面的参数，call接收的是参数列表，apply接收的是参数数组。
a.call(null); // [object Window]1
// call apply bind的第一个参数如果不是对象，会先调用内部的ToObject方法转换成对象。然后传入方法。例如，5 转成number实例，绑定f内部 this
a.call(1, 9); // 2  // object, new Number(1)

// console.log(a.call === Function.prototype.call); // true
// console.log(a.bind === Function.prototype.bind); // true
// call apply bind是函数Function原型的方法，所有函数继承自Function.prototype
console.log(a.__proto__ === Function.prototype); */ // true

/* function foo(c, d) {
  console.log(this.a + this.b + c + d);
}
global.a = 3;
global.b = 4;
// foo执行时，this没有明确的指向，默认指向全局对象window
// nodejs中是global，browser中是window
foo(3, 4); */ // 14

/* console.log(Math.max);
console.log(Math.max(111, 1, 24, 5));
console.log(Math.max.call(null, 111, 1, 24, 5));
console.log(Math.max.apply(null, [111, 1, 24, 5]));
// es6支持使用扩展运算符，一些情况下可以不再使用call、apply、bind。
console.log(Math.max(...[111, 1, 24, 5])); */

// console.log(typeof Object.prototype.toString); // function
// console.log(Object.prototype.toString.call("1").substring(8)); // String]

// 由于js中this的指向受函数运行环境的影响，指向经常改变，使得开发变得困难和模糊，所以在封装sdk，写一些复杂函数的时候经常会用到this 指向绑定，以避免出现不必要的问题，call、apply、bind基本都能实现这一功能：

// 1. Function.prototype.call
// call 方法可以指定this 的指向（即函数执行时所在的的作用域），然后再指定的作用域中，执行函数
// call 方法的参数，应该是对象obj,如果参数为空或null,undefind,则默认传参全局对象

// 将数组中的空值，转化成undefined,主要应用在数组遍历中，因为数组foreach 遍历会跳过空值，而不会跳过undefined
/* var a = ["a", , "b"];
console.log(Array.apply(null, a)); */ // ["a", undefined, "b"]
console.log("Array", typeof Array); // Array function

/* console.log(Array.prototype.slice.apply({ length: 4 })); // [empty × 4]
const aaa = Array.prototype.slice.apply({ 2: "a", 6: "b", length: 8 });
console.log(aaa); // [empty × 2, "a", empty × 3, "b", empty]
console.log(Array.apply(null, aaa)); */ // [undefined, undefined, "a", undefined, undefined, undefined, "b", undefined]

// 3.Function.prototype.bind()  ，bind 用于将函数体内的this绑定到某个对象，然后返回一个新函数
var d = new Date();
// d.getTime();

// var print = d.getTime;
// print(); // Uncaught TypeError: this is not a Date object.
// 报错是因为，d.getTime 赋值给 print 后，getTime 内部的this 指向方式变化，已经不再指向Date 对象实例了
var print = d.getTime.call(d);
console.log(print);

/* var add = function (x, y) {
  console.log(x * this.m + y * this.n);
};
var obj = {
  m: 2,
  n: 2
};
var newAdd = add.bind(obj, 5);
newAdd(5);  */ // 20
/* 1. call 、 apply 、bind 均能改变this 指向
2. bind 每次执行产生一个新函数，call、apply 不会
3. call ,bind 接收多个参数绑定到函数，参数单一传入，apply 接收方式为数组 */

/* function Parent(name, money) {
  this.name = name;
  this.money = money;
  this.info = function () {
    console.log("姓名： " + this.name + " 钱： " + this.money);
  };
}
//定义子类
function Children(...para) {
  Parent.apply(this, para); // 全部继承
  this.age = 99;
}
//实例化类
var chi = new Children("child", 800);
chi.info();
console.log(chi.age); */

/* function Component() {
  this.id = Math.random().toString(36).slice(-5);
  Object.defineProperty(this, "id", {
    writable: false
  });
}
function SubComponent() {
  Component.call(this);
}
SubComponent.prototype = Component.prototype;
const com = new SubComponent();
com.id = 3;
console.log(com.id); */

/* class Component {
  constructor() {
    this.id = Math.random().toString(36).slice(-5);
    Object.defineProperty(this, "id", {
      writable: false
    });
  }
}
class SubComponent extends Component {}
const com = new SubComponent();
com.id = 3;
console.log(com.id); */

// object.defineProperty 方法在构造函数里显得那么格格不入。有没有更优雅的写法呢？不妨试试 ES6 新的语法 Proxy？

class Component {
  constructor() {
    this.proxy = new Proxy(
      {
        id: Math.random().toString(36).slice(-5)
      },
      {
        set(target, key, value) {
          return false;
        }
      }
    );
  }

  get id() {
    return this.proxy.id;
  }
}
//  proxy 下面可以放很多跟 id 一样的内容，这样我们就不会一个一个用 Object.defineProperty 去显示的定义“只读”。用 class getter + proxy 的方式写起来更简洁

const com = new Component();
com.proxy.id = 4; // 这样写会修改id的值，如果设置set的话，就不会修改了...
com.id = 3;
console.log(com.id);

// 这段代码将target对象保护起来，对外暴露proxy变量，这样对target对象的操作都要经过代理层proxy，在代理层可以设置各种规则进而完成对target的保护。这个看上去没什么用，其实不然，设想一下一些核心的数据可以封装在target对象，数据校验放在proxy来做，这样用户是不能直接操作核心数据的进而保证了代码安全。
let target = {
  foo: "Welcome, foo"
};
let proxy = new Proxy(target, {
  get(receiver, name) {
    return name in receiver ? receiver[name] : `Hello, ${name}`;
  }
});
console.log(proxy.foo === "Welcome, foo");
console.log(proxy.world === "Hello, world");

/* const date = "2021-06-07";
const t = date.match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(t);
// ES9 开始支持正则表达式的分组命名捕获
const t1 = date.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
console.log(t1); */
console.log("-----------------------------------------------------------");
// Shape - 父类(superclass)
function Shape() {
  this.x = 66;
  this.y = 2;
}
// 父类的方法
Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info(this.x); // 116
  console.info("Shape moved.");
};
// Rectangle - 子类(subclass)
function Rectangle() {
  Shape.call(this); // call super constructor.
}
// 子类续承父类  Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
// 可选。需要传入一个对象，该对象的属性类型参照Object.defineProperties()的第二个参数。如果该参数被指定且不为 undefined，该传入对象的自有可枚举属性(即其自身定义的属性，而不是其原型链上的枚举属性)将为新创建的对象添加指定的属性值和对应的属性描述符。
Rectangle.prototype = Object.create(Shape.prototype, {
  property1: {
    value: true,
    writable: true
  },
  property2: {
    value: "Hello-tt",
    writable: false
  },
  bar: {
    configurable: false,
    get: function () {
      return this.x;
    },
    set: function (value) {
      console.log("Setting `o.bar` to", value);
      this.x = value;
    }
  }
});
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

// console.log(rect instanceof Rectangle); // true
// console.log(rect instanceof Shape); // true
// console.log(rect.property2); // Hello-tt
/* console.log(rect.bar); // 66
rect.bar = 99;
console.log(rect.bar); // 99
rect.move(17, 1); */ // Outputs, 'Shape moved.'

/* var obj = {};
Object.defineProperties(obj, {
  property1: {
    value: true,
    writable: true
  },
  property2: {
    value: "Hello",
    writable: false
  }
});
console.log(obj.property2); */ // Hello

window.aa = function (s) {
  console.log(s);
};
aa(88);

class jQuery {
  constructor(selector) {
    let dom = Array.from(document.querySelectorAll(selector));
    let len = dom ? dom.length : 0;
    for (let i = 0; i < len; i++) {
      this[i] = dom[i];
    }
    this.length = len;
    this.selector = selector || "";
  }

  append(node) {}
  addClass(name) {}
  html() {}
}

window.$ = function (selector) {
  return new jQuery(selector);
};

console.log($("h1"));

/* let obj = {
  part1: {
    name: "安东",
    age: 2
  }
};
const {
  part1: { name, age }
} = obj;
console.log(name, age); */

// 数字分隔符整起来
const myMoney = 1_00_100_00_00;
console.log(myMoney);

// 普通函数调用中，return 一般会提前结束函数的执行，而在  try...catch...finally 中，return 就不会提前结束执行
/* function demo() {
  try {
    return 1;
  } catch (err) {
    console.log(err);
    return 2;
  } finally {
    return 3;
  }
}
console.log(demo());  */ // 3

function demo() {
  try {
    return 1;
  } catch (err) {
    console.log(err);
    return 2;
  } finally {
    try {
      return 3;
    } finally {
      return 4;
    }
  }
}
console.log(demo()); // 4

// 四、获取当前调用栈
// new Error().stack 这样就能随时获取到当前代码执行的调用栈信息，也不失一种调试代码的办法
/* function firstFunction() {
  secondFunction();
}
function secondFunction() {
  thridFunction();
}
function thridFunction() {
  console.log(new Error().stack);
}
firstFunction(); */

// 五、一行代码生成随机字符串
// const str = Math.random().toString(36).substr(2, 10);
const str = Math.random().toString(36).slice(-10);
console.log(str);
// 先是 Math.random() 生成 [0, 1) 的数，也就是 0.123312、0.982931之类的，然后调用 number 的 toString方法将其转换成36进制的，按照MDN的说法，36进制的转换应该是包含了字母 a~z 和 数字0~9的，因为这样生成的是 0.89kjna21sa 类似这样的，所以要截取一下小数部分，即从索引 2 开始截取10个字符就是我们想要的随机字符串了

// 六、最快获取dom的方法，HTML中带有 id 属性的元素，都会被全局的 ID 同名变量所引用
// 原本获取 dom 是这样的  document.getElementById('zeroh1')
// 现在可以这样
console.log(zeroh1.textContent); // textContent属性可以获取或更新包含元素（及其子元素）中的文本。

// continue 语句用在了标签引用上。在 j 等于 12 时，会跳过 "Loop2" 的当前迭代，并执行下一个迭代。
function myFunction() {
  var text = "";
  var i, j;

  // 第一个循环标签 "Loop1"
  Loop1: for (i = 0; i < 3; i++) {
    text += "<br>" + "i = " + i + ", j = ";

    // 第二个循环标签 "Loop2"
    Loop2: for (j = 10; j < 15; j++) {
      if (j == 12) {
        continue Loop2;
      }
      document.getElementById("zeroh1").innerHTML = text += j + "----";
    }
  }
}
myFunction();

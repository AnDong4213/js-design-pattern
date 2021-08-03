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

/* console.log(Array.prototype.slice.apply({ length: 4 })); // [empty × 4]
const aaa = Array.prototype.slice.apply({ 2: "a", 6: "b", length: 8 });
console.log(aaa); // [empty × 2, "a", empty × 3, "b", empty]
console.log(Array.apply(null, aaa)); */ // [undefined, undefined, "a", undefined, undefined, undefined, "b", undefined]

// 3.Function.prototype.bind()  ，bind 用于将函数体内的this绑定到某个对象，然后返回一个新函数
var d = new Date();
d.getTime();

// var print = d.getTime;
// print(); // Uncaught TypeError: this is not a Date object.
// 报错是因为，d.getTime 赋值给 print 后，getTime 内部的this 指向方式变化，已经不再指向Date 对象实例了
var print = d.getTime.bind(d);
console.log(print());

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

function Parent(name, money) {
  this.name = name;
  this.money = money;
  this.info = function () {
    console.log("姓名： " + this.name + " 钱： " + this.money);
  };
}
//定义孩子类
function Children(...para) {
  Parent.apply(this, para); // 全部继承
  this.age = 99;
}
//实例化类
var chi = new Children("child", 800);
chi.info();
console.log(chi.age);

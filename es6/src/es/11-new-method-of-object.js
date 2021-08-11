// Object.is()
// ES5 比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0。JavaScript 缺乏一种运算，在所有环境中，只要两个值是一样的，它们就应该相等。

// 它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

// Object.assign()
// Object.assign方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。Object.assign()只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。
// （3）克隆对象
/* class A {
  constructor(x, y) {
    Object.assign(this, { x, y });
  }
  getAge() {
    console.log(this.x);
  }
}

class B extends A {
  constructor(x, y) {
    super(x, y);
    this.sex = "";
  }
}
const b = new B(23);
b.getAge();
console.log(b.x); // 23
const c = Object.assign({}, B);
console.log(c); // {}
// 采用上面方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。
let originProto = Object.getPrototypeOf(B);
let d = Object.assign(Object.create(originProto), B);
console.log(d);  */ // Function {}

// ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。
// ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象，该方法的引入目的，主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。
const obj = {
  foo: 123,
  get bar() {
    return "abc";
  }
};
console.log(Object.getOwnPropertyDescriptor(obj)); // undefined
console.log(Object.getOwnPropertyDescriptor(obj, "foo")); // {value: 123, writable: true, enumerable: true, configurable: true}
console.log(Object.getOwnPropertyDescriptors(obj)); // {foo: {…}, bar: {…}}

// Object.getOwnPropertyDescriptors()也可以用来实现 Mixin（混入）模式。(见other.html)

// 4，__proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
// JavaScript语言的对象继承是通过原型链实现的。ES6 提供了更多原型对象的操作方法

// __proto__属性  __proto__属性（前后各两个下划线），用来读取或设置当前对象的原型对象（prototype）
// es5 的写法
/* const obj = {
  method: function() { ... }
};
obj.__proto__ = someOtherObj;

// es6 的写法
var obj = Object.create(someOtherObj);
obj.method = function() { ... }; */

// 无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的Object.setPrototypeOf()（写操作）、Object.getPrototypeOf()（读操作）、Object.create()（生成操作）代替。

// Object.setPrototypeOf()
// Object.setPrototypeOf方法的作用与__proto__相同，用来设置一个对象的原型对象（prototype），返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法。
let proto = {};
let obj2 = { x: 10 };
Object.setPrototypeOf(obj2, proto);
proto.y = 20;
proto.z = 40;
console.log(obj2.y);

const obj3 = Object.create(proto);
console.log(obj3.y);
console.log(proto.isPrototypeOf(obj3)); // true

// Object.getPrototypeOf()。 该方法与Object.setPrototypeOf方法配套，用于读取一个对象的原型对象。
console.log(Object.getPrototypeOf(obj3)); // {y: 20, z: 40}

function Rectangle() {
  // ...
}
const rec = new Rectangle();
console.log(Object.getPrototypeOf(rec) === Rectangle.prototype); // true
console.log(Rectangle.prototype); // {constructor: ƒ}

console.log("----------------------------------------------------");

// 5，Object.keys()，Object.values()，Object.entries()
// Object.values方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。
const obj5 = Object.create({}, { p: { value: 42 } });
console.log(Object.values(obj5)); // []
// Object.create方法的第二个参数添加的对象属性（属性p），如果不显式声明，默认是不可遍历的，因为p的属性描述对象的enumerable默认是false，Object.values不会返回这个属性。只要把enumerable改成true，Object.values就会返回属性p的值。

// Object.values会过滤属性名为 Symbol 值的属性。

// Object.values方法的参数是一个字符串，会返回各个字符组成的一个数组。
console.log(Object.values("abc")); // ["a", "b", "c"]
console.log([...new Set("abc")]); // ["a", "b", "c"]
console.log("abc".split("")); // ["a", "b", "c"]

// Object.entries方法的另一个用处是，将对象转为真正的Map结构。如果原对象的属性名是一个 Symbol 值，该属性会被忽略。
const obj6 = { foo: "bar", baz: 42 };
console.log(Object.entries(obj6));
const map = new Map(Object.entries(obj6));
console.log(map); // {"foo" => "bar", "baz" => 42}

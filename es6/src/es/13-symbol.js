// ES5 的对象属性名都是字符串，这容易造成属性名的冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因。

// 1, Symbol 值不能与其他类型的值进行运算，会报错。
// 2, Symbol值可以显式转为字符串。
/* let sym = Symbol("My symbol");
console.log(String(sym));
console.log(sym.toString());
// 3, Symbol 值也可以转为布尔值，但是不能转为数值。
let sym2 = Symbol();
console.log(Boolean(sym2)); // true
console.log(!sym2); // false
if (sym2) {
  console.log(sym2);
} */
// console.log(Number(sym2));  // TypeError: Cannot convert a Symbol value to a number

// ES2019 提供了一个实例属性description，直接返回 Symbol 的描述。
const sym3 = Symbol("foo");
console.log(sym3.description);

/* const mySymbol = Symbol();
const a = {};
a.mySymbol = "Hello!";
console.log(a[mySymbol]); // undefined
console.log(a["mySymbol"]);  */ // "Hello!"
// 因为点运算符后面总是字符串，所以不会读取mySymbol作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个 Symbol 值。

/* let s = Symbol();
let obj = {
  [s]: function (arg) {
    console.log(arg);
  },
  // 采用增强的对象写法，
  [s](arg) {
    console.log(arg);
  }
};
obj[s](456); */

// Symbol 类型还可以用于定义一组常量，保证这组常量的值都是不相等的。
const log = {};
log.levels = {
  DEBUG: Symbol("debug"),
  INFO: Symbol("info")
};
console.log(log.levels.DEBUG);

const COLOR_RED = Symbol();
const COLOR_GREEN = Symbol();
function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return "COLOR_GREEN";
    case COLOR_GREEN:
      return "COLOR_RED";
    default:
      throw new Error("Undefined color");
  }
}
console.log(getComplement(COLOR_RED)); // COLOR_GREEN

//   还有一点需要注意，Symbol 值作为属性名时，该属性还是公开属性，不是私有属性。

// (二)实例
// 1,消除魔术字符串。魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。

// 属性名的遍历
// Symbol 作为属性名，遍历对象的时候，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。
const obj = {
  c: 9
};
let a = Symbol("a");
let b = Symbol("b");

obj[a] = "Hello";
obj[b] = "World";
obj["d"] = 10;
console.log(obj);
for (let h in obj) {
  console.log(h);
}
console.log(Object.keys(obj)); // ["c", "d"]
console.log(Object.getOwnPropertyNames(obj)); // ["c", "d"]
// 它也不是私有属性，有一个Object.getOwnPropertySymbols()方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(a), Symbol(b)]
// 另一个新的 API，Reflect.ownKeys()方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
console.log(Reflect.ownKeys(obj)); // ["c", "d", Symbol(a), Symbol(b)]

// 6, Symbol.for()，Symbol.keyFor()
// 我们希望重新使用同一个 Symbol 值，Symbol.for()方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。
let s1 = Symbol.for("foo");
let s2 = Symbol.for("foo");
let s3 = Symbol.for("bar");
console.log(s1); // Symbol(foo)
console.log(s1 === s2); // true
// Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会
// Symbol.keyFor()方法返回一个已登记的 Symbol 类型值的key。
console.log(Symbol.keyFor(s1));
console.log(Symbol.keyFor(s3)); // bar

// Symbol.for()为 Symbol 值登记的名字，是全局环境的，不管有没有在全局环境运行。
function foo() {
  return Symbol.for("bar");
}
const x = foo();
const y = Symbol.for("bar");
console.log(x === y); // true

// 除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。
// Symbol.iterator
// 对象的Symbol.iterator属性，指向该对象的默认遍历器方法。
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
console.log([...myIterable]); // [1, 2, 3]

// 对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器
for (let hh of myIterable) {
  console.log(hh);
}

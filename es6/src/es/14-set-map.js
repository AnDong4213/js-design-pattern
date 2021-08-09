// ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

// Set本身是一个构造函数，用来生成 Set 数据结构。
/* const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach((item) => s.add(item));
console.log(s); // Set(4) {2, 3, 5, 4}
for (let i of s) {
  console.log(i);
}
console.log(s.size); // 4
console.log(Object.entries(s));  */ // []

// Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
/* const set = new Set([1, 2, 3, 4, 4]); // 数组去重
console.log([...set]); //  [1, 2, 3, 4]

const set2 = new Set(document.querySelectorAll("div"));
console.log(set2.size);

// 方法也可以用于，去除字符串里面的重复字符。
console.log([...new Set("ababbc")].join("")); */ // abc

/* let set = new Set();
set.add({});
set.size; // 1
set.add({});
console.log(set.size); */ // 由于两个空对象不相等，所以它们被视为两个值

// Set 实例的属性和方法
// Set 结构的实例有以下属性。 Set.prototype.constructor：构造函数，默认就是Set函数。  Set.prototype.size：返回Set实例的成员总数。

// Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）
// Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
// Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
// Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
// Set.prototype.clear()：清除所有成员，没有返回值。
/* const s = new Set();
s.add(1).add(2).add(2); // Set(3) {1, 2, 3}
console.log(s.add("3"));
console.log(s.size); // 3
console.log(s.has(2)); // true
console.log(s.delete(2)); // true
console.log(s.has(2)); // false
s.clear();
console.log(s); */

// 看看在判断是否包括一个键上面，Object结构和Set结构的写法不同。
// if (properties[someName]) {...}
// if (properties.has(someName)) {...}

// Array.from方法可以将 Set 结构转为数组。
/* const items = new Set([1, 4, 2, 3, 4, 4, 5, 5]);
console.log(Array.from(items)); // [1, 4, 2, 3, 5]
console.log([...items]);  */ // [1, 4, 2, 3, 5]

/* 遍历操作
Set 结构的实例有四个遍历方法，可以用于遍历成员。
Set.prototype.keys()：返回键名的遍历器
Set.prototype.values()：返回键值的遍历器
Set.prototype.entries()：返回键值对的遍历器
Set.prototype.forEach()：使用回调函数遍历每个成员 */
// Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

// keys方法、values方法、entries方法返回的都是遍历器对象（详见《Iterator 对象》一章）。由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。
/* let set = new Set(["red", "green", "blue"]);
for (let item of set.keys()) {
  console.log(item);
}
for (let item of set.values()) {
  console.log(item);
}
for (let item of set.entries()) {
  console.log(item); // ["red", "red"]
}
// Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
// console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // true
// 可以省略values方法，直接用for...of循环遍历 Set
for (let x of set) {
  console.log(x);
}
// Set 结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值。Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的。
set.forEach((value, key) => {
  console.log(key + " : " + value); // red : red
});

// （3）遍历的应用
// 扩展运算符（...）内部使用for...of循环，所以也可以用于 Set 结构。 */

// Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。数组的map和filter方法也可以间接用于 Set 了。
/* let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 交集
let intersect = new Set([...a].filter((x) => !b.has(x)));
console.log(intersect);
console.log(Array.from({ length: 5 })); // [undefined, undefined, undefined, undefined, undefined]
console.log(Array(5)); // [empty × 5]
console.log(Array.from([1, 2, 3], (x) => x ** x)); */

/* let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, (val) => val * 2));
console.log(set);  */ // Set(3) {2, 4, 6}

/* const ws = new WeakSet();
ws.add(1); */
// WeakSet
// WeakSet 的成员只能是对象，而不能是其他类型的值。
// WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。
// 如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
// ES6 规定 WeakSet 不可遍历  WeakSet 是一个构造函数，可以使用new命令，创建 WeakSet 数据结构。
/* const a = { a: 1 };
const b = { b: 1 };
const aa = [
  [1, 2],
  [3, 4]
];
console.log(new WeakSet([a, b])); // WeakSet {{…}, {…}}
console.log(new WeakSet(aa)); */ // WeakSet {Array(2), Array(2)}
// 上面代码中，aa是一个数组，它有两个成员，也都是数组。将aa作为 WeakSet 构造函数的参数，aa的成员会自动成为 WeakSet 的成员。
// 注意，是a数组的成员成为 WeakSet 的成员，而不是a数组本身。这意味着，数组的成员只能是对象。

/* const b = [3, 4];
const ws = new WeakSet(b); */
// Uncaught TypeError: Invalid value used in weak set。 数组b的成员不是对象，加入 WeakSet 就会报错。

/* const ws = new WeakSet();
const obj = {};
const foo = {};
ws.add(window);
console.log(ws.has(window)); // true
ws.add(foo);
console.log(ws.has(foo)); // true
console.log(ws);
ws.delete(window);
console.log(ws.has(window));  */ // false

// WeakSet 不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。
/* console.log(typeof document.querySelectorAll("div")[0]);
const ws = new WeakSet();
ws.add(document.querySelectorAll("div"));
console.log(ws); */ // WeakSet {NodeList(2)}

/* const foos = new WeakSet();
class Foo {
  constructor() {
    foos.add(this);
  }
  method() {
    if (!foos.has(this)) {
      throw new TypeError("Foo.prototype.method 只能在Foo的实例上调用！");
    }
  }
  add() {
    return 78;
  }
}
console.log(new Foo().add());
console.log(foos); */

// Map
// JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。
// ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

// 作为构造函数，Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。
/* const map = new Map([
  ["name", "张三"],
  ["title", "Author"]
]);
console.log(map); // Map(2) {"name" => "张三", "title" => "Author"}
console.log(map.size); // 2
console.log(map.has("name")); // true
console.log(map.get("name"));  */ // 张三
// console.log(new Map(["name", "张三"])); // Uncaught TypeError: Iterator value name is not an entry object

// 不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构（详见《Iterator》一章）都可以当作Map构造函数的参数。这就是说，Set和Map都可以用来生成新的 Map。
/* const set = new Set([
  ["foo", 1],
  ["bar", 2]
]);
console.log(set);
const m1 = new Map(set);
console.log(m1.get("foo")); // 1
const m2 = new Map([["baz", 3]]);
const m3 = new Map(m2);
console.log(m3.get("baz")); */ // 3

// Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。
const map = new Map([
  ["F", "no"],
  ["T", "yes"]
]);
console.log(map); // {"F" => "no", "T" => "yes"}
/* for (let i of map) {
  console.log(i);
}
for (let i of map.entries()) {
  console.log(i);
}
for (let [key, value] of map) {
  console.log(key, value);
} */
// 表示 Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。

// Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。
/* console.log([...map.keys()]);
console.log([...map.values()]);
console.log([...map.entries()]); // [Array(2), Array(2)]
console.log([...map]); */ // [Array(2), Array(2)]

const map0 = new Map().set(1, "a").set(2, "b").set(3, "c");
console.log(map0); // Map(3) {1 => "a", 2 => "b", 3 => "c"}
const map1 = new Map([...map0].filter(([k, v]) => k < 3));
console.log(map1); // Map(2) {1 => "a", 2 => "b"}
map0.forEach((value, key, map) => {
  console.log("Key-q: %s, Value-q: %s", key, value); // Key-q: 1, Value-q: a
});

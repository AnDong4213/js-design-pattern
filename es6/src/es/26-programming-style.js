// 如何将 ES6 的新语法，运用到编码实践之中，与传统的 JavaScript 语法结合在一起，写出合理的、易于阅读和维护的代码。

// 立即执行函数可以写成箭头函数的形式。
(() => {
  console.log("Welcome to the Internet.");
})();

// 注意区分 Object 和 Map，只有模拟现实世界的实体对象时，才使用 Object。如果只是需要 (key: value) 的数据结构，使用 Map 结构。因为 Map 有内建的遍历机制。

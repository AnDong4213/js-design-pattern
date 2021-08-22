/*jshint esversion: 6 */

// Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。
// Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

// 执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

// Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）。

// 调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。

// Generator 函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数。
function* fd() {
  console.log("执行了！");
}

var generator = fd();
console.log(generator.next());
// 函数f如果是普通函数，在为变量generator赋值时就会执行。但是，函数f是一个 Generator 函数，就变成只有调用next方法时，函数f才会执行。

{
  let arr = [1, [
      [2, 3], 4
    ],
    [5, 6, [9]]
  ];

  let flat = function*(a) {
    var length = a.length;
    for (var i = 0; i < length; i++) {
      var item = a[i];
      if (typeof item !== 'number') {
        yield* flat(item);
      } else {
        yield item;
      }
    }
  };
  console.log(...flat(arr));

  // yield表达式如果用在另一个表达式之中，必须放在圆括号里面。
  /* function* demo() {
    // console.log('Hello' + yield); // SyntaxError
    // console.log('Hello' + yield 123); // SyntaxError

    console.log('Hello' + (yield)); // OK
    console.log('Hello' + (yield 123)); // OK
  } */

  // yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
  let foo = function(a, b) {};

  let demo = function*() {
    foo(yield 'a', yield 'b'); // OK
    let input = yield; // OK
  };
  const aa = demo();
  console.log(aa.next()); // {value: "a", done: false}
  console.log(aa.next());
  console.log(aa.next()); // {value: undefined, done: false}

}
console.log('-------------------------------------'); {
  // 与 Iterator 接口的关系
  // 任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象
  // 由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。

}
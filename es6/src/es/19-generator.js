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
  let arr = [1, [[2, 3], 4], [5, 6, [9]]];

  let flat = function* (a) {
    var length = a.length;
    for (var i = 0; i < length; i++) {
      var item = a[i];
      if (typeof item !== "number") {
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
  let foo = function (a, b) {};

  let demo = function* () {
    foo(yield "a", yield "b"); // OK
    let input = yield; // OK
  };
  const aa = demo();
  console.log(aa.next()); // {value: "a", done: false}
  console.log(aa.next());
  console.log(aa.next()); // {value: undefined, done: false}
}
console.log("-------------------------------------");
{
  // 与 Iterator 接口的关系
  // 任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象
  // 由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。

  let myIterable = {};
  myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
  };
  console.log(...myIterable);
  for (let aa of myIterable) {
    console.log(aa);
  }

  // Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。
  let gen = function* () {};
  let g = gen();
  console.log(g[Symbol.iterator]() === g); // true
}
console.log("-------------------------------------");
{
  // 2，next 方法的参数
  // yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
  function* f() {
    for (var i = 0; true; i++) {
      var reset = yield i;

      if (reset) {
        i = -2;
      }
    }
  }

  var g = f();
  console.log(g.next());
  console.log(g.next());
  console.log(g.next(true));
  // Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。通过next方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

  function* foo(x) {
    var y = 2 * (yield x + 1);
    var z = yield y / 3;
    return x + y + z;
  }

  var a = foo(5);
  console.log(a.next()); // {value: 6, done: false}
  console.log(a.next(12)); // {value: 8, done: false}
  console.log(a.next(13)); // 13+24+5=42
  console.log(a.next()); // {value: undefined, done: true}

  console.log("-------------------------------------");

  function* dataConsumer() {
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
    return "result";
  }
  let genObj = dataConsumer();
  console.log(genObj.next());
  console.log(genObj.next());
  console.log(genObj.next(3));
}
console.log("-------------------------------------");
{
  // 3， for...of 循环
  // for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法
  // 一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在for...of循环之中。

  function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
      yield curr;
      [prev, curr] = [curr, prev + curr];
    }
  }
  /* for (let n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
  } */

  function* objectEntries(obj) {
    let propsKeys = Reflect.ownKeys(obj);

    for (let key of propsKeys) {
      yield [key, obj[key]];
    }
  }

  const aa = { a: 1, b: 2 };
  for (let hh of objectEntries(aa)) {
    console.log(hh);
  }

  // 除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。
  function* numbers() {
    yield 1;
    yield 2;
    return 3;
    yield 4;
  }
  console.log([...numbers()]); // [1, 2]
}

console.log("-------------------------------------");

{
  // 4，Generator.prototype.throw()  g.throw()和 yield最好在 tyr{}catch(){}里写
  // Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。
  // throw方法可以接受一个参数，该参数会被catch语句接收，建议抛出Error对象的实例。

  /* let g = function* () {
    try {
      yield;
    } catch (e) {
      console.log(e); // Error: 哎呀，出错了
    }
  };
  let i = g();
  console.log(i.next());
  i.throw(new Error("哎呀，出错了")); */
  // 不要混淆遍历器对象的throw方法和全局的throw命令。上面代码的错误，是用遍历器对象的throw方法抛出的，而不是用throw命令抛出的。后者只能被函数体外的catch语句捕获。

  /* var g = function* () {
    while (true) {
      try {
        yield;
      } catch (e) {
        if (e != "a") throw e;
        console.log("内部捕获", e);
      }
    }
  };

  var i = g();
  i.next();

  try {
    throw new Error("错误-a");
    throw new Error("b");
  } catch (e) {
    console.log("外部捕获", e); // 外部捕获 Error: 错误-a
  } */
  // 之所以只捕获了a，是因为函数体外的catch语句块，捕获了抛出的a错误以后，就不会再继续try代码块里面剩余的语句了。

  // 如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获。
  /* var g = function* () {
    yield;
    console.log("内部捕获", e);
  };

  var i = g();
  i.next();

  try {
    i.throw("a");
    i.throw("b");
  } catch (e) {
    console.log("外部捕获", e);
  }
  // 外部捕获 a */

  // 如果 Generator 函数内部和外部，都没有部署try...catch代码块，那么程序将报错，直接中断执行
  /* var gen = function* gen() {
    yield console.log("hello");
    yield console.log("world");
  };

  var g = gen();
  g.next();
  g.throw(); */
  // g.throw抛出错误以后，没有任何try...catch代码块可以捕获这个错误，导致程序报错，中断执行。

  // throw方法抛出的错误要被内部捕获，前提是必须至少执行过一次next方法。
  /* function* gen() {
    try {
      yield "哈哈";
    } catch (e) {
      console.log("内部捕获");
    }
  }

  var g = gen();
  g.throw(1); */ // Uncaught 1

  // throw方法被捕获以后，会附带执行下一条yield表达式。也就是说，会附带执行一次next方法。
  /* var gen = function* gen() {
    try {
      yield console.log("a");
    } catch (e) {
      console.log(e);
    }
    yield console.log("b");
    yield console.log("c");
    yield console.log("d");
  };
  var g = gen();
  g.next(); // a
  g.throw(new Error("yyyyy")); // b
  g.next(); // c
  g.next(); // d */
  // 也可以看到，只要 Generator 函数内部部署了try...catch代码块，那么遍历器的throw方法抛出的错误，不影响下一次遍历。

  console.log("---------------------------------------");
  // throw命令与g.throw方法是无关的，两者互不影响。
  var gen2 = function* gen() {
    yield console.log("hello");
    try {
      // yield console.log("hello");
    } catch (e) {
      console.log(e);
    }
    yield console.log("world");
  };

  var g = gen2();
  g.next();
  try {
    g.throw(new Error("qqqq"));
  } catch (error) {
    console.log(error);
  }

  try {
    throw new Error("00000");
  } catch (e) {
    console.log(e);
    g.next();
  }

  // Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的catch捕获。
}

console.log("---------------------------------------");

{
  // 5，Generator.prototype.return()
  // Generator 函数返回的遍历器对象，还有一个return()方法，可以返回给定的值，并且终结遍历 Generator 函数。

  // 如果 Generator 函数内部有try...finally代码块，且正在执行try代码块，那么return()方法会导致立刻进入finally代码块，执行完以后，整个函数才会结束。
  function* numbers() {
    yield 1;
    try {
      yield 2;
      yield 3;
    } finally {
      yield 4;
      yield 5;
    }
    yield 6;
  }
  var g = numbers();
  console.log(g.next()); // { value: 1, done: false }
  console.log(g.next()); // { value: 2, done: false }
  console.log(g.return(7)); // { value: 4, done: false }
  console.log(g.next()); // { value: 5, done: false }
  console.log(g.next()); // {value: 7, done: true}
}

{
  //6， next()、throw()、return() 的共同点 ,
  // ext()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。
  // next()是将yield表达式替换成一个值。
  // throw()是将yield表达式替换成一个throw语句。
  // return()是将yield表达式替换成一个return语句。
}

console.log("---------------------------------------");

{
  // 7, yield* 表达式
  // 如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历。
  function* foo() {
    yield "a";
    yield "b";
  }
  function* bar() {
    yield "x";
    yield* foo();
    yield "y";
  }
  for (let v of bar()) {
    console.log(v);
  }
  // 如果yield表达式后面跟的是一个遍历器对象，需要在yield表达式后面加上星号，表明它返回的是一个遍历器对象。这被称为yield*表达式。
}

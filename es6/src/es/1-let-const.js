/* function test() {
  for (let i = 1; i < 3; i++) {
    console.log(i);
  }
  // console.log(i + "yy");
  // let i = 9; // Cannot access 'i' before initialization
} */
// test();

// let, const声明的变量只在它所在的代码块有效。

/* {
  var a = [];
  for (var i = 0; i < 10; i++) {
    console.log(i);
    a[i] = function () {
      console.log(i);
    };
  }
  a[6](); // 10  执行这段代码时循环已经执行完了，由于i是var声明的，i指向的就是全局的i，所有数组a的成员里面的i，指向的都是同一个i，导致运行时输出的是最后一轮的i的值，也就是 10
  console.log(i);
} */

{
  let a = [];
  for (let i = 0; i < 10; i++) {
    a[i] = function () {
      console.log(i);
    };
  }
  a[7](); // 6

  // 变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6。你可能会问，如果每一轮循环的变量i都是重新声明的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为 JavaScript 引擎内部会记住上一轮循环的值，初始化本轮的变量i时，就在上一轮循环的基础上进行计算。
}

{
  // for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
  for (let i = 0; i < 3; i++) {
    let i = "abc";
    console.log(i);
  }
  // 输出了 3 次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域（同一个作用域不可使用 let 重复声明同一个变量）。
}

/* {
  console.log(foo);
  var foo;
} */

{
  // 1.不存在变量提升。
  // 2, 存在暂时性死区(在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）)。只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
  /* var tmp = 123;
  if (true) {
    tmp = "abc"; // ReferenceError
    let tmp;
  } */
  /* if (true) {
    // TDZ开始
    tmp = "abc"; // ReferenceError
    console.log(tmp); // ReferenceError

    let tmp; // TDZ结束
    console.log(tmp); // undefined

    tmp = 123;
    console.log(tmp); // 123
  } */
  // 3,不允许重复声明
}

/* {
  // let实际上为 JavaScript 新增了块级作用域。
  //为什么需要块级作用域？
  var tmp = 99;

  function f() {
    console.log(tmp);
    // 1，变量提升，内层变量可能会覆盖外层变量
    if (false) {
      // 变量提升，导致内层的tmp变量覆盖了外层的tmp变量。是false也能变量提升
      var tmp = "hello world";
    }
  }
  f(); // undefined

  // 2，用来计数的循环变量泄露为全局变量
  var s = "heluo";
  for (var i = 0; i < s.length; i++) {
    console.log(s[i]);
  }
  console.log(i); // 5
} */

{
  function f1() {
    let n = 5;
    if (true) {
      let n = 10;
      console.log(n); // 10
    }
    console.log(n); // 5
  }
  f1();
}

/* {
  console.log(ui);
  if (false) {
    var ui;
  }
} */

/* {
  function f() {
    console.log("I am outside!");
  }

  (function () {
    if (false) {
      // 重复声明一次函数f
      function f() {
        console.log("I am inside!");
      }
    }

    f();  // f is not a function
  })();
} */

/* {
  // 考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。
  // 块级作用域内部的 函数声明 语句，建议不要使用
  {
    let a = "secret";
    function f() {
      return a;
    }
  }

  // 块级作用域内部，优先使用 函数表达式
  {
    let a = "secret";
    let f = function () {
      return a;
    };
  }
} */

{
  // const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。
  // const ah;  // 'Const declarations' require an initialization value.
}

{
  // const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。
}

{
  window.a = 1;
  a; // 1

  a = 2;
  console.log(window.a); // 2
  console.log(self.a); // 2
  // 上面代码中，顶层对象的属性赋值与全局变量的赋值，是同一件事。
  // 顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。

  // ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩
}

{
  console.log(self === window); // true
  console.log(this); // {}
}

{
  // globalThis 对象
  // ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。
  console.log(globalThis); // Window
}

const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach((x) => s.add(x));

for (let i of s) {
  console.log(i);
}

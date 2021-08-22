// 1，Iterator（遍历器）的概念

// javaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了Map和Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是Map，Map的成员是对象。
// 这样就需要一种统一的接口机制，来处理所有不同的数据结构。

// 遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

// Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

//Iterator 的遍历过程是这样的。
/* （1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
（2）第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
（3）第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
（4）不断调用指针对象的next方法，直到它指向数据结构的结束位置。 */
{
  function makeIterator(array) {
    let nextIndex = 0;

    return {
      next: function () {
        return nextIndex < array.length
          ? { value: array[nextIndex++], done: false }
          : { value: undefined, done: true };
      }
    };
  }

  let it = makeIterator(["a", "b", { a: 1, b: 2 }]);
  console.log(it.next());
  console.log(it.next());
  console.log(it.next());
  console.log(it.next());

  // makeIterator函数，它是一个遍历器生成函数，作用就是返回一个遍历器对象。对数组['a', 'b']执行这个函数，就会返回该数组的遍历器对象（即指针对象）it。

  // 由于 Iterator 只是把接口规则加到数据结构之上，所以，遍历器与它所遍历的那个数据结构，实际上是分开的，完全可以写出没有对应数据结构的遍历器对象，或者说用遍历器对象模拟出数据结构。
}
console.log("---------------------------------------------");
{
  // 2，默认 Iterator 接口
  // Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环, 当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。
  // 一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）
  // 一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）。Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。
  // 至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内。

  const obj = {
    [Symbol.iterator]() {
      return {
        next: function () {
          return {
            value: 1,
            done: true
          };
        }
      };
    }
  };
  for (let a of obj) {
    console.log(a); // 如果想有值，done为false，会陷入死循环
  }
  console.log(obj[Symbol.iterator]().next());

  // 凡是部署了Symbol.iterator属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。
}

{
  let arr = ["a", "b", "c"];
  let iter = arr[Symbol.iterator]();
  console.log(iter.next()); // {value: "a", done: false}
  // 变量arr是一个数组，原生就具有遍历器接口，部署在arr的 Symbol.iterator属性上面。所以，调用这个属性，就得到遍历器对象。

  // 其他数据结构（主要是对象）的 Iterator 接口，都需要自己在Symbol.iterator属性上面部署，这样才会被for...of循环遍历。

  // 遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map 结构，而 ES6 原生提供了。
}
console.log("---------------------------------------------");
{
  // 一个对象如果要具备可被for...of循环调用的 Iterator 接口，就必须在Symbol.iterator的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。
  class RangeIterator {
    constructor(start, stop) {
      this.value = start;
      this.stop = stop;
    }

    [Symbol.iterator]() {
      // return this;
      const self = this;
      return {
        next() {
          var value = self.value;
          if (value < self.stop) {
            self.value++;
            return {
              done: false,
              value
            };
          }
          return { done: true, value: undefined };
        }
      };
    }

    /* next() {
      var value = this.value;
      if (value < this.stop) {
        this.value++;
        return {
          done: false,
          value
        };
      }
      return { done: true, value: undefined };
    } */
  }

  function range(start, stop) {
    return new RangeIterator(start, stop);
  }
  for (var value of range(0, 3)) {
    console.log(value);
  }
  // 是一个类部署 Iterator 接口的写法。Symbol.iterator属性对应一个函数，执行后返回当前对象的遍历器对象。
}

console.log("---------------------------------------------");

{
  // 为对象添加 Iterator 接口的例子
  let obj = {
    data: ["hello", "world", "cn"],
    [Symbol.iterator]() {
      const self = this;
      let index = 0;
      return {
        next() {
          if (index < self.data.length) {
            return {
              value: self.data[index++],
              done: false
            };
          }
          return { value: undefined, done: true };
        }
      };
    }
  };

  for (let v of obj) {
    console.log(v);
  }
}

{
  // 对于类似数组的对象（存在数值键名和length属性），部署 Iterator 接口，有一个简便方法，就是Symbol.iterator方法直接引用数组的 Iterator 接口。
  // NodeList 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历。
  /* const aa = document.querySelectorAll("div");
  console.log(aa);
  aa.forEach((i) => {
    console.log(i);
  });
  for (let dom of aa) {
    console.log(dom);
  }
  console.log([...aa].splice(0, 1)); */

  // 类似数组的对象调用数组的Symbol.iterator方法的例子。
  const obj = {
    0: "a",
    1: "b",
    2: "c",
    length: 3,
    // [Symbol.iterator]: [][Symbol.iterator]
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
  };
  for (let item of obj) {
    console.log(item); // a, b, c
  }
  console.log([...obj]); // 只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组 ["a", "b", "c"]
  // 注意，普通对象部署数组的Symbol.iterator方法，并无效果。
}

console.log("---------------------------------------------");

{
  // 3， 调用 Iterator 接口的场合
  // 有一些场合会默认调用 Iterator 接口（即 Symbol.iterator方法），除了下文会介绍的for...of循环，还有几个别的场合。

  // （1）解构赋值   对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。
  let set = new Set().add("a").add("b").add("c");
  console.log(set);
  let [x, y] = set;
  console.log(x + "c", y);
  let [first, ...rest] = set;
  console.log(rest);

  const map = new Map([
    ["name", "张三"],
    ["title", "Author"]
  ]);
  map.set("a", "b");
  const [m, ...n] = map;
  console.log(m, n);
  console.log(Object.fromEntries(map)); // {name: "张三", title: "Author", a: "b"}
}

console.log("---------------------------------------------");

{
  // (2）扩展运算符  扩展运算符（...）也会调用默认的 Iterator 接口。
  var str = "hello";
  console.log([...str]);

  // （3）yield*  yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
  let generator = function* () {
    yield 1;
    yield* "ab";
    yield 5;
  };
  var iterator = generator();
  console.log(iterator.next());
  console.log(iterator.next()); // {value: "a", done: false}
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());

  // （4）其他场合  由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口
  // for...of
  // Array.from()
  // Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
  // Promise.all()
  // Promise.race()
}

{
  // 5，Iterator 接口与 Generator 函数  Symbol.iterator()方法的最简单实现，还是 Generator 函数
  console.log("---------------------------------------------");
  let myIterable = {
    [Symbol.iterator]: function* () {
      yield 1;
      yield 2;
      yield 3;
    }
  };
  console.log(...myIterable);
  const gf = myIterable[Symbol.iterator]();
  console.log(gf.next());
  console.log(gf.next());
  console.log(gf.next());
  console.log(gf.next()); // {value: undefined, done: true}
  let obj = {
    *[Symbol.iterator]() {
      yield "hello";
      yield "world";
    }
  };
  console.log(...obj); // hello world

  // 6，遍历器对象的 return()，throw()
  // 遍历器对象除了具有next()方法，还可以具有return()方法和throw()方法。如果你自己写遍历器对象生成函数，那么next()方法是必须部署的，return()方法和throw()方法是否部署是可选的。
}
console.log("---------------------------------------------");
{
  // 7，for...of 循环
  // ES6 借鉴 C++、Java、C# 和 Python 语言，引入了for...of循环，作为遍历所有数据结构的统一的方法。
  // 一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，就可以用for...of循环遍历它的成员。也就是说，for...of循环内部调用的是数据结构的Symbol.iterator方法。
  const obj = Object.create(null);
  obj[Symbol.iterator] = [][Symbol.iterator].bind([1, 3]);
  console.log(...obj); // 1 3
  // 空对象obj部署了数组 [] 的Symbol.iterator属性

  // for...of循环可以代替数组实例的forEach方法。

  // for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟for...in循环也不一样。
  let arr = [3, 5, 7];
  arr.foo = "hello";
  for (let i in arr) {
    console.log(i); // "0", "1", "2", "foo"
  }
  console.log(...arr); // 3 5 7
  // 总之，for...in循环主要是为遍历对象而设计的，不适用于遍历数组。

  // 类似数组的对象
  let paras = document.querySelectorAll("div");
  for (let p of paras) {
    p.classList.add("test");
  }

  let arrayLike = { length: 2, 0: "a", 1: "b" };
  console.log(Array.from(arrayLike)); // ["a", "b"]
}

{
  // 对于普通的对象，for...of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。但是，这样情况下，for...in循环依然可以用来遍历键名。
  // 使用 Generator 函数将对象重新包装一下。
  const obj = { a: 1, b: 2, c: 3 };

  function* entries(obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]];
    }
  }
  console.log([...entries(obj)]); // (3) [Array(2), Array(2), Array(2)]

  let fibonacci = {
    [Symbol.iterator]() {
      let [pre, cur] = [0, 1];
      return {
        next() {
          [pre, cur] = [cur, pre + cur];
          return { done: false, value: cur };
        }
      };
    }
  };

  for (let n of fibonacci) {
    if (n > 1000) break;
    console.log(n);
  }
}

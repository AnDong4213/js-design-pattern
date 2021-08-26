/*jshint esversion: 6 */

// 1，概述
// 历史上，JavaScript 一直没有模块（module）体系，无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。  ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。
// ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西

// ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。由于 ES6 模块是编译时加载，使得静态分析成为可能。

{
  // 2, 严格模式。  ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";
  console.log(99);
}

{
  // 3, export 命令
  // 模块功能主要由两个命令构成：export和import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
  // 一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。
  console.log(99);

  // export输出的变量就是本来的名字，但是可以使用as关键字重命名。
  /* function v1() {}
  function v2() {}
  export { v1 as streamV1, v2 as streamV2, v2 as streamLatestVersion }; */
  // 使用as关键字，重命名了函数v1和v2的对外接口。重命名后，v2可以用不同的名字输出两次。
}

var m = 1;
export default m;

// import命令具有提升效果，会提升到整个模块的头部，首先执行。
console.log(stringToArr("128390", ["2", "8"]));
import { stringToArr } from "./project-period";
// 上面的代码不会报错，因为import的执行早于stringToArr的调用。这种行为的本质是，import命令是编译阶段执行的，在代码运行之前。

// 如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。  import语句是 Singleton 模式。

// export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。

// modules.js
/* function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules'; */

// export *  命令会忽略模块的default方法。

// import命令会被 JavaScript 引擎静态分析，先于模块内的其他语句执行（import命令叫做“连接” binding 其实更合适）。
// 下面的代码会报错。
/* if (x === 2) {
  import MyModual from './myModual';
} import和export命令只能在模块的顶层，不能在代码块之中（比如，在if代码块之中，或在函数之中）。 */

// ES2020提案 引入import()函数，支持动态加载模块。
// import()返回一个 Promise 对象。。import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。

// import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

// import()也可以用在 async 函数之中。
/* async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main(); */

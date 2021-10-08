console.log("inherit");
{
  // Class 可以通过extends关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。
  class Point {}

  class ColorPoint extends Point {
    constructor(x, y, color) {
      super(x, y); // 调用父类的constructor(x, y)
      this.color = color;
    }

    toString() {
      return this.color + " " + super.toString(); // 调用父类的toString()
    }
  }
  const aCP = new ColorPoint(1, 2, "red");
  console.log(aCP);
  console.log(aCP.__proto__.__proto__ === Point.prototype); // true
  console.log(aCP instanceof Point); // true
  // Object.getPrototypeOf方法可以用来从子类上获取父类。
  console.log(Object.getPrototypeOf(ColorPoint) === Point); // true

  // constructor方法和toString方法之中，都出现了super关键字，它在这里表示父类的构造函数，用来新建父类的this对象。

  // 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。

  // ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。
}

{
  // super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。
  // 第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。
  // super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。

  // 作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。
  class A {}
  class B extends A {
    m() {
      // super(); // 报错
    }
  }

  // 第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
}

{
  // 原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript 的原生构造函数大致有下面这些。
  /* Boolean()
    Number()
    String()
    Array()
    Date()
    Function()
    RegExp()
    Error()
    Object() */
}

{
  /* var MyCircularQueue = function (k) {
    this.queue = new Array(k);
  };

  MyCircularQueue.prototype.enQueue = function (value) {
    console.log("enQueue");
    this.deQueue();
  };

  MyCircularQueue.prototype.deQueue = function () {
    console.log("deQueue");
  };
  const hh = new MyCircularQueue(4);
  console.log(hh.queue);
  hh.enQueue(); */

  // 循环队列
  class MyCircularQueue {
    constructor(k) {
      this.queue = new Array(k);
      this.front = 0;
      this.rear = 0;
      this.max = k;
    }

    enQueue(value) {
      if (this.isFull()) {
        return false;
      } else {
        this.queue[this.rear] = value;
        this.rear = (this.rear + 1) % this.max;
        return true;
      }
    }
    deQueue() {
      if (!this.isEmpty()) {
        this.queue[this.front] = "";
        this.front = (this.front + 1) % this.max;
        return true;
      } else {
        return false;
      }
    }
    Front() {
      if (this.isEmpty()) {
        return -1;
      } else {
        return this.queue[this.front];
      }
    }
    Rear() {
      if (this.isEmpty()) {
        return -1;
      } else {
        let rear = this.rear - 1;
        return this.queue[rear < 0 ? this.max - 1 : rear];
      }
    }
    isEmpty() {
      return this.front === this.rear && !this.queue[this.front];
    }
    isFull() {
      return this.front === this.rear && !!this.queue[this.front];
    }
  }
  const vv = new MyCircularQueue(5);
  vv.enQueue(1);
  vv.enQueue(2);
  vv.enQueue(3);
  vv.enQueue(4);
  vv.enQueue(5);
  console.log(vv.queue);
  console.log(vv.front);
  console.log(vv.rear);
  vv.deQueue();
  vv.deQueue();
  console.log(vv.queue);
  console.log(vv.front);
  console.log(vv.rear);
  vv.enQueue(6);
  console.log(vv.queue);
  console.log(vv.front);
  console.log(vv.rear);
}

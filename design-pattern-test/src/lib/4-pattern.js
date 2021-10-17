// 4-工厂模式
// jQuery-$('#div')
class jQuery {
  constructor(selector) {
    // let dom = Array.from(document.querySelectorAll(selector));
    let dom = Array.prototype.slice.call(document.querySelectorAll(selector));
    let len = dom ? dom.length : 0;
    for (let i = 0; i < len; i++) {
      this[i] = dom[i];
    }
    this.length = len;
    this.selector = selector || "";
  }

  append(node) {}
  addClass(name) {}
  html(data) {}
}

// $变成了一个函数，函数返回了一个jQuery的实例，函数相当于工厂，工厂返回了封装实例的操作。
// window.jQuery = window.$ = jQuery;
window.$ = function (selector) {
  return new jQuery(selector);
};
// console.log($("h1"));
$("h1")[0].style.color = "#ccc";

{
  // 5-单例模式  jQuery中防止多次初始化
  class SingleObject {
    login() {
      console.log("login...");
    }
  }
  SingleObject.getInstance = (function () {
    let instance;
    return function () {
      if (!instance) {
        instance = new SingleObject();
      }
      return instance;
    };
  })();

  let obj1 = SingleObject.getInstance();
  obj1.login();
  let obj2 = SingleObject.getInstance();
  obj2.login();
  console.log(obj1 === obj2); // true

  class LoginForm {
    constructor() {
      this.state = "hide";
    }

    show() {
      if (this.state === "show") {
        console.log("已经显示");
        return;
      }
      this.state = "show";
      console.log("登录框显示成功");
    }

    hide() {
      if (this.state === "hide") {
        console.log("已经隐藏");
        return;
      }
      this.state = "hide";
      console.log("登录框隐藏成功");
    }
  }

  LoginForm.getInstance = (function () {
    let instance;
    return function () {
      if (!instance) {
        instance = new LoginForm();
      }
      return instance;
    };
  })();

  let login1 = LoginForm.getInstance();
  login1.show();

  let login2 = LoginForm.getInstance();
  login2.show();
}

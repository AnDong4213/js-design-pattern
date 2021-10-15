// 4-工厂模式
// jQuery-$('#div')
class jQuery {
  constructor(selector) {
    let dom = Array.from(document.querySelectorAll(selector));
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

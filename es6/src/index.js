// import "./es/project-period";

// import "./es/1-let-const";

// import "./es/5-new-method-of-string";

// import "./es/11-new-method-of-object";

// import "./es/13-symbol";

// import "./es/14-set-map";

// import "./es/15-proxy.js";

// import "./es/16-reflect";

// import "./es/17-promise";

// import "./es/18-iterator";

// import "./es/19-generator";

// import "./es/22-class-basic-grammar";

// import "./es/23-class-inherit";

import "./es/24-module-syntax";

// import "./es/25-module-load-implement";

// import "./es/26-programming-style";

// import "./es/31-decorator";

/* function isValid(str) {
  let leftStr = "]})";
  let rightStr = "[{(";

  let arr = str.split("");
  console.log([...str]);
  let newArr = [];
  arr.forEach((item) => {
    if (rightStr.includes(item)) {
      newArr.push(item);
    } else {
      if (
        leftStr.indexOf(item) === rightStr.indexOf(newArr[newArr.length - 1])
      ) {
        newArr.pop();
      } else {
        newArr.push(item);
      }
    }
  });

  return newArr.length === 0;
}
console.log(isValid("{{){}")); */

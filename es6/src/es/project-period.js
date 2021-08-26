/*jshint esversion: 6 */

const compare = (property) => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2; //升序排序
  };
};
/* console.log(
  "权限都没了,还有jB面子啊！现在咱师傅二人穷的都尿血了啊,给咱刷钱的就是咱爹,别"
    .length
); */

let name =
  "权限都没了,还有jB面子啊！现在咱师傅二人穷的都尿血了啊,给咱刷钱的就是咱爹,别jB这么多废话";
let word = ["尿血", "废", "jB", "师傅"];

console.log(name.length);
console.time("aaa");
export const stringToArr = (nameStr, keyword) => {
  let splitWords = [];
  let posSet = new Set();
  let sortWord = [];
  keyword = [...new Set(keyword)];
  for (let key of keyword) {
    for (let value of [...nameStr.matchAll(new RegExp(key, "g"))]) {
      posSet.add(value);
    }
  }
  posSet.forEach((set) => {
    sortWord.push({
      key: set[0],
      num: set.index
    });
  });

  sortWord.sort((a, b) => a.num - b.num);
  let newKeyword = sortWord.map((n) => n.key);

  newKeyword.forEach((key, index) => {
    let sName = nameStr.split(key);
    splitWords.push(sName[0]);
    splitWords.push(key);
    if (index === newKeyword.length - 1) {
      splitWords.push(sName[1]);
    }
    nameStr = nameStr.substr(nameStr.indexOf(key) + key.length);
  });

  return splitWords;
};
console.log(stringToArr(name, word));
console.timeEnd("aaa");

{
  function makeRandomArr(arrList, num) {
    if (num > arrList.length) {
      `
      return [];`;
    }
    let tempArr = arrList.slice(0);
    let newArrList = [];
    for (let i = 0; i < num; i++) {
      let random = Math.floor(Math.random() * tempArr.length);
      let arr = tempArr[random];
      tempArr.splice(random, 1);
      newArrList.push(arr);
    }
    return newArrList;
  }
  const aa = ["不知道", "以前", "的提案已经有点 ", "不知道6"];
  // console.log(makeRandomArr(aa, 3));
}

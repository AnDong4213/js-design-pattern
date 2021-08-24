{
  function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2; //升序排序
    };
  }
  let name = "近期购车需要留个心眼，水泡车尽量不要碰，你都知道吗？";
  let word = ["泡车", "期", "需要"];

  const stringToArr = (nameStr, keyword) => {
    let splitWords = [];
    let sortWord = keyword.map((key) => ({
      key,
      num: nameStr.search(key)
    }));
    sortWord.sort(compare("num"));
    let newKeyword = sortWord.map((n) => n.key);

    for (let key of newKeyword) {
      let sName = nameStr.split(key);
      splitWords.push(sName[0]);
      splitWords.push(key);
      if (key === newKeyword.slice(-1)[0]) {
        splitWords.push(sName[1]);
      }
      nameStr = nameStr.substr(nameStr.search(key) + key.length);
    }

    return splitWords;
  };
  console.log(stringToArr(name, word));
}

{
  function makeRandomArr(arrList, num) {
    if (num > arrList.length) {
      return [];
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
  console.log(makeRandomArr(aa, 3));
}

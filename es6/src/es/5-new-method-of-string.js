{
  // ，字符串的实例方法replace()只能替换第一个匹配。
  console.log("aabbcc".replace("b", "_")); // aa_bcc
  console.log("aabbcc".replace(/b/g, "_")); // aa__cc
  // 正则表达式毕竟不是那么方便和直观，ES2021 引入了replaceAll()方法，可以一次性替换所有匹配
  console.log("aabbcc".replaceAll("b", "_"));
}

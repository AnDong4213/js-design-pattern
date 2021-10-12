function loadImg(src) {
  let promise = new Promise((resolve, reject) => {
    let img = document.createElement("img");
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject("图片加载失败...");
    };
    img.src = src;
  });
  return promise;
}
let src = "https://pica.zhimg.com/v2-b34ab31d4101fb621cce3340dac1ceca_qhd.jpg";
let result = loadImg(src);
result
  .then((img) => {
    console.log(img.width);
    zeroh1.appendChild(img);
    return img;
  })
  // 单一职责原则，开放封闭原则
  .then((img) => {
    console.log(img.height);
  })
  .catch((err) => {
    console.log(err);
  });

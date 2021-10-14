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
    // zeroh1.appendChild(img);
    return img;
  })
  // 单一职责原则，开放封闭原则
  .then((img) => {
    console.log(img.height);
  })
  .catch((err) => {
    console.log(err);
  });

class Car {
  constructor(number, name) {
    this.number = number;
    this.name = name;
  }
}

class KuaiChe extends Car {
  constructor(number, name) {
    super(number, name);
    this.price = 2;
  }
}

class ZhuanChe extends Car {
  constructor(number, name) {
    super(number, name);
    this.price = 5;
  }
}
class Trip {
  constructor(car) {
    this.car = car;
  }
  start() {
    console.log(`行程开始：名称-${this.car.name}，车牌号-${this.car.number}`);
  }

  end() {
    console.log(`价格：${this.car.price * 5}`);
  }
}

let car = new KuaiChe(200, "奔驰");
let trip = new Trip(car);
trip.start();
trip.end();

console.log(
  "-----------------------------------------------------------------"
);

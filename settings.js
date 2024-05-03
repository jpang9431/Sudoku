//Screen height and width
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var colorInputs = [
  "regBorderColor",
  "emphBorderColor",
  "squareSelectColor",
  "colRowSelectColor",
  "regTextColor",
  "mistakeTextColor",
  "regBackgroundColor",
  "hintBackgroundColor",
  "buttonTextColor",
  "disableButtonColor",
  "selectButtonColor",
  "hoverButtonColor",
  "screenBackgroundColor",
];

var defaultValues = [
  "#D3D3D3",
  "#000000",
  "#7CB9E8",
  "#ADD8E6",
  "#000000",
  "#ff0000",
  "#FFFFFF",
  "#808080",
  "#000000",
  "#808080",
  "#A9A9A9",
  "#d3d3d3",
  "#000000",
];

var part = localStorage.getItem("particleTrail");

var dots = [];
const speed = 2;
const maxNunmberOfParticles = 30;
const numParticlesSpawn = 5;
const maxRadius = 5;
const minRadius = 1;
const opaciity = 0.6;
const sha = 0;

var partInterval = null;

window.onresize = function () {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
};

document.addEventListener("mousemove", function (event) {
  let x = event.clientX;
  let y = event.clientY;
  for (let i = 0; i < numParticlesSpawn; i++) {
    dots.push(new Dot(x, y));
  }
});

function loopingFunction() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  removeParticles();
  dotMove();
}

function removeParticles() {
  if (dots.length > 1) {
    dots.splice(0, Math.ceil(dots.length / maxNunmberOfParticles));
  }
}

function dotMove() {
  for (i = 0; i < dots.length; i++) {
    dots[i].x += dots[i].xVel * speed;
    dots[i].y += dots[i].yVel * speed;
    ctx.beginPath();
    ctx.fillStyle = dots[i].color;
    ctx.globalAlpha = opaciity;
    ctx.shadowColor = dots[i].color;
    ctx.shadowBlur = sha;
    if (dots[i].shape == 0) {
      ctx.arc(dots[i].x, dots[i].y, dots[i].radius, 0, 2 * Math.PI);
    } else if (dots[i].shape == 1) {
      ctx.fillRect(
        dots[i].x,
        dots[i].y,
        dots[i].radius * 2,
        dots[i].radius * 2,
      );
    } else if (dots[i].shape == 2) {
      ctx.lineTo(dots[i].x, dots[i].y - dots[i].radius);
      ctx.lineTo(dots[i].x - dots[i].radius, dots[i].y + dots[i].radius);
      ctx.lineTo(dots[i].x + dots[i].radius, dots[i].y + dots[i].radius);
      ctx.lineTo(dots[i].x, dots[i].y - dots[i].radius);
    }
    ctx.fill();
    ctx.closePath();
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = Math.random() * 2 - 1;
    this.yVel = Math.random() * 2 - 1;
    this.color = "hsl(" + Math.random() * 360 + ",65%,65%)";
    this.radius = getRandomArbitrary(minRadius, maxRadius);
    this.shape = getRandomInt(3);
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

document.addEventListener("DOMContentLoaded", function (event) {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  if (part == null || part == "true") {
    localStorage.setItem("particleTrail", "true");
    loopingFunction();
    partInterval = setInterval(loopingFunction, 16.67);
  }
  document.getElementById("particleTrail").checked =
    localStorage.getItem("particleTrail") == "true";
  centerElm(document.getElementById("resetButton"), false);
  for (let i = 0; i < colorInputs.length; i++) {
    if (localStorage.getItem(colorInputs[i]) == null) {
      localStorage.setItem(
        colorInputs,
        document.getElementById(colorInputs[i]).value,
      );
    } else {
      document.getElementById(colorInputs[i]).value = localStorage.getItem(
        colorInputs[i],
      );
    }
    document
      .getElementById(colorInputs[i])
      .addEventListener("input", function (event) {
        localStorage.setItem(event.target.id, event.target.value);
        if (colorInputs[i] == "screenBackgroundColor") {
          document.getElementById("innerLoading").style.backgroundColor =
            event.target.value;
        }
      });
  }
  let checkedProp = localStorage.getItem("popupConfirm") == "true";
  if (checkedProp == null) {
    localStorage.setItem("popupConfirm", true);
    checkedProp = true;
  }
  document.getElementById("popupConfirm").checked = checkedProp;
  document
    .getElementById("popupConfirm")
    .addEventListener("change", function (event) {
      localStorage.setItem(
        "popupConfirm",
        document.getElementById("popupConfirm").checked,
      );
    });
  let tempElm = document.getElementById("outerLoading");
  tempElm.style.left = screenWidth - tempElm.offsetWidth + "px";
  tempElm.style.top = "0px";
  centerElmInElm(
    document.getElementById("outerLoading"),
    document.getElementById("innerLoading"),
  );
  document.getElementById("innerLoading").style.backgroundColor =
    localStorage.getItem("screenBackgroundColor");
  document.getElementById("vertFlex").style.top =
    document.getElementById("outerLoading").offsetHeight + "px";
  document.getElementById("vertFlex").style.height =
    screenHeight -
    document.getElementById("outerLoading").offsetHeight -
    document.getElementById("backButton").offsetHeight -
    screenHeight * 0.03 +
    "px";
  document
    .getElementById("particleTrail")
    .addEventListener("change", function (event) {
      localStorage.setItem(
        "particleTrail",
        document.getElementById("particleTrail").checked,
      );
      if (document.getElementById("particleTrail").checked) {
        console.log("a");
        loopingFunction();
        partInterval = setInterval(loopingFunction, 16.67);
      } else {
        clearInterval(partInterval);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        dots = [];
      }
    });
});

function centerElm(elm, isVert = true) {
  elm.style.position = "absolute";
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  elm.style.left = windowWidth / 2 - elm.offsetWidth / 2 + "px";
  if (isVert) {
    elm.style.top = windowHeight / 2 - elm.offsetHeight / 2 + "px";
  }
}

function centerElmInElm(elm1, elm2) {
  elm2.style.position = "absolute";
  let leftChange = elm1.offsetWidth / 2 - elm2.offsetWidth / 2;
  let topChange = elm1.offsetHeight / 2 - elm2.offsetHeight / 2;
  elm2.style.left = parseInt(elm1.style.left) + leftChange + "px";
  elm2.style.top = parseInt(elm1.style.top) + topChange + "px";
}

document
  .getElementById("resetButton")
  .addEventListener("click", function (event) {
    for (let i = 0; i < colorInputs.length; i++) {
      document.getElementById(colorInputs[i]).value = defaultValues[i];
      localStorage.setItem(colorInputs[i], defaultValues[i]);
      if (colorInputs[i] == "screenBackgroundColor") {
        document.getElementById("innerLoading").style.backgroundColor =
          event.target.value;
      }
    }
    document.getElementById("popupConfirm").checked = true;
  });

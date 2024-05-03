let inputs = ["regBorderColor", "emphBorderColor", "squareSelectColor", "colRowSelectColor", "regTextColor", "mistakeTextColor", "regBackgroundColor", "hintBackgroundColor", "buttonTextColor", "disableButtonColor", "selectButtonColor", "hoverButtonColor", "screenBackgroundColor", "popupConfirm", "particleTrail"];

let defaultValues = ["#D3D3D3", "#000000","#7CB9E8","#ADD8E6", "#000000", "#ff0000",  "#FFFFFF", "#808080", "#000000","#808080", "#A9A9A9", "#d3d3d3", "#000000", "true", "true"];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var part = localStorage.getItem("particleTrail");

const dots = [];
const speed = 2;
const maxNunmberOfParticles = 30;
const numParticlesSpawn = 5;
const maxRadius = 7;
const minRadius = 2;
const opaciity = 0.6;
const sha = 0; 
const title = document.getElementById("startTitle");

window.onresize = function () {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

document.addEventListener("mousemove", function(event){
  let x = event.clientX;
  let y = event.clientY;
  for(let i=0; i<numParticlesSpawn; i++){
    dots.push(new Dot(x,y));
  }
});

function loopingFunction(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

  removeParticles();
  dotMove();
}



function removeParticles(){
  if(dots.length > 1){
    dots.splice(0, Math.ceil(dots.length/maxNunmberOfParticles));
  }
}

function dotMove(){
  for(i=0; i<dots.length; i++){
    dots[i].x += dots[i].xVel * speed;
    dots[i].y += dots[i].yVel * speed;
    ctx.beginPath();
    ctx.fillStyle = dots[i].color;
    ctx.globalAlpha = opaciity;
    ctx.shadowColor = dots[i].color;
    ctx.shadowBlur = sha;
    if (dots[i].shape==0){
      ctx.arc(dots[i].x, dots[i].y, dots[i].radius, 0, 2*Math.PI);
    } else if (dots[i].shape==1){
      ctx.fillRect(dots[i].x, dots[i].y, dots[i].radius*2, dots[i].radius*2);
    } else if (dots[i].shape==2){
      ctx.lineTo(dots[i].x, dots[i].y-dots[i].radius);
      ctx.lineTo(dots[i].x-dots[i].radius, dots[i].y+dots[i].radius);
      ctx.lineTo(dots[i].x+dots[i].radius, dots[i].y+dots[i].radius);
      ctx.lineTo(dots[i].x, dots[i].y-dots[i].radius);
    }
    ctx.fill();
    ctx.closePath();
  }
}

class Dot{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = Math.random() * 2 - 1;
    this.yVel = Math.random() * 2 - 1;
    this.color = "hsl("+Math.random() * 360+",65%,65%)";
    this.radius = getRandomArbitrary(minRadius, maxRadius);
    this.shape = getRandomInt(3);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

document.addEventListener("DOMContentLoaded", function(event){
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  if (part==null||part=="true"){
    loopingFunction();
    setInterval(loopingFunction, 16.67);
  }
  for(let i=0; i<inputs.length; i++){
    if (localStorage.getItem(inputs[i])==null){
      localStorage.setItem(inputs[i], defaultValues[i]);
    } 
  }
  
});
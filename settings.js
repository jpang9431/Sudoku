//Screen height and width
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

let colorInputs = ["regBorderColor", "emphBorderColor", "squareSelectColor", "colRowSelectColor", "regTextColor", "mistakeTextColor", "regBackgroundColor", "hintBackgroundColor", "buttonTextColor", "disableButtonColor", "selectButtonColor", "hoverButtonColor", "screenBackgroundColor"];

let defaultValues = ["#D3D3D3", "#000000","#7CB9E8","#ADD8E6", "#000000", "#ff0000",  "#FFFFFF", "#808080", "#000000","#808080", "#A9A9A9", "#d3d3d3", "#000000"  ];

document.addEventListener("DOMContentLoaded", function(event){
  document.getElementById("title").style.top = 0;
  document.getElementById("title").style.left = screenWidth/2-document.getElementById("title").offsetWidth/2+"px";
  centerElm(document.getElementById("resetButton"), false);
  for(let i=0; i<colorInputs.length; i++){
    if (localStorage.getItem(colorInputs[i])==null){
      localStorage.setItem(colorInputs, document.getElementById(colorInputs[i]).value);
    } else {
      document.getElementById(colorInputs[i]).value = localStorage.getItem(colorInputs[i]);
    }
    document.getElementById(colorInputs[i]).addEventListener("input", function(event){
      localStorage.setItem(event.target.id, event.target.value);
      if (colorInputs[i]=="screenBackgroundColor"){
        document.getElementById("innerLoading").style.backgroundColor = event.target.value;
      }
    });
  }
  let checkedProp = localStorage.getItem("popupConfirm")=="true";
  if (checkedProp==null){
    localStorage.setItem("popupConfirm", true);
    checkedProp = true;
  }
  document.getElementById("popupConfirm").checked = checkedProp;
  document.getElementById("popupConfirm").addEventListener("change", function(event){
    localStorage.setItem("popupConfirm",   document.getElementById("popupConfirm").checked);
  });
  let tempElm = document.getElementById("outerLoading");
  tempElm.style.left = screenWidth-tempElm.offsetWidth+"px";
  tempElm.style.top = "0px";
  centerElmInElm(document.getElementById("outerLoading"), document.getElementById("innerLoading"));
  document.getElementById("innerLoading").style.backgroundColor = localStorage.getItem("screenBackgroundColor");
  document.getElementById("vertFlex").style.top = document.getElementById("outerLoading").offsetHeight+"px";
  document.getElementById("vertFlex").style.height = screenHeight - document.getElementById("outerLoading").offsetHeight - document.getElementById("backButton").offsetHeight-screenHeight*.03+"px";
});

function centerElm(elm, isVert=true){
  elm.style.position = "absolute";
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  elm.style.left = windowWidth/2-elm.offsetWidth/2+"px";
  if (isVert){
    elm.style.top = windowHeight/2-elm.offsetHeight/2+"px";
  }
  
}

function centerElmInElm(elm1, elm2){
  elm2.style.position="absolute";
  let leftChange = elm1.offsetWidth/2-elm2.offsetWidth/2;
  let topChange = elm1.offsetHeight/2-elm2.offsetHeight/2;
  elm2.style.left = parseInt(elm1.style.left)+leftChange+"px";
  elm2.style.top = parseInt(elm1.style.top)+topChange+"px";
}


document.getElementById("resetButton").addEventListener("click", function(event){
  for(let i=0; i<colorInputs.length; i++){
    document.getElementById(colorInputs[i]).value = defaultValues[i];
    localStorage.setItem(colorInputs[i], defaultValues[i]);
    if (colorInputs[i]=="screenBackgroundColor"){
      document.getElementById("innerLoading").style.backgroundColor = event.target.value;
    }
  }
  document.getElementById("popupConfirm").checked = true;
});


let colorInputs = ["regBorderColor", "emphBorderColor", "squareSelectColor", "colRowSelectColor", "regTextColor", "mistakeTextColor", "regBackgroundColor", "hintBackgroundColor", "buttonTextColor", "disableButtonColor", "selectButtonColor", "hoverButtonColor", "screenBackgroundColor"];

let defaultValues = ["#D3D3D3", "#000000","#7CB9E8","#ADD8E6", "#000000", "#ff0000",  "#FFFFFF", "#808080", "#000000","#808080", "#A9A9A9", "#d3d3d3", "#000000"  ];
document.addEventListener("DOMContentLoaded", function(event){
  for(let i=0; i<colorInputs.length; i++){
    if (localStorage.getItem(colorInputs[i])==null){
      localStorage.setItem(colorInputs[i], defaultValues[i]);
    } 
  }
  
});
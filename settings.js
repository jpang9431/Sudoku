//Please use local storage instead of document.cookie, do not change any of the colors of the settings page for now

/*document.addEventListener('click', function(event) {
  const target = event.target;
  if (target.id.endsWith('b')) {
    const color = target.value.toLowerCase();
    document.body.style.backgroundColor = color;
    document.cookie = `background_color=${color}; path=/`;
  }
  if (target.id.endsWith('c')) {
    const color = target.value.toLowerCase();
    const buttons = document.getElementsByTagName('input');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].type === 'button') {
        buttons[i].style.backgroundColor = color;
      }
    }
    document.cookie = `button_color=${color}; path=/`;
  }
});*/

//Upon the html page loading check if the user has any of the cookies
//If they do have the cookie then set the value of the html color picker to that color
//If they do not have the cookie then set the value of the cookie to be the defulat color

//Note store the values in local storage

let bColorPick = document.getElementById('background');

bColorPick.addEventListener("change", watchColorPicker, false);

function watchColorPicker(event) {
    console.log(bColorPick.value);
   // document.body.style.backgroundColor = event.target.value;
}
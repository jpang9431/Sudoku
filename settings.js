document.addEventListener('click', function(event) {
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
});
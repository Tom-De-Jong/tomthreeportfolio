const isTouchDevice = () => {
  return window.matchMedia('(pointer: coarse)').matches;
};

if (!isTouchDevice()) {
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  const speed = 0.3;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

const hoverSound = new Audio('./music/hover.mp3');
hoverSound.volume = 1;

document.addEventListener('mouseover', (e) => {
  if (e.target.matches('a, button, .hover-target, input, textarea')) {
    cursor.classList.add('enlarged');
    hoverSound.currentTime = 0;
    hoverSound.play();
  }
});

  document.addEventListener('mouseout', (e) => {
    if (e.target.matches('a, button, .hover-target, input, textarea')) {
      cursor.classList.remove('enlarged');
    }
  });
}
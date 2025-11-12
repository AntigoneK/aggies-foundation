const nav = document.getElementById('nav');
const burger = document.getElementById('hamburger');
if (burger){
  burger.addEventListener('click', () => {
    const shown = getComputedStyle(nav).display !== 'none';
    nav.style.display = shown ? 'none' : 'block';
  });
}

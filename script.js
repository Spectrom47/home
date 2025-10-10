const currentPage = window.location.pathname.split("/").pop(); // gets the current file, e.g., "index.html"
const links = document.querySelectorAll('nav ul li a');

links.forEach(link => {
  if(link.getAttribute('href') === currentPage) {
    link.classList.add('tab-active'); // add to <a>
  } else {
    link.classList.remove('tab-active');
  }
});

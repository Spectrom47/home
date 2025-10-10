// Optional: Smooth scroll for nav links
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });

    // Highlight active tab
    document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('tab-active'));
    link.parentElement.classList.add('tab-active');
  });
});

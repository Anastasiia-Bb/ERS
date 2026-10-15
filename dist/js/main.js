
const van = document.querySelector('.van');
const vanStage = document.querySelector('.van-stage');
const emergency = document.querySelector('.emergency');

if (van && vanStage && emergency) {
  let currentX = 0;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const newScrollY = window.scrollY;

    const sectionTop =
      emergency.getBoundingClientRect().top + window.scrollY;

    const sectionStart = sectionTop - window.innerHeight;
    const sectionEnd = sectionTop + emergency.offsetHeight;

    // Пока блок не появился на экране — машинка стоит
    if (newScrollY < sectionStart || newScrollY > sectionEnd) {
      lastScrollY = newScrollY;
      return;
    }

    const difference = newScrollY - lastScrollY;
    const maxX = Math.max(0, vanStage.clientWidth - van.offsetWidth);

    currentX += difference * .5;
    currentX = Math.max(0, Math.min(currentX, maxX));

    van.style.left = `${currentX}px`;

    lastScrollY = newScrollY;
  }, { passive: true });
}


const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

if (header && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  header.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}
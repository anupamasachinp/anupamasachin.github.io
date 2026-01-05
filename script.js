// ===============================
// Fade-in animation on scroll
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade-in");

  function showElements() {
    elements.forEach((el) => {
      const position = el.getBoundingClientRect().top;
      if (position < window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", showElements, { passive: true });
  window.addEventListener("load", showElements);
  showElements(); // run once immediately
});

// ===============================
// Mobile Nav Toggle (Hamburger)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#primary-nav");
  const header = document.querySelector("header");

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Close when clicking a nav link
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close when clicking outside menu/header
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("open")) return;

    const clickedInsideMenu = menu.contains(e.target);
    const clickedToggle = toggle.contains(e.target);
    const clickedHeader = header ? header.contains(e.target) : false;

    if (!(clickedInsideMenu || clickedToggle || clickedHeader)) closeMenu();
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // If user rotates / resizes to desktop, ensure menu is closed
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 768) closeMenu();
    },
    { passive: true }
  );
});

// ===============================
// Reports Carousel (Tourism)
// + Mobile swipe support
// ===============================
(function () {
  function setSlide(carouselId, index) {
    const carousel = document.querySelector(
      `.carousel[data-carousel="${carouselId}"]`
    );
    if (!carousel) return;

    const imgs = Array.from(carousel.querySelectorAll(".carousel-img"));
    const dots = Array.from(
      carousel.querySelectorAll(`.dot[data-dot="${carouselId}"]`)
    );
    const captionEl = document.getElementById(`${carouselId}-caption`);

    if (imgs.length === 0) return;

    // wrap index
    const newIndex = (index + imgs.length) % imgs.length;

    imgs.forEach((img, i) => img.classList.toggle("active", i === newIndex));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === newIndex));

    // update caption
    if (captionEl) captionEl.textContent = imgs[newIndex].dataset.caption || "";

    // save index
    carousel.dataset.index = String(newIndex);
  }

  function getIndex(carouselId) {
    const carousel = document.querySelector(
      `.carousel[data-carousel="${carouselId}"]`
    );
    if (!carousel) return 0;
    return parseInt(carousel.dataset.index || "0", 10);
  }

  function addSwipe(carouselId) {
    const carousel = document.querySelector(
      `.carousel[data-carousel="${carouselId}"]`
    );
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    if (!track) return;

    let startX = 0;
    let endX = 0;
    const threshold = 45; // swipe distance px

    // Touch events (mobile)
    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) < threshold) return;

        // swipe left -> next, swipe right -> prev
        if (diff < 0) setSlide(carouselId, getIndex(carouselId) + 1);
        else setSlide(carouselId, getIndex(carouselId) - 1);
      },
      { passive: true }
    );
  }

  // Initialize carousel when page loads
  window.addEventListener("load", () => {
    setSlide("tourism", 0);
    addSwipe("tourism");
  });

  // Handle next/prev/dots clicks
  document.addEventListener("click", (e) => {
    const prevBtn = e.target.closest("[data-prev]");
    const nextBtn = e.target.closest("[data-next]");
    const dotBtn = e.target.closest("[data-dot]");

    if (prevBtn) {
      const id = prevBtn.getAttribute("data-prev");
      setSlide(id, getIndex(id) - 1);
    }

    if (nextBtn) {
      const id = nextBtn.getAttribute("data-next");
      setSlide(id, getIndex(id) + 1);
    }

    if (dotBtn) {
      const id = dotBtn.getAttribute("data-dot");
      const idx = parseInt(dotBtn.getAttribute("data-index") || "0", 10);
      setSlide(id, idx);
    }
  });
})();

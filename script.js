// ===============================
// Fade-in animation on scroll
// ===============================
const elements = document.querySelectorAll('.fade-in');

function showElements() {
    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        if (position < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', showElements);
window.addEventListener('load', showElements);

// ===============================
// Reports Carousel (Tourism)
// ===============================
(function () {
    function setSlide(carouselId, index) {
        const carousel = document.querySelector(`.carousel[data-carousel="${carouselId}"]`);
        if (!carousel) return;

        const imgs = Array.from(carousel.querySelectorAll(".carousel-img"));
        const dots = Array.from(carousel.querySelectorAll(`.dot[data-dot="${carouselId}"]`));
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
        const carousel = document.querySelector(`.carousel[data-carousel="${carouselId}"]`);
        if (!carousel) return 0;
        return parseInt(carousel.dataset.index || "0", 10);
    }

    // Initialize carousel when page loads
    window.addEventListener("load", () => {
        setSlide("tourism", 0);
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

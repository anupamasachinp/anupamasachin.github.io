// ============================================================
// ONE SAFE INIT (prevents duplicates + keeps everything stable)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------
  // 1) Fade-in animation on scroll (IntersectionObserver version)
  // ------------------------------------------------------------
  const fadeEls = document.querySelectorAll(".fade-in");
  if (fadeEls.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      fadeEls.forEach((el) => el.classList.add("visible"));
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
      );
      fadeEls.forEach((el) => io.observe(el));
    } else {
      // fallback
      const showElements = () => {
        fadeEls.forEach((el) => {
          const top = el.getBoundingClientRect().top;
          if (top < window.innerHeight - 100) el.classList.add("visible");
        });
      };
      window.addEventListener("scroll", showElements, { passive: true });
      showElements();
    }
  }

  // ------------------------------------------------------------
  // 2) Mobile Nav Toggle (Hamburger)
  // ------------------------------------------------------------
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#primary-nav");
  const header = document.querySelector("header");

  if (toggle && menu) {
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
      isOpen ? closeMenu() : openMenu();
    });

    // Close when clicking a nav link
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      const insideMenu = menu.contains(e.target);
      const insideToggle = toggle.contains(e.target);
      const insideHeader = header ? header.contains(e.target) : false;

      if (!(insideMenu || insideToggle || insideHeader)) closeMenu();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close on resize to desktop
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 768) closeMenu();
      },
      { passive: true }
    );
  }

  // ------------------------------------------------------------
  // 3) Reports Carousel (supports MULTIPLE carousels)
  //    Buttons + dots + swipe
  // ------------------------------------------------------------
  const carousels = document.querySelectorAll(".carousel[data-carousel]");

  function setSlide(carouselId, index) {
    const carousel = document.querySelector(`.carousel[data-carousel="${carouselId}"]`);
    if (!carousel) return;

    const imgs = Array.from(carousel.querySelectorAll(".carousel-img"));
    const dots = Array.from(carousel.querySelectorAll(`.dot[data-dot="${carouselId}"]`));
    const captionEl = document.getElementById(`${carouselId}-caption`);
    if (!imgs.length) return;

    const newIndex = (index + imgs.length) % imgs.length;

    imgs.forEach((img, i) => img.classList.toggle("active", i === newIndex));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === newIndex));

    if (captionEl) captionEl.textContent = imgs[newIndex].dataset.caption || "";
    carousel.dataset.index = String(newIndex);
  }

  function getIndex(carouselId) {
    const carousel = document.querySelector(`.carousel[data-carousel="${carouselId}"]`);
    if (!carousel) return 0;
    return parseInt(carousel.dataset.index || "0", 10);
  }

  function addSwipe(carouselId) {
    const carousel = document.querySelector(`.carousel[data-carousel="${carouselId}"]`);
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    if (!track) return;

    let startX = 0;
    const threshold = 45;

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
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) < threshold) return;
        if (diff < 0) setSlide(carouselId, getIndex(carouselId) + 1);
        else setSlide(carouselId, getIndex(carouselId) - 1);
      },
      { passive: true }
    );
  }

  // init all carousels found in page
  carousels.forEach((c) => {
    const id = c.getAttribute("data-carousel");
    c.dataset.index = c.dataset.index || "0";
    setSlide(id, parseInt(c.dataset.index, 10));
    addSwipe(id);
  });

  // buttons + dots (event delegation)
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

  // ------------------------------------------------------------
  // 4) Math Symbols Snow (Hero only)
  // ------------------------------------------------------------
  const canvas = document.getElementById("mathSnow");
  const hero = document.querySelector(".hero");

  if (canvas && hero) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      const ctx = canvas.getContext("2d");

      const symbols = [
        "∑","∫","π","∞","√","≈","≠","≤","≥","÷","×","+","−","=",
        "∂","θ","λ","μ","σ","Δ","∈","∩","∪","→","∇","α","β","γ"
      ];

      let w = 0, h = 0, dpr = 1;
      let particles = [];
      let lastTime = 0;

      const rand = (min, max) => Math.random() * (max - min) + min;
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      function resize() {
        const rect = hero.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const targetCount = Math.floor((w * h) / 17000);
        const count = Math.max(22, Math.min(95, targetCount));
        particles = Array.from({ length: count }, () => makeParticle(true));
      }

      function makeParticle(randomY = false) {
        return {
          x: rand(0, w),
          y: randomY ? rand(-h, h) : rand(-60, -10),
          vy: rand(22, 60),
          baseVx: rand(-6, 6),
          waveAmp: rand(6, 22),
          waveFreq: rand(0.6, 1.6),
          wavePhase: rand(0, Math.PI * 2),
          size: rand(12, 22),
          rot: rand(0, Math.PI * 2),
          rotSpeed: rand(-0.7, 0.7),
          alpha: rand(0.25, 0.85),
          char: pick(symbols),
          blur: rand(0, 0.8),
          flicker: rand(0.4, 1.1),
        };
      }

      function draw(t, dt) {
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
          p.y += p.vy * dt;

          const wave = Math.sin((t / 1000) * p.waveFreq + p.wavePhase) * p.waveAmp;
          p.x += (p.baseVx * dt) + (wave * dt * 0.7);
          p.rot += p.rotSpeed * dt;

          // fade in/out
          const fadeInZone = 90;
          const fadeOutZone = 140;
          let fade = 1;

          if (p.y < fadeInZone) fade = Math.max(0, p.y / fadeInZone);
          if (p.y > h - fadeOutZone) fade = Math.max(0, (h - p.y) / fadeOutZone);

          // twinkle
          const tw = 0.85 + 0.15 * Math.sin((t / 1000) * p.flicker + p.wavePhase);

          // respawn
          if (p.y > h + 50) Object.assign(p, makeParticle(false));
          if (p.x < -60) p.x = w + 60;
          if (p.x > w + 60) p.x = -60;

          ctx.save();
          ctx.globalAlpha = p.alpha * fade * tw;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);

          ctx.font = `800 ${p.size}px Inter, Segoe UI, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.shadowColor = "rgba(255,255,255,0.55)";
          ctx.shadowBlur = 10 + p.blur * 6;

          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.fillText(p.char, 0, 0);

          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(224,242,254,0.70)";
          ctx.fillText(p.char, 0.7, 0.7);

          ctx.restore();
        }
      }

      function animate(t) {
        if (!lastTime) lastTime = t;
        const dt = Math.min((t - lastTime) / 1000, 0.033);
        lastTime = t;

        draw(t, dt);
        requestAnimationFrame(animate);
      }

      resize();
      requestAnimationFrame(animate);
      window.addEventListener("resize", resize, { passive: true });
    }
  }

  // ------------------------------------------------------------
  // 5) Hero Typing Effect (auto type + delete + next)
  // ------------------------------------------------------------
  const typedTextEl = document.getElementById("typed-text");
  const cursorEl = document.querySelector(".cursor");

  if (typedTextEl) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // You can edit these titles anytime:
    const roles = [
      "Power BI Developer",
      "Business Analyst",
      "Power Apps Developer",
      "Data Analyst"
    ];

    // If user prefers reduced motion, show a static title and stop.
    if (reduceMotion) {
      typedTextEl.textContent = roles[0];
      if (cursorEl) cursorEl.style.display = "none";
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPE_SPEED = 95;       // typing speed
    const DELETE_SPEED = 55;     // deleting speed
    const END_PAUSE = 1100;      // pause when word completed
    const START_PAUSE = 250;     // pause before typing next word

    function tick() {
      const full = roles[roleIndex];

      if (!isDeleting) {
        charIndex++;
        typedTextEl.textContent = full.slice(0, charIndex);

        if (charIndex === full.length) {
          // pause then start deleting
          isDeleting = true;
          setTimeout(tick, END_PAUSE);
          return;
        }

        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        typedTextEl.textContent = full.slice(0, Math.max(0, charIndex));

        if (charIndex <= 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, START_PAUSE);
          return;
        }

        setTimeout(tick, DELETE_SPEED);
      }
    }

    // Start with whatever is in HTML, or start clean
    typedTextEl.textContent = "";
    tick();
  }
});

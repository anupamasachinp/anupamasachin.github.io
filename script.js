document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Dynamic Footer Year
  document.getElementById("year").textContent = new Date().getFullYear();

  // 2. Scroll Spy (Highlighting active section in navigation)
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-menu a");

  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(currentSectionId)) {
        link.classList.add("active");
      }
    });
  });

  // 3. Mobile Navigation Menu
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#primary-nav");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
    navLinks.forEach(l => l.addEventListener("click", () => menu.classList.remove("open")));
  }

  // 4. Typing Effect for Hero Section
  const typedTextEl = document.getElementById("typed-role");
  if (typedTextEl) {
    const roles = [" Excel Expert", "Power Apps Developer", "Power Automate Specialist", "Power BI Developer", "Data Analyst", "BI Specialist"];
    let rIdx = 0, cIdx = 0, isDeleting = false;

    function type() {
      const currentRole = roles[rIdx];
      typedTextEl.textContent = isDeleting ? currentRole.substring(0, cIdx--) : currentRole.substring(0, cIdx++);
      
      if (!isDeleting && cIdx > currentRole.length) { 
        isDeleting = true; setTimeout(type, 1500); 
      } else if (isDeleting && cIdx < 0) { 
        isDeleting = false; rIdx = (rIdx + 1) % roles.length; cIdx = 0; setTimeout(type, 500); 
      } else { 
        setTimeout(type, isDeleting ? 50 : 100); 
      }
    }
    type();
  }

  // 5. Fade-In Scroll Animations
  const fadeEls = document.querySelectorAll(".fade-in");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => io.observe(el));
});

// ============================================================
// MODAL (POPUP) LOGIC FOR POWER BI REPORTS
// ============================================================
window.openModal = function(url) {
  const modal = document.getElementById("reportModal");
  const iframe = document.getElementById("modalIframe");
  
  iframe.src = url;
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent background scrolling
};

window.closeModal = function() {
  const modal = document.getElementById("reportModal");
  const iframe = document.getElementById("modalIframe");
  
  modal.style.display = "none";
  iframe.src = ""; // Stop report processing
  document.body.style.overflow = "auto"; // Re-enable background scrolling
};

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById("reportModal");
  if (event.target === modal) {
    window.closeModal();
  }
};

// ============================================================
  // SCROLL PROGRESS BAR LOGIC
  // ============================================================
  window.addEventListener("scroll", () => {
    // Scroll කරපු ප්‍රමාණය කොච්චරද කියලා හොයනවා
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    
    // Website එකේ සම්පූර්ණ උස
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // ප්‍රතිශතයක් විදිහට හදනවා (0% සිට 100% දක්වා)
    let scrolled = (winScroll / height) * 100;
    
    // ඒ ප්‍රතිශතය Progress Bar එකේ width එකට දෙනවා
    document.getElementById("myBar").style.width = scrolled + "%";
  });

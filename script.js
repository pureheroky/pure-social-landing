const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav__link");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
});

const header = document.getElementById("header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("animated");
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll(".animate-on-scroll");
animatedElements.forEach((el) => observer.observe(el));

const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  updateCounter();
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = document.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-target"));
          animateCounter(stat, target);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector(".hero__stats");
if (heroStats) {
  statsObserver.observe(heroStats);
}

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero__bg-image");

  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card) => {
  const inner = card.querySelector(".feature-card__inner");
  let counter = 0;
  const updateRate = 10;

  const isTimeToUpdate = () => counter++ % updateRate === 0;

  card.addEventListener("mouseenter", () => {
    card.style.willChange = "transform";
    inner.style.transform = "translateY(-8px)";
  });

  card.addEventListener("mousemove", (e) => {
    if (!isTimeToUpdate()) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    inner.style.transform = "";
    card.style.willChange = "auto";
  });
});

const reviewCards = document.querySelectorAll(".review-card");
const reviewObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 150);
        reviewObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

reviewCards.forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "all 0.6s ease-out";
  reviewObserver.observe(card);
});

const galleryItems = document.querySelectorAll(".gallery__item");

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    const overlay = document.createElement("div");
    overlay.className = "gallery-modal";
    overlay.innerHTML = `
            <div class="gallery-modal__content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="gallery-modal__close">&times;</button>
            </div>
        `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    setTimeout(() => overlay.classList.add("active"), 10);

    const closeModal = () => {
      overlay.classList.remove("active");
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.body.style.overflow = "";
      }, 300);
    };

    overlay.addEventListener("click", (e) => {
      if (
        e.target === overlay ||
        e.target.classList.contains("gallery-modal__close")
      ) {
        closeModal();
      }
    });
  });
});

const modalStyles = document.createElement("style");
modalStyles.textContent = `
    .gallery-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 2rem;
    }
    
    .gallery-modal.active {
        opacity: 1;
    }
    
    .gallery-modal__content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        animation: zoomIn 0.3s ease;
    }
    
    .gallery-modal__content img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 1rem;
    }
    
    .gallery-modal__close {
        position: absolute;
        top: -3rem;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        line-height: 1;
        transition: transform 0.2s ease;
    }
    
    .gallery-modal__close:hover {
        transform: scale(1.2);
    }
    
    @keyframes zoomIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(modalStyles);

const buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

const rippleStyles = document.createElement("style");
rippleStyles.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

const floatCards = document.querySelectorAll(".hero__float-card");

floatCards.forEach((card) => {
  const randomDelay = Math.random() * 2;
  const randomDuration = 3 + Math.random() * 2;

  card.style.animation = `float ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
});

const sections = document.querySelectorAll("section[id]");

const highlightNavigation = () => {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add("active");
    } else {
      navLink?.classList.remove("active");
    }
  });
};

window.addEventListener("scroll", highlightNavigation);

const activeLinkStyles = document.createElement("style");
activeLinkStyles.textContent = `
    .nav__link.active {
        color: var(--color-primary);
    }
    
    .nav__link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeLinkStyles);

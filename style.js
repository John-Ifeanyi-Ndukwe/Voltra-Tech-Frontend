document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================
     HAMBURGER MENU
  ========================= */

  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");

  if (hamburger && nav) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-controls", nav.id || "nav");

    const closeMenu = () => {
      nav.classList.remove("active");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    const toggleMenu = () => {
      const isOpen = nav.classList.toggle("active");

      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));

      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    hamburger.addEventListener("click", toggleMenu);

    nav.querySelectorAll("a, button").forEach((item) => {
      item.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("active") &&
        !nav.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        nav.classList.contains("active")
      ) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* =========================
     SMOOTH SCROLL
  ========================= */

  const scrollToId = (id) => {
    if (typeof id !== "string" || !id.trim()) {
      return;
    }

    const element = document.getElementById(id.trim());

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  document
    .querySelectorAll("[data-scroll-to]")
    .forEach((element) => {
      element.addEventListener("click", (event) => {
        const targetId = element.getAttribute("data-scroll-to");

        if (!targetId) {
          return;
        }

        event.preventDefault();
        scrollToId(targetId);
      });
    });

  /* =========================
     HERO SLIDER
  ========================= */

  const hero = document.getElementById("hero");

  if (!hero) {
    return;
  }

  const slides = Array.from(
    hero.querySelectorAll(".slide")
  );

  // Set background images from data-src attribute
  slides.forEach((slide) => {
    const src = slide.getAttribute("data-src");
    if (src) slide.style.backgroundImage = `url("${src}")`;
  });

  const dotsWrap = document.getElementById("dots");

  if (!slides.length) {
    return;
  }

  /* =========================
     STARTING SLIDE
  ========================= */

  let currentIndex = slides.findIndex((slide) => {
    return slide.classList.contains("active");
  });

  if (currentIndex === -1) {
    currentIndex = 0;
    slides[0].classList.add("active");
  }

  /* =========================
     REDUCED MOTION
  ========================= */

  const motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* =========================
     SLIDE FUNCTION
  ========================= */

  const showSlide = (newIndex) => {
    slides[currentIndex].classList.remove("active");

    currentIndex = newIndex;

    if (currentIndex >= slides.length) {
      currentIndex = 0;
    }

    if (currentIndex < 0) {
      currentIndex = slides.length - 1;
    }

    slides[currentIndex].classList.add("active");

    updateDots();
  };

  /* =========================
     NEXT SLIDE
  ========================= */

  const nextSlide = () => {
    showSlide(currentIndex + 1);
  };

  /* =========================
     DOTS
  ========================= */

  const updateDots = () => {
    if (!dotsWrap) {
      return;
    }

    const dots = dotsWrap.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;

      dot.classList.toggle("active", isActive);

      dot.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });
  };

  if (dotsWrap) {
    dotsWrap.replaceChildren();

    slides.forEach((slide, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "dot";

      if (index === currentIndex) {
        button.classList.add("active");
      }

      button.setAttribute(
        "aria-label",
        `Show slide ${index + 1}`
      );

      button.setAttribute(
        "aria-selected",
        String(index === currentIndex)
      );

      button.addEventListener("click", () => {
        showSlide(index);
        restartSlider();
      });

      dotsWrap.appendChild(button);
    });
  }

  /* =========================
     AUTOMATIC SLIDER
  ========================= */

  let sliderTimer = null;

  const stopSlider = () => {
    if (sliderTimer !== null) {
      window.clearInterval(sliderTimer);
      sliderTimer = null;
    }
  };

  const startSlider = () => {
    stopSlider();

    if (motionQuery.matches) {
      return;
    }

    sliderTimer = window.setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const restartSlider = () => {
    startSlider();
  };

  /* =========================
     REDUCED MOTION CHANGE
  ========================= */

  const handleMotionChange = () => {
    if (motionQuery.matches) {
      stopSlider();
    } else {
      startSlider();
    }
  };

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener(
      "change",
      handleMotionChange
    );
  }

  /* =========================
     PAUSE WHEN TAB IS HIDDEN
  ========================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopSlider();
      } else {
        startSlider();
      }
    }
  );

  /* =========================
     MOBILE VIEWPORT HEIGHT
  ========================= */

  let viewportTimer = null;

  const setViewportHeight = () => {
    const viewportHeight = window.innerHeight * 0.01;

    document.documentElement.style.setProperty(
      "--vh",
      `${viewportHeight}px`
    );
  };

  const updateViewportHeight = () => {
    if (viewportTimer !== null) {
      window.clearTimeout(viewportTimer);
    }

    viewportTimer = window.setTimeout(() => {
      setViewportHeight();
      viewportTimer = null;
    }, 150);
  };

  setViewportHeight();

  window.addEventListener(
    "resize",
    updateViewportHeight,
    { passive: true }
  );

  window.addEventListener(
    "orientationchange",
    updateViewportHeight,
    { passive: true }
  );

  /* =========================
     START SLIDER
  ========================= */

  updateDots();
  startSlider();

});
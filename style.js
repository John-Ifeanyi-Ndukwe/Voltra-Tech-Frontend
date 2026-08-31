document.addEventListener("DOMContentLoaded", () => {
  // ===== Mobile menu (safe if markup is added later) =====
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-label", "Toggle navigation menu");
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a, button").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ===== Smooth scroll for header buttons =====
  window.scrollToId = function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ===== Hero slideshow =====
  const slides = Array.from(document.querySelectorAll("#hero .slide"));
  const dotsWrap = document.getElementById("dots") || document.querySelector(".dots");
  const counter = document.querySelector(".hero-counter");
  const labels = slides.map((slide, i) => {
    const heading = slide.querySelector("h1");
    return heading ? heading.textContent.replace(/\s+/g, " ").trim() : "Slide " + (i + 1);
  });

  let index = Math.max(0, slides.findIndex((s) => s.classList.contains("active")));
  let timer = null;

  function imageSrc(slide) {
    const dataSrc = slide.getAttribute("data-src");
    if (dataSrc) return dataSrc;
    const bg = slide.style.backgroundImage || "";
    const match = bg.match(/url\(["']?(.+?)["']?\)/);
    return match ? match[1] : "";
  }

  function show(next) {
    if (!slides.length) return;
    slides[index].classList.remove("active");
    index = (next + slides.length) % slides.length;
    slides[index].classList.add("active");

    if (counter) {
      const n = String(index + 1).padStart(2, "0");
      const total = String(slides.length).padStart(2, "0");
      counter.innerHTML =
        "<strong>" + n + "</strong> / " + total + " — " + labels[index];
    }

    if (dotsWrap) {
      dotsWrap.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }
  }

  function startTimer() {
    stopTimer();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = window.setInterval(() => show(index + 1), 4000);
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  slides.forEach((slide) => {
    const src = slide.getAttribute("data-src");
    if (src) slide.style.backgroundImage = 'url("' + src + '")';
  });

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dot" + (i === index ? " active" : "");
      btn.setAttribute("aria-label", "Show " + labels[i]);
      btn.setAttribute("aria-selected", i === index ? "true" : "false");
      btn.addEventListener("click", () => {
        show(i);
        startTimer();
      });
      dotsWrap.appendChild(btn);
    });
  }

  Promise.all(
    slides.map((slide) => {
      return new Promise((resolve) => {
        const src = imageSrc(slide);
        if (!src) return resolve();
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    })
  ).then(startTimer);

  // ===== Fix mobile 100vh =====
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
  };
  setViewportHeight();
  window.addEventListener("resize", setViewportHeight);
  window.addEventListener("orientationchange", setViewportHeight);
});
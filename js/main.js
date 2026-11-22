/* ============================================================
   PREMIUM DEVELOPER PORTFOLIO — MAIN JS
   Effects: neural canvas, cursor, magnetic buttons, typing,
   reveal, counters, carousel, tilt, parallax, clock, heatmap
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Helper: prefers reduced motion ---------- */
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =========================================================
     NEURAL GLOW CANVAS (particle network)
  ========================================================= */
  const neuralCanvas = document.getElementById("neural-canvas");
  if (neuralCanvas && !prefersReduced) {
    const ctx = neuralCanvas.getContext("2d");
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    const CONNECT = 130;

    function resize() {
      neuralCanvas.width = neuralCanvas.offsetWidth;
      neuralCanvas.height = neuralCanvas.offsetHeight;
    }
    function init() {
      const count = Math.min(
        90,
        Math.floor((neuralCanvas.width * neuralCanvas.height) / 16000),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * neuralCanvas.width,
        y: Math.random() * neuralCanvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.6,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > neuralCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > neuralCanvas.height) p.vy *= -1;

        // mouse attraction
        const dx = mouse.x - p.x,
          dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          p.x += dx * 0.004;
          p.y += dy * 0.004;
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < CONNECT) {
            const a = (1 - d / CONNECT) * 0.5;
            ctx.strokeStyle = `rgba(168,85,247,${a})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(192,132,252,0.9)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener("resize", () => {
      resize();
      init();
    });
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    resize();
    init();
    draw();
  }

  /* =========================================================
     STARS BACKGROUND
  ========================================================= */
  const starsEl = document.getElementById("stars");
  if (starsEl) {
    const n = prefersReduced ? 0 : 60;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = Math.random() * 3 + "s";
      s.style.animationDuration = 2 + Math.random() * 3 + "s";
      starsEl.appendChild(s);
    }
  }

  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */
  const dot = document.querySelector(".cursor-dot");
  const glow = document.querySelector(".cursor-glow");
  const ring = document.querySelector(".cursor-ring");
  if (dot && glow && ring && window.matchMedia("(hover:hover)").matches) {
    let rx = innerWidth / 2,
      ry = innerHeight / 2,
      cx = rx,
      cy = ry;
    window.addEventListener("mousemove", (e) => {
      rx = e.clientX;
      ry = e.clientY;
      dot.style.left = rx + "px";
      dot.style.top = ry + "px";
      glow.style.left = rx + "px";
      glow.style.top = ry + "px";
    });
    (function anim() {
      cx += (rx - cx) * 0.16;
      cy += (ry - cy) * 0.16;
      ring.style.left = cx + "px";
      ring.style.top = cy + "px";
      requestAnimationFrame(anim);
    })();
    const hoverTargets = document.querySelectorAll(
      "a, button, .tilt, .cursor-target",
    );
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */
  if (!prefersReduced) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* =========================================================
     RIPPLE CLICK
  ========================================================= */
  document.addEventListener("click", function (e) {
    const target = e.target.closest(".btn, .social, .tech-chip");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = e.clientX - rect.left + "px";
    ripple.style.top = e.clientY - rect.top + "px";
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  /* =========================================================
     TYPING ANIMATION (hero)
  ========================================================= */
  const typeLine = document.getElementById("typeLine");
  const roles = [
    "Aspiring Creative Developer",
    "Aspiring Backend Developer",
    "Aspiring Data Manager",
    "Aspiring UI/UX Designer",
    "College Student",
  ];
  if (typeLine) {
    let ri = 0,
      ci = 0,
      deleting = false;
    function type() {
      const word = roles[ri];
      typeLine.textContent = word.slice(0, ci);
      if (!deleting) {
        if (ci < word.length) {
          ci++;
          setTimeout(type, 80);
        } else {
          deleting = true;
          setTimeout(type, 1600);
        }
      } else {
        if (ci > 0) {
          ci--;
          setTimeout(type, 40);
        } else {
          deleting = false;
          ri = (ri + 1) % roles.length;
          setTimeout(type, 300);
        }
      }
    }
    type();
  }


  /* =========================================================
     NAVIGATION + SCROLL PROGRESS + NAV SCROLL
  ========================================================= */
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("progressBeam");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  function onScroll() {
    const st = document.documentElement.scrollTop;
    if (navbar) navbar.classList.toggle("scrolled", st > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
      const open = navLinks.classList.contains("open");
      hamburger.setAttribute("aria-expanded", open);
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      }),
    );
  }

  /* =========================================================
     REVEAL ANIMATIONS (Intersection Observer)
  ========================================================= */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  revealEls.forEach((el) => io.observe(el));

  /* =========================================================
     ANIMATED COUNTERS
  ========================================================= */
  const counters = document.querySelectorAll(".count");
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = +el.dataset.target;
        const dur = 1600;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.floor(
            target * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)),
          );
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((c) => counterIO.observe(c));

  /* =========================================================
     SKILL BARS
  ========================================================= */
  const bars = document.querySelectorAll(".bar-fill");
  const barIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.style.width = en.target.dataset.w + "%";
          barIO.unobserve(en.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  bars.forEach((b) => barIO.observe(b));

  /* =========================================================
     STAT RINGS (circular progress)
  ========================================================= */
  const rings = document.querySelectorAll(".stat-ring");
  const ringIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const ring = en.target;
        const target = +ring.dataset.target;
        const fg = ring.querySelector(".ring-fg");
        const C = 327;
        let current = 0;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / 1600, 1);
          current = target * (1 - Math.pow(2, -10 * p));
          fg.style.strokeDashoffset = C - (current / 100) * C;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        ringIO.unobserve(ring);
      });
    },
    { threshold: 0.5 },
  );
  rings.forEach((r) => ringIO.observe(r));

  /* =========================================================
     3D TILT on hover
  ========================================================= */
  if (!prefersReduced) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* =========================================================
     PARALLAX depth layers (hero)
  ========================================================= */
  if (!prefersReduced) {
    document.querySelectorAll("[data-depth]").forEach((el) => {
      const depth = +el.dataset.depth;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = `translate(${x * depth * 18}px, ${y * depth * 18}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* =========================================================
     TESTIMONIAL CAROUSEL (auto slide)
  ========================================================= */
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  if (track && dotsWrap) {
    const slides = track.children;
    let idx = 0,
      timer;
    Array.from(slides).forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", () => {
        go(i);
        reset();
      });
      dotsWrap.appendChild(b);
    });
    const dots = dotsWrap.children;
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      Array.from(dots).forEach((d, k) =>
        d.classList.toggle("active", k === idx),
      );
    }
    function reset() {
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 4000);
    }
    dots[0].classList.add("active");
    reset();
  }

  /* =========================================================
     GITHUB HEATMAP
  ========================================================= */
  const heat = document.getElementById("ghHeatmap");

if (heat) {
  const cols = 53;
  const rows = 7;
  const cells = cols * rows; // 371 cells

  // Eksaktong pwesto at kulay (1-4) base sa picture: "col-row": level
  const activeCells = {
    "35-4": 1, // Jul (Friday) - dark green
    "38-6": 4, // Aug (Saturday) - bright green
    "39-5": 4, // Aug (Friday) - bright green
    "40-2": 2, // Aug (Tuesday) - medium green
    "41-2": 1, // Aug (Tuesday) - dark green
    "52-0": 1, // Nov (Sunday) - dark green
    "52-5": 4  // Nov (Friday) - bright green
  };

  for (let i = 0; i < cells; i++) {
    const col = Math.floor(i / rows);
    const row = i % rows;
    const key = `${col}-${row}`;

    const c = document.createElement("span");
    const lvl = activeCells[key];

    if (lvl) {
      c.className = "gh-cell l" + lvl;
    } else {
      c.className = "gh-cell";
    }

    heat.appendChild(c);
  }
}

  /* =========================================================
     CONTACT FORM (validation)
  ========================================================= */

  /* =========================================================
     DIGITAL CLOCK
  ========================================================= */
  const clock = document.getElementById("clock");
  if (clock) {
    function tickClock() {
      const d = new Date();
      clock.textContent = d.toLocaleTimeString("en-US", { hour12: false });
    }
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* =========================================================
     FOOTER YEAR
  ========================================================= */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* =========================================================
     LENIS SMOOTH SCROLL
  ========================================================= */
  if (window.Lenis && !prefersReduced) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    // Sync GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* =========================================================
     GSAP + ScrollTrigger (enhanced reveal & parallax)
  ========================================================= */
  if (window.gsap && window.ScrollTrigger && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from(".hero-left > *", {
      opacity: 0,
      y: 50,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.1,
    });
    gsap.from(".hero-right", {
      opacity: 0,
      scale: 0.85,
      duration: 1,
      ease: "power3.out",
      delay: 0.3,
    });

    // Section parallax
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        y: () => -200,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Floating blobs subtle parallax via ScrollTrigger
    gsap.to(".blob.b1", {
      y: 120,
      scrollTrigger: { trigger: ".hero", scrub: true },
    });
    gsap.to(".blob.b2", {
      y: -120,
      scrollTrigger: { trigger: ".hero", scrub: true },
    });
  }
})();

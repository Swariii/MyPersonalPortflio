/* =========================================================
   INTRO / LOADING SCREEN
   Name + loading, glitch (may sound effect), tapos bubukas ang page.
   Palitan ang NAME / ROLE / mga SOUND settings sa baba.
========================================================= */
(function () {
  "use strict";

  /* ---------- SETTINGS ---------- */
  var NAME = "Ser John Rempillo";
  var ROLE = "Future Full Stack Developer";
  var DURATION = 3200;               // ilang ms bago umabot sa 100%

  var SOUND_ON = true;               // false = walang tunog
  var SOUND_FILE = "Audio/glitch.mp3";  // path ng sarili mong sound (galing sa index.html)
  var SOUND_VOLUME = 0.8;            // 0 hanggang 1
  var STOP_ON_OPEN = false;          // true = puputulin ang tunog pag bumukas na ang curtain

  var STATUS = [
    [0,  "> booting portfolio"],
    [25, "> loading assets"],
    [55, "> compiling projects"],
    [85, "> almost there"],
    [100, "> ready"]
  ];

  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) DURATION = 900;

  // takpan agad ang page para walang flash
  root.classList.add("intro-lock");

  var pageLoaded = document.readyState === "complete";
  window.addEventListener("load", function () { pageLoaded = true; });

  /* =========================================================
     GLITCH SOUND (sarili mong audio file)
  ========================================================= */
  var glitchAudio = null;

  if (SOUND_ON && SOUND_FILE) {
    glitchAudio = new Audio(SOUND_FILE);   // i-preload para handa na pag dating ng glitch
    glitchAudio.preload = "auto";
    glitchAudio.volume = SOUND_VOLUME;
    glitchAudio.addEventListener("error", function () {
      console.error("Glitch sound: hindi mahanap o ma-load ang '" + SOUND_FILE + "'.");
    });
  }

  var soundPlayed = false;

  function playGlitchSound() {
    if (!glitchAudio || soundPlayed) return;
    var p;
    try { p = glitchAudio.play(); } catch (e) { return; }
    if (p && p.then) {
      p.then(function () { soundPlayed = true; }).catch(function (err) {
        if (err && err.name !== "NotAllowedError") {
          // hindi block ng browser: mali ang path/pangalan ng file o hindi supported ang format
          console.error("Glitch sound: hindi ma-play ang '" + SOUND_FILE + "' (" + err.name + "). Check ang pangalan/path ng file.");
          return;
        }
        console.info("Glitch sound: hinarang ng browser ang auto-play (wala pang click ang bisita).");
        // tutunog sa unang click/tap/key sa loob ng 10 segundo
        var tries = ["pointerdown", "keydown", "touchstart"];
        var retry = function () {
          tries.forEach(function (ev) { window.removeEventListener(ev, retry, true); });
          if (soundPlayed) return;
          glitchAudio.play().then(function () { soundPlayed = true; }).catch(function () {});
        };
        tries.forEach(function (ev) { window.addEventListener(ev, retry, true); });
        setTimeout(function () {
          tries.forEach(function (ev) { window.removeEventListener(ev, retry, true); });
        }, 10000);
      });
    }
  }

  function stopGlitchSound() {
    if (!glitchAudio) return;
    var v0 = glitchAudio.volume, i = 0;
    var iv = setInterval(function () {
      i++;
      glitchAudio.volume = Math.max(v0 * (1 - i / 10), 0);
      if (i >= 10) { clearInterval(iv); glitchAudio.pause(); }
    }, 40);
  }

  /* =========================================================
     UI
  ========================================================= */
  function build() {
    var el = document.createElement("div");
    el.className = "intro";
    el.setAttribute("role", "status");
    el.setAttribute("aria-label", "Loading portfolio");

    var words = NAME.split(" ").map(function (w, wi, arr) {
      var offset = arr.slice(0, wi).join(" ").length + (wi ? 1 : 0);
      return '<span class="intro-word">' + w.split("").map(function (c, ci) {
        return '<span class="intro-ch" style="--i:' + (offset + ci) + '">' + c + "</span>";
      }).join("") + "</span>";
    }).join("");

    el.innerHTML =
      '<div class="intro-panel intro-top"></div>' +
      '<div class="intro-panel intro-bottom"></div>' +
      '<div class="intro-grid"></div><div class="intro-glow"></div><div class="intro-scan"></div>' +
      '<span class="intro-corner tl"></span><span class="intro-corner tr"></span>' +
      '<span class="intro-corner bl"></span><span class="intro-corner br"></span>' +
      '<div class="intro-center">' +
        '<p class="intro-eyebrow">✦ Hello world, I\'m</p>' +
        '<h1 class="intro-name" data-text="' + NAME + '" aria-label="' + NAME + '">' + words + "</h1>" +
        '<p class="intro-role">' + ROLE + "</p>" +
        '<div class="intro-load">' +
          '<div class="intro-bar"><i></i></div>' +
          '<div class="intro-meta"><span class="intro-status">' + STATUS[0][1] + '</span><b class="intro-pct">0%</b></div>' +
        "</div>" +
      "</div>" +
      '<div class="intro-seam"></div>' +
      '<button type="button" class="intro-skip">Skip ›</button>';

    document.body.appendChild(el);
    return el;
  }

  function run() {
    var el = build();
    var bar = el.querySelector(".intro-bar i");
    var pct = el.querySelector(".intro-pct");
    var status = el.querySelector(".intro-status");
    var skip = el.querySelector(".intro-skip");

    var start = 0;
    var started = false;
    var finishing = false;
    var forced = false;
    var lastStatus = 0;

    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function setProgress(p) {
      var v = Math.round(p * 100);
      bar.style.transform = "scaleX(" + p + ")";
      pct.textContent = v + "%";
      for (var i = STATUS.length - 1; i >= 0; i--) {
        if (v >= STATUS[i][0]) {
          if (lastStatus !== i) { lastStatus = i; status.textContent = STATUS[i][1]; }
          break;
        }
      }
    }

    function finish() {
      if (finishing) return;
      finishing = true;
      setProgress(1);
      el.classList.add("is-glitch");
      playGlitchSound();                                // 🔊 dito lalabas ang glitch sound
      setTimeout(function () {
        el.classList.add("is-done");
        setTimeout(function () {
          el.classList.add("is-open");
          if (STOP_ON_OPEN) stopGlitchSound();
          root.classList.remove("intro-lock");
          window.scrollTo(0, 0);
          setTimeout(function () {
            el.remove();
            window.dispatchEvent(new CustomEvent("introdone"));
          }, 1100);
        }, 450);
      }, reduced ? 100 : 750);
    }

    function tick(now) {
      if (finishing) return;
      var t = Math.min((now - start) / DURATION, 1);
      var p = ease(t);
      if (!pageLoaded && !forced) p = Math.min(p, 0.92);   // hintayin ang totoong pag-load
      setProgress(p);
      if (p >= 1) { finish(); return; }
      requestAnimationFrame(tick);
    }

    function begin() {
      if (started) return;
      started = true;
      start = performance.now();
      setTimeout(function () { forced = true; }, DURATION + 2500);   // failsafe
      requestAnimationFrame(tick);
    }

    skip.addEventListener("click", function () { forced = true; finish(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === " ") { forced = true; finish(); }
    });

    begin();
  }

  function safeRun() {
    try { run(); } catch (err) {
      root.classList.remove("intro-lock");
      console.error("Intro error:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeRun);
  } else {
    safeRun();
  }
})();
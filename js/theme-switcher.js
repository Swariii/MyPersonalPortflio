/* =========================================================
   THEME SWITCHER
   - Naglo-load ng css/themes/theme-*.css depende sa napili
   - Naka-save sa localStorage kaya naaalala ng browser
   - Naglalabas ng "themechange" event para sa ibang JS (hal. canvas)
========================================================= */
(function () {
  "use strict";

  // Ginagamit para tama ang path ng CSS kahit nasaang page ka pa
  var ROOT = document.currentScript
    ? new URL("../", document.currentScript.src).href
    : "";

  var STORAGE_KEY = "portfolio-theme";
  var DEFAULT_THEME = "purple";

  // sw = [kulay ng accent, kulay ng background] para sa bilog
  var THEMES = [
    { id: "purple",          label: "Purple",           file: "css/themes/theme-purple.css",          sw: ["#a855f7", "#1d0640"] },
    { id: "black-red",       label: "Black Red",        file: "css/themes/theme-black-red.css",       sw: ["#ef233c", "#000000"] },
    { id: "black-orange",    label: "Black Orange",     file: "css/themes/theme-black-orange.css",    sw: ["#ff8a1f", "#000000"] },
    { id: "black-purple",    label: "Black Purple",     file: "css/themes/theme-black-purple.css",    sw: ["#a855f7", "#000000"] },
    { id: "black-lightblue", label: "Black Light Blue", file: "css/themes/theme-black-lightblue.css", sw: ["#38bdf8", "#000000"] }
  ];

  function findTheme(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
    return THEMES[0];
  }

  function saved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function save(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* ignore */ }
  }

  var buttons = [];

  /* ---------- Apply theme ---------- */
  function applyTheme(id, persist) {
    var theme = findTheme(id);
    var root = document.documentElement;

    // palitan ang <link> ng theme
    var oldLink = document.getElementById("theme-stylesheet");
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "theme-stylesheet-new";
    link.href = ROOT + theme.file;

    root.classList.add("theme-fade");

    link.onload = function () {
      if (oldLink) oldLink.remove();
      link.id = "theme-stylesheet";
      setTimeout(function () { root.classList.remove("theme-fade"); }, 500);
    };
    link.onerror = function () { root.classList.remove("theme-fade"); };

    // ilagay pagkatapos ng style.css para mag-override
    (document.head || root).appendChild(link);

    root.setAttribute("data-theme", theme.id);

    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.theme === theme.id));
    });

    if (persist) save(theme.id);

    // para sa ibang script (hal. canvas na may sariling kulay)
    window.dispatchEvent(new CustomEvent("themechange", { detail: { id: theme.id, theme: theme } }));
  }

  /* ---------- Build UI ---------- */
  function buildUI(current) {
    var wrap = document.createElement("div");
    wrap.className = "theme-switcher";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";
    toggle.setAttribute("aria-label", "Choose theme color");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/>' +
      '<circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/></svg>';

    var options = document.createElement("div");
    options.className = "theme-options";
    options.setAttribute("role", "group");
    options.setAttribute("aria-label", "Theme colors");

    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "theme-swatch";
      b.dataset.theme = t.id;
      b.dataset.label = t.label;
      b.setAttribute("aria-label", t.label);
      b.setAttribute("aria-pressed", String(t.id === current));
      b.style.setProperty("--sw-a", t.sw[0]);
      b.style.setProperty("--sw-b", t.sw[1]);
      b.addEventListener("click", function () { applyTheme(t.id, true); });
      buttons.push(b);
      options.appendChild(b);
    });

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    wrap.appendChild(toggle);
    wrap.appendChild(options);
    document.body.appendChild(wrap);
  }

  /* ---------- Init ---------- */
  var initial = findTheme(saved() || DEFAULT_THEME).id;

  // i-load agad ang theme (kung naka-<head> ang script) para walang flash
  applyTheme(initial, false);

  function ready() { buildUI(initial); applyTheme(initial, false); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();

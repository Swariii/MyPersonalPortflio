/* =========================================================
   HERO: picture lang ang gumagalaw kapag hinover
   (3D tilt na sumusunod sa mouse + konting zoom)
========================================================= */
(function () {
  "use strict";

  var avatar = document.querySelector(".hero .avatar");
  if (!avatar) return;

  // walang hover sa touch devices / reduced motion
  if (window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var MAX = 16;   // pinakamataas na tilt (degrees)

  avatar.addEventListener("mouseenter", function () {
    avatar.style.transition = "transform 0.15s ease-out";
  });

  avatar.addEventListener("mousemove", function (e) {
    var r = avatar.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    avatar.style.transform =
      "perspective(600px) rotateX(" + (-y * MAX) + "deg) rotateY(" + (x * MAX) + "deg) scale(1.08)";
  });

  avatar.addEventListener("mouseleave", function () {
    avatar.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
    avatar.style.transform = "";
  });
})();
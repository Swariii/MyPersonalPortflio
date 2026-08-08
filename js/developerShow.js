const modal = document.getElementById("developerModal");
const openBtn = document.getElementById("showDevelopers");
const closeBtn = document.querySelector(".close");

openBtn.addEventListener("click", function (e) {
  e.preventDefault();
  modal.classList.add("show");
});

closeBtn.addEventListener("click", function () {
  modal.classList.remove("show");
});

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

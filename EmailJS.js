const form = document.getElementById("contactForm");

if (form) {
  const note = document.getElementById("formNote");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    // Clear previous messages and validate fields
    form.querySelectorAll(".field").forEach((field) => {
      const input = field.querySelector("input, textarea");

      // Remove previous error message
      field.querySelector(".err-msg")?.remove();

      // Required field validation
      if (!input.value.trim()) {
        valid = false;

        field.classList.add("error");

        const err = document.createElement("span");
        err.className = "err-msg";
        err.textContent = "This field is required.";

        field.appendChild(err);
      }

      // Email validation
      else if (
        input.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
      ) {
        valid = false;

        field.classList.add("error");

        const err = document.createElement("span");
        err.className = "err-msg";
        err.textContent = "Please enter a valid email.";

        field.appendChild(err);
      }

      // Valid field
      else {
        field.classList.remove("error");
      }
    });

    // Stop if validation failed
    if (!valid) {
      note.textContent = "Please fill in all required fields correctly.";
      return;
    }

    // Show sending status
    note.textContent = "Sending message...";

    // Send form through EmailJS
    emailjs
      .sendForm("service_qxtsxi9", "template_pxyo8qb", form)
      .then(function () {
        note.textContent = "✦ Message sent! I'll get back to you soon.";

        form.reset();
      })
      .catch(function (error) {
        console.error("EmailJS Error:", error);

        note.textContent = "✦ Something went wrong. Please try again later.";
      });
  });
}

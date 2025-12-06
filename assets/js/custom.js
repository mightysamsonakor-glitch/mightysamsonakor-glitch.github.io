// assets/js/custom.js
// Homework 11 – Contact form logic, validation, average rating & popup

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const firstNameInput = document.getElementById("firstName");
    const surnameInput = document.getElementById("surname");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const rating1Input = document.getElementById("rating1");
    const rating2Input = document.getElementById("rating2");
    const rating3Input = document.getElementById("rating3");
    const submitBtn = document.getElementById("contact-submit");

    const formOutput = document.getElementById("form-output");
    const averageOutput = document.getElementById("average-output");
    const successPopup = document.getElementById("form-success-popup");

    /* ----------------------------
       SIMPLE HELPERS
       ---------------------------- */

    function setError(id, message) {
      const el = document.getElementById("error-" + id);
      const inputEl = document.getElementById(id);
      if (!el || !inputEl) return;
      el.textContent = message || "";
      if (message) {
        inputEl.classList.add("is-invalid");
      } else {
        inputEl.classList.remove("is-invalid");
      }
      updateSubmitState();
    }

    function showSuccessPopup() {
      if (!successPopup) return;
      successPopup.classList.add("show");
      setTimeout(() => {
        successPopup.classList.remove("show");
      }, 2500);
    }

    function getNumberFromInput(input) {
      const value = input.value.trim();
      if (value === "") return NaN;
      return Number(value);
    }

    /* ----------------------------
       VALIDATION RULES
       ---------------------------- */

    function validateName(input, id) {
      const value = input.value.trim();
      if (value === "") {
        setError(id, "This field is required.");
        return false;
      }
      if (!/^[A-Za-zÀ-ž\s'-]+$/.test(value)) {
        setError(id, "Only letters and spaces are allowed.");
        return false;
      }
      setError(id, "");
      return true;
    }

    function validateEmail() {
      const value = emailInput.value.trim();
      if (value === "") {
        setError("email", "Email is required.");
        return false;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setError("email", "Please enter a valid email.");
        return false;
      }
      setError("email", "");
      return true;
    }

    function maskPhone() {
      // keep digits only
      let digits = phoneInput.value.replace(/\D/g, "");

      // ensure Lithuanian prefix 3706...
      if (!digits.startsWith("3706")) {
        const tail = digits.replace(/^370|^86|^0/, "");
        digits = "3706" + tail.slice(0, 7);
      } else {
        digits = digits.slice(0, 11); // 3706 + 7 digits
      }

      const country = digits.slice(0, 3); // 370
      const first = digits.slice(3, 4);   // 6
      const mid = digits.slice(4, 6);     // xx
      const end = digits.slice(6);        // xxxxx

      let formatted = "+";
      if (country) formatted += country;
      if (first) formatted += " " + first;
      if (mid) formatted += mid;
      if (end) formatted += " " + end;

      phoneInput.value = formatted.trim();
    }

    function validatePhone() {
      const digits = phoneInput.value.replace(/\D/g, "");
      if (digits === "") {
        setError("phone", "Phone number is required.");
        return false;
      }
      if (!/^3706\d{7}$/.test(digits)) {
        setError("phone", "Format must be like +370 6xx xxxxx.");
        return false;
      }
      setError("phone", "");
      return true;
    }

    function validateAddress() {
      const value = addressInput.value.trim();
      if (value === "") {
        setError("address", "Address is required.");
        return false;
      }
      if (value.length < 5) {
        setError("address", "Address should be a bit more descriptive.");
        return false;
      }
      setError("address", "");
      return true;
    }

    function validateRating(input, id) {
      const num = getNumberFromInput(input);
      if (isNaN(num)) {
        setError(id, "Please provide a rating between 1 and 10.");
        return false;
      }
      if (num < 1 || num > 10) {
        setError(id, "Rating must be between 1 and 10.");
        return false;
      }
      setError(id, "");
      return true;
    }

    function isFormValid() {
      const results = [
        validateName(firstNameInput, "firstName"),
        validateName(surnameInput, "surname"),
        validateEmail(),
        validatePhone(),
        validateAddress(),
        validateRating(rating1Input, "rating1"),
        validateRating(rating2Input, "rating2"),
        validateRating(rating3Input, "rating3"),
      ];
      return results.every(Boolean);
    }

    function updateSubmitState() {
      if (!submitBtn) return;

      const hasValues =
        firstNameInput.value.trim() &&
        surnameInput.value.trim() &&
        emailInput.value.trim() &&
        phoneInput.value.trim() &&
        addressInput.value.trim() &&
        rating1Input.value.trim() &&
        rating2Input.value.trim() &&
        rating3Input.value.trim();

      const anyError = document.querySelector(".lab-error-message:not(:empty)");
      submitBtn.disabled = !hasValues || Boolean(anyError);
    }

    /* ----------------------------
       REAL-TIME VALIDATION HOOKS
       ---------------------------- */

    firstNameInput.addEventListener("input", () => validateName(firstNameInput, "firstName"));
    surnameInput.addEventListener("input", () => validateName(surnameInput, "surname"));
    emailInput.addEventListener("input", validateEmail);

    phoneInput.addEventListener("input", () => {
      maskPhone();
      validatePhone();
    });

    addressInput.addEventListener("input", validateAddress);
    rating1Input.addEventListener("input", () => validateRating(rating1Input, "rating1"));
    rating2Input.addEventListener("input", () => validateRating(rating2Input, "rating2"));
    rating3Input.addEventListener("input", () => validateRating(rating3Input, "rating3"));

    updateSubmitState();

    /* ----------------------------
       FORM SUBMIT HANDLER
       ---------------------------- */

    form.addEventListener("submit", function (event) {
      event.preventDefault(); // prevent page reload

      if (!isFormValid()) {
        return;
      }

      const rating1 = getNumberFromInput(rating1Input);
      const rating2 = getNumberFromInput(rating2Input);
      const rating3 = getNumberFromInput(rating3Input);

      const data = {
        name: firstNameInput.value.trim(),
        surname: surnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        rating1: rating1,
        rating2: rating2,
        rating3: rating3,
      };

      // 1) Print the object in the browser console
      console.log("Submitted contact form data:", data);

      // 2) Display same data below the form, one item per line
      if (formOutput) {
        formOutput.innerHTML = `
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Surname:</strong> ${data.surname}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Phone number:</strong> ${data.phone}</p>
          <p><strong>Address:</strong> ${data.address}</p>
          <p><strong>Service quality:</strong> ${data.rating1}</p>
          <p><strong>Communication:</strong> ${data.rating2}</p>
          <p><strong>Reliability:</strong> ${data.rating3}</p>
        `;
        formOutput.classList.remove("d-none");
      }

      // 3) Calculate and display average rating
      const average = ((rating1 + rating2 + rating3) / 3).toFixed(1);

      if (averageOutput) {
        let averageClass = "";
        const avgNumber = parseFloat(average);

        if (avgNumber < 4) {
          averageClass = "average-low";
        } else if (avgNumber < 7) {
          averageClass = "average-medium";
        } else {
          averageClass = "average-high";
        }

        averageOutput.innerHTML = `
          ${data.name} ${data.surname}: 
          <span class="${averageClass}">${average}</span>
        `;
      }

      // 4) Show success confirmation popup
      showSuccessPopup();

      // If you want to clear form after submit, uncomment below:
      // form.reset();
      // updateSubmitState();
    });
  });
})();

// assets/js/custom.js
// Contact form logic + Memory Game (with timer + best score + fixed hard deck)

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

    function setError(id, message) {
      const el = document.getElementById("error-" + id);
      const inputEl = document.getElementById(id);
      if (!el || !inputEl) return;
      el.textContent = message || "";
      if (message) inputEl.classList.add("is-invalid");
      else inputEl.classList.remove("is-invalid");
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
      let digits = phoneInput.value.replace(/\D/g, "");
      if (!digits.startsWith("3706")) {
        const tail = digits.replace(/^370|^86|^0/, "");
        digits = "3706" + tail.slice(0, 7);
      } else {
        digits = digits.slice(0, 11);
      }

      const country = digits.slice(0, 3);
      const first = digits.slice(3, 4);
      const mid = digits.slice(4, 6);
      const end = digits.slice(6);

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

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!isFormValid()) return;

      const rating1 = getNumberFromInput(rating1Input);
      const rating2 = getNumberFromInput(rating2Input);
      const rating3 = getNumberFromInput(rating3Input);

      const data = {
        name: firstNameInput.value.trim(),
        surname: surnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        rating1,
        rating2,
        rating3,
      };

      console.log("Submitted contact form data:", data);

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

      const average = ((rating1 + rating2 + rating3) / 3).toFixed(1);
      if (averageOutput) {
        const avgNumber = parseFloat(average);
        const averageClass =
          avgNumber < 4 ? "average-low" : avgNumber < 7 ? "average-medium" : "average-high";

        averageOutput.innerHTML = `
          ${data.name} ${data.surname}: 
          <span class="${averageClass}">${average}</span>
        `;
      }

      showSuccessPopup();
    });
  });
})();

/* =======================================
   MEMORY GAME – FIXED HARD MODE (24 cards)
   + TIMER + BEST SCORE (localStorage)
   ======================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const boardEl = document.getElementById("mg-board");
    const movesEl = document.getElementById("mg-moves");
    const matchesEl = document.getElementById("mg-matches");
    const messageEl = document.getElementById("mg-message");
    const diffEl = document.getElementById("mg-difficulty");
    const startBtn = document.getElementById("mg-start");
    const restartBtn = document.getElementById("mg-restart");

    const timerEl = document.getElementById("mg-timer");
    const bestEasyEl = document.getElementById("mg-best-easy");
    const bestHardEl = document.getElementById("mg-best-hard");

    if (!boardEl || !movesEl || !matchesEl || !messageEl || !diffEl || !startBtn || !restartBtn || !timerEl || !bestEasyEl || !bestHardEl) {
      return;
    }

    // ✅ MUST HAVE AT LEAST 12 UNIQUE ICONS FOR HARD (12 pairs)
    const MG_ICONS = [
      "🍎","🚗","🐶","⚽","🎧","📚","🌟","🍕","🎲","🚀","🎯","🧩","🎸","🛠️"
    ];

    const BEST_SCORES_KEY = "memoryGameBestScores";

    let mgDifficulty = diffEl.value || "easy"; // ✅ read from dropdown
    let mgDeck = [];
    let mgFirstCard = null;
    let mgSecondCard = null;
    let mgLockBoard = false;
    let mgMoves = 0;
    let mgMatches = 0;
    let mgTotalPairs = 0;
    let mgGameStarted = false;

    let mgTimerInterval = null;
    let mgElapsedSeconds = 0;

    let mgBestScores = { easy: null, hard: null };

    function loadBestScores() {
      try {
        const stored = localStorage.getItem(BEST_SCORES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") {
            mgBestScores.easy = typeof parsed.easy === "number" ? parsed.easy : null;
            mgBestScores.hard = typeof parsed.hard === "number" ? parsed.hard : null;
          }
        }
      } catch (e) {}
      updateBestScoresUI();
    }

    function saveBestScores() {
      try {
        localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(mgBestScores));
      } catch (e) {}
    }

    function updateBestScoresUI() {
      bestEasyEl.textContent = mgBestScores.easy !== null ? mgBestScores.easy : "–";
      bestHardEl.textContent = mgBestScores.hard !== null ? mgBestScores.hard : "–";
    }

    function maybeUpdateBestScore() {
      const currentBest = mgBestScores[mgDifficulty];
      if (currentBest === null || mgMoves < currentBest) {
        mgBestScores[mgDifficulty] = mgMoves;
        saveBestScores();
        updateBestScoresUI();
      }
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function updateTimerUI() {
      timerEl.textContent = formatTime(mgElapsedSeconds);
    }

    function startTimer() {
      stopTimer();
      mgElapsedSeconds = 0;
      updateTimerUI();
      mgTimerInterval = setInterval(() => {
        mgElapsedSeconds += 1;
        updateTimerUI();
      }, 1000);
    }

    function stopTimer() {
      if (mgTimerInterval) {
        clearInterval(mgTimerInterval);
        mgTimerInterval = null;
      }
    }

    function resetTimer() {
      stopTimer();
      mgElapsedSeconds = 0;
      updateTimerUI();
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function createDeck() {
      const pairCount = mgDifficulty === "easy" ? 6 : 12;
      const chosenIcons = MG_ICONS.slice(0, pairCount);

      mgTotalPairs = pairCount;

      const cards = [];
      chosenIcons.forEach((icon, index) => {
        cards.push(
          { id: `${index}-a`, icon, pairId: index },
          { id: `${index}-b`, icon, pairId: index }
        );
      });

      mgDeck = shuffleArray(cards);
    }

    function renderBoard() {
      boardEl.innerHTML = "";
      boardEl.classList.remove("easy", "hard");
      boardEl.classList.add(mgDifficulty);

      mgDeck.forEach((card) => {
        const cardEl = document.createElement("div");
        cardEl.className = "mg-card";
        cardEl.dataset.pairId = String(card.pairId);

        cardEl.innerHTML = `
          <div class="mg-card-inner">
            <div class="mg-card-face mg-card-front"></div>
            <div class="mg-card-face mg-card-back">${card.icon}</div>
          </div>
        `;

        cardEl.addEventListener("click", () => handleCardClick(cardEl));
        boardEl.appendChild(cardEl);
      });
    }

    function updateStatsUI() {
      movesEl.textContent = String(mgMoves);
      matchesEl.textContent = `${mgMatches} / ${mgTotalPairs}`;
    }

    function resetStats() {
      mgMoves = 0;
      mgMatches = 0;
      mgFirstCard = null;
      mgSecondCard = null;
      mgLockBoard = false;
      mgGameStarted = false;
      messageEl.textContent = "";
      updateStatsUI();
    }

    function startGame() {
      resetStats();
      resetTimer();

      mgDifficulty = diffEl.value || "easy"; // ✅ always read current difficulty
      createDeck();                           // ✅ sets mgTotalPairs correctly (6 or 12)
      updateStatsUI();                        // ✅ updates 0/12 for hard
      renderBoard();

      mgGameStarted = true;
      restartBtn.disabled = false;
      startTimer();
    }

    function handleCardClick(cardEl) {
      if (!mgGameStarted) return;
      if (mgLockBoard) return;
      if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;

      cardEl.classList.add("flipped");

      if (!mgFirstCard) {
        mgFirstCard = cardEl;
        return;
      }

      mgSecondCard = cardEl;
      mgLockBoard = true;

      mgMoves += 1;
      updateStatsUI();
      checkForMatch();
    }

    function checkForMatch() {
      const a = mgFirstCard.dataset.pairId;
      const b = mgSecondCard.dataset.pairId;

      if (a === b) {
        mgFirstCard.classList.add("matched");
        mgSecondCard.classList.add("matched");
        mgMatches += 1;
        updateStatsUI();
        resetTurn();

        if (mgMatches === mgTotalPairs) {
          stopTimer();
          messageEl.textContent = `You won! Completed in ${mgMoves} moves in ${formatTime(mgElapsedSeconds)}. 🎉`;
          maybeUpdateBestScore();
        }
      } else {
        setTimeout(() => {
          mgFirstCard.classList.remove("flipped");
          mgSecondCard.classList.remove("flipped");
          resetTurn();
        }, 1000);
      }
    }

    function resetTurn() {
      mgFirstCard = null;
      mgSecondCard = null;
      mgLockBoard = false;
    }

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", startGame);

    diffEl.addEventListener("change", function () {
      startGame();
    });

    // init
    resetTimer();
    loadBestScores();
    updateStatsUI();
  });
})();

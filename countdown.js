function countdownTimer() {
  const targetDateElement = document.querySelector(".countdown_date");

  if (!targetDateElement) return;

  const targetDate = new Date(targetDateElement.textContent.trim());

  // Get countdown elements
  const daysElement = document.querySelector('[data-countdown="days"]');
  const hoursElement = document.querySelector('[data-countdown="hours"]');
  const minutesElement = document.querySelector('[data-countdown="minutes"]');
  const secondsElement = document.querySelector('[data-countdown="seconds"]');

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
    return;
  }

  function updateDisplay(element, value, allowThreeDigits = false) {
    const valueStr = value.toString();
    const spans = element.querySelectorAll(".countdown_span");

    if (allowThreeDigits && valueStr.length === 3 && spans.length >= 3) {
      // Show three-digit span
      const threeDigitSpan = element.querySelector(
        '[data-countdown="three-digit"]'
      );
      if (threeDigitSpan) {
        threeDigitSpan.style.display = "flex";
      }

      spans[0].textContent = valueStr[0];
      spans[1].textContent = valueStr[1];
      spans[2].textContent = valueStr[2];
    } else {
      // Hide three-digit span
      const threeDigitSpan = element.querySelector(
        '[data-countdown="three-digit"]'
      );
      if (threeDigitSpan) {
        threeDigitSpan.style.display = "none";
      }

      const formattedValue = valueStr.padStart(2, "0");
      // Skip the first span (three-digit) and use spans[1] and spans[2] for two-digit display
      if (spans.length >= 3) {
        spans[1].textContent = formattedValue[0];
        spans[2].textContent = formattedValue[1];
      } else if (spans.length >= 2) {
        // Fallback for elements without three-digit span (hours, minutes, seconds)
        spans[0].textContent = formattedValue[0];
        spans[1].textContent = formattedValue[1];
      }
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      updateDisplay(daysElement, 0, true);
      updateDisplay(hoursElement, 0);
      updateDisplay(minutesElement, 0);
      updateDisplay(secondsElement, 0);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateDisplay(daysElement, days, true);
    updateDisplay(hoursElement, hours);
    updateDisplay(minutesElement, minutes);
    updateDisplay(secondsElement, seconds);
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  countdownTimer();
});
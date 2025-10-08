function mmmCounter() {
  const totalElement = document.querySelector('[data-counter="total"]');
  const visibleElement = document.querySelector('[data-counter="visible"]');

  if (!totalElement || !visibleElement) {
    return;
  }

  const targetNumber = parseInt(totalElement.textContent.replace(/,/g, ""));

  if (isNaN(targetNumber)) {
    console.error("Invalid counter number:", totalElement.textContent);
    return;
  }

  // Calculate starting number
  const startingNumber = Math.max(0, targetNumber - 800);

  function updateCounterDisplay(number) {
    const paddedNumber = number.toString().padStart(6, "0");
    const formattedNumber =
      paddedNumber.slice(0, 3) + "," + paddedNumber.slice(3);

    const spans = visibleElement.querySelectorAll(".countdown_span");
    const separators = visibleElement.querySelectorAll(".countdown_separator");

    spans.forEach((span) => (span.textContent = ""));
    separators.forEach((sep) => (sep.style.display = "none"));

    const chars = formattedNumber.split("");
    let spanIndex = 0;
    let separatorIndex = 0;

    chars.forEach((char) => {
      if (char === ",") {
        if (separators[separatorIndex]) {
          separators[separatorIndex].style.display = "block";
          separatorIndex++;
        }
      } else {
        if (spans[spanIndex]) {
          spans[spanIndex].textContent = char;
          spanIndex++;
        }
      }
    });
  }

  updateCounterDisplay(startingNumber);

  const counter = { value: startingNumber };

  // Calculate duration based on range and desired speed
  const range = targetNumber - startingNumber;
  const momentsPerSecond = 1.5;
  const duration = range / momentsPerSecond;

  gsap.to(counter, {
    value: targetNumber,
    duration: duration,
    ease: "none",
    scrollTrigger: {
      trigger: visibleElement,
      start: "top bottom",
      toggleActions: "play none none none",
    },
    onUpdate: function () {
      const currentValue = Math.floor(counter.value);
      updateCounterDisplay(currentValue);
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  mmmCounter();
});
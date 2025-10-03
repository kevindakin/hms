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

  // Calculate starting number (50k less than target, but not below 0)
  const startingNumber = Math.max(0, targetNumber - 50000);

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

  gsap.to(counter, {
    value: targetNumber,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: visibleElement,
      start: "top bottom",
      toggleActions: "play none none reset",
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

function matterportModal() {
  const modal = document.querySelector('[data-matterport="modal"]');
  const openTriggers = document.querySelectorAll('[data-matterport="open"]');
  const closeTriggers = document.querySelectorAll('[data-matterport="close"]');
  let focusableElements = [];
  let lastActiveElement = null;
  let tabTrapListener = null;

  if (!modal) return;

  // Move modal to end of body to escape component constraints
  document.body.appendChild(modal);

  // Set initial modal attributes
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("tabindex", "-1");

  function openModal() {
    lastActiveElement = document.activeElement;

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Force reflow then add class for transition
    modal.offsetHeight;
    modal.classList.add("is-open");

    setupFocusTrap();
    modal.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Wait for transition to complete before hiding
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);

    if (lastActiveElement) {
      lastActiveElement.focus();
    }

    removeFocusTrap();
  }

  function setupFocusTrap() {
    focusableElements = modal.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, iframe, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    tabTrapListener = function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    modal.addEventListener("keydown", tabTrapListener);
  }

  function removeFocusTrap() {
    if (tabTrapListener) {
      modal.removeEventListener("keydown", tabTrapListener);
    }
  }

  // Event listeners
  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  matterportModal();
});

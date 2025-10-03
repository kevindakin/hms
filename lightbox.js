function modularLightbox() {
  const openTriggers = document.querySelectorAll("[data-lightbox-open]");

  if (openTriggers.length === 0) return;

  openTriggers.forEach((trigger) => {
    const lightboxId = trigger.getAttribute("data-lightbox-open");
    const modal = document.querySelector(
      `[data-lightbox-modal="${lightboxId}"]`
    );

    if (!modal) {
      return;
    }

    const closeTriggers = modal.querySelectorAll("[data-lightbox-close]");
    let focusableElements = [];
    let lastActiveElement = null;
    let tabTrapListener = null;

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

      // Pause all videos in the modal
      const videos = modal.querySelectorAll("video");
      videos.forEach((video) => {
        video.pause();
      });

      // Pause all iframes (YouTube, Vimeo, etc.)
      const iframes = modal.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        const src = iframe.src;
        iframe.src = src; // Reload iframe to stop video
      });

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

    // Open trigger events
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

    // Close trigger events
    closeTriggers.forEach((closeTrigger) => {
      closeTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  modularLightbox();
});

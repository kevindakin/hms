function galleryLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox="trigger"]');
  const lightbox = document.querySelector('[data-lightbox="modal"]');
  const closeButtons = document.querySelectorAll('[data-lightbox="close"]');
  const swiperEl = document.querySelector(".gallery_lightbox_cms.swiper");

  // Exit early if any required elements don't exist
  if (!lightbox || !swiperEl || triggers.length === 0) return;

  // Initialize Swiper
  const lightboxSwiper = new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 600,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    keyboard: {
      enabled: false,
      onlyInViewport: false,
    },
    navigation: {
      nextEl: ".gallery_lightbox_button.swiper-next",
      prevEl: ".gallery_lightbox_button.swiper-prev",
    },
  });

  let previouslyFocusedElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  function trapFocus(e) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }

  function openLightbox(index) {
    previouslyFocusedElement = document.activeElement;

    lightbox.style.display = "flex";
    lightbox.offsetHeight;
    lightbox.classList.add("is-open");

    lightboxSwiper.slideToLoop(index, 0);

    lightboxSwiper.keyboard.enable();

    if (typeof disableScrolling === "function") {
      disableScrolling();
    }

    focusableElements = lightbox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", trapFocus);
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");

    lightboxSwiper.keyboard.disable();

    setTimeout(() => {
      lightbox.style.display = "none";
    }, 300);

    if (typeof enableScrolling === "function") {
      enableScrolling();
    }

    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keydown", trapFocus);

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeLightbox();
    }
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openLightbox(index));
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeLightbox);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  galleryLightbox();
});
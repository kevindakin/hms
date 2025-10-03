function sliders() {
  const gallerySwiper = new Swiper(".gallery_slider_cms.swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 200,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".gallery_slider_button.swiper-next",
      prevEl: ".gallery_slider_button.swiper-prev",
    },
    pagination: {
      el: ".gallery_slider_pagination",
      type: "bullets",
      bulletClass: "pagination_bullet swiper-pagination-bullet",
      bulletActiveClass:
        "pagination_bullet swiper-pagination-bullet swiper-pagination-bullet-active",
      clickable: false,
      renderBullet: function (index, className) {
        return (
          '<span class="pagination_bullet swiper-pagination-bullet' +
          (className.includes("active")
            ? " swiper-pagination-bullet-active"
            : "") +
          '"></span>'
        );
      },
    },
  });

  function updateBulletClasses() {
    const bullets = document.querySelectorAll(
      ".gallery_slider_pagination span"
    );
    bullets.forEach((bullet) => {
      if (!bullet.classList.contains("pagination_bullet")) {
        bullet.classList.add("pagination_bullet", "swiper-pagination-bullet");
      }
    });
  }

  updateBulletClasses();
  gallerySwiper.on("slideChange", updateBulletClasses);

  const lightboxSwiper = new Swiper(".gallery_lightbox_cms.swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 200,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    keyboard: {
      enabled: false, // Start disabled
      onlyInViewport: false,
    },
    navigation: {
      nextEl: ".gallery_lightbox_button.swiper-next",
      prevEl: ".gallery_lightbox_button.swiper-prev",
    },
  });

  return { lightboxSwiper };
}

function galleryLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox="trigger"]');
  const lightbox = document.querySelector('[data-lightbox="modal"]');
  const closeButtons = document.querySelectorAll('[data-lightbox="close"]');

  if (!lightbox) return;

  const { lightboxSwiper } = sliders();

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

    // Enable keyboard navigation
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

    // Disable keyboard navigation
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

function filterDropdowns() {
  const wrap = document.querySelector(".filters_wrap");
  const dropdowns = document.querySelectorAll(".filter_wrap");
  const triggers = document.querySelectorAll(".filter_trigger");
  const optionsLists = document.querySelectorAll(".filter_options");
  const icons = document.querySelectorAll(".filter_icon");

  if (!wrap || dropdowns.length === 0) {
    return;
  }

  let currentOpenDropdown = null;

  function updateFilterVisualState(dropdown) {
    const selectedOption = dropdown.querySelector(
      'input[type="radio"]:checked'
    );

    if (selectedOption && selectedOption.value !== "") {
      dropdown.classList.add("is-filtered");
    } else {
      dropdown.classList.remove("is-filtered");
    }
  }

  function openDropdown(dropdown, options, icon) {
    if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
      closeDropdown(currentOpenDropdown);
    }

    gsap.set(options, { display: "block" });

    gsap.to(options, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(icon, {
      rotation: 180,
      duration: 0.4,
      ease: "power4.out",
    });

    currentOpenDropdown = dropdown;
    dropdown.classList.add("is-open");
  }

  function closeDropdown(dropdown) {
    const options = dropdown.querySelector(".filter_options");
    const icon = dropdown.querySelector(".filter_icon");

    gsap.to(options, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(options, { display: "none" });
      },
    });

    gsap.to(icon, {
      rotation: 0,
      duration: 0.4,
      ease: "power4.out",
    });

    if (currentOpenDropdown === dropdown) {
      currentOpenDropdown = null;
    }
    dropdown.classList.remove("is-open");
  }

  function closeAllDropdowns() {
    dropdowns.forEach((dropdown) => {
      if (dropdown.classList.contains("is-open")) {
        closeDropdown(dropdown);
      }
    });
  }

  dropdowns.forEach((dropdown) => {
    updateFilterVisualState(dropdown);
  });

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      const dropdown = dropdowns[index];
      const options = optionsLists[index];
      const icon = icons[index];

      if (dropdown.classList.contains("is-open")) {
        closeDropdown(dropdown);
      } else {
        openDropdown(dropdown, options, icon);
      }
    });
  });

  dropdowns.forEach((dropdown) => {
    const radioButtons = dropdown.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", () => {
        updateFilterVisualState(dropdown);
      });
    });
  });

  document.addEventListener("click", (e) => {
    let clickedInsideDropdown = false;

    dropdowns.forEach((dropdown) => {
      if (dropdown.contains(e.target)) {
        clickedInsideDropdown = true;
      }
    });

    if (!clickedInsideDropdown) {
      closeAllDropdowns();
    }
  });

  optionsLists.forEach((options) => {
    options.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });
}

function filterTags() {
  const tagContainer = document.getElementById("custom-tags-container");
  const tagTemplate = document.getElementById("tag-template");

  function createTag(field, value) {
    const tag = tagTemplate.cloneNode(true);
    tag.removeAttribute("id");
    tag.style.display = "flex";
    tag.setAttribute("data-field", field);
    tag.setAttribute("data-value", value);
    tag.classList.add("filters_tag_wrap");

    tag.querySelector(".filters_tag_field").textContent = field;
    tag.querySelector(".filters_tag_operator").textContent = ":";
    tag.querySelector(".tag_main_text.is-filter-tag").textContent = value;

    tag.querySelector(".tag_main_remove").addEventListener("click", () => {
      const checkbox = document.querySelector(
        `input[fs-list-field="${field}"][fs-list-value="${value}"]`
      );
      if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event("input", { bubbles: true }));
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));

        setTimeout(() => {
          if (window.fsAttributes && window.fsAttributes["list"]) {
            window.fsAttributes["list"].refresh();
          }
        }, 10);

        tag.remove();
      }
    });

    tagContainer.appendChild(tag);
    return tag;
  }

  function handleCheckboxChange(checkbox) {
    const field = checkbox.getAttribute("fs-list-field");
    const value = checkbox.getAttribute("fs-list-value");
    const selector = `[data-field="${field}"][data-value="${value}"]`;
    const existingTag = tagContainer.querySelector(selector);

    if (checkbox.checked) {
      if (!existingTag) {
        createTag(field, value);
      }
    } else {
      if (existingTag) {
        existingTag.remove();
      }

      // Force refresh Finsweet's filter when unchecking
      setTimeout(() => {
        if (window.fsAttributes && window.fsAttributes["list"]) {
          window.fsAttributes["list"].refresh();
        }
      }, 10);
    }
  }

  document.addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"][fs-list-value]')) {
      handleCheckboxChange(e.target);
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll('input[type="checkbox"][fs-list-value]:checked')
      .forEach(handleCheckboxChange);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  sliders();
  galleryLightbox();
  filterDropdowns();
  filterTags();
});

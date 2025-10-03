function splitGallery() {
  const swiperWrapper = document.querySelector(
    ".gallery-slider_cms.swiper .swiper-wrapper"
  );

  if (!swiperWrapper) return;

  const slides = Array.from(swiperWrapper.children).filter((child) =>
    child.classList.contains("swiper-slide")
  );

  if (slides.length === 0) {
    return;
  }

  for (let i = slides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slides[i], slides[j]] = [slides[j], slides[i]];
  }

  const slidesToKeep = slides.slice(0, Math.min(10, slides.length));
  const slidesToRemove = slides.slice(10);

  slidesToRemove.forEach((slide) => slide.remove());

  slidesToKeep.forEach((slide) => {
    swiperWrapper.appendChild(slide);
  });

  const gallerySwiper = new Swiper(".gallery-slider_cms.swiper", {
    effect: "cards",
    cardsEffect: {
      perSlideOffset: 6,
      perSlideRotate: 1.5,
      slideShadows: false,
    },
    grabCursor: true,
    loop: true,
    speed: 400,

    navigation: {
      nextEl: ".split-gallery_arrow.swiper-next",
      prevEl: ".split-gallery_arrow.swiper-prev",
    },

    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  splitGallery();
});

function benefitsScroller() {
  const wrap = document.querySelector(".benefits_wrap");
  const videos = wrap.querySelectorAll(".benefits_video-wrap");
  const texts = wrap.querySelectorAll(".step-item_wrap");

  if (!wrap || !videos.length || !texts.length) {
    return;
  }

  const videoArray = Array.from(videos);
  const textArray = Array.from(texts);

  function getVideoIndex(textIndex) {
    return videoArray.length - 1 - textIndex;
  }

  function setInitialState() {
    textArray.forEach((textItem, index) => {
      if (index !== 0) {
        textItem.classList.add("is-inactive");
      }
    });

    videoArray.forEach((videoItem, index) => {
      const correspondingTextIndex = videoArray.length - 1 - index;
      if (correspondingTextIndex !== 0) {
        videoItem.classList.add("is-inactive");
      }
    });
  }

  function updateState() {
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * 0.8;

    let activeTextIndex = -1;

    textArray.forEach((textItem, index) => {
      const rect = textItem.getBoundingClientRect();

      if (rect.top <= triggerPoint && rect.bottom > 0) {
        activeTextIndex = index;
      }
    });

    if (activeTextIndex === -1) {
      activeTextIndex = 0;
    }

    textArray.forEach((textItem, index) => {
      if (index === activeTextIndex) {
        textItem.classList.remove("is-inactive");
      } else {
        textItem.classList.add("is-inactive");
      }
    });

    videoArray.forEach((videoItem, index) => {
      const correspondingTextIndex = getVideoIndex(index);

      if (correspondingTextIndex === activeTextIndex) {
        videoItem.classList.remove("is-inactive");
      } else {
        videoItem.classList.add("is-inactive");
      }
    });
  }

  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  setInitialState();

  const throttledUpdate = throttle(updateState, 16);
  window.addEventListener("scroll", throttledUpdate);

  window.addEventListener("resize", throttle(updateState, 100));

  return function cleanup() {
    window.removeEventListener("scroll", throttledUpdate);
    window.removeEventListener("resize", updateState);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  gsap.matchMedia().add("(min-width: 768px)", () => {
    benefitsScroller();
  });
});

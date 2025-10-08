function videoReviews() {
  const wrap = document.querySelector(".split_wrap.is-videos");
  if (!wrap) return;

  const el = wrap.querySelector(".reviews_videos_cms.swiper");
  const arrowNext = wrap.querySelector(".split-gallery_arrow.swiper-next");
  const arrowPrev = wrap.querySelector(".split-gallery_arrow.swiper-prev");

  let players = [];
  let hasStarted = false;

  // Detect touch device
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Init Swiper
  const videoSwiper = new Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 200,
    effect: "fade",
    fadeEffect: { crossFade: true },
    grabCursor: false,
    allowTouchMove: false, // Disable swipe/drag entirely
    watchOverflow: true,
    navigation: {
      nextEl: arrowNext,
      prevEl: arrowPrev,
    },
    on: {
      transitionStart: function () {
        // Stop all players immediately when transition starts
        players.forEach((player) => {
          if (!player.destroyed) player.pause();
        });
      },
      slideChangeTransitionEnd: function () {
        // Autoplay video after transition completes (after first video has been played)
        if (hasStarted && !isTouchDevice) {
          const nextIndex = videoSwiper.realIndex;
          const nextPlayer = players[nextIndex];

          if (nextPlayer && !nextPlayer.destroyed) {
            nextPlayer.play();
          }
        }
      },
    },
  });

  // Init Plyr players
  el.querySelectorAll(".reviews_videos_player").forEach((element, index) => {
    const playerId = `reviews-player-${index}`;
    element.id = playerId;

    const player = new Plyr(`#${playerId}`, {
      controls: ["play-large"],
      youtube: {
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        controls: 0,
        playsinline: 1,
      },
      hideControls: false,
      clickToPlay: true,
      playsinline: true,
      resetOnEnd: true,
      ratio: "9:16",
    });

    players[index] = player;

    // Detect first manual play
    player.on("play", () => {
      if (!hasStarted) hasStarted = true;
    });

    // When video ends
    player.on("ended", () => {
      if (!hasStarted || isTouchDevice) return;

      // Go to next slide
      videoSwiper.slideNext();
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  videoReviews();
});
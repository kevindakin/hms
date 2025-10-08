function videoReviews() {
  const wrap = document.querySelector(".split_wrap.is-videos");
  if (!wrap) return;

  const el = wrap.querySelector(".reviews_videos_cms.swiper");
  const arrowNext = wrap.querySelector(".split-gallery_arrow.swiper-next");
  const arrowPrev = wrap.querySelector(".split-gallery_arrow.swiper-prev");

  let players = [];
  let hasStarted = false;

  // Init Swiper
  const videoSwiper = new Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 200,
    effect: "fade",
    fadeEffect: { crossFade: true },
    grabCursor: false,
    watchOverflow: true,
    navigation: {
      nextEl: arrowNext,
      prevEl: arrowPrev,
    },
    on: {
      slideChange: function () {
        // Stop all players when slide changes
        players.forEach((player) => {
          if (!player.destroyed) player.stop();
        });
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
    });

    players[index] = player;

    // Detect first manual play
    player.on("play", () => {
      if (!hasStarted) hasStarted = true;
    });

    // When video ends
    player.on("ended", () => {
      if (!hasStarted) return; // Don't autoplay if first video hasn't been manually played

      // Go to next slide
      videoSwiper.slideNext();

      // Wait for Swiper transition to complete, then autoplay next video
      const nextIndex = videoSwiper.realIndex;
      const nextPlayer = players[nextIndex];

      setTimeout(() => {
        if (nextPlayer) nextPlayer.play();
      }, 250);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  videoReviews();
});
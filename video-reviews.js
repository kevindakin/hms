function videoReviews() {
  const wrap = document.querySelector(".split_wrap.is-videos");

  if (!wrap) return;

  const el = wrap.querySelector(".reviews_videos_cms.swiper");
  const arrowNext = wrap.querySelector(".split-gallery_arrow.swiper-next");
  const arrowPrev = wrap.querySelector(".split-gallery_arrow.swiper-prev");

  let players = [];

  // Initialize all Plyr instances
  el.querySelectorAll(".reviews_videos_player").forEach((element, index) => {
    const playerId = `reviews-player-${index}`;
    element.id = playerId;

    players[index] = new Plyr(`#${playerId}`, {
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
  });

  const videoSwiper = new Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 200,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    grabCursor: false,
    watchOverflow: true,

    navigation: {
      nextEl: arrowNext,
      prevEl: arrowPrev,
    },

    on: {
      slideChange: function () {
        players.forEach((player, index) => {
          player.stop();
        });
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  videoReviews();
});

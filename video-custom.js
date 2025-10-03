function standardVideo() {
  const wrap = document.querySelector(".video_player_wrap");

  if (!wrap) return;

  const playerElement = wrap.querySelector(".video_custom_item");

  if (!playerElement) return;

  const playerId = "standard-video-player";
  playerElement.id = playerId;

  const player = new Plyr(`#${playerId}`, {
    controls: ["play-large"],
    youtube: {
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
    },
    hideControls: false,
    clickToPlay: true,
    resetOnEnd: true,
  });

  // Pause video when it leaves viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && player.playing) {
          player.pause();
        }
      });
    },
    {
      threshold: 0.5, // Video pauses when less than 50% visible
    }
  );

  observer.observe(wrap);
}

document.addEventListener("DOMContentLoaded", function () {
  standardVideo();
});

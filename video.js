function lazyLoad() {
  document.querySelectorAll("video").forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("preload", "none");
  });

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll('[data-load="lazy"]').forEach((video) => {
      loadVideo(video);
    });
    return;
  }

  const videoObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          loadVideo(video);
          observer.unobserve(video);
        }
      });
    },
    {
      rootMargin: "500px 0px",
      threshold: 0.1,
    }
  );

  document.querySelectorAll('[data-load="lazy"]').forEach((video) => {
    videoObserver.observe(video);
  });
}

function loadVideo(video) {
  const sources = video.querySelectorAll("source");

  sources.forEach((source) => {
    if (source.dataset.src) {
      source.src = source.dataset.src;
    }
  });

  if (video.dataset.src) {
    video.src = video.dataset.src;
  }

  video.load();

  video.play().catch((error) => {
    console.log("Video autoplay failed:", error);
  });

  video.classList.add("loaded");
}

document.addEventListener("DOMContentLoaded", function () {
  lazyLoad();
});

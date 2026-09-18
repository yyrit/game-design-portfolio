(function () {
  "use strict";

  const media = window.PORTFOLIO_MEDIA || {};

  Object.entries(media).forEach(([key, config]) => {
    const video = document.getElementById(config.elementId);
    const frame = document.getElementById(config.frameId);
    const error = document.querySelector(`[data-error-for="${key}"]`);
    const duration = document.querySelector(`[data-duration-for="${key}"]`);
    const bvid = String(config.bvid || "").trim();

    if (config.provider === "bilibili" && frame && /^BV[0-9A-Za-z]+$/.test(bvid)) {
      const page = Number.isInteger(config.page) && config.page > 0 ? config.page : 1;
      const params = new URLSearchParams({
        bvid,
        p: String(page),
        autoplay: "0",
        danmaku: "0",
        poster: "1"
      });

      frame.src = `https://player.bilibili.com/player.html?${params.toString()}`;
      frame.hidden = false;

      if (video) {
        video.hidden = true;
        video.removeAttribute("src");
        video.load();
      }
      return;
    }

    if (!video) return;

    const source = String(config.fallbackSrc || "").trim();
    if (!source) {
      if (error) error.hidden = false;
      return;
    }

    video.hidden = false;
    video.src = source;
    if (bvid && error) error.hidden = false;
    video.addEventListener("loadedmetadata", () => {
      if (!duration || !Number.isFinite(video.duration)) return;
      const minutes = Math.floor(video.duration / 60);
      const seconds = Math.floor(video.duration % 60);
      duration.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    });
    video.addEventListener("error", () => {
      if (error) error.hidden = false;
    });
  });

})();

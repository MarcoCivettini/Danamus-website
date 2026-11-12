/**
 * Progressive motion layer. Runs only in browsers; content is already
 * visible without it (see global.css).
 */
const html = document.documentElement;
const motionOk = () => html.classList.contains("motion-ok");

// Reveal each [data-reveal] once when it enters the viewport.
const revealer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-visible");
      revealer.unobserve(e.target);
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll("[data-reveal]").forEach((el) => revealer.observe(el));
(window as unknown as { __motionReady: boolean }).__motionReady = true;

// Clips: load near the viewport, autoplay muted only when motion is allowed.
const clips = document.querySelectorAll<HTMLElement>("[data-clip]");
const loadClip = (video: HTMLVideoElement) => {
  if (!video.src && video.dataset.src) video.src = video.dataset.src;
};
const nearObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const video = e.target.querySelector("video");
      if (video && motionOk()) loadClip(video);
      nearObserver.unobserve(e.target);
    }
  },
  { rootMargin: "600px 0px" },
);
const playObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const video = e.target.querySelector("video");
      if (!video) continue;
      if (e.isIntersecting && motionOk()) {
        loadClip(video);
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  },
  { threshold: 0.4 },
);
clips.forEach((clip) => {
  const video = clip.querySelector("video")!;
  const button = clip.querySelector<HTMLButtonElement>("[data-clip-play]")!;
  if (motionOk()) {
    nearObserver.observe(clip);
    playObserver.observe(clip);
  } else {
    // Reduced motion: poster only, play on explicit request.
    button.hidden = false;
    button.addEventListener("click", () => {
      loadClip(video);
      video.loop = false;
      video.controls = true;
      button.hidden = true;
      void video.play().catch(() => {});
    });
  }
});

// Sticky walkthrough: mark the step whose text crosses the viewport centre.
document.querySelectorAll<HTMLElement>("[data-walkthrough]").forEach((root) => {
  const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
  const setActive = (index: string) => {
    root.dataset.active = index;
    steps.forEach((s) => s.toggleAttribute("data-current", s.dataset.step === index));
  };
  const stepObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.step!);
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  steps.forEach((s) => stepObserver.observe(s));
  setActive("0");
});

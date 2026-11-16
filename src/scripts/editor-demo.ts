/**
 * Hero editor demo (spec: hero-editor-demo). Read-only: play/pause, seek bar,
 * draggable timeline with a fixed playhead, keyboard slider. The video is only
 * requested after the page has loaded; with motion allowed it autoplays muted
 * while the hero is in view, and never resumes on its own after a manual pause.
 */
type Segment = { start: number; end: number };

const MOTION = window.matchMedia("(prefers-reduced-motion: no-preference)");

function setup(root: HTMLElement) {
  const length = Number(root.dataset.length);
  const segments: Segment[] = JSON.parse(root.dataset.segments!);
  const video = root.querySelector<HTMLVideoElement>("[data-ed-video]")!;
  const box = video.parentElement!;
  const play = root.querySelector<HTMLButtonElement>("[data-ed-play]")!;
  const clock = root.querySelector<HTMLElement>("[data-ed-clock]")!;
  const precise = root.querySelector<HTMLElement>("[data-ed-precise]")!;
  const segLabel = root.querySelector<HTMLElement>("[data-ed-segment]")!;
  const timeline = root.querySelector<HTMLElement>("[data-ed-timeline]")!;
  const seek = root.querySelector<HTMLElement>("[data-ed-seek]")!;
  const segEls = [...root.querySelectorAll<HTMLElement>("[data-ed-seg]")];

  let t = Number(getComputedStyle(root).getPropertyValue("--t")) || 0;
  let userPaused = false;
  let inView = false;
  let attached = false;
  let loaded = false; // the page has loaded: the video may be requested
  let current = -2;
  let raf = 0;

  const clamp = (v: number) => Math.min(Math.max(v, 0), length - 0.05);
  const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const fine = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
  const pxPerSecond = () => parseFloat(getComputedStyle(root).fontSize) * 0.8;
  const segmentAt = (s: number) => segments.findIndex((g) => s >= g.start && s < g.end);
  const label = (i: number) => (i >= 0 ? `Segmento ${i + 1} di ${segments.length}` : "Pausa");

  function render(announce = false) {
    root.style.setProperty("--t", t.toFixed(3));
    clock.textContent = mmss(t);
    precise.textContent = fine(t);
    const i = segmentAt(t);
    if (i !== current) {
      segEls[current]?.classList.remove("is-current");
      segEls[i]?.classList.add("is-current");
      segLabel.textContent = label(i);
      current = i;
    }
    if (announce || video.paused) {
      timeline.setAttribute("aria-valuenow", String(Math.round(t)));
      timeline.setAttribute("aria-valuetext", `${mmss(t)} di ${mmss(length)}, ${label(i).toLowerCase()}`);
    }
  }

  // Playback shows only the valid segments: at the end of one (or from a
  // pause) it jumps to the start of the next, after the last back to the first.
  const EDGE = 0.04;
  const nextStart = (s: number) => (segments.find((g) => g.start > s + EDGE - 0.001) ?? segments[0]).start;
  const skipPauses = () => {
    if (video.seeking) return;
    const now = video.currentTime;
    const i = segmentAt(now);
    if (i >= 0 && now < segments[i].end - EDGE) return;
    t = nextStart(i >= 0 ? segments[i].end : now);
    video.currentTime = t;
  };

  const tick = () => {
    skipPauses();
    if (!video.seeking) t = video.currentTime;
    render();
    raf = requestAnimationFrame(tick);
  };

  function setPlaying(on: boolean) {
    play.setAttribute("aria-pressed", String(on));
    play.setAttribute("aria-label", on ? "Pausa" : "Riproduci");
    cancelAnimationFrame(raf);
    if (on) raf = requestAnimationFrame(tick);
    else render(true);
  }
  video.addEventListener("playing", () => setPlaying(true));
  video.addEventListener("pause", () => setPlaying(false));
  video.addEventListener("loadeddata", () => box.classList.add("is-ready"), { once: true });

  function attach() {
    if (attached) return;
    attached = true;
    video.muted = true;
    video.src = root.dataset.src!;
    video.currentTime = t;
  }
  async function start() {
    attach();
    try {
      // Starting from a pause: begin at the next segment.
      if (segmentAt(t) < 0) t = nextStart(t);
      if (Math.abs(video.currentTime - t) > 0.05) video.currentTime = t;
      render(true);
      await video.play();
    } catch {
      setPlaying(false); // autoplay refused: the play button stays available
    }
  }

  function seekTo(s: number, announce = true) {
    t = clamp(s);
    if (attached) {
      const v = video as HTMLVideoElement & { fastSeek?: (s: number) => void };
      if (v.fastSeek && !announce) v.fastSeek(t);
      else video.currentTime = t;
    }
    render(announce);
  }

  play.addEventListener("click", () => {
    if (video.paused) {
      userPaused = false;
      void start();
    } else {
      userPaused = true;
      video.pause();
    }
  });

  // Drag the timeline (content moves under the fixed playhead) or the seek bar.
  // touch-action: pan-y keeps vertical swipes for page scrolling.
  function drag(el: HTMLElement, toTime: (e: PointerEvent, startT: number, startX: number) => number) {
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const startX = e.clientX;
      const startT = t;
      let moved = false;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
      const move = (ev: PointerEvent) => {
        if (!moved && Math.abs(ev.clientX - startX) < 3 && el === timeline) return;
        if (!moved) {
          moved = true;
          userPaused = true;
          video.pause();
        }
        seekTo(toTime(ev, startT, startX), false);
      };
      const up = (ev: PointerEvent) => {
        if (!moved && el === seek) {
          userPaused = true;
          video.pause();
          seekTo(toTime(ev, startT, startX));
        } else if (moved) seekTo(t);
        el.classList.remove("is-dragging");
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  }
  drag(timeline, (e, startT, startX) => startT - (e.clientX - startX) / pxPerSecond());
  drag(seek, (e) => {
    const r = seek.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * length;
  });

  timeline.addEventListener("keydown", (e) => {
    const step = { ArrowLeft: -2, ArrowDown: -2, ArrowRight: 2, ArrowUp: 2, PageDown: -10, PageUp: 10 }[e.key];
    let next: number | undefined;
    if (step !== undefined) next = t + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = length;
    if (next === undefined) return;
    e.preventDefault();
    userPaused = true;
    video.pause();
    seekTo(next);
  });

  // Autoplay only with motion allowed, only while the hero is visible.
  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !userPaused && MOTION.matches && loaded) void start();
      else if (!inView && !video.paused) video.pause();
    },
    { threshold: 0.35 },
  ).observe(root);

  const whenIdle = (fn: () => void) =>
    "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200);
  const afterLoad = () =>
    whenIdle(() => {
      loaded = true;
      if (!MOTION.matches) return; // reduced motion: load only on play
      attach();
      if (inView && !userPaused) void start();
    });
  if (document.readyState === "complete") afterLoad();
  else window.addEventListener("load", afterLoad, { once: true });

  render(true);
}

document.querySelectorAll<HTMLElement>("[data-editor-demo]").forEach(setup);

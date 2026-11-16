/**
 * Motion layer: Lenis smooth scrolling + GSAP (ScrollTrigger, SplitText),
 * pointer glow and the problem timeline sequence.
 *
 * Progressive enhancement: content is visible without this script (see
 * global.css). `html.motion-ok` is set inline only when reduced motion is not
 * requested; everything that moves is registered inside a matchMedia block, so
 * with reduced motion nothing is created and scrolling stays native. If setup
 * throws, `__motionReady` is never set and Base.astro's safety net removes
 * `motion-ok` after 3 s.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const html = document.documentElement;
const motionOk = () => html.classList.contains("motion-ok");
const MOTION = "(prefers-reduced-motion: no-preference)";
const EASE = "power3.out";

/* ---------- Clips: lazy load, autoplay muted only with motion ---------- */
function setupClips() {
  const loadClip = (video: HTMLVideoElement) => {
    if (!video.src && video.dataset.src) video.src = video.dataset.src;
  };
  document.querySelectorAll<HTMLElement>("[data-clip]").forEach((clip) => {
    const video = clip.querySelector("video")!;
    const button = clip.querySelector<HTMLButtonElement>("[data-clip-play]")!;
    if (motionOk()) {
      ScrollTrigger.create({
        trigger: clip,
        start: "top bottom+=600",
        end: "bottom top-=600",
        once: true,
        onEnter: () => loadClip(video),
        onEnterBack: () => loadClip(video),
      });
      ScrollTrigger.create({
        trigger: clip,
        // Play once a good part of the clip is in view (as the old 0.4 threshold):
        // the hero clip then stays a poster during load, keeping LCP on the image.
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            loadClip(video);
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
      });
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
}

/* ---------- Smooth scrolling + anchors ---------- */
function setupLenis() {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.1, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const id = decodeURIComponent(a.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    history.pushState(null, "", a.hash);
    lenis.scrollTo(target, {
      // Lenis already honours the page's scroll-padding-top (fixed nav).
      duration: 1.1,
      onComplete: () => {
        if (!target.hasAttribute("tabindex") && !target.matches("a,button,input,select,textarea")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
      },
    });
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

/* ---------- Entry reveals, headlines, scroll-linked effects ---------- */
function setupReveals() {
  const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  gsap.set(items, { y: 32, filter: "blur(8px)" });
  ScrollTrigger.batch(items, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: EASE,
        stagger: 0.08,
        clearProps: "filter,transform",
      }),
  });
}

function setupHeadlines() {
  // Port of React Bits "Split Text" + "Blur Text": words rise out of a mask.
  gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
    const inHero = el.closest("#top") !== null;
    SplitText.create(el, {
      type: "words",
      wordsClass: "word",
      mask: "words",
      aria: "auto",
      autoSplit: true,
      onSplit(self) {
        el.classList.add("is-split");
        return gsap.from(self.words, {
          yPercent: 110,
          filter: "blur(6px)",
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.06,
          delay: inHero ? 0.1 : 0,
          scrollTrigger: inHero ? undefined : { trigger: el, start: "top 88%", once: true },
        });
      },
    });
  });
}

function setupScrollEffects() {
  // Hero phone straightens as the page scrolls (replaces the CSS view() timeline).
  gsap.utils.toArray<HTMLElement>("[data-scroll-zoom]").forEach((el) => {
    gsap.fromTo(
      el,
      // Mild start: the hero holds the interactive editor demo, usable at once.
      { rotateX: 8, scale: 0.94, opacity: 1, transformPerspective: 1600, transformOrigin: "50% 0%" },
      {
        rotateX: 0,
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: 1 },
      },
    );
  });
  // Gentle parallax on device frames (spec: at most 10% of their height).
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 6 },
      { yPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 } },
    );
  });
}

function setupTimeline() {
  // Problem timeline: a one-off sequence when it enters the view (no pin, no
  // scrub). 1) a playhead sweeps the recording and each rally lights up as it
  // passes; 2) the pauses fade; 3) they close up, the full length stays as a
  // dashed outline; 4) the counter drops to the play time. "Rivedi" replays it.
  gsap.utils.toArray<HTMLElement>("[data-timeline]").forEach((root) => {
    const track = root.querySelector<HTMLElement>("[data-timeline-track]")!;
    const value = root.querySelector<HTMLElement>("[data-timeline-value]")!;
    const name = root.querySelector<HTMLElement>("[data-timeline-name]")!;
    const ghost = root.querySelector<HTMLElement>("[data-timeline-ghost]")!;
    const removed = root.querySelector<HTMLElement>("[data-timeline-removed]")!;
    const head = root.querySelector<HTMLElement>("[data-timeline-head]")!;
    const replay = root.querySelector<HTMLButtonElement>("[data-timeline-replay]")!;
    const segs = [...track.children] as HTMLElement[];
    const grows = segs.map((el) => Number(el.style.flexGrow) || 0); // original durations
    const pauses = segs.filter((el) => el.classList.contains("timeline__seg--pause"));
    const total = Number(root.dataset.total);
    const play = Number(root.dataset.play);
    const share = getComputedStyle(root).getPropertyValue("--play-share").trim();
    const mss = (sec: number) => {
      const r = Math.round(sec + 1e-6);
      return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}`;
    };
    const clock = { v: total };
    const SWEEP = 1.4;

    const tl = gsap.timeline({
      paused: true,
      onStart: () => (replay.hidden = true),
      onComplete: () => (replay.hidden = false),
    });
    tl.set(track, { width: "100%" })
      .set(pauses, { flexGrow: (i: number) => grows[segs.indexOf(pauses[i])], opacity: 1 })
      .set([ghost, removed], { opacity: 0 })
      .set(head, { left: "0%", opacity: 1 })
      .call(() => {
        clock.v = total;
        value.textContent = mss(total);
        name.textContent = "La registrazione";
      });
    // 1. Sweep: the playhead runs the bar, rallies flash as it reaches them.
    tl.to(head, { left: "100%", duration: SWEEP, ease: "none" }, 0);
    let offset = 0;
    segs.forEach((el, i) => {
      const grow = grows[i];
      if (el.classList.contains("timeline__seg--rally")) {
        tl.fromTo(el, { filter: "brightness(1)" }, { filter: "brightness(1.7)", duration: 0.12, yoyo: true, repeat: 1 }, (offset / total) * SWEEP);
      }
      offset += grow;
    });
    // 2. Pauses fade, the playhead leaves.
    tl.to(head, { opacity: 0, duration: 0.2 }, SWEEP)
      .to(pauses, { opacity: 0.25, duration: 0.4, ease: "power1.out" }, SWEEP)
      .to(ghost, { opacity: 1, duration: 0.4 }, SWEEP + 0.3);
    // 3. Close up: pauses collapse, rallies slide left, outline stays.
    tl.to(pauses, { flexGrow: 0, opacity: 0, duration: 1.2, ease: "power2.inOut" }, SWEEP + 0.4)
      .to(track, { width: share, duration: 1.2, ease: "power2.inOut" }, SWEEP + 0.4);
    // 4. Counter and removed time.
    tl.to(clock, {
      v: play, duration: 1, ease: "power1.out",
      onUpdate: () => (value.textContent = mss(clock.v)),
      onComplete: () => (value.textContent = mss(play)),
    }, SWEEP + 0.9)
      .call(() => (name.textContent = "Solo il gioco"), [], SWEEP + 1.4)
      .to(removed, { opacity: 1, duration: 0.4 }, SWEEP + 1.4);

    ScrollTrigger.create({ trigger: root, start: "top 70%", once: true, onEnter: () => tl.play(0) });
    replay.addEventListener("click", () => tl.restart());
  });
}

function setupGlow() {
  // Site-wide pointer glow on the page background (spec: site-visual-identity).
  const glow = document.querySelector<HTMLElement>(".cursor-glow");
  if (!glow) return;
  const toX = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
  const toY = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });
  let shown = false;
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (!shown) {
      gsap.set(glow, { x: e.clientX, y: e.clientY });
      gsap.to(glow, { opacity: 1, duration: 0.4 });
      shown = true;
    }
    toX(e.clientX);
    toY(e.clientY);
  };
  const leave = () => {
    shown = false;
    gsap.to(glow, { opacity: 0, duration: 0.4 });
  };
  window.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  return () => {
    window.removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    gsap.set(glow, { opacity: 0 });
  };
}

/* ---------- Boot ---------- */
setupClips();

const mm = gsap.matchMedia();
mm.add(MOTION, () => {
  if (!motionOk()) return;
  const stopLenis = setupLenis();
  setupReveals();
  setupScrollEffects();
  setupTimeline();
  void document.fonts.ready.then(() => {
    setupHeadlines();
    ScrollTrigger.refresh();
  });
  return stopLenis;
});
mm.add(`${MOTION} and (hover: hover) and (pointer: fine)`, () => (motionOk() ? setupGlow() : undefined));

(window as unknown as { __motionReady: boolean }).__motionReady = true;

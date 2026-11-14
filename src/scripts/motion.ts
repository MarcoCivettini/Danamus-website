/**
 * Motion layer: Lenis smooth scrolling + GSAP (ScrollTrigger, SplitText).
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

/* ---------- Walkthrough: active step (always), cross-fade (motion only) ---------- */
function setupWalkthrough() {
  document.querySelectorAll<HTMLElement>("[data-walkthrough]").forEach((root) => {
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    const medias = [...root.querySelectorAll<HTMLElement>("[data-media]")];
    const progress = root.querySelector<HTMLElement>("[data-walkthrough-progress]");
    let animate = false;

    const setActive = (index: string) => {
      if (root.dataset.active === index && steps.some((s) => s.hasAttribute("data-current"))) return;
      root.dataset.active = index;
      steps.forEach((s) => s.toggleAttribute("data-current", s.dataset.step === index));
      if (!animate) return;
      medias.forEach((m) => {
        const on = m.dataset.media === index;
        gsap.to(m, {
          autoAlpha: on ? 1 : 0,
          scale: on ? 1 : 1.03,
          filter: on ? "blur(0px)" : "blur(8px)",
          duration: on ? 0.6 : 0.45,
          ease: on ? EASE : "power2.inOut",
          overwrite: true,
        });
      });
    };

    steps.forEach((s) =>
      ScrollTrigger.create({
        trigger: s,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(s.dataset.step!),
      }),
    );
    setActive("0");

    gsap.matchMedia().add(`${MOTION} and (min-width: 1024px)`, () => {
      animate = true;
      const current = root.dataset.active;
      medias.forEach((m) => {
        const on = m.dataset.media === current;
        gsap.set(m, { autoAlpha: on ? 1 : 0, scale: on ? 1 : 1.03, filter: on ? "blur(0px)" : "blur(8px)" });
      });
      if (progress) {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: root.querySelector("[data-steps]") ?? root, start: "top center", end: "bottom center", scrub: 0.6 },
          },
        );
      }
      return () => {
        animate = false;
        gsap.set(medias, { clearProps: "opacity,visibility,scale,filter" });
      };
    });
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
      { rotateX: 14, scale: 0.9, opacity: 0.55, transformPerspective: 1600, transformOrigin: "50% 0%" },
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

function setupSpotlight() {
  // Port of React Bits "Spotlight Card", hover-capable pointers only.
  const cleanups: (() => void)[] = [];
  gsap.utils.toArray<HTMLElement>("[data-spotlight]").forEach((el) => {
    const setX = gsap.quickSetter(el, "--mx", "px");
    const setY = gsap.quickSetter(el, "--my", "px");
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setX(e.clientX - r.left + 32);
      setY(e.clientY - r.top + 32);
    };
    const enter = () => el.style.setProperty("--spot", "1");
    const leave = () => el.style.setProperty("--spot", "0");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.style.removeProperty("--spot");
    });
  });
  return () => cleanups.forEach((c) => c());
}

/* ---------- Boot ---------- */
setupClips();
setupWalkthrough();

const mm = gsap.matchMedia();
mm.add(MOTION, () => {
  if (!motionOk()) return;
  const stopLenis = setupLenis();
  setupReveals();
  setupScrollEffects();
  void document.fonts.ready.then(() => {
    setupHeadlines();
    ScrollTrigger.refresh();
  });
  return stopLenis;
});
mm.add(`${MOTION} and (hover: hover) and (pointer: fine)`, () => (motionOk() ? setupSpotlight() : undefined));

(window as unknown as { __motionReady: boolean }).__motionReady = true;

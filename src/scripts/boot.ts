/**
 * Loads the motion layer (GSAP + Lenis, ~53 KB gzip) off the critical path:
 * on the first interaction (scroll, pointer, key) or shortly after `load`,
 * whichever comes first. The hero intro is pure CSS and does not wait for it.
 */
const events = ["wheel", "touchstart", "pointerdown", "keydown", "scroll"] as const;
let started = false;
const load = () => {
  if (started) return;
  started = true;
  events.forEach((e) => removeEventListener(e, load));
  void import("./motion");
};
events.forEach((e) => addEventListener(e, load, { once: true, passive: true }));
const later = () => setTimeout(load, 1200);
if (document.readyState === "complete") later();
else addEventListener("load", later, { once: true });

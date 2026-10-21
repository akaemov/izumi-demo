"use client";

import { useEffect } from "react";

/** Progressive enhancement: content stays visible without JS or animation support. */
export function useMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    let disposed = false;
    const seen = new WeakSet<Element>();

    function play(
      element: Element | null,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions,
    ) {
      if (disposed || preference.matches || !element?.animate) return;
      const animation = element.animate(keyframes, {
        duration: 680,
        easing: "cubic-bezier(.22, 1, .36, 1)",
        ...options,
      });
      animations.add(animation);
      animation.onfinish = animation.oncancel = () =>
        animations.delete(animation);
    }

    function observe() {
      if (preference.matches || !window.IntersectionObserver) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || seen.has(entry.target)) return;
            seen.add(entry.target);
            observer?.unobserve(entry.target);
            // No delayed animation for an anchor target or a focused control.
            if (entry.target.contains(document.activeElement)) return;
            const image = entry.target.matches(
              ".photo-tall, .garden, .location-art",
            );
            play(
              entry.target,
              image
                ? [
                    { opacity: 0.55, transform: "translateY(16px)" },
                    { opacity: 1, transform: "translateY(0)" },
                  ]
                : [
                    { opacity: 0.12, transform: "translateY(18px)" },
                    { opacity: 1, transform: "translateY(0)" },
                  ],
              { duration: image ? 850 : 650 },
            );
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -24px 0px" },
      );
      document
        .querySelectorAll(
          ".section-heading, .about-main > h2, .two-copy > p, .architecture-copy, .photo-tall, .garden, .location-art, .space-details article, .infrastructure details, .purchase > h2, .purchase > div, .journal-grid > article, .developer > div, .contacts > div, .catalog-empty, .gallery-item",
        )
        .forEach((element) => {
          if (!seen.has(element)) observer?.observe(element);
        });
    }

    function onPreferenceChange() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      if (!preference.matches) observe();
    }
    function onFocus() {
      // Never leave keyboard focus inside a fading or moving element.
      animations.forEach((animation) => {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (target?.contains(document.activeElement)) animation.finish();
      });
    }

    play(
      document.querySelector(".hero-copy"),
      [
        { opacity: 0.3, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 850 },
    );
    const heroImage = document.querySelector(".hero-visual img");
    if (heroImage)
      play(
        heroImage,
        [{ transform: "scale(1.045)" }, { transform: "scale(1)" }],
        { duration: 1400 },
      );
    observe();
    preference.addEventListener("change", onPreferenceChange);
    document.addEventListener("focusin", onFocus);
    return () => {
      disposed = true;
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);
}

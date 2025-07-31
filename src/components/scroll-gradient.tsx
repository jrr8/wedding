"use client";

import { useEffect } from "react";

const round = (value: number, precision: number = 2) =>
  Math.round(value * 10 ** precision) / 10 ** precision;

export default function ScrollGradient() {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;

        const availableScroll = document.body.scrollHeight - window.innerHeight;
        if (availableScroll <= 0) return;
        const scrollProgress = window.scrollY / availableScroll;

        const x = Math.min(Math.max(scrollProgress * 100, 0), 100);
        const y = 40 - Math.sin(Math.PI * (scrollProgress + 1 / 4)) * 20;

        document.documentElement.style.setProperty("--x", `${round(x)}%`);
        document.documentElement.style.setProperty("--y", `${round(y)}%`);
      });
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

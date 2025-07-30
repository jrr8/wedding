"use client";
import { useEffect } from "react";

export default function ScrollGradient() {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollProgress =
            window.scrollY /
            (document.body.scrollHeight - window.innerHeight);

          // Clamp to safe range
          const x = Math.min(Math.max(scrollProgress * 100, 0), 100);
          const y = 50 - Math.sin(scrollProgress * Math.PI) * 30;

          document.documentElement.style.setProperty("--x", `${x}%`);
          document.documentElement.style.setProperty("--y", `${y}%`);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

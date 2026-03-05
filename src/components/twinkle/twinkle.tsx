"use cache";

import styles from "./twinkle.module.css";

const SIZES = [1, 1, 2, 3, 4];
const N_STAR_CLASSES = 6

const random = (min = 1, max = 100): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const starClass = (i: number, n: number): string => {
  // i = 0, 1, ..., n-1
  // map linearly to 1, 2, ..., N_STAR_CLASSES
  const bucketSize = Math.floor(n / N_STAR_CLASSES);
  const classIdx = 1 + Math.floor(i / bucketSize)
  return `star${classIdx}`
}

export const Twinkle = async ({ n = 300, children }: { n?: number, children: React.ReactNode }) => {
  return (
    <div className={styles.twinkleContainer}>
      <div className={styles.gradientA} />
      <div className={styles.gradientB} />
      <div className={styles.stars}>

        {Array.from({ length: n }).map((_, i) => {
          const top = `${random()}%`
          const left = `${random()}%`;
          const size = `${SIZES[random(0, SIZES.length - 1)]}px`;

          return (
            <div
              key={i}
              className={`${styles.star} ${styles[starClass(i, n)]}`}
              style={{ top, left, width: size, height: size }}
            />
          );
        })}
      </div>
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
};

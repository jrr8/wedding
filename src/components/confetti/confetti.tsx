import styles from "./confetti.module.css";
import { Fragment, useMemo } from "react";

export const Confetti = ({ n = 10 }: { n?: number }) => {
  const delays = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => (i * 2) / n).sort(() =>
        Math.random() > 0.5 ? 1 : -1
      ),
    [n]
  );

  const colors = [
    "#ff0",
    "#0f0",
    "#f0f",
    "#0ff",
    "#ff6347",
    "#00ced1",
    "#ffa500",
    "#adff2f",
    "#ff69b4",
    "#1e90ff",
  ];

  return (
    <div className="contents">
      {Array.from({ length: n }).map((_, i) => {
        const left = `${1 + (i * 98) / (n - 1)}%`;
        const backgroundColor = colors[i % colors.length];
        return (
          <Fragment key={i}>
            <div
              className={styles.confetti}
              style={{
                left,
                backgroundColor,
                animationDelay: `${delays[i]}s`,
              }}
            />
            <div
              className={styles.confetti}
              style={{
                left,
                backgroundColor,
                animationDelay: `${delays[i] + 2.5}s`,
              }}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

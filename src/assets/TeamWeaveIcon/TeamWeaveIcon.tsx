import { useEffect, useRef, useState } from "react";
import icon from "./teamweave-icon.svg";
import iconbkg from "./teamweave-icon-white-background.svg";

type TeamWeaveIconProps = {
  size: number;
  background?: boolean;
  spinning?: boolean;
  speedDegPerSec?: number;
};

function TeamWeaveIcon({
  size,
  background,
  spinning = false,
  speedDegPerSec = 240,
}: TeamWeaveIconProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);
  const lastTsRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);

  const active = spinning || hovered; // hover also triggers spinning

  const cancel = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
  };

  useEffect(() => {
    const speedDegPerMs = speedDegPerSec / 1000;

    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current; // ms
      lastTsRef.current = ts;

      let inc = dt * speedDegPerMs;

      if (active) {
        angleRef.current += inc;
      } else {
        const rem = (360 - (angleRef.current % 360)) % 360;
        if (rem === 0) {
          cancel();
          return;
        }
        if (inc >= rem) inc = rem;
        angleRef.current += inc;
      }

      if (imgRef.current) {
        imgRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }

      if (active || angleRef.current % 360 !== 0) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        cancel();
      }
    };

    if (active || angleRef.current % 360 !== 0) {
      cancel();
      rafRef.current = requestAnimationFrame(step);
    } else {
      if (imgRef.current) imgRef.current.style.transform = "rotate(0deg)";
    }

    return cancel;
  }, [active, speedDegPerSec]);

  return (
    <img
      ref={imgRef}
      src={background ? iconbkg : icon}
      width={size}
      height={size}
      style={{
        display: "inline-block",
        transform: "rotate(0deg)",
        transformOrigin: "50% 50%",
        willChange: "transform",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // keyboard parity
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      alt="TeamWeave icon"
    />
  );
}

export { TeamWeaveIcon };

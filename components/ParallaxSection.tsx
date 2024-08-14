"use client";

import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const ParallaxSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const spring = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(50px)",
    config: { mass: 1, tension: 80, friction: 26 },
  });

  return (
    <animated.div
      ref={ref}
      style={spring}
      className="min-h-screen flex items-center justify-center"
    >
      {children}
    </animated.div>
  );
};

export default ParallaxSection;

import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";

const supportsObserver = typeof window !== "undefined" && "IntersectionObserver" in window;

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section";
  children: ReactNode;
}

// Fades its content up the first time it scrolls into view. The motion itself
// lives in index.css and is skipped for prefers-reduced-motion.
const Reveal = ({ as = "div", className = "", children, ...rest }: RevealProps) => {
  // A callback ref stored in state, so the observer attaches once the element exists.
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(!supportsObserver);

  useEffect(() => {
    if (visible || !node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, visible]);

  const props = {
    ...rest,
    ref: setNode,
    className: `reveal ${visible ? "reveal--visible" : ""} ${className}`,
  };
  return as === "section" ? <section {...props}>{children}</section> : <div {...props}>{children}</div>;
};

export default Reveal;

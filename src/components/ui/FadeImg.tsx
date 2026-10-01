import type { ImgHTMLAttributes, SyntheticEvent } from "react";

const markLoaded = (e: SyntheticEvent<HTMLImageElement>) => e.currentTarget.classList.add("is-loaded");

// An <img> that fades in once it has loaded (or failed, so alt text shows).
// Not for images that set their own opacity, which this would override.
const FadeImg = ({ className = "", alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} alt={alt} className={`img-fade ${className}`} onLoad={markLoaded} onError={markLoaded} />
);

export default FadeImg;

import { useAppDispatch } from "../../state/hooks";
import SlickModule, { type Settings } from "react-slick";
import { openTitle } from "../../state/detailsSlice";
import { HeroSkeleton } from "../ui/HeroSkeleton";
import TitleHero from "./TitleHero";
import { useI18n } from "../../i18n/context";

import "./slider.css";
import type { RequestStatus, Title } from "../../types";

// react-slick is CommonJS; depending on the bundler its default export
// arrives either as the component or wrapped in `{ default }`.
const Slider = (SlickModule as unknown as { default?: typeof SlickModule }).default ?? SlickModule;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const settings: Settings = {
  dots: true,
  centerMode: true,
  centerPadding: "8%",
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: !prefersReducedMotion,
  autoplaySpeed: 6000,
  pauseOnHover: true,
  pauseOnFocus: true,
  speed: 700,
  cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
  responsive: [
    { breakpoint: 768, settings: { centerMode: false, arrows: false } },
  ],
};

interface SlideShowProps {
  items: Title[];
  status: RequestStatus;
  label: string;
}

const SlideShow = ({ items, status, label }: SlideShowProps) => {
  const dispatch = useAppDispatch();
  const { t } = useI18n();

  if (status === "loading") {
    return <HeroSkeleton />;
  }
  if (status === "failed" || items.length === 0) {
    return (
      <p className="mt-16 text-center text-muted" role="alert">
        {t("browse.heroError")}
      </p>
    );
  }

  return (
    <section aria-label={label} className="overflow-hidden pb-12 pt-8">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={item.id} className="px-2 md:px-3">
            <TitleHero
              item={item}
              eagerImage={index === 0}
              onDetails={(m) => dispatch(openTitle(m))}
              className="mx-auto max-w-6xl"
            />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default SlideShow;


import Skeleton from "react-loading-skeleton";

export const HeroSkeleton = ({ className = "mx-auto mt-8 max-w-6xl px-4" }: { className?: string }) => {
  return (
    <div className={className} aria-hidden="true">
      <div className="flex flex-col gap-6 rounded-2xl border border-line/60 bg-surface p-5 sm:p-8 md:flex-row md:gap-10">
        <div className="w-40 shrink-0 self-center sm:w-52 md:self-start">
          <Skeleton className="block aspect-[2/3]" borderRadius={12} />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton width="55%" height={32} />
          <Skeleton width="40%" />
          <div className="mt-3">
            <Skeleton count={4} />
          </div>
          <Skeleton width={140} height={38} className="mt-3" borderRadius={8} />
        </div>
      </div>
    </div>
  );
};

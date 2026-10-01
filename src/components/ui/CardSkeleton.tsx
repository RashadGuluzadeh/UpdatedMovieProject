
import Skeleton from "react-loading-skeleton";

export const CardSkeleton = ({ cards }: { cards: number }) => {
  return Array.from({ length: cards }, (_, i) => (
    <li
      key={i}
      className="overflow-hidden rounded-xl border border-line/60 bg-surface"
      aria-hidden="true"
    >
      <Skeleton className="block aspect-[2/3]" borderRadius={0} />
      <div className="p-3">
        <Skeleton />
        <Skeleton width={48} />
      </div>
    </li>
  ));
};

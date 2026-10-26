import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import { useI18n } from "../../i18n/context";

// "↑ +0.3" / "↓ −0.2" change between episode ratings. Direction is carried by
// the arrow and the sign, not by color alone.
const Delta = ({ value }: { value: number | null }) => {
  const { t } = useI18n();
  if (value === null || Math.abs(value) < 0.05) {
    return <span className="text-xs text-subtle">—</span>;
  }
  const up = value > 0;
  return (
    <span className="inline-flex items-center text-xs tabular-nums text-muted">
      {up ? (
        <RiArrowUpSLine className="text-base text-rise" aria-hidden="true" />
      ) : (
        <RiArrowDownSLine className="text-base text-fall" aria-hidden="true" />
      )}
      <span className="sr-only">{t(up ? "spotlight.up" : "spotlight.down")} </span>
      {up ? "+" : "−"}
      {Math.abs(value).toFixed(1)}
    </span>
  );
};

export default Delta;

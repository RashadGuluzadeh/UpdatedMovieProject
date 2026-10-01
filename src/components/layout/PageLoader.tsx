import { useI18n } from "../../i18n/context";

const PageLoader = ({ label }: { label?: string }) => {
  const { t } = useI18n();
  return (
    <div className="load-center flex-col gap-4" role="status">
      <div className="spinner" />
      <span className={label ? "text-sm text-muted" : "sr-only"}>{label ?? t("common.loading")}</span>
    </div>
  );
};

export default PageLoader;

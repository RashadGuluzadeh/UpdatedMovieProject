import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import { useHideSplash } from "../utils/splash";

const NotFoundPage = () => {
  useHideSplash();
  const { t } = useI18n();
  return (
  <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
    <p className="font-display text-7xl font-semibold text-line">404</p>
    <h1 className="font-display text-2xl font-semibold">{t("notFound.title")}</h1>
    <p className="text-muted">{t("notFound.text")}</p>
    <Link to="/" className="btn-primary mt-4">
      {t("common.backToMovies")}
    </Link>
  </main>
  );
};

export default NotFoundPage;

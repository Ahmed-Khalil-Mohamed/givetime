import type { ReactNode } from "react";
import {
  UsersThree,
  ListBullets,
  CalendarBlank,
  HandHeart,
  Package,
  ChartBar,
  Cards,
} from "@phosphor-icons/react";
import type { Lang } from "./contracts";
export function ProductLayout({
  brand,
  utilities,
  lang,
  children,
}: {
  brand: ReactNode;
  utilities: ReactNode;
  lang: Lang;
  children: ReactNode;
}) {
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  return (
    <div className="planner-shell">
      <header className="planner-rail">
        {brand}
        <nav>
          <a href="#records">
            <CalendarBlank size={25} />
            <span>{t("Calendar", "التقويم")}</span>
          </a>
          <a href="#overview">
            <HandHeart size={25} />
            <span>{t("Community", "المجتمع")}</span>
          </a>
        </nav>
        <div className="planner-rail-bottom">{utilities}</div>
      </header>
      <main className="identity-main">{children}</main>
    </div>
  );
}

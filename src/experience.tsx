import { useState, type ReactNode } from "react";
import {
  Plus,
  Scales,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  FolderOpen,
  FileText,
  Wrench,
  ShieldCheck,
  Package,
  Receipt,
  Cards,
  MapPin,
  Clock,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import {
  type Project,
  type Entry,
  type Lang,
  type Action,
  cash,
} from "./contracts";
import { Status, fmtDate } from "./components";
type Slots = {
  p: Project;
  now: Date;
  create: () => void;
  notices: ReactNode;
  metrics: ReactNode;
  features: ReactNode;
  records: ReactNode;
  lang: Lang;
};
type Props = {
  p: Project;
  rows: Entry[];
  lang: Lang;
  now: Date;
  busy: boolean;
  open: (e: Entry) => void;
  action: (e: Entry, a: Action) => void;
};
const words = (lang: Lang) => (en: string, ar: string) =>
  lang === "ar" ? ar : en;
function Title({ e, p, open }: Pick<Props, "p" | "open"> & { e: Entry }) {
  return (
    <button className="record-title" dir="auto" onClick={() => open(e)}>
      {p.title(e.data)}
      <ArrowUpRight size={17} />
    </button>
  );
}
function Next({ e, p, lang, busy, action }: Props & { e: Entry }) {
  const a = p.actions.find((a) => a.when(e.data));
  return a ? (
    <button
      className="secondary compact"
      disabled={busy}
      onClick={() => action(e, a)}
    >
      {a.label[lang]}
      <ArrowRight size={14} />
    </button>
  ) : null;
}
function Scene({ label }: { label: string }) {
  return (
    <figure className="brand-scene">
      <img src="/brand-scene.png" alt="" />
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export function ProductComposition({
  p,
  now,
  create,
  notices,
  metrics,
  features,
  records,
  lang,
}: Slots) {
  const t = words(lang);
  return (
    <div className="experience">
      <div className="planner-title" id="overview">
        <div>
          <span className="overline">
            {t("MAKE TIME FOR GOOD", "وقت يعمل فرق")}
          </span>
          <h1>{t("Your community calendar", "تقويم مجتمعك")}</h1>
        </div>
        <button className="primary" onClick={create}>
          <Plus />
          {p.createLabel[lang]}
        </button>
      </div>
      <div className="planner-body">{records}</div>
      <div className="planner-bottom">
        <div className="planner-next">{features}</div>
        <div className="planner-impact">
          <img src="/brand-scene.png" alt="" />
          {metrics}
        </div>
      </div>
      <div className="workspace-notes">{notices}</div>
    </div>
  );
}
export function ProductRecords(props: Props) {
  const { p, rows, lang, now, busy, open, action } = props;
  const t = words(lang);
  const [month, setMonth] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [day, setDay] = useState<string | null>(null);
  const key = (d: Date) =>
    [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const visible = day
    ? rows.filter((e) => key(new Date(e.data.startsAt)) === day)
    : rows;
  return (
    <div className="calendar-work">
      <section
        className="month-calendar"
        aria-label={t("Shift calendar", "تقويم الأنشطة")}
      >
        <div className="month-controls">
          <button
            className="icon-button"
            aria-label={t("Previous month", "الشهر السابق")}
            onClick={() => {
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
              setDay(null);
            }}
          >
            <CaretLeft />
          </button>
          <h3>
            {month.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            className="icon-button"
            aria-label={t("Next month", "الشهر التالي")}
            onClick={() => {
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
              setDay(null);
            }}
          >
            <CaretRight />
          </button>
        </div>
        <div className="calendar-grid">
          {Array.from({ length: 7 }, (_, i) => (
            <span className="weekday" key={"w" + i}>
              {new Date(2024, 0, 7 + i).toLocaleDateString(
                lang === "ar" ? "ar-EG" : "en-GB",
                { weekday: "short" },
              )}
            </span>
          ))}
          {Array.from({ length: month.getDay() }, (_, i) => (
            <span key={"blank" + i} />
          ))}
          {Array.from({ length: count }, (_, i) => {
            const d = new Date(month.getFullYear(), month.getMonth(), i + 1),
              date = key(d),
              n = rows.filter(
                (e) => key(new Date(e.data.startsAt)) === date,
              ).length;
            return (
              <button
                key={date}
                className={
                  (day === date ? "selected-day " : "") +
                  (key(now) === date ? "today" : "")
                }
                aria-pressed={day === date}
                aria-label={date + " · " + n + " " + t("shifts", "أنشطة")}
                onClick={() => setDay(day === date ? null : date)}
              >
                <span>{i + 1}</span>
                {n > 0 && <i>{n}</i>}
              </button>
            );
          })}
        </div>
        <button
          className="text-button calendar-reset"
          onClick={() => {
            setDay(null);
            setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
          }}
        >
          {t("Show all shifts", "عرض كل الأنشطة")}
        </button>
      </section>
      <div className="shift-agenda">
        <h3>
          {day
            ? fmtDate(day, lang)
            : t("All planned shifts", "كل الأنشطة المخططة")}
        </h3>
        {visible.map((e) => (
          <article className="record-card agenda-shift" key={e.id}>
            <div className="agenda-date">
              <strong>{new Date(e.data.startsAt).getDate()}</strong>
              <span>
                {new Date(e.data.startsAt).toLocaleDateString(
                  lang === "ar" ? "ar-EG" : "en-GB",
                  { month: "short" },
                )}
              </span>
            </div>
            <div>
              <Status project={p} entry={e} lang={lang} now={now} />
              <Title {...props} e={e} />
              <p>{e.data.location}</p>
              <div className="volunteer-spaces">
                <span>
                  {e.data.volunteers.length} / {e.data.capacity}{" "}
                  {t("volunteers", "متطوعين")}
                </span>
                <span>
                  {e.data.hours} {t("hours", "ساعات")}
                </span>
              </div>
              <Next {...props} e={e} />
            </div>
          </article>
        ))}
        {!visible.length && (
          <p className="day-empty">
            {t(
              "No shifts on this day. Select another date or show all shifts.",
              "لا توجد أنشطة في اليوم ده. اختار تاريخ تاني أو اعرض كل الأنشطة.",
            )}
          </p>
        )}
      </div>
    </div>
  );
}

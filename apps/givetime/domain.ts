import { z } from "zod";
import {
  c,
  text,
  note,
  count,
  datetime,
  metric,
  fail,
  type Project,
} from "../../src/contracts";
export const givetime: Project = {
  id: "givetime",
  name: "GiveTime",
  arabic: "وقتك خير",
  kind: "web",
  color: "#765336",
  mark: "05",
  tagline: c("Small shifts. Meaningful change.", "ساعات بسيطة، وأثر يستاهل."),
  problem: c(
    "Coordinate volunteer shifts without overbooking. Track attendance and count completed volunteer hours.",
    "تنسيق ورديات المتطوعين دون تجاوز السعة، وتسجيل الحضور وساعات التطوع المكتملة.",
  ),
  entity: c("shifts", "ورديات"),
  createLabel: c("Create a shift", "إنشاء وردية"),
  fields: [
    { key: "title", label: c("Activity", "النشاط"), required: true },
    {
      key: "location",
      label: c("Meeting point", "نقطة التجمع"),
      required: true,
    },
    {
      key: "startsAt",
      label: c("Start time", "موعد البداية"),
      type: "datetime-local",
      required: true,
    },
    {
      key: "hours",
      label: c("Duration · hours", "المدة · ساعات"),
      type: "number",
      min: 1,
      max: 12,
      required: true,
    },
    {
      key: "capacity",
      label: c("Volunteer places", "عدد المتطوعين"),
      type: "number",
      min: 1,
      max: 1000,
      required: true,
    },
    {
      key: "notes",
      label: c("Preparation notes", "تعليمات التجهيز"),
      type: "textarea",
    },
  ],
  schema: z
    .object({
      title: text,
      location: text,
      startsAt: datetime,
      hours: z.number().int().min(1).max(12),
      capacity: count.max(1000),
      notes: note,
    })
    .strict(),
  create: (d, n) => {
    if (Date.parse(d.startsAt) <= +n) fail("future_deadline");
    return { ...d, volunteers: [], status: "scheduled" };
  },
  act: (d, a, p, n) => {
    if (d.status === "completed") fail("invalid_transition");
    if (a === "join") {
      if (Date.parse(d.startsAt) <= +n) fail("shift_started");
      const { name } = z.object({ name: text }).strict().parse(p);
      if (d.volunteers.length >= d.capacity) fail("insufficient_capacity");
      if (
        d.volunteers.some(
          (v: any) => v.name.toLowerCase() === name.toLowerCase(),
        )
      )
        fail("duplicate");
      return {
        ...d,
        volunteers: [
          ...d.volunteers,
          { id: crypto.randomUUID(), name, attended: false },
        ],
      };
    }
    if (a === "attendance") {
      if (Date.parse(d.startsAt) > +n) fail("shift_not_started");
      const { volunteerId } = z.object({ volunteerId: text }).strict().parse(p);
      if (!d.volunteers.some((v: any) => v.id === volunteerId))
        fail("not_found");
      return {
        ...d,
        volunteers: d.volunteers.map((v: any) =>
          v.id === volunteerId ? { ...v, attended: !v.attended } : v,
        ),
      };
    }
    if (a === "complete") {
      if (Date.parse(d.startsAt) + d.hours * 3600000 > +n)
        fail("shift_not_finished");
      return { ...d, status: "completed" };
    }
    return fail("invalid_transition");
  },
  actions: [
    {
      id: "join",
      label: c("Add volunteer", "إضافة متطوع"),
      fields: [
        {
          key: "name",
          label: c("Volunteer name", "اسم المتطوع"),
          required: true,
        },
      ],
      when: (d) => d.status === "scheduled" && d.volunteers.length < d.capacity,
    },
    {
      id: "complete",
      label: c("Complete shift", "إنهاء الوردية"),
      when: (d) => d.status === "scheduled",
    },
  ],
  title: (d) => d.title,
  subtitle: (d) => d.location,
  status: (d) => d.status,
  statuses: {
    scheduled: c("Scheduled", "مجدولة"),
    completed: c("Completed", "مكتملة"),
  },
  metrics: (r, now) => [
    metric(
      "Upcoming shifts",
      "ورديات مجدولة",
      r.filter(
        (x) =>
          x.data.status === "scheduled" && Date.parse(x.data.startsAt) > +now,
      ).length,
      "Build a reliable team",
      "تنظيم فريق يعتمد عليه",
    ),
    metric(
      "Open places",
      "أماكن شاغرة",
      r
        .filter(
          (x) =>
            x.data.status === "scheduled" && Date.parse(x.data.startsAt) > +now,
        )
        .reduce((s, x) => s + x.data.capacity - x.data.volunteers.length, 0),
      "Places left to fill",
      "أماكن متاحة للمتطوعين",
    ),
    metric(
      "Completed hours",
      "ساعات مكتملة",
      r
        .filter((x) => x.data.status === "completed")
        .reduce(
          (s, x) =>
            s +
            x.data.hours *
              x.data.volunteers.filter((v: any) => v.attended).length,
          0,
        ),
      "Verified by attendance",
      "محسوبة من الحضور",
    ),
  ],
  seed: (n) => [
    {
      title: "Community garden morning",
      location: "Riverside Garden",
      startsAt: new Date(+n + 172800000).toISOString(),
      hours: 3,
      capacity: 10,
      notes: "Bring a reusable water bottle.",
      volunteers: [
        { id: "v1", name: "Nour", attended: false },
        { id: "v2", name: "Omar", attended: false },
      ],
      status: "scheduled",
    },
    {
      title: "Book sorting afternoon",
      location: "Community Library",
      startsAt: new Date(+n - 86400000).toISOString(),
      hours: 2,
      capacity: 6,
      notes: "",
      volunteers: [{ id: "v3", name: "Salma", attended: true }],
      status: "scheduled",
    },
  ],
};

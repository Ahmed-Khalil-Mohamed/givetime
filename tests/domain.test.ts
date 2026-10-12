import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, findProject } from "../src/projects";
import { DomainError, cash, type Entry } from "../src/contracts";
import { splitCents, balances, settlements } from "../src/settlements";
const now = new Date("2026-10-12T12:00:00Z");
const p = (id: string) => findProject(id)!;
const rejects = (fn: () => unknown, code: string) =>
  assert.throws(
    fn,
    (e: unknown) => e instanceof DomainError && e.code === code,
  );
for (const project of projects) {
  test(`${project.name}: samples yield finite, renderable metrics and recognized states`, () => {
    const entries = project.seed(now).map((data, i) => ({
      id: String(i),
      version: 1,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      data,
    }));
    assert.ok(entries.length);
    assert.equal(project.metrics(entries, now).length, 3);
    for (const e of entries) {
      assert.ok(project.title(e.data));
      assert.ok(project.statuses[project.status(e.data, now)]);
    }
    for (const m of project.metrics(entries, now)) {
      assert.ok(m.label.ar && m.label.en);
      assert.ok(typeof m.value === "string" || Number.isFinite(m.value));
    }
  });
}
test("GiveTime prevents duplicate volunteers, overbooking and premature completion", () => {
  const project = p("givetime");
  const samples = project.seed(now).map((data, i) => ({
    id: String(i),
    version: 1,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    data,
  }));
  assert.equal(project.metrics(samples, now)[0].value, 1);
  assert.equal(project.metrics(samples, now)[1].value, 8);
  let d: Record<string, any> = { ...project.seed(now)[0], capacity: 3 };
  rejects(() => project.act(d, "join", { name: "nour" }, now), "duplicate");
  d = project.act(d, "join", { name: "Salma" }, now) as typeof d;
  rejects(
    () => project.act(d, "join", { name: "Fourth" }, now),
    "insufficient_capacity",
  );
  rejects(() => project.act(d, "complete", {}, now), "shift_not_finished");
  rejects(
    () => project.act(d, "attendance", { volunteerId: "v1" }, now),
    "shift_not_started",
  );
  const later = new Date(Date.parse(d.startsAt) + 4 * 3600000);
  d = project.act(d, "attendance", { volunteerId: "v1" }, later) as typeof d;
  d = project.act(d, "complete", {}, later) as typeof d;
  assert.equal(d.status, "completed");
});
test("Currency display preserves cents above Number safe integer range", () => {
  assert.equal(cash(200000000000000001n), "EGP 2,000,000,000,000,000.01");
  assert.equal(cash(-1n), "-EGP 0.01");
});

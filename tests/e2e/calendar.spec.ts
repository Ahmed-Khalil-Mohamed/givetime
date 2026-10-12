import { test, expect } from "@playwright/test";
test("calendar filters actual shifts and can restore the full agenda", async ({
  page,
}) => {
  await page.goto("/givetime");
  await page
    .getByRole("button", { name: "Explore with sample data", exact: true })
    .click();
  await expect(page.locator(".record-card")).toHaveCount(2);
  const calendar = page.getByRole("region", { name: "Shift calendar" });
  await calendar.locator('button[aria-label*=" · 1 shifts"]').first().click();
  await expect(page.locator(".record-card")).toHaveCount(1);
  await calendar.locator('button[aria-label*=" · 0 shifts"]').first().click();
  await expect(page.locator(".record-card")).toHaveCount(0);
  await expect(
    page.getByText(
      "No shifts on this day. Select another date or show all shifts.",
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show all shifts", exact: true })
    .click();
  await expect(page.locator(".record-card")).toHaveCount(2);
  const month = await page.locator(".month-controls h3").innerText();
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await expect(page.locator(".month-controls h3")).not.toHaveText(month);
  await page
    .getByRole("button", { name: "Previous month", exact: true })
    .click();
  await expect(page.locator(".month-controls h3")).toHaveText(month);
});

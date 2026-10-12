import { test, expect } from "@playwright/test";
test("volunteer registration, attendance gating and completed hours", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Explore with sample data", exact: true })
    .click();
  await page
    .locator(".record-title")
    .filter({ hasText: "Community garden morning" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Add volunteer", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByLabel("Volunteer name")
    .fill("Test volunteer");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirm", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("button", { name: /Test volunteer/ }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await page
    .locator(".record-title")
    .filter({ hasText: "Book sorting afternoon" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Complete shift", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator(".status")).toHaveText(
    "Completed",
  );
  await page.keyboard.press("Escape");
  await expect(
    page
      .locator(".metric")
      .filter({ hasText: "Completed hours" })
      .locator("strong"),
  ).toHaveText("2");
});

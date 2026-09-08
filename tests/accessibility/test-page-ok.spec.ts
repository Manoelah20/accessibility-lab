import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Página acessível", () => {
  test("não deve apresentar violações de acessibilidade", async ({ page }) => {
    await page.goto("/test-page-ok");

    await expect(
      page.getByRole("heading", {
        name: "Página de teste sem violações",
      }),
    ).toBeVisible();

    const accessibilityScan = await new AxeBuilder({
      page,
    }).analyze();

    expect(accessibilityScan.violations).toEqual([]);
  });
});
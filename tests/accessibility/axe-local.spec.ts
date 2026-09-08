import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("axe deve funcionar diretamente na página de teste", async ({ page }) => {
  await page.goto("/test-page");

  const results = await new AxeBuilder({
    page,
  }).analyze();

  const imageViolation = results.violations.find(
    (violation) => violation.id === "image-alt",
  );

  expect(imageViolation).toBeDefined();
  expect(imageViolation?.impact).toBe("critical");
});
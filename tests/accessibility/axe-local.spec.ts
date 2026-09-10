import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("axe deve detectar as violações intencionais da página de teste", async ({
  page,
}) => {
  await page.goto("/test-page");

  const results = await new AxeBuilder({
    page,
  }).analyze();

  const violationIds = results.violations.map(
    (violation) => violation.id,
  );

  expect(violationIds).toContain("button-name");
  expect(violationIds).toContain("image-alt");
});
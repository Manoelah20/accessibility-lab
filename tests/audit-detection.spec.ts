import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Detecção de problemas de acessibilidade", () => {
  test("deve detectar imagem sem texto alternativo", async ({ page }) => {
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
});
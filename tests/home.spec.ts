import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Lab - acessibilidade", () => {
  test("página inicial não deve apresentar violações de acessibilidade", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("campo de URL deve possuir label acessível", async ({ page }) => {
    await page.goto("/");

    const urlInput = page.getByLabel("URL da página");

    await expect(urlInput).toBeVisible();
  });

  test("elementos interativos devem ser acessíveis pelo teclado", async ({
    page,
  }) => {
    await page.goto("/");

    const urlInput = page.getByLabel("URL da página");
    const submitButton = page.getByRole("button", {
      name: "Analisar página",
    });

    await urlInput.focus();
    await expect(urlInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(submitButton).toBeFocused();
  });

  test("mensagem de carregamento deve ser anunciada para tecnologias assistivas", async ({
    page,
  }) => {
    await page.route("**/api/audit", async () => {
      await new Promise(() => {});
    });

    await page.goto("/");

    const urlInput = page.getByLabel("URL da página");

    const submitButton = page.getByRole("button", {
      name: "Analisar página",
    });

    await urlInput.fill("https://example.com");
    await submitButton.click();

    const statusMessage = page.getByRole("status");

    const loadingButton = page.getByRole("button", {
      name: "Analisando...",
    });

    await expect(statusMessage).toContainText("Analisando...");
    await expect(loadingButton).toBeDisabled();
    await expect(urlInput).toBeDisabled();
  });

  test("mensagem de erro deve ser anunciada para tecnologias assistivas", async ({
    page,
  }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "URL inválida para análise.",
        }),
      });
    });

    await page.goto("/");

    const urlInput = page.getByLabel("URL da página");

    const submitButton = page.getByRole("button", {
      name: "Analisar página",
    });

    await urlInput.fill("https://example.com");
    await submitButton.click();

    const errorMessage = page.getByText("URL inválida para análise.");

    await expect(errorMessage).toBeVisible();
  });
});


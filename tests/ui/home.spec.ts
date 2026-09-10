import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Lab - acessibilidade e interface", () => {
  // ============================================================
  // 1. ACESSIBILIDADE ESTRUTURAL DA HOME
  // ============================================================

  test("página inicial não deve apresentar violações de acessibilidade", async ({
    page,
  }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("deve possuir link de pular para o conteúdo principal (skip link)", async ({
    page,
  }) => {
    await page.goto("/");

    const skipLink = page.getByRole("link", {
      name: "Pular para o conteúdo principal",
    });

    await expect(skipLink).toBeAttached();
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

    await urlInput.fill("https://example.com");
    await urlInput.focus();

    await expect(urlInput).toBeFocused();

    await page.keyboard.press("Tab");

    await expect(submitButton).toBeFocused();
  });

  // ============================================================
  // 2. ELEMENTOS DA INTERFACE
  // ============================================================

  test("botões de preset devem estar visíveis e funcionais", async ({
    page,
  }) => {
    await page.goto("/");

    const demoWithViolationsBtn = page.getByRole("button", {
      name: /Página com problemas/i,
    });

    const demoAccessibleBtn = page.getByRole("button", {
      name: /Páginas sem violações/i,
    });

    await expect(demoWithViolationsBtn).toBeVisible();
    await expect(demoAccessibleBtn).toBeVisible();
  });

  test("mensagem de carregamento deve ser anunciada para tecnologias assistivas", async ({
    page,
  }) => {
    await page.route("**/api/audit", async () => {
      await new Promise(() => { });
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

    await expect(statusMessage).toContainText("Analisando");
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

  // ============================================================
  // 3. FLUXO PRINCIPAL DE AUDITORIA
  // ============================================================

  test("deve exibir relatório completo com score e filtros ao concluir análise com sucesso", async ({
    page,
  }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Auditoria concluída.",
          url: "http://localhost:3000/test-page",
          title: "Página de teste",
          score: 72,
          violations: [
            {
              id: "image-alt",
              impact: "critical",
              description:
                "Garante que elementos <img> possuam texto alternativo",
              help: "Imagens devem possuir texto alternativo",
              helpUrl:
                "https://dequeuniversity.com/rules/axe/4.10/image-alt",
              tags: ["cat.text-alternatives", "wcag2a", "wcag111"],
              nodes: [
                {
                  html: '<img src="/test-image.jpg" />',
                  target: ["img"],
                  failureSummary:
                    "Fix all of the following: Element does not have an alt attribute",
                },
              ],
            },
          ],
        }),
      });
    });

    await page.goto("/");

    const urlInput = page.getByLabel("URL da página");

    await urlInput.fill("http://localhost:3000/test-page");

    await page.getByRole("button", {
      name: "Analisar página",
    }).click();

    await expect(
      page.getByRole("heading", {
        name: "Relatório de Auditoria",
      }),
    ).toBeVisible();

    await expect(page.getByText("Score A11Y")).toBeVisible();
    await expect(page.getByText("72")).toBeVisible();

    await expect(
      page.getByText("Imagens devem possuir texto alternativo"),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Copiar Markdown",
      }),
    ).toBeVisible();
  });

  // ============================================================
  // 4. FILTROS
  // ============================================================

  test("deve filtrar violações por impacto", async ({ page }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Auditoria concluída.",
          url: "http://localhost:3000/test-page",
          title: "Página de teste",
          score: 72,
          violations: [
            {
              id: "image-alt",
              impact: "critical",
              description:
                "Garante que elementos <img> possuam texto alternativo",
              help: "Imagens devem possuir texto alternativo",
              helpUrl:
                "https://dequeuniversity.com/rules/axe/4.10/image-alt",
              tags: ["cat.text-alternatives", "wcag2a", "wcag111"],
              nodes: [
                {
                  html: '<img src="/test-image.jpg" />',
                  target: ["img"],
                  failureSummary:
                    "Fix all of the following: Element does not have an alt attribute",
                },
              ],
            },
            {
              id: "label",
              impact: "moderate",
              description: "Garante que os campos tenham labels",
              help: "Form elements must have labels",
              helpUrl: "https://dequeuniversity.com/rules/axe/label",
              tags: ["cat.forms", "wcag2a", "wcag412"],
              nodes: [
                {
                  html: '<input type="text" />',
                  target: ["input"],
                },
              ],
            },
          ],
        }),
      });
    });

    await page.goto("/");

    await page.getByLabel("URL da página").fill(
      "http://localhost:3000/test-page",
    );

    await page.getByRole("button", {
      name: "Analisar página",
    }).click();

    await expect(
      page.getByText("Imagens devem possuir texto alternativo"),
    ).toBeVisible();

    await expect(
      page.getByText("Form elements must have labels"),
    ).toBeVisible();

    const criticalFilter = page.getByRole("button", {
      name: /Critical/i,
    });

    await criticalFilter.click();

    await expect(criticalFilter).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await expect(
      page.getByText("Imagens devem possuir texto alternativo"),
    ).toBeVisible();

    await expect(
      page.getByText("Form elements must have labels"),
    ).not.toBeVisible();
  });

  test("deve filtrar violações pela busca textual e permitir limpar a busca", async ({
    page,
  }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Auditoria concluída.",
          url: "http://localhost:3000/test-page",
          title: "Página de teste",
          score: 72,
          violations: [
            {
              id: "image-alt",
              impact: "critical",
              description:
                "Garante que elementos <img> possuam texto alternativo",
              help: "Imagens devem possuir texto alternativo",
              helpUrl:
                "https://dequeuniversity.com/rules/axe/4.10/image-alt",
              tags: ["cat.text-alternatives", "wcag2a", "wcag111"],
              nodes: [
                {
                  html: '<img src="/test-image.jpg" />',
                  target: ["img"],
                  failureSummary:
                    "Fix all of the following: Element does not have an alt attribute",
                },
              ],
            },
            {
              id: "label",
              impact: "moderate",
              description: "Garante que os campos tenham labels",
              help: "Form elements must have labels",
              helpUrl: "https://dequeuniversity.com/rules/axe/label",
              tags: ["cat.forms", "wcag2a", "wcag412"],
              nodes: [
                {
                  html: '<input type="text" />',
                  target: ["input"],
                },
              ],
            },
          ],
        }),
      });
    });

    await page.goto("/");

    await page.getByLabel("URL da página").fill(
      "http://localhost:3000/test-page",
    );

    await page.getByRole("button", {
      name: "Analisar página",
    }).click();

    await expect(
      page.getByText("Imagens devem possuir texto alternativo"),
    ).toBeVisible();

    await expect(
      page.getByText("Form elements must have labels"),
    ).toBeVisible();

    const searchInput = page.getByRole("searchbox", {
      name: "Buscar regras ou palavras-chave",
    });

    await searchInput.fill("image-alt");

    await expect(
      page.getByText("Imagens devem possuir texto alternativo"),
    ).toBeVisible();

    await expect(
      page.getByText("Form elements must have labels"),
    ).not.toBeVisible();

    const clearButton = page.getByRole("button", {
      name: "Limpar busca",
    });

    await expect(clearButton).toBeVisible();

    await clearButton.click();

    await expect(searchInput).toHaveValue("");

    await expect(
      page.getByText("Imagens devem possuir texto alternativo"),
    ).toBeVisible();

    await expect(
      page.getByText("Form elements must have labels"),
    ).toBeVisible();
  });

  // ============================================================
  // 5. DETALHAMENTO TÉCNICO
  // ============================================================

  test("deve exibir os detalhes técnicos da violação", async ({ page }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Auditoria concluída.",
          url: "http://localhost:3000/test-page",
          title: "Página de teste",
          score: 72,
          violations: [
            {
              id: "image-alt",
              impact: "critical",
              description:
                "Garante que elementos <img> possuam texto alternativo",
              help: "Imagens devem possuir texto alternativo",
              helpUrl:
                "https://dequeuniversity.com/rules/axe/4.10/image-alt",
              tags: ["cat.text-alternatives", "wcag2a", "wcag111"],
              nodes: [
                {
                  html: '<img src="/test-image.jpg" />',
                  target: ["img"],
                  failureSummary:
                    "Fix all of the following: Element does not have an alt attribute",
                },
              ],
            },
          ],
        }),
      });
    });

    await page.goto("/");

    await page.getByLabel("URL da página").fill(
      "http://localhost:3000/test-page",
    );

    await page.getByRole("button", {
      name: "Analisar página",
    }).click();

    await expect(
      page.getByText("Imagens devem possuir texto alternativo"),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Garante que elementos <img> possuam texto alternativo",
      ),
    ).toBeVisible();

    await expect(
      page.getByText("critical", { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Fix all of the following: Element does not have an alt attribute",
      ),
    ).toBeVisible();

    const documentationLink = page.getByRole("link", {
      name: /documentação|saiba mais|regra/i,
    });

    await expect(documentationLink).toBeVisible();

    await expect(documentationLink).toHaveAttribute(
      "href",
      "https://dequeuniversity.com/rules/axe/4.10/image-alt",
    );

    await expect(
      page.getByText('<img src="/test-image.jpg" />'),
    ).toBeVisible();
  });

  test("deve copiar o relatório em formato Markdown", async ({ page }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Auditoria concluída.",
          url: "http://localhost:3000/test-page",
          title: "Página de teste",
          score: 72,
          violations: [
            {
              id: "image-alt",
              impact: "critical",
              description:
                "Garante que elementos <img> possuam texto alternativo",
              help: "Imagens devem possuir texto alternativo",
              helpUrl:
                "https://dequeuniversity.com/rules/axe/4.10/image-alt",
              tags: ["cat.text-alternatives", "wcag2a", "wcag111"],
              nodes: [
                {
                  html: '<img src="/test-image.jpg" />',
                  target: ["img"],
                  failureSummary:
                    "Fix all of the following: Element does not have an alt attribute",
                },
              ],
            },
          ],
        }),
      });
    });

    await page.goto("/");

    await page.getByLabel("URL da página").fill(
      "http://localhost:3000/test-page",
    );

    await page.getByRole("button", {
      name: "Analisar página",
    }).click();

    await expect(
      page.getByRole("button", {
        name: "Copiar Markdown",
      }),
    ).toBeVisible();

    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async () => { },
        },
        configurable: true,
      });
    });

    await page.getByRole("button", {
      name: "Copiar Markdown",
    }).click();

    await expect(
      page.getByRole("button", {
        name: /Markdown copiado|Copiado/i,
      }),
    ).toBeVisible();
  });

  test("deve baixar o relatório em formato JSON", async ({ page }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Auditoria concluída.",
          url: "http://localhost:3000/test-page",
          title: "Página de teste",
          score: 72,
          violations: [
            {
              id: "image-alt",
              impact: "critical",
              description:
                "Garante que elementos <img> possuam texto alternativo",
              help: "Imagens devem possuir texto alternativo",
              helpUrl:
                "https://dequeuniversity.com/rules/axe/4.10/image-alt",
              tags: ["cat.text-alternatives", "wcag2a", "wcag111"],
              nodes: [
                {
                  html: '<img src="/test-image.jpg" />',
                  target: ["img"],
                  failureSummary:
                    "Fix all of the following: Element does not have an alt attribute",
                },
              ],
            },
          ],
        }),
      });
    });

    await page.goto("/");

    await page.getByLabel("URL da página").fill(
      "http://localhost:3000/test-page",
    );

    await page.getByRole("button", {
      name: "Analisar página",
    }).click();

    const downloadPromise = page.waitForEvent("download");

    await page.getByRole("button", {
      name: /Baixar JSON|Download JSON/i,
    }).click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });
  test("deve exibir estado aprovado quando a página não possui violações", async ({
    page,
  }) => {
    await page.route("**/api/audit", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Auditoria concluída.",
          url: "http://localhost:3000/test-page-ok",
          title: "Página de teste sem violações",
          score: 100,
          violations: [],
        }),
      });
    });

    await page.goto("/");

    await page.getByLabel("URL da página").fill(
      "http://localhost:3000/test-page-ok",
    );

    await page.getByRole("button", {
      name: "Analisar página",
    }).click();

    await expect(
      page.getByText("100"),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Auditoria concluída sem violações",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Copiar Markdown",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: /Baixar JSON|Download JSON/i,
      }),
    ).toBeVisible();
  });
});
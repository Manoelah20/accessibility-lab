import { test, expect } from "@playwright/test";

test.describe("API de auditoria", () => {
  test("deve rejeitar requisição sem URL", async ({ request }) => {
    const response = await request.post("/api/audit", {
      data: {},
    });

    expect(response.status()).toBe(400);

    const data = await response.json();

    expect(data.error).toBe("A URL é obrigatória.");
  });

  test("deve rejeitar protocolo diferente de HTTP ou HTTPS", async ({
    request,
  }) => {
    const response = await request.post("/api/audit", {
      data: {
        url: "ftp://exemplo.com",
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();

    expect(data.error).toBe("A URL deve usar HTTP ou HTTPS.");
  });

  test("deve rejeitar URL inválida", async ({ request }) => {
    const response = await request.post("/api/audit", {
      data: {
        url: "nao-e-uma-url",
      },
    });

    const data = await response.json();

    expect(response.status()).toBe(400);
    expect(data.error).toBe("Não foi possível analisar essa página.");
  });

  test("deve retornar violações de acessibilidade da página analisada", async ({
    request,
  }) => {
    const response = await request.post("/api/audit", {
      data: {
        url: "http://localhost:3000/test-page",
      },
    });

    const data = await response.json();

    expect(response.status()).toBe(200);
    expect(data.message).toBe("Auditoria concluída.");
    expect(data.url).toBe("http://localhost:3000/test-page");
    expect(data.title).toBe("Página de teste de acessibilidade | Accessibility Lab");
    expect(Array.isArray(data.violations)).toBe(true);
    expect(typeof data.passesCount).toBe("number");
    expect(typeof data.incompleteCount).toBe("number");
    expect(typeof data.inapplicableCount).toBe("number");
    expect(typeof data.score).toBe("number");
    expect(typeof data.timestamp).toBe("string");
    expect(data.violations.length).toBeGreaterThan(0);

    const imageViolation = data.violations.find(
      (violation: { id: string }) => violation.id === "image-alt",
    );

    expect(imageViolation).toBeDefined();
    expect(imageViolation.impact).toBe("critical");
  });

  test("deve auditar com sucesso a página de teste sem violações (/test-page-ok)", async ({
    request,
  }) => {
    const response = await request.post("/api/audit", {
      data: {
        url: "http://localhost:3000/test-page-ok",
      },
    });

    const data = await response.json();

    expect(response.status()).toBe(200);
    expect(data.message).toBe("Auditoria concluída.");
    expect(data.violations).toEqual([]);
    expect(data.score).toBe(100);
  });

  test("deve rejeitar acesso a endereço local não autorizado", async ({ request }) => {
    const response = await request.post("/api/audit", {
      data: {
        url: "http://127.0.0.1:3000/test-page",
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();

    expect(data.error).toBe(
      "Não é permitido analisar endereços locais ou privados.",
    );
  });
});
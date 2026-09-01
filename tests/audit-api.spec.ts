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

    const imageViolation = data.violations.find(
      (violation: { id: string }) => violation.id === "image-alt",
    );

    expect(imageViolation).toBeDefined();
    expect(imageViolation.impact).toBe("critical");
  });

  test("deve rejeitar acesso a endereço local", async ({ request }) => {
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
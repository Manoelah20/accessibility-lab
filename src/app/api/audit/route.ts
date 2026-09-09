import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import { calculateAccessibilityScore } from "@/lib/audit-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let browser;

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A URL é obrigatória." },
        { status: 400 },
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Não foi possível analisar essa página." },
        { status: 400 },
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "A URL deve usar HTTP ou HTTPS." },
        { status: 400 },
      );
    }

    const hostname = parsedUrl.hostname;

    const isLocalOrPrivate =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

    const isTestPage =
      hostname === "localhost" &&
      (parsedUrl.port === "3000" ||
        parsedUrl.port === "" ||
        !parsedUrl.port) &&
      (parsedUrl.pathname === "/test-page" ||
        parsedUrl.pathname === "/test-page-ok" ||
        parsedUrl.pathname.startsWith("/test-page"));

    if (isLocalOrPrivate && !isTestPage) {
      return NextResponse.json(
        {
          error: "Não é permitido analisar endereços locais ou privados.",
        },
        { status: 400 },
      );
    }

    const isVercel = process.env.VERCEL === "1";

    if (isVercel) {
      const executablePath = await chromium.executablePath();

      browser = await playwright.launch({
        args: chromium.args,
        executablePath,
        headless: true,
      });
    } else {
      const { chromium: localChromium } = await import("playwright");

      browser = await localChromium.launch({
        headless: true,
      });
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const title = await page.title();

    const results = await new AxeBuilder({
      page,
    }).analyze();

    const score = calculateAccessibilityScore(results.violations);

    return NextResponse.json({
      message: "Auditoria concluída.",
      url,
      title: title || "Página sem título",
      violations: results.violations,
      passesCount: results.passes ? results.passes.length : 0,
      incompleteCount: results.incomplete ? results.incomplete.length : 0,
      inapplicableCount: results.inapplicable
        ? results.inapplicable.length
        : 0,
      score,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ERRO NA AUDITORIA:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro inesperado na auditoria";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
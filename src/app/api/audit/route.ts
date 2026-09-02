import { NextResponse } from "next/server";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

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

    const parsedUrl = new URL(url);

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
      parsedUrl.port === "3000" &&
      parsedUrl.pathname === "/test-page";

    if (isLocalOrPrivate && !isTestPage) {
      return NextResponse.json(
        {
          error: "Não é permitido analisar endereços locais ou privados.",
        },
        { status: 400 },
      );
    }

    browser = await chromium.launch({
      headless: true,
    });

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

    return NextResponse.json({
      message: "Auditoria concluída.",
      url,
      title,
      violations: results.violations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível analisar essa página.",
      },
      { status: 400 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
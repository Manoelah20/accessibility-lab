import { test, expect } from "@playwright/test";
import { calculateAccessibilityScore } from "../../src/lib/audit-utils";

test.describe("Accessibility Score", () => {
    test("deve retornar 100 sem violações", () => {
        expect(calculateAccessibilityScore([])).toBe(100);
    });

    test("deve calcular uma violação minor", () => {
        expect(
            calculateAccessibilityScore([
                {
                    impact: "minor",
                    nodes: [{}],
                },
            ]),
        ).toBe(97);
    });

    test("deve calcular uma violação moderate", () => {
        expect(
            calculateAccessibilityScore([
                {
                    impact: "moderate",
                    nodes: [{}],
                },
            ]),
        ).toBe(92);
    });

    test("deve calcular uma violação serious", () => {
        expect(
            calculateAccessibilityScore([
                {
                    impact: "serious",
                    nodes: [{}],
                },
            ]),
        ).toBe(85);
    });

    test("deve calcular uma violação critical", () => {
        expect(
            calculateAccessibilityScore([
                {
                    impact: "critical",
                    nodes: [{}],
                },
            ]),
        ).toBe(75);
    });

    test("deve calcular duas violações moderate", () => {
        expect(
            calculateAccessibilityScore([
                {
                    impact: "moderate",
                    nodes: [{}],
                },
                {
                    impact: "moderate",
                    nodes: [{}],
                },
            ]),
        ).toBe(84);
    });

    test("deve considerar múltiplos elementos afetados", () => {
        expect(
            calculateAccessibilityScore([
                {
                    impact: "moderate",
                    nodes: [{}, {}, {}],
                },
            ]),
        ).toBe(90);
    });
});
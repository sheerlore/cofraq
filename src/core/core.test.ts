import { expect, test, describe } from "vitest";
import {
  countArrow,
  countVertex,
  makeGraphText,
  toHalfWidth,
  toNumberArray,
  twoSidesMinus,
} from "./core";

describe("basic function", () => {
  test.each([
    { c: "０", expected: "0" },
    { c: "２", expected: "2" },
    { c: "５", expected: "5" },
    { c: "９", expected: "9" },
    { c: "１０", expected: "10" },
    { c: "９９", expected: "99" },
  ])("toHalfWidth($c) -> $expected", (v) => {
    expect(toHalfWidth(v.c)).toBe(v.expected);
  });

  test.each([
    { in: "2, 3, 3, 2", expected: [2, 3, 3, 2] },
    { in: "1, 2, 2, 1", expected: [1, 2, 2, 1] },
    { in: "1, 1, 1", expected: [1, 1, 1] },
    { in: "", expected: [] },
    { in: "１, ２, 1, 1", expected: [1, 2, 1, 1] },
    { in: "１, 1, 1, ２", expected: [1, 1, 1, 2] },
  ])("toNumberArray($in) -> $expected", (v) => {
    expect(toNumberArray(v.in)).toStrictEqual(v.expected);
  });

  test.each([
    { in: [2, 3, 3, 2], expected: [1, 3, 3, 1] },
    { in: [1, 2, 2, 1], expected: [0, 2, 2, 0] },
    { in: [1, 1, 1, 1], expected: [0, 1, 1, 0] },
  ])("twoSidesMinus($in) -> $expected", (v) => {
    expect(twoSidesMinus(v.in)).toStrictEqual(v.expected);
  });

  test.each([
    { in: [1, 2, 2], expected: "○ ← ○ → ○ → ○ ← ○ ← ○" },
    { in: [0, 2, 1], expected: "○ → ○ → ○ ← ○" },
    { in: [1, 2, 0], expected: "○ ← ○ → ○ → ○" },
    { in: [0, 2, 0], expected: "○ → ○ → ○" },
  ])("makeGraphText($in) -> $expected", (v) => {
    expect(makeGraphText(v.in)).toBe(v.expected);
  });

  test.each([
    { in: [2, 3, 3, 2], expected: 11 },
    { in: [1, 2, 2, 1], expected: 7 },
    { in: [1, 1, 1, 1], expected: 5 },
  ])("countVertex($in) -> $expected", (v) => {
    expect(countVertex(v.in)).toStrictEqual(v.expected);
  });

  test.each([
    { in: [2, 3, 3, 2], expected: 10 },
    { in: [1, 2, 2, 1], expected: 6 },
    { in: [1, 1, 1, 1], expected: 4 },
  ])("countArrow($in) -> $expected", (v) => {
    expect(countArrow(v.in)).toStrictEqual(v.expected);
  });
});

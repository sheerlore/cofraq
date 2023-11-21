// ================================================
// Display
export function toHalfWidth(str: string): string {
  return str.replace(/[０-９]/g, (s: string) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  );
}

export function toNumberArray(str: string): number[] {
  if (str === "") return [];
  return str.split(",").map(toHalfWidth).map(Number);
}

export function twoSidesMinus(arr: number[]): number[] {
  arr[0] -= 1;
  arr[arr.length - 1] -= 1;
  return arr;
}

const V = "○";
export function makeGraphText(arr: number[]): string {
  if (arr.length === 0) return "";
  let res = V;
  arr.forEach((num, index) => {
    for (let i = 0; i < num; i++) {
      res += index % 2 == 0 ? " ← " : " → ";
      res += V;
    }
  });
  return res;
}
// ================================================
// Graph
export function countVertex(arr: number[]): number {
  return arr.reduce((cur, ele) => cur + ele, 0) + 1;
}

export function countArrow(arr: number[]): number {
  return arr.reduce((cur, ele) => cur + ele, 0);
}

export function calclatePatern(arr: number[]): number[] {
  return arr;
}

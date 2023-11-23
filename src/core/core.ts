export type InputString = string;
export type DisplayText = string;
export type Char = string;
export type Sequence = number[];
export type AdjMat = number[][];
export type Patterns = { [key: number]: number[][] };

// ================================================
// Display
// ================================================

export function toHalfWidth(c: Char): Char {
  return c.replace(/[０-９]/g, (cc: Char) =>
    String.fromCharCode(cc.charCodeAt(0) - 0xfee0)
  );
}

export function toNumberArray(str: InputString): Sequence | undefined {
  if (str === "") return undefined;
  return str.split(",").map(toHalfWidth).map(Number);
}

export function twoSidesMinus(seq: Sequence): Sequence {
  seq[0] -= 1;
  seq[seq.length - 1] -= 1;
  return seq;
}

const VW = "○";
const VB = "●";
export function makeGraphText(seq?: Sequence): DisplayText | undefined {
  if (seq !== undefined && seq.length !== 0) {
    let res = VW;
    seq.forEach((num, index) => {
      for (let i = 0; i < num; i++) {
        res += index % 2 == 0 ? " ← " : " → ";
        res += VW;
      }
    });
    return res;
  }
  return undefined;
}

export function makePatternGraphText(
  pat?: Sequence,
  seq?: Sequence
): DisplayText | undefined {
  if (
    seq !== undefined &&
    pat !== undefined &&
    pat.length === countVertex(seq) &&
    seq.length !== 0
  ) {
    let res = pat[0] === 1 ? VB : VW;
    let pin = 1;
    seq.forEach((num, index) => {
      for (let i = 0; i < num; i++) {
        res += index % 2 == 0 ? " ← " : " → ";
        res += pat[pin] === 1 ? VB : VW;
        pin++;
      }
    });
    return res;
  }
  return undefined;
}

export function makeBWString(arr: number[]): DisplayText {
  if (arr.length === 0) return "";
  let res = "";
  for (let i = 0; i < arr.length; i++) {
    res += makeBWChar(arr[i]);
  }
  return res;
}

export function makeBWChar(num: number): DisplayText {
  if (num >= 1) return "■";
  return "□";
}
// ================================================
// Graph
// ================================================

export function countVertex(seq?: Sequence): number {
  if (seq !== undefined) {
    return seq.reduce((cur, ele) => cur + ele, 0) + 1;
  }
  return 0;
}

export function countArrow(seq?: Sequence): number {
  if (seq !== undefined) {
    return seq.reduce((cur, ele) => cur + ele, 0);
  }
  return 0;
}

// 対応する隣接行列を作成する
export function makeAdjMat(seq?: Sequence): AdjMat | undefined {
  if (seq !== undefined && seq.length !== 0) {
    const vertex_num = countVertex(seq);
    const mat = [...Array(vertex_num)].map((_) =>
      new Array(vertex_num).fill(0)
    );
    let pin = 0;
    for (let i = 0; i < seq.length; i++) {
      for (let j = 0; j < seq[i]; j++) {
        let v = j + pin;
        if (i % 2 == 0) {
          // left arrow
          mat[v + 1][v] = 1;
        } else {
          // right arrow
          mat[v][v + 1] = 1;
        }
      }
      pin += seq[i];
    }
    return mat;
  }
  return undefined;
}

// パターンを列挙したオブジェクト作成
export function calclatePattern(mat?: AdjMat): Patterns {
  if (mat === undefined) return {};
  const vertex_num = mat.length;
  // 0個とすべて埋めたパターン(vertex_num個)は決まっているので前もって入れておく
  let res: Patterns = {
    0: [new Array(vertex_num).fill(0)],
    [vertex_num]: [new Array(vertex_num).fill(1)],
  };

  // n = 1の場合を作成する
  res[1] = [];
  for (let i = 0; i < vertex_num; i++) {
    let temp = new Array(vertex_num).fill(0);
    if (checkOne(mat, i)) {
      temp[i] = 1;
      res[1].push(temp);
    }
  }
  // n = 0, 1, 2で完成
  if (vertex_num === 2) return res;

  // n = 2, ..., (vertex_num-1)の間で調べる
  for (let n = 2; n <= vertex_num - 1; n++) {
    console.log("n =", n);
    res[n] = [];
    // n-1個のパターンを使って計算する
    for (let prepat of res[n - 1]) {
      // prepetに頂点を一つ追加して調べる
      for (let pos = 0; pos < vertex_num; pos++) {
        if (prepat[pos] === 1) continue;
        prepat[pos] = 1; // 1を挿入
        let candidate_pat = Array.from(prepat);
        if (checkRange(mat, candidate_pat) && !inArray(res[n], candidate_pat)) {
          res[n].push(candidate_pat);
        }
        prepat[pos] = 0; // 操作を戻す
      }
    }
  }
  return res;
}

function inArray(arrs: number[][], arr: number[]): boolean {
  if (arrs.length === 0) return false;
  for (let ar of arrs) {
    if (ar.toString() === arr.toString()) return true;
  }
  return false;
}

/*
黒く塗る部分を隣接行列の対角成分を塗ることに対応させる。
対角成分の点（頂点）の左に1があれば左に矢印がある
対角成分の点（頂点）の右に1があれば右に矢印がある。

塗る頂点が1つの場合左右に矢印があってはだめ

複数塗る場合一番上（列として見た場合左）の頂点の左に矢印がある場合だめ
複数塗る場合一番下（列として見た場合右）の頂点の右に矢印がある場合だめ

複数塗った場合連続していないで離れていればそれぞれのルールで塗る
NG: false
OK: true
とする
*/
function checkOne(mat: AdjMat, v: number): boolean {
  if (v === 0 && mat[v][v + 1] === 1) return false;
  if (v === mat.length - 1 && mat[v][v - 1] === 1) return false;
  if (mat[v][v - 1] === 1 || mat[v][v + 1] === 1) return false;
  return true;
}

function checkOneLeft(mat: AdjMat, v: number): boolean {
  if (v === 0) return true;
  if (mat[v][v - 1] === 1) return false;
  return true;
}
function checkOneRight(mat: AdjMat, v: number): boolean {
  if (v === mat.length) return true;
  if (mat[v][v + 1] === 1) return false;
  return true;
}

function checkRange(mat: AdjMat, vs: number[]): boolean {
  let s = vs.indexOf(1);
  let t = s;
  while (true) {
    let temp_t = vs.indexOf(1, t + 1);
    if (temp_t === -1) {
      if (s !== t) {
        return checkOneLeft(mat, s) && checkOneRight(mat, t);
      }
      if (s === t) {
        return checkOne(mat, s);
      }
    }
    // 中間
    if (temp_t !== -1) {
      if (temp_t === t + 1) {
        t = temp_t;
      } else if (temp_t !== t + 1) {
        if (!checkOneLeft(mat, s)) return false;
        if (!checkOneRight(mat, t)) return false;
        s = temp_t;
        t = s;
      } else {
        if (!checkOne(mat, s)) return false;
        s = temp_t;
        t = s;
      }
    }
  }
}

export function countPatternsNum(pat?: Patterns): Sequence | undefined {
  if (pat !== undefined) {
    let res = [];
    for (let key in pat) {
      res[Number(key)] = pat[key].length;
    }
    return res;
  }
  return undefined;
}

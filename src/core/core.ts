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
  const res = [...seq];
  res[0] -= 1;
  res[res.length - 1] -= 1;
  return res;
}

export function sideZeroRej(seq?: Sequence): Sequence {
  if (seq === undefined) return [];
  let res = [...seq];
  if (res[0] === 0) {
    res = res.slice(1);
  }
  if (res[res.length - 1] === 0) {
    res = res.slice(0, res.length - 1);
  }
  return res;
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
export async function calclatePattern(mat?: AdjMat): Promise<Patterns> {
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

export async function countPatternsNum(
  pat?: Patterns
): Promise<Sequence | undefined> {
  if (pat !== undefined) {
    let res = [];
    for (let key in pat) {
      res[Number(key)] = pat[key].length;
    }
    return res;
  }
  return undefined;
}

function isPrime(num: number): boolean {
  if (!Number.isSafeInteger(num)) {
    throw safeIntegerError;
  }
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  const sqrtNum = Math.floor(Math.sqrt(num));
  for (let i = 3; i <= sqrtNum; i += 2) {
    if (num % i === 0) return false;
  }

  return true;
}

// エラストテネスの篩
function sieveOfEratosthenes(N: number): number[] {
  console.log("sieve N = ", N);
  let isPrimeArr = new Array(N + 1).fill(true);
  for (let p = 2; p * p <= N; p++) {
    if (isPrimeArr[p] == true) {
      for (let i = p * p; i <= N; i += p) {
        isPrimeArr[i] = false;
      }
    }
  }
  let prime = [];
  for (let i = 2; i <= N; i++) {
    if (isPrimeArr[i]) {
      prime.push(i);
    }
  }
  return prime;
}
// 今回は扱う数の範囲から整数の範囲を超えたものは基本的に可約であると判断する
// 可約の場合エラーが出る。
const safeIntegerError = new Error("安全な整数の範囲を超えました");

// Murtyの既約判定法 ===================
// f(x) = a0 + a1x + a2x^2 + ... + adx^d <- Z[x]
// H = max |a_i / a_d | (i = 0,...,d-1)
// n >= H+2となる整数nに対しf(n)が素数となるとき、f(x)は
// Z[x]上で既約
// INPUT =======================
// 係数を小さい順から配列で受け取る
// [a0, a1, a2, ... , an]
// 条件 =========================
// 今回は最大次数が1と決まっているのでモニックなものしか入らない
export async function isIrreducible(coefficient: number[]): Promise<boolean> {
  const H = coefficient
    .slice(0, -1)
    .reduce((prev, cur) => Math.max(Math.abs(prev), Math.abs(cur)), 0);
  console.log("H = ", H);
  let n = H + 2;
  while (true) {
    let f = coefficient[0];
    for (let i = 1; i < coefficient.length; i++) {
      f += coefficient[i] * Math.pow(n, i);
    }
    try {
      console.log("n = ", n, "f = ", f);
      if (isPrime(f)) {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    n += 1;
  }
}

// Eisensteinの既約判定法
// f(x) = a0 + a1x + a2x^2 + ... + anx^n <- Z[x]
// 素数Pが存在して、
// 　Pはanを割り切れない (pの倍数でない)
// 　Pはすべての他のan-1, ... , a0を割り切れる（pの倍数である)
// 　P^2はa0を割り切れない (pの倍数でない)
// ならf(x)はQ上既約
// INPUT =======================
// 係数を小さい順から配列で受け取る
// [a0, a1, a2, ... , an]
// 条件 =========================
// 今回は最大次数が1と決まっているのでモニックなものしか入らない
// したがって「Pはanを割り切れない（Pの倍数でない）」はOK
function checkEisenstein(arr: number[], P: number, N: number): boolean {
  if (arr[0] % P === 0) {
    return false;
  }
  for (let i = 1; i < N; i++) {
    if (arr[i] % P !== 0) {
      return false;
    }
  }
  if (arr[N - 1] % (P * P) === 0) {
    return false;
  }
  return true;
}
export async function isIrreducible2(coefficient: number[]): Promise<boolean> {
  console.log("アイゼンシュタインの既約判定法 === ", coefficient);
  const N = coefficient.length;
  const rcoef = [...coefficient].reverse();
  console.log("RCOEF: ", rcoef);
  let M = -1;
  // Find the maximum element in rcoef
  for (let i = 0; i < N; i++) {
    M = Math.max(M, rcoef[i]);
  }
  console.log("M = ", M);
  let primes = sieveOfEratosthenes(M * M * M);

  // Check if any prime satisfies the conditions
  for (let i = 0; i < primes.length; i++) {
    if (checkEisenstein(rcoef, primes[i], N)) {
      console.log(
        "アイゼンシュタインの既約判定法により、次の素数で満たします P = ",
        primes[i]
      );
      return true;
    }
  }
  console.log("NON IRR");
  return false;
}

export async function checkIrr(coefficient: number[]): Promise<boolean> {
  const r1 = await isIrreducible(coefficient);
  // const r2 = await isIrreducible2(coefficient);
  return r1;
}

export function createExpString(arr: Sequence | undefined) {
  if (arr === undefined) return "";
  let exp = `${arr[0]} + `;
  for (let i = 1; i < arr.length; i++) {
    let c = "";
    if (arr[i] !== 1) c = String(arr[i]);
    if (i == 1) {
      exp += `${c}x + `;
      continue;
    }
    if (i == arr.length - 1) {
      exp += `x^${i}`;
      continue;
    }
    exp += `${c}x^${i} + `;
  }
  return exp;
}

// Woldram上で既約多項式か判定するためのURL
export function createWolframURL(arr: Sequence | undefined) {
  if (arr === undefined) return "";
  const exp = createExpString(arr);
  const url = new URL("https://www.wolframalpha.com/input");
  url.searchParams.set("i", `IrreduciblePolynomialQ[ ${exp} ]`);
  url.searchParams.set("lang", "ja");
  return url.toString();
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// 有理数の連分数展開
export function rationalToContinuedFraction(
  numerator: number,
  denominator: number
): number[] {
  const result: number[] = [];
  let _numerator = numerator;
  let _denominator = denominator;
  while (_denominator !== 0) {
    const quotient = Math.floor(_numerator / _denominator);
    result.push(quotient);

    const newNumerator = _denominator;
    _denominator = _numerator - quotient * _denominator;
    _numerator = newNumerator;

    const commonDivisor = gcd(_numerator, _denominator);
    _numerator /= commonDivisor;
    _denominator /= commonDivisor;
  }
  if (result[result.length - 1] !== 1) {
    result[result.length - 1] -= 1;
    result.push(1);
  }
  if (numerator < denominator) {
    result.shift();
  }

  return result;
}

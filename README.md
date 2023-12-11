# cofraq

有理数連分数展開で出た数字をなんか An 型のグラフで表してその数を数えるやつ

先生が作ってほしい言ったので作る

サイト

[https://sheerlore.github.io/cofraq/](https://sheerlore.github.io/cofraq/)

## 例

1. 有理数？の連分数展開する

$$
  \dfrac{11}{3} = 3 + \dfrac{1}{1 + \dfrac{1}{1 + \dfrac{1}{1}}}
$$

$$
\longrightarrow  (3, 1, 1, 1)
$$

2. この数字の両端を-1する

$$\rightarrow  (2, 1, 1, 0)$$

3. この数字に対して（左、右、左、右、...　）の順番で数字の数だけ向き付け矢印を書く。このときの頂点は適当に取る

$$
\text{○} \leftarrow \text{○} \leftarrow \text{○} \rightarrow \text{○} \leftarrow \text{○}
$$

4. 次のルールで黒く塗りつぶしていく。黒く塗る個数ごとに何パターンあるか数える

$$\text{ルール：} \text{●} \rightarrow \text{○} \text{ の部分がない} $$

- 0 個

$$\text{○} \leftarrow \text{○} \leftarrow \text{○} \rightarrow \text{○} \leftarrow \text{○}$$

- 1 個

$$\text{●} \leftarrow \text{○} \leftarrow \text{○} \rightarrow \text{○} \leftarrow \text{○}$$

$$\text{○} \leftarrow \text{○} \leftarrow \text{○} \rightarrow \text{●} \leftarrow \text{○}$$

- 2 個

$$\text{●} \leftarrow \text{●} \leftarrow \text{○} \rightarrow \text{○} \leftarrow \text{○}$$

$$\text{○} \leftarrow \text{○} \leftarrow \text{○} \rightarrow \text{●} \leftarrow \text{●}$$

$$\text{●} \leftarrow \text{○} \leftarrow \text{○} \rightarrow \text{●} \leftarrow \text{○}$$

- 3 個

$$\text{●} \leftarrow \text{●} \leftarrow \text{○} \rightarrow \text{●} \leftarrow \text{○}$$

$$\text{●} \leftarrow \text{○} \leftarrow \text{○} \rightarrow \text{●} \leftarrow \text{●}$$

- 4 個

$$\text{●} \leftarrow \text{●} \leftarrow \text{○} \rightarrow \text{●} \leftarrow \text{●}$$

$$\text{●} \leftarrow \text{●} \leftarrow \text{●} \rightarrow \text{●} \leftarrow \text{○}$$

- 5 個

$$\text{●} \leftarrow \text{●} \leftarrow \text{●} \rightarrow \text{●} \leftarrow \text{●}$$

0 個から順にパターン数は　（1, 2, 3, 2, 2, 1）
これを整数係数多項式の係数にする。つまり。

$$
1 + 2X + 3X^2 + 2X^3 + 2X^4 + X^5
$$

これが7次以上で既約（因数分解できない）だそう。

ここでは、明らかにモニック（最高次係数が１）なので、
次の定理から、 $\mathbb{Q}$ 上既約かどうかを調べて $\mathbb{Z}$ 上既約か判定できそう？

定理

$f(x) \in \mathbb{Z}[x]$ をモニックかつ $deg f \ge 1$ とする。このとき次は同値である。

(1) $f(x)$ は $\mathbb{Z}$ 上 既約である。

(2) $f(x)$ は $\mathbb{Q}$ 上 既約である。

実際に既約かどうか判定するにはMurtyの既約判定法を用いることにする。これは数を大きくしていって度々素数かどうか判断しなくてはならないが、数の範囲的に（これはあくまで予想だが）JavaScriptが扱う整数の範囲(Number.MAX_SAFE_INTEGER)以内に収まると判断したため、この数以上になった場合には可約であるとする。なので正確性は保証できない。

定理 (Murtyの既約判定法)

$f(x) = a_dx^d + a_{d-1}x^{d-1} + \cdots + a_1x + a_0 \in \mathbb{Z}[x]$　を d次の多項式、

$$
H = \max_{0 \ge i \ge d-1}  |a_i / a_d |
$$

とする $n \ge H + 2$ となる整数 $n$ に対し $f(n)$ が素数となるとき $f(x)$ は $\mathbb{Z}[x]$ 上で既約である。

## 参考URL

[Murtyの既約判定法 - 現実と数学の区別が付かない - はてなブログ](https://egory-cat.hatenablog.com/entry/2018/09/30/011549#:~:text=%E3%81%A8%E3%81%99%E3%82%8B%E3%80%82,%E3%81%A8%E3%81%97%E3%81%A6%E6%97%A2%E7%B4%84%E3%81%A7%E3%81%82%E3%82%8B%E3%80%82)

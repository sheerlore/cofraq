# cofraq

有理数連分数展開で出た数字をなんか An 型のグラフで表してその数を数えるやつ

先生が作ってほしい言ったので作る

## 例

1. 有理数？の連分数展開する

$$
  \dfrac{11}{3} = 3 + \dfrac{1}{1 + \dfrac{1}{1 + \dfrac{1}{1}}}
$$

$$
\longrightarrow  (3, 1, 1, 1)
$$

2. この数字の両端を$-1$する

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

5. まとめ

0 個から順にパターン数は　（1, 2, 3, 2, 2, 1）
これを多項式の係数にする

$Z[X]$上では因数分解できない

$$
1 + 2X + 3X^2 + 2X^3 + 2X^4 + X^5
$$

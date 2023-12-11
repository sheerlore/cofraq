<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { twoSidesMinus, makeAdjMat, makeGraphText, toNumberArray, calclatePattern, AdjMat, makePatternGraphText, countPatternsNum, countVertex, countArrow, isIrreducible, createWolframURL, createExpString, rationalToContinuedFraction } from './core/core.ts'

const sequenceText = ref("")
const numeratorNum = ref(0)
const denominatorNum = ref(0)
// 自動で計算する部分
const sequenceArray = computed(() => toNumberArray(sequenceText.value))
const graph = computed(() => makeGraphText(sequenceArray.value))
const mat = computed(() => makeAdjMat(sequenceArray.value))
const vertex_num = computed(() => countVertex(sequenceArray.value))
const arrow_num = computed(() => countArrow(sequenceArray.value))
const continuedFracionSequenceArray = ref();

// Pattern計算後に入力される部分
const pattern = ref()
const patternCount = ref()
const isIrr = ref()
const wolframURL = computed(() => createWolframURL(patternCount.value))
const expString = computed(() => createExpString(patternCount.value))

// その他
const isLoading = ref(false)
const isDisplay = ref(false)
const matToggle = ref(false)
const graphToggle = ref(true)
const patternToggle = ref(false)

watch(sequenceArray, () => {
  isDisplay.value = false
  pattern.value = undefined
  patternCount.value = undefined
  isIrr.value = undefined
})
watch([numeratorNum, denominatorNum], () => {
  if (numeratorNum.value != 0 && denominatorNum.value != 0) {
    continuedFracionSequenceArray.value = rationalToContinuedFraction(numeratorNum.value, denominatorNum.value)
  } else {
    continuedFracionSequenceArray.value = undefined
  }
})

const tableColor = (ch: number) => ch === 1 ? "bg-red-400" : "";
const badgeColor = (ch: boolean) => ch ? "badge-green" : "badge-indigo";

function createSequenceFromFraction(seq: number[]) {
  if (seq === undefined) return
  sequenceText.value = twoSidesMinus(seq).toString();
}

async function patternCalclate(mat?: AdjMat) {
  if (mat === undefined) return
  isDisplay.value = false
  isLoading.value = true
  pattern.value = await calclatePattern(mat);
  patternCount.value = await countPatternsNum(pattern.value)
  isIrr.value = await isIrreducible(patternCount.value)
  setTimeout(() => {
    isLoading.value = false
    isDisplay.value = true
  }, 1500);
}

</script>

<template>
  <main class="flex flex-col items-center">
    <!-- 入力部 -->
    <div class="w-full border-collapse flex">
      <div class="min-w-fit border border-collapse p-5">
        <div class="mb-5">
          <form onsubmit="return false">
            <div class="mb-5">
              <label class="input-label" for="fraction">
                有理数入力
              </label>
              <span class="text-xs">分子</span>
              <input @keypress.enter="" class="input-text" id="fraction" type="number" v-model="numeratorNum" />
              <span class="text-xs">分母</span>
              <input @keypress.enter="" class="input-text" id="fraction" type="number" v-model="denominatorNum" />
            </div>
            <div class="mb-5">
              <span class="text-xs">連分数展開</span><br>
              {{ continuedFracionSequenceArray }}
            </div>
            <input type="button" @click="createSequenceFromFraction(continuedFracionSequenceArray)" value="↓"
              class="input-button" />
            <span class="text-xs text-gray-500">※ 両側が-1されます</span>
          </form>
        </div>
        <hr>
        <div class="pt-5">
          <form onsubmit="return false">
            <div class="mb-5">
              <label class="input-label" for="sequence">
                数列入力
              </label>
              <input @keypress.enter="patternCalclate(mat)" class="input-text" id="sequence" type="text"
                placeholder="1, 2, 3" required v-model="sequenceText" />
            </div>
            <input type="button" @click="patternCalclate(mat)" value="Calclate" class="input-button2" />
          </form>
        </div>
      </div>
      <div class="w-fit max-w-6xl p-4">
        <div class="flex">
          <div class="flex items-center mb-4 p-2">
            <input type="checkbox" v-model="graphToggle" id="graphCheckBox" class="input-checkbox" />
            <label for="graphCheckBox" class="input-checkbox-label">
              グラフ
            </label>
          </div>
          <div class="flex items-center mb-4 p-2">
            <input type="checkbox" v-model="matToggle" id="matCheckBox" class="input-checkbox" />
            <label for="matCheckBox" class="input-checkbox-label">
              隣接行列
            </label>
          </div>
          <div class="flex items-center mb-4 p-2">
            <input type="checkbox" v-model="patternToggle" id="patternCheckBox" class="input-checkbox" />
            <label for="patternCheckBox" class="input-checkbox-label">
              パターン
            </label>
          </div>
        </div>
        <div class="flex">
          <label class="block text-gray-700 text-sm font-bold p-2">
            頂点の数 : {{ vertex_num }}
          </label>
          <label class="block text-gray-700 text-sm font-bold p-2">
            矢の数 : {{ arrow_num }}
          </label>
        </div>
        <div class="w-full p-5">
          <span v-if="graphToggle">
            {{ graph }}
          </span>
        </div>
        <div class="border p-2">
          <label class="block text-gray-700 font-bold p-2">
            計算結果
          </label>
          <div v-if="isLoading" class="flex space-x-2 p-2">
            <div class="animate-bounce  h-2 w-2 bg-blue-600 rounded-full"></div>
            <div class="animate-bounce  h-2 w-2 bg-blue-600 rounded-full animation-delay-200"></div>
            <div class="animate-bounce  h-2 w-2 bg-blue-600 rounded-full animation-delay-400"></div>
          </div>
          <div v-if="isDisplay">
            <label class="block text-gray-700 text-sm font-bold p-2">
              係数: {{ patternCount }}
            </label>
            <label class="block text-gray-700 text-sm font-bold p-2">
              式: {{ expString }}
            </label>
            <label class="block text-gray-700 text-sm font-bold p-2">
              <span :class="badgeColor(isIrr)">{{ isIrr ? "既約" : "可約" }} </span>
            </label>
          </div>
          <div v-if="isDisplay" class="block text-sm p-4 rounded-sm whitespace-nowrap overflow-hidden text-ellipsis">
            <p class="text-gray-500 dark:text-gray-400">Wolfram上で多項式を確かめる</p>
            <a class=" text-blue-600 underline dark:text-blue-500 hover:no-underline" :href="wolframURL"
              target="_blank">{{ wolframURL }}</a>
          </div>
        </div>
      </div>

    </div>
    <!-- 出力部 -->
    <div>
      <!-- グラフ -->

      <!-- 隣接行列 -->
      <div class="w-full p-5">
        <table v-if="matToggle">
          <tr class="" v-for="(arr, index) in mat" :key="index">
            <template v-for="ch in arr">
              <td class="w-9 h-9 border text-center hover:bg-gray-200" :class="tableColor(ch)">{{ ch }}</td>
            </template>
          </tr>
        </table>
      </div>
      <!-- パターン -->
      <div class="w-full p-5">
        <div v-if="pattern && patternToggle">
          <template v-for="(v, k) in pattern" :key="k">
            <span>n = {{ k }}</span>
            <div class="w-full max-w-fit px-5 py-5 my-2 border" v-for="vv in v">
              {{ makePatternGraphText(vv, sequenceArray) }}
            </div>
          </template>
        </div>
      </div>

    </div>
  </main>
</template>

<style>
</style>

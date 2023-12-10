<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { makeAdjMat, makeGraphText, toNumberArray, calclatePattern, AdjMat, makePatternGraphText, countPatternsNum, countVertex, countArrow } from './core/core.ts'

const sequenceText = ref("")
// 自動で計算する部分
const sequenceArray = computed(() => toNumberArray(sequenceText.value))
const graph = computed(() => makeGraphText(sequenceArray.value))
const mat = computed(() => makeAdjMat(sequenceArray.value))
const vertex_num = computed(() => countVertex(sequenceArray.value))
const arrow_num = computed(() => countArrow(sequenceArray.value))

// Pattern計算後に入力される部分
const pattern = ref()
const patternCount = ref()

// その他
const isLoading = ref(false)
const matToggle = ref(false)
const graphToggle = ref(true)
const patternToggle = ref(false)

watch(sequenceArray, () => {
  pattern.value = undefined
  patternCount.value = undefined
})

const tableColor = (ch: number) => ch === 1 ? "bg-red-400" : "";

async function patternCalclate(mat?: AdjMat) {
  console.log("CALL patternCalclate")
  if (mat === undefined) return
  isLoading.value = true
  pattern.value = await calclatePattern(mat);
  setTimeout(() => {
    isLoading.value = false
    patternCount.value = countPatternsNum(pattern.value)
  }, 1000);
}

</script>

<template>
  <main class="flex flex-col items-center">
    <!-- 入力部 -->
    <div class="w-full border flex">
      <div class="border p-5">
        <form onsubmit="return false">
          <div class="mb-5">
            <label class="input-label" for="sequence">
              数列入力
            </label>
            <input @keypress.enter="patternCalclate(mat)" class="input-text" id="sequence" type="text"
              placeholder="1, 2, 3" required v-model="sequenceText" />
          </div>
          <input type="button" @click="patternCalclate(mat)" value="Calclate Pattern" class="input-button" />
        </form>
      </div>
      <div class="w-full p-5">
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
          <label class="block text-gray-700 text-sm font-bold mb-4 p-2">
            頂点の数 : {{ vertex_num }}
          </label>
          <label class="block text-gray-700 text-sm font-bold mb-4 p-2">
            矢の数 : {{ arrow_num }}
          </label>
        </div>
        <label class="block text-gray-700 text-sm font-bold mb-4 p-2">
          整数係数多項式の係数部 (定数項から) ===============
        </label>
        <div v-if="isLoading" class="flex space-x-2 p-2">
          <div class="animate-bounce  h-2 w-2 bg-blue-600 rounded-full"></div>
          <div class="animate-bounce  h-2 w-2 bg-blue-600 rounded-full animation-delay-200"></div>
          <div class="animate-bounce  h-2 w-2 bg-blue-600 rounded-full animation-delay-400"></div>
        </div>
        <span v-if="pattern">
          {{ patternCount }}
        </span>
      </div>

    </div>
    <!-- 出力部 -->
    <div>
      <!-- グラフ -->
      <div class="w-full p-5">
        <span v-if="graphToggle">
          {{ graph }}
        </span>
      </div>
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
        <div v-if="patternToggle">
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

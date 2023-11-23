<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { makeAdjMat, makeGraphText, toNumberArray, calclatePattern, AdjMat, Patterns, makePatternGraphText, countPatternsNum, countVertex, countArrow } from './core/core.ts'

const sequenceText = ref("")
const sequenceArray = computed(() => toNumberArray(sequenceText.value))
const graph = computed(() => makeGraphText(sequenceArray.value))
const mat = computed(() => makeAdjMat(sequenceArray.value))
const vertex_num = computed(() => countVertex(sequenceArray.value))
const arrow_num = computed(() => countArrow(sequenceArray.value))
const pattern = ref<Patterns | undefined>()
const patCount = ref()
const isLoading = ref(false)

watch(sequenceArray, () => {
  pattern.value = undefined
  patCount.value = undefined
})

const tableColor = (ch: number) => ch === 1 ? "bg-red-400" : "";

async function patternCalclate(mat?: AdjMat) {
  if (mat === undefined) return
  isLoading.value = true
  const patternArray = await calclatePattern(mat);
  setTimeout(() => { // これはなんとなく
    pattern.value = patternArray;
    patCount.value = countPatternsNum(pattern.value)
    isLoading.value = false
  }, 1000);
}

</script>

<template>
  <div class="flex flex-col items-center">

    <div class="w-full max-w-xs px-5 py-5 my-5 border">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="sequence">
        入力
      </label>
      <input
        class="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="sequence" type="text" placeholder="1, 2, 3" v-model="sequenceText" />
    </div>

    <div v-if="sequenceArray" class="w-full max-w-fit px-5 py-5">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        頂点の数 : {{ vertex_num }}
      </label>
      <label class="block text-gray-700 text-sm font-bold mb-2">
        矢の数 : {{ arrow_num }}
      </label>
    </div>

    <div v-if="graph" class="w-full max-w-fit px-5 py-5 my-5 border">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        グラフ
      </label>
      {{ graph }}
    </div>

    <div v-if="mat" class="w-full max-w-fit px-5 py-5 my-5 border">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        隣接行列
      </label>
      <table>
        <tr class="" v-for="(arr, index) in mat" :key="index">
          <template v-for="ch in arr">
            <td class="w-8 h-8 border text-center hover:bg-gray-200" :class="tableColor(ch)">{{ ch }}</td>
          </template>
        </tr>
      </table>
    </div>

    <div v-if="sequenceArray" class="w-full max-w-fit px-5 py-5 my-5 border">
      <button class="bg-slate-300 px-5 py-4 shadow-md hover:shadow-lg" @click="patternCalclate(mat)">
        <span v-if="isLoading">Pattern Calclate ... </span>
        <span v-else>Pattern Output</span>
      </button>
    </div>

    <div v-if="patCount && sequenceArray" class="w-full max-w-fit px-5 py-5 my-5">
      <label class="block text-gray-700 text-sm font-bold mb-2">
        パターン数 0から{{ patCount.length - 1 }}まで順に
      </label>
      <p>
        {{ patCount }}
      </p>
    </div>

    <div v-if="pattern && sequenceArray" class="w-full max-w-fit px-5 py-5 my-5">
      <template v-for="(v, k) in pattern" :key="k">
        <span>n = {{ k }}</span>
        <div class="w-full max-w-fit px-5 py-5 my-2 border" v-for="vv in v">
          {{ makePatternGraphText(vv, sequenceArray) }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>

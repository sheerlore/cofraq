<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { makeAdjMat, makeGraphText, toNumberArray, calclatePattern, AdjMat, Patterns, makePatternGraphText, countPatternsNum } from './core/core.ts'

const sequenceText = ref("")
const sequenceArray = computed(() => toNumberArray(sequenceText.value))
const graph = computed(() => makeGraphText(sequenceArray.value))
const mat = computed(() => makeAdjMat(sequenceArray.value))
const pattern = ref<Patterns | undefined>()
const patCount = ref()

watch(sequenceArray, () => {
  pattern.value = undefined
  patCount.value = undefined
})

function patternCalclate(mat?: AdjMat) {
  console.log("CLICK")
  if (mat === undefined) return
  const patternArray = calclatePattern(mat);
  pattern.value = patternArray;
  patCount.value = countPatternsNum(pattern.value)
}

</script>

<template>
  <div class="flex flex-col items-center">

    <div class="w-full max-w-xs px-5 py-5 my-5 border">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="sequence">
        数列入力
      </label>
      <input
        class="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="sequence" type="text" placeholder="1, 2, 3" v-model="sequenceText" />
    </div>

    <div v-if="graph" class="w-full max-w-fit px-5 py-5 my-5 border">
      {{ graph }}
    </div>

    <div v-if="mat" class="w-full max-w-fit px-5 py-5 my-5 border">
      <table>
        <tr class="" v-for="(arr, index) in mat" :key="index">
          <template v-for="ch in arr">
            <td class="w-7 h-7 border text-center">{{ ch }}</td>
          </template>
        </tr>
      </table>
    </div>

    <div v-if="sequenceArray" class="w-full max-w-fit px-5 py-5 my-5 border">
      <button class=" bg-slate-300 px-5 py-4 shadow-md hover:shadow-lg" @click="patternCalclate(mat)">Pattern
        Output</button>
    </div>

    <div v-if="patCount && sequenceArray">
      <p></p>
      <p>
        パターン数 0から{{ patCount.length - 1 }}まで順に
      </p>
      <p>
        {{ patCount }}
      </p>
    </div>

    <div v-if="pattern && sequenceArray">
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

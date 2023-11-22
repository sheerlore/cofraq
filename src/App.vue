<script setup lang="ts">
import { computed, ref } from 'vue';
import { makeAdjMat, makeGraphText, toNumberArray, makePertternGraphText } from './core/core.ts'

const sequenceText = ref("")
const sequenceArray = computed(() => toNumberArray(sequenceText.value))
const text = computed(() => makeGraphText(sequenceArray.value))
const mat = computed(() => makeAdjMat(sequenceArray.value))
const tx = computed(() => makePertternGraphText([0, 1, 1, 1, 1], sequenceArray.value))
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

    <div class="w-full max-w-fit px-5 py-5 my-5 border">
      {{ text }}
    </div>

    <div class="w-full max-w-fit px-5 py-5 my-5">
      <table>
        <tr class="" v-for="(arr, index) in mat" :key="index">
          <template v-for="ch in arr">
            <td class="w-7 h-7 border text-center">{{ ch }}</td>
          </template>
        </tr>
      </table>
    </div>

    <div class="w-full max-w-fit px-5 py-5 my-5 border">
      {{ tx }}
    </div>
  </div>
</template>

<style scoped>
</style>

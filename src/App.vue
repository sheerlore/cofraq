<script setup lang="ts">
import { computed, ref } from 'vue';
import { makeGraphText, toNumberArray } from './core/core.ts'

const sequence = ref("")
const text = computed(() => makeGraphText(toNumberArray(sequence.value)))

</script>

<template>
  <div class="flex flex-col items-center">
    <div class="w-full max-w-xs px-5 py-5 my-10 border">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="sequence">
        数列入力
      </label>
      <input
        class="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="sequence" type="text" placeholder="1, 2, 3" v-model="sequence" />
    </div>

    <div class="w-full max-w-fit px-5">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
</style>

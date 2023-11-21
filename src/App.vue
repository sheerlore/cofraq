<script setup lang="ts">
import { computed, ref } from 'vue';
import { makeGraphText, toNumberArray } from './core/core.ts'

const sequence = ref("")
const text = computed(() => makeGraphText(toNumberArray(sequence.value)))

</script>

<template>
  <div class="w-full max-w-xs">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="sequence">
        数列
      </label>
    </div>
    <input
      class="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="sequence" type="text" placeholder="1, 2, 3" v-model="sequence" />
  </div>
  <div>
    [{{ sequence }}]
  </div>
  <div>
    {{ text }}
  </div>
</template>

<style scoped>
</style>

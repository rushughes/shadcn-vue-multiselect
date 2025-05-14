<template>
    <div class="p-8 max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-4">shadcn-vue-multiselect demo</h1>
      <MultiSelect
        v-model="selected"
        :options="options"
        :max-count="3"
        placeholder="Pick platforms"
      >
        <template #icon="{ option }">
          <span class="inline-block w-4 h-4 rounded-full bg-gray-300" />
        </template>
      </MultiSelect>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import MultiSelect from '../src/MultiSelect.vue'
  
  const selected = ref<string[]>([])
  
  const options = [
    { label: 'Instagram', value: 'ig' },
    { label: 'Facebook', value: 'fb' },
    { label: 'Twitter', value: 'tw' }
  ]
  </script>
  
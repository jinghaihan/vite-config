<script lang="ts" setup>
const modelValue = defineModel('model-value', { type: Number })
</script>

<template>
  <input v-model="modelValue" class="px-2 py-1 rounded-md" type="number">
</template>

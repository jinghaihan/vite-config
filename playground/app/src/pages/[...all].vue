<script lang="ts" setup>
const { count1, count2, sum } = useSum()
const id = ref(uid())

function onClick() {
  id.value = uid()
}

// @ts-expect-error metadata
// eslint-disable-next-line no-console
console.log(__VITE_APP_METADATA__)
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <div>
      <InputNumber v-model:model-value="count1" />
      +
      <InputNumber v-model:model-value="count2" />
      =
      {{ sum }}
    </div>

    <div>
      <Button @click="onClick">
        Change id
      </Button>
      : {{ id }}
    </div>
  </div>
</template>

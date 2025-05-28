import { computed, ref } from 'vue'

export function useSum() {
  const count1 = ref<number>(1)
  const count2 = ref<number>(2)

  const sum = computed(() => count1.value + count2.value)

  return {
    count1,
    count2,
    sum,
  }
}

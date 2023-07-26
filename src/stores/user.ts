import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function reset() {
    router.push('/login')
  }

  const router = useRouter()

  return { count, doubleCount, reset }
})

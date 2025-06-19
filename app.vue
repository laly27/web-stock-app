<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-6 ml-64">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductsStore } from '~/stores/products'
import { useOrdersStore } from '~/stores/orders'

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

onMounted(() => {
  productsStore.loadFromLocalStorage()
  ordersStore.loadFromLocalStorage()
})
</script>
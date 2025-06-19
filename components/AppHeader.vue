<template>
  <header class="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">🍽️ Web Stock App</h1>
          <span class="text-sm text-gray-500">{{ currentPageTitle }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-600">
            {{ currentDate }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentDate = ref('')

const pageTitles = {
  '/': 'Dashboard',
  '/produits': 'Gestion des Produits',
  '/commandes': 'Commandes',
  '/factures': 'Factures',
  '/stats': 'Statistiques'
}

const currentPageTitle = computed(() => {
  return pageTitles[route.path] || 'Web Stock App'
})

onMounted(() => {
  const updateDate = () => {
    currentDate.value = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  updateDate()
  setInterval(updateDate, 60000) // Update every minute
})
</script>
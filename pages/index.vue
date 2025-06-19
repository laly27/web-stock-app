<template>
  <div class="space-y-6 mt-12">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
      <p class="text-gray-600">Vue d'ensemble de votre restaurant</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Produits</p>
            <p class="text-3xl font-bold text-gray-900">{{ productsStore.getTotalProducts }}</p>
          </div>
          <div class="text-4xl">🍽️</div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Stock Total</p>
            <p class="text-3xl font-bold text-gray-900">{{ productsStore.getTotalStock }}</p>
          </div>
          <div class="text-4xl">📦</div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Commandes</p>
            <p class="text-3xl font-bold text-gray-900">{{ ordersStore.getTotalOrders }}</p>
          </div>
          <div class="text-4xl">🛒</div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Revenus</p>
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(ordersStore.getTotalRevenue) }}</p>
          </div>
          <div class="text-4xl">💰</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="card">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Commandes Récentes</h3>
        </div>
        <div class="p-6">
          <div v-if="ordersStore.getRecentOrders.length === 0" class="text-center text-gray-500 py-8">
            Aucune commande enregistrée
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="order in ordersStore.getRecentOrders.slice(0, 5)" 
              :key="order.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ order.customerName }}</p>
                <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">{{ formatCurrency(order.total) }}</p>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Alert -->
      <div class="card">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Alertes Stock Faible</h3>
        </div>
        <div class="p-6">
          <div v-if="productsStore.getLowStockProducts.length === 0" class="text-center text-gray-500 py-8">
            Tous les produits ont un stock suffisant
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="product in productsStore.getLowStockProducts" 
              :key="product.id"
              class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div>
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-sm text-gray-600">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {{ product.quantity }} restant{{ product.quantity > 1 ? 's' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'
import { useOrdersStore } from '~/stores/orders'

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
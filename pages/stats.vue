<template>
  <div class="space-y-6 mt-12">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Statistiques</h2>
      <p class="text-gray-600">Analysez les performances de votre restaurant</p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Revenus Aujourd'hui</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(ordersStore.getDailyRevenue) }}</p>
          </div>
          <div class="text-3xl">💰</div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Revenus Total</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(ordersStore.getTotalRevenue) }}</p>
          </div>
          <div class="text-3xl">📊</div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Commandes Total</p>
            <p class="text-2xl font-bold text-purple-600">{{ ordersStore.getTotalOrders }}</p>
          </div>
          <div class="text-3xl">🛒</div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Panier Moyen</p>
            <p class="text-2xl font-bold text-orange-600">
              {{ ordersStore.getTotalOrders > 0 ? formatCurrency(ordersStore.getTotalRevenue / ordersStore.getTotalOrders) : formatCurrency(0) }}
            </p>
          </div>
          <div class="text-3xl">🧺</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Products -->
      <div class="card">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Produits les plus vendus</h3>
        </div>
        <div class="p-6">
          <div v-if="topProducts.length === 0" class="text-center text-gray-500 py-8">
            Aucune vente enregistrée
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="(item, index) in topProducts.slice(0, 10)" 
              :key="item.productName"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ item.productName }}</p>
                  <p class="text-sm text-gray-600">{{ item.totalQuantity }} vendus</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">{{ formatCurrency(item.totalRevenue) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="card">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Ventes par jour (7 derniers jours)</h3>
        </div>
        <div class="p-6">
          <div v-if="dailySales.length === 0" class="text-center text-gray-500 py-8">
            Aucune vente enregistrée
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="day in dailySales" 
              :key="day.date"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ day.date }}</p>
                <p class="text-sm text-gray-600">{{ day.orderCount }} commande{{ day.orderCount > 1 ? 's' : '' }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">{{ formatCurrency(day.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Analysis -->
    <div class="card">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Analyse du stock</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ productsStore.getTotalProducts }}</div>
            <p class="text-sm text-gray-600 mt-1">Produits différents</p>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ productsStore.getTotalStock }}</div>
            <p class="text-sm text-gray-600 mt-1">Unités en stock</p>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-red-600">{{ productsStore.getLowStockProducts.length }}</div>
            <p class="text-sm text-gray-600 mt-1">Alertes stock faible</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

// Calculate top products
const topProducts = computed(() => {
  const productStats = {}
  
  ordersStore.orders.forEach(order => {
    order.items.forEach(item => {
      if (!productStats[item.productName]) {
        productStats[item.productName] = {
          productName: item.productName,
          totalQuantity: 0,
          totalRevenue: 0
        }
      }
      
      productStats[item.productName].totalQuantity += item.quantity
      productStats[item.productName].totalRevenue += item.subtotal
    })
  })
  
  return Object.values(productStats)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
})

// Calculate daily sales
const dailySales = computed(() => {
  const salesByDate = {}
  const last7Days = []
  
  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toDateString()
    last7Days.push({
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
      dateString,
      revenue: 0,
      orderCount: 0
    })
    
    salesByDate[dateString] = last7Days[last7Days.length - 1]
  }
  
  // Calculate sales for each day
  ordersStore.orders.forEach(order => {
    const orderDate = new Date(order.createdAt).toDateString()
    if (salesByDate[orderDate]) {
      salesByDate[orderDate].revenue += order.total
      salesByDate[orderDate].orderCount++
    }
  })
  
  return last7Days
})
</script>
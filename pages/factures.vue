<template>
  <div class="space-y-6 mt-12">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Factures</h2>
      <p class="text-gray-600">Consultez et imprimez les factures</p>
    </div>

    <!-- Invoice Detail -->
    <div v-if="selectedOrder" class="space-y-6">
      <div class="flex justify-between items-center">
        <button @click="selectedOrder = null" class="btn-secondary">
          ← Retour à la liste
        </button>
        <button @click="printInvoice" class="btn-primary">
          🖨️ Imprimer
        </button>
      </div>

      <div id="invoice" class="card p-8 bg-white">
        <!-- Invoice Header -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">🍽️ Web Stock App</h1>
              <p class="text-gray-600 mt-1">Restaurant & Gestion</p>
              <p class="text-sm text-gray-500 mt-2">
                Dakar, Sénégal<br>
                Tél: +221 77 777 777<br>
                Email: contact@web-stock-app.sn
              </p>
            </div>
            <div class="text-right">
              <h2 class="text-xl font-bold text-gray-900">FACTURE</h2>
              <p class="text-gray-600 mt-1">N° {{ selectedOrder.id.slice(-6) }}</p>
              <p class="text-sm text-gray-500 mt-2">
                Date: {{ formatDate(selectedOrder.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-900 mb-2">Facturé à:</h3>
          <p class="text-gray-700">{{ selectedOrder.customerName }}</p>
        </div>

        <!-- Items Table -->
        <div class="mb-6">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 font-semibold text-gray-900">Article</th>
                <th class="text-center py-3 font-semibold text-gray-900">Qté</th>
                <th class="text-right py-3 font-semibold text-gray-900">Prix unitaire</th>
                <th class="text-right py-3 font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedOrder.items" :key="item.productId" class="border-b border-gray-100">
                <td class="py-3 text-gray-900">{{ item.productName }}</td>
                <td class="py-3 text-center text-gray-700">{{ item.quantity }}</td>
                <td class="py-3 text-right text-gray-700">{{ formatCurrency(item.price) }}</td>
                <td class="py-3 text-right font-semibold text-gray-900">{{ formatCurrency(item.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total -->
        <div class="flex justify-end">
          <div class="w-64">
            <div class="flex justify-between py-2 border-t border-gray-200">
              <span class="text-xl font-bold text-gray-900">TOTAL:</span>
              <span class="text-xl font-bold text-green-600">{{ formatCurrency(selectedOrder.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Merci de votre visite !</p>
          <p class="mt-1">Web Stock App  - {{ formatDate(selectedOrder.createdAt) }}</p>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else class="card">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Sélectionner une commande</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Commande
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in ordersStore.orders.slice().reverse()" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                #{{ order.id.slice(-6) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                {{ order.customerName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewInvoice(order)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  📄 Voir facture
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '~/stores/orders'

const route = useRoute()
const ordersStore = useOrdersStore()
const selectedOrder = ref(null)

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

const viewInvoice = (order) => {
  selectedOrder.value = order
}

const printInvoice = () => {
  const printContent = document.getElementById('invoice').innerHTML
  const printWindow = window.open('', '_blank')
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Facture #${selectedOrder.value.id.slice(-6)}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
      </style>
    </head>
    <body>
      ${printContent}
    </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.print()
}

onMounted(() => {
  // Check if order ID is provided in query params
  const orderId = route.query.order
  if (orderId) {
    const order = ordersStore.getOrderById(orderId)
    if (order) {
      selectedOrder.value = order
    }
  }
})
</script>
<template>
  <div class="space-y-6 mt-12">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Commandes</h2>
        <p class="text-gray-600">Créez et gérez les commandes</p>
      </div>
      <button @click="showNewOrderModal = true" class="btn-primary">
        ➕ Nouvelle commande
      </button>
    </div>

    <!-- Orders List -->
    <div class="card">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Historique des commandes</h3>
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
                <NuxtLink :to="`/factures?order=${order.id}`" class="text-blue-600 hover:text-blue-900">
                  📄 Voir facture
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New Order Modal -->
    <div v-if="showNewOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">Nouvelle commande</h3>
          <button @click="closeOrderModal" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Products Selection -->
          <div>
            <h4 class="font-medium text-gray-900 mb-4">Sélectionner les produits</h4>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div 
                v-for="product in productsStore.products.filter(p => p.quantity > 0)" 
                :key="product.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-600">{{ product.category }} - {{ formatCurrency(product.price) }}</p>
                  <p class="text-xs text-gray-500">Stock: {{ product.quantity }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="orderItems[product.id]"
                    type="number"
                    min="0"
                    :max="product.quantity"
                    class="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                  <button 
                    @click="addToOrder(product)"
                    class="btn-primary text-sm px-3 py-1"
                    :disabled="!orderItems[product.id] || orderItems[product.id] <= 0"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
              <input
                v-model="customerName"
                type="text"
                class="input-field"
                placeholder="Nom du client"
              />
            </div>

            <h4 class="font-medium text-gray-900 mb-4">Récapitulatif de la commande</h4>
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div v-if="currentOrder.length === 0" class="text-center text-gray-500 py-4">
                Aucun produit sélectionné
              </div>
              <div v-else>
                <div 
                  v-for="item in currentOrder" 
                  :key="item.product.id"
                  class="flex items-center justify-between"
                >
                  <div class="flex-1">
                    <p class="font-medium text-sm">{{ item.product.name }}</p>
                    <p class="text-xs text-gray-600">{{ item.quantity }} × {{ formatCurrency(item.product.price) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">{{ formatCurrency(item.subtotal) }}</p>
                    <button 
                      @click="removeFromOrder(item.product.id)"
                      class="text-red-600 hover:text-red-800 text-xs"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 pt-3 mt-3">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold">Total:</span>
                    <span class="font-bold text-lg text-green-600">{{ formatCurrency(orderTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button @click="closeOrderModal" class="btn-secondary">
                Annuler
              </button>
              <button 
                @click="createOrder" 
                class="btn-success"
                :disabled="currentOrder.length === 0"
              >
                Confirmer la commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useProductsStore } from '~/stores/products'
import { useOrdersStore } from '~/stores/orders'

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

const showNewOrderModal = ref(false)
const customerName = ref('')
const orderItems = reactive({})
const currentOrder = ref([])

const orderTotal = computed(() => {
  return currentOrder.value.reduce((total, item) => total + item.subtotal, 0)
})

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

const addToOrder = (product) => {
  const quantity = parseInt(orderItems[product.id]) || 0
  if (quantity > 0 && quantity <= product.quantity) {
    const existingIndex = currentOrder.value.findIndex(item => item.product.id === product.id)
    
    if (existingIndex !== -1) {
      currentOrder.value[existingIndex].quantity += quantity
      currentOrder.value[existingIndex].subtotal = currentOrder.value[existingIndex].quantity * product.price
    } else {
      currentOrder.value.push({
        product,
        quantity,
        subtotal: quantity * product.price
      })
    }
    
    orderItems[product.id] = 0
  }
}

const removeFromOrder = (productId) => {
  currentOrder.value = currentOrder.value.filter(item => item.product.id !== productId)
}

const createOrder = () => {
  if (currentOrder.value.length === 0) return
  
  // Check stock availability
  for (const item of currentOrder.value) {
    if (!productsStore.decrementStock(item.product.id, item.quantity)) {
      alert(`Stock insuffisant pour ${item.product.name}`)
      return
    }
  }
  
  // Create order
  const orderData = {
    items: currentOrder.value.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.subtotal
    })),
    total: orderTotal.value,
    customerName: customerName.value || 'Client'
  }
  
  ordersStore.createOrder(orderData)
  closeOrderModal()
  
  alert('Commande créée avec succès!')
}

const closeOrderModal = () => {
  showNewOrderModal.value = false
  customerName.value = ''
  currentOrder.value = []
  Object.keys(orderItems).forEach(key => orderItems[key] = 0)
}
</script>
<template>
  <div class="space-y-6 mt-12">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Gestion des Produits</h2>
        <p class="text-gray-600">Gérez votre inventaire de produits</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary">
        ➕ Ajouter un produit
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un produit..."
            class="input-field"
          />
        </div>
        <div>
          <select v-model="selectedCategory" class="input-field">
            <option value="">Toutes les catégories</option>
            <option v-for="category in productsStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products List -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ product.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="product.quantity <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                >
                  {{ product.quantity }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editProduct(product)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  ✏️ Modifier
                </button>
                <button 
                  @click="deleteProduct(product.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md m-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ showEditModal ? 'Modifier le produit' : 'Ajouter un produit' }}
        </h3>
        
        <form @submit.prevent="submitProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
            <input
              v-model="productForm.name"
              type="text"
              required
              class="input-field"
              placeholder="Ex: Pizza Margherita"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select v-model="productForm.category" required class="input-field">
              <option value="">Sélectionner une catégorie</option>
              <option v-for="category in productsStore.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (XOF)</label>
            <input
              v-model="productForm.price"
              type="number"
              min="0"
              step="100"
              required
              class="input-field"
              placeholder="2500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité en stock</label>
            <input
              v-model="productForm.quantity"
              type="number"
              min="0"
              required
              class="input-field"
              placeholder="10"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal" class="btn-secondary">
              Annuler
            </button>
            <button type="submit" class="btn-primary">
              {{ showEditModal ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useProductsStore } from '~/stores/products'

const productsStore = useProductsStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref(null)
const searchTerm = ref('')
const selectedCategory = ref('')

const productForm = reactive({
  name: '',
  category: '',
  price: '',
  quantity: ''
})

const filteredProducts = computed(() => {
  let filtered = productsStore.products
  
  if (searchTerm.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }
  
  return filtered
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount)
}

const editProduct = (product) => {
  editingProduct.value = product
  productForm.name = product.name
  productForm.category = product.category
  productForm.price = product.price
  productForm.quantity = product.quantity
  showEditModal.value = true
}

const deleteProduct = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    productsStore.deleteProduct(id)
  }
}

const submitProduct = () => {
  if (showEditModal.value) {
    productsStore.updateProduct(editingProduct.value.id, {
      name: productForm.name,
      category: productForm.category,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity)
    })
  } else {
    productsStore.addProduct(productForm)
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  Object.keys(productForm).forEach(key => productForm[key] = '')
}
</script>
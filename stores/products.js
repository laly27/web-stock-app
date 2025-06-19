import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: ['Entrées', 'Plats', 'Desserts', 'Boissons', 'Autres']
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id)
    },
    
    getProductsByCategory: (state) => (category) => {
      return state.products.filter(product => product.category === category)
    },
    
    getTotalProducts: (state) => state.products.length,
    
    getTotalStock: (state) => {
      return state.products.reduce((total, product) => total + product.quantity, 0)
    },
    
    getLowStockProducts: (state) => {
      return state.products.filter(product => product.quantity <= 5)
    }
  },

  actions: {
    addProduct(product) {
      const newProduct = {
        id: Date.now().toString(),
        name: product.name,
        category: product.category,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        createdAt: new Date().toISOString()
      }
      
      this.products.push(newProduct)
      this.saveToLocalStorage()
    },

    updateProduct(id, updatedProduct) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updatedProduct }
        this.saveToLocalStorage()
      }
    },

    deleteProduct(id) {
      this.products = this.products.filter(p => p.id !== id)
      this.saveToLocalStorage()
    },

    updateStock(productId, newQuantity) {
      const product = this.getProductById(productId)
      if (product) {
        product.quantity = newQuantity
        this.saveToLocalStorage()
      }
    },

    decrementStock(productId, quantity) {
      const product = this.getProductById(productId)
      if (product && product.quantity >= quantity) {
        product.quantity -= quantity
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('web-stock-app-products', JSON.stringify(this.products))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const stored = localStorage.getItem('web-stock-app-products')
        if (stored) {
          this.products = JSON.parse(stored)
        }
      }
    }
  }
})
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: []
  }),

  getters: {
    getOrderById: (state) => (id) => {
      return state.orders.find(order => order.id === id)
    },
    
    getTotalOrders: (state) => state.orders.length,
    
    getTotalRevenue: (state) => {
      return state.orders.reduce((total, order) => total + order.total, 0)
    },
    
    getOrdersByDate: (state) => (date) => {
      return state.orders.filter(order => 
        new Date(order.createdAt).toDateString() === new Date(date).toDateString()
      )
    },
    
    getRecentOrders: (state) => {
      return state.orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
    },
    
    getDailyRevenue: (state) => {
      const today = new Date().toDateString()
      return state.orders
        .filter(order => new Date(order.createdAt).toDateString() === today)
        .reduce((total, order) => total + order.total, 0)
    }
  },

  actions: {
    createOrder(orderData) {
      const newOrder = {
        id: Date.now().toString(),
        items: orderData.items,
        total: orderData.total,
        customerName: orderData.customerName || 'Client',
        status: 'completed',
        createdAt: new Date().toISOString()
      }
      
      this.orders.push(newOrder)
      this.saveToLocalStorage()
      return newOrder
    },

    updateOrderStatus(id, status) {
      const order = this.getOrderById(id)
      if (order) {
        order.status = status
        this.saveToLocalStorage()
      }
    },

    deleteOrder(id) {
      this.orders = this.orders.filter(order => order.id !== id)
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('web-stock-app-orders', JSON.stringify(this.orders))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const stored = localStorage.getItem('web-stock-app-orders')
        if (stored) {
          this.orders = JSON.parse(stored)
        }
      }
    }
  }
})
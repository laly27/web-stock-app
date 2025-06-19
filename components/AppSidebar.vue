<template>
  <aside class="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
    <nav class="p-6">
      <ul class="space-y-2">
        <li>
          <NuxtLink 
            to="/" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/' }"
          >
            <span class="nav-icon">📊</span>
            Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/produits" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/produits' }"
          >
            <span class="nav-icon">🍽️</span>
            Produits
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/commandes" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/commandes' }"
          >
            <span class="nav-icon">🛒</span>
            Commandes
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/factures" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/factures' }"
          >
            <span class="nav-icon">🧾</span>
            Factures
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/stats" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/stats' }"
          >
            <span class="nav-icon">📈</span>
            Statistiques
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.nav-link {
  @apply flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200;
}

.nav-link-active {
  @apply bg-blue-100 text-blue-700 font-medium;
}

.nav-icon {
  @apply text-xl;
}
</style>
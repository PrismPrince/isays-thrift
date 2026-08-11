<template>
  <q-list>
    <template v-for="(navMenuItem, index) in navMenuList" :key="index">
      <q-item :to="navMenuItem.to" :active="navMenuItem.label === 'Outbox'" v-ripple>
        <q-item-section avatar>
          <q-icon :name="navMenuItem.icon" />
        </q-item-section>
        <q-item-section>{{ navMenuItem.label }}</q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup>
import { ref } from 'vue'

const navMenuList = ref([
  { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
  { label: 'Sales', icon: 'shopping_bag', to: '/sales' },
  { label: 'Report', icon: 'article', to: '/report' },
])
</script>

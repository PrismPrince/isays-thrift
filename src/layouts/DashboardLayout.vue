<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-brown text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <d-toolbar-title></d-toolbar-title>

        <d-logout-btn></d-logout-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <d-nav-menu-list></d-nav-menu-list>
        <q-separator />
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item :to="menuItem.to" :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import DToolbarTitle from 'components/DToolbarTitle.vue'
import DNavMenuList from 'components/DNavMenuList.vue'
import DLogoutBtn from 'components/auth/DLogoutBtn.vue'

const leftDrawerOpen = ref(true)
const menuList = ref([
  { label: 'Customers', icon: 'people', to: '/dashboard/customers' },
  { label: 'Locations', icon: 'map', to: '/dashboard/locations' },
  { label: 'Categories', icon: 'category', to: '/dashboard/categories' },
])
</script>

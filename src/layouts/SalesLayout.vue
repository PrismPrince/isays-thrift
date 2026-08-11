<template>
  <q-layout view="lHh lpR fFf">
    <q-header bordered class="bg-brown text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <d-toolbar-title></d-toolbar-title>

        <d-logout-btn></d-logout-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" overlay elevated>
      <q-scroll-area class="fit">
        <d-nav-menu-list></d-nav-menu-list>
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

const leftDrawerOpen = ref(false)
</script>

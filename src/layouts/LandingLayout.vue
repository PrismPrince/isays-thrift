<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-brown text-white">
      <q-toolbar>

        <d-toolbar-title></d-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import DToolbarTitle from 'components/DToolbarTitle.vue'
</script>

<template>
  <q-btn dense flat label="Logout" icon="logout" @click="logout" />
</template>

<script setup>
import { pb } from 'src/boot/pocketbase'
import { useQuasar } from 'quasar'

const $q = useQuasar()

function logout() {
  pb.authStore.clear()

  $q.notify({
    type: 'positive',
    message: 'Logout successful!',
  })
}
</script>

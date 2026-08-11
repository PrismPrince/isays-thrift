<template>
  <q-form @submit.prevent="login">
    <q-input
      v-model="loginForm.email"
      label="Email"
      type="email"
      outlined
      dense
      :rules="[(val) => !!val || 'Email is required', (val) => /.+@.+\..+/.test(val) || 'Enter a valid email']"
      :disable="loading"
    />

    <q-input
      v-model="loginForm.password"
      label="Password"
      type="password"
      outlined
      dense
      :rules="[(val) => !!val || 'Password is required']"
      :disable="loading"
    />

    <q-btn
      class="full-width"
      color="brown"
      type="submit"
      label="Login"
      :disable="loading"
    />
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { pb } from 'src/boot/pocketbase'

const $q = useQuasar()
const loading = ref(false)

const loginForm = ref({
  email: '',
  password: '',
})


async function login() {
  loading.value = true

  try {
    await pb.collection('users').authWithPassword(loginForm.value.email, loginForm.value.password)

    $q.notify({
      type: 'positive',
      message: 'Login successful!',
    })

    console.log('Authenticated user:', pb.authStore.record)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error?.response?.message || 'Invalid email or password',
    })
  } finally {
    loading.value = false
  }
}

</script>
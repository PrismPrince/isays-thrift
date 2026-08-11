<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-tabs v-model="tab" class="bg-amber-6 text-white" active-color="brown" align="justify">
        <q-tab name="login" label="Login" />
        <q-tab name="signup" label="Sign Up" />
      </q-tabs>

      <!-- Tab Panels -->
      <q-tab-panels v-model="tab" animated>
        <!-- Login -->
        <q-tab-panel name="login">
          <d-login-form></d-login-form>
        </q-tab-panel>

        <!-- Signup -->
        <q-tab-panel name="signup">
          <d-signup-form></d-signup-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import DLoginForm from 'src/components/auth/DLoginForm.vue'
import DSignupForm from 'src/components/auth/DSignupForm.vue'

const tab = ref('login')
</script>

<style scoped>
.q-card {
  flex-basis: 50%;
}
</style>

<template>
  <q-form @submit.prevent="signup">
    <div class="row flex">
      <q-input
        label="Name"
        v-model="signupForm.name"
        outlined
        dense
        :rules="[(val) => !!val || 'Name is required.']" 
      />

      <q-input
        label="Email" type="email"
        v-model="signupForm.email"
        outlined
        dense
        :rules="[
          (val) => !!val || 'Email is required.',
          (val) => /.+@.+\..+/.test(val) || 'Enter a valid email.'
        ]" 
      />
    </div>
    <div class="row flex">
      <q-input
        label="Password" type="password"
        v-model="signupForm.password"
        outlined
        dense
        :rules="[
          (val) => !!val || 'Password is required.',
          (val) => val.length >= 8 || 'Password must be at least 8 characters.'
        ]" 
      />

      <q-input
        label="Confirm Password" type="password"
        v-model="signupForm.passwordConfirm"
        outlined
        dense
        :rules="[
          (val) => !!val || 'Confirm password is required.',
          (val) => val === signupForm.password || 'Passwords do not match.'
        ]" 
      />
    </div>

    <q-btn 
      class="full-width" 
      color="brown" 
      type="submit"
      label="Create Account"
    />
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { pb } from 'src/boot/pocketbase'

const $q = useQuasar()
const loading = ref(false)

const signupForm = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const signup = async () => {
  loading.value = true

  try {
    await pb.collection('users').create({
      name: signupForm.value.name,
      email: signupForm.value.email,
      password: signupForm.value.password,
      passwordConfirm: signupForm.value.passwordConfirm,
    })

    // Automatically log the newly created user in
    await pb.collection('users').authWithPassword(signupForm.value.email, signupForm.value.password)

    $q.notify({
      type: 'positive',
      message: 'Account created successfully!',
    })
    
    console.log('Authenticated user:', pb.authStore.record)
  } catch (error) {
    console.error('Error creating account:', error)

    $q.notify({
      type: 'negative',
      message: error?.response?.message || 'Could not create account.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.row.flex {
  gap: 0.5rem;
}
.q-input {
  flex: 1;
}
</style>
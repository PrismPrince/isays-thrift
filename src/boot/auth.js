import { boot } from 'quasar/wrappers'
import { pb } from './pocketbase'

export default boot(({ router }) => {
  pb.authStore.onChange(() => {
    if (pb.authStore.isValid) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  })
})
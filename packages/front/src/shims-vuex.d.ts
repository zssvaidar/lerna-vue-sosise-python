// import { Store } from '@/store/index'
// import { Store } from 'vuex'
import { Store } from '@/store/index'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store;
  }
}

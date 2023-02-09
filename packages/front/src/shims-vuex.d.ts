// import { Store } from '@/store/index'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store;
  }
}

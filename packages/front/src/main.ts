/* eslint-disable vue/multi-word-component-names */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './assets/css/style.css'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'

const app = createApp(App)

app.component('Button', Button)
app.component('Menubar', Menubar)

app.use(PrimeVue).use(store).use(router).mount('#app')

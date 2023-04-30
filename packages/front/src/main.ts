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
import Dialog from 'primevue/dialog'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Card from 'primevue/card'
import Tooltip from 'primevue/tooltip'
import VirtualScroller from 'primevue/virtualscroller'
import ScrollPanel from 'primevue/scrollpanel'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import FileUpload from 'primevue/fileupload'

const app = createApp(App)

app.component('Button', Button)
app.component('Menubar', Menubar)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Dropdown', Dropdown)
app.component('Card', Card)
app.component('VirtualScroller', VirtualScroller)
app.component('ScrollPanel', ScrollPanel)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('FileUpload', FileUpload)

app.directive('tooltip', Tooltip)

app.use(PrimeVue).use(store).use(router).mount('#app')

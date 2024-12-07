import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './views/BoardView.vue'
import router from './router'
import VueKonva from 'vue-konva'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueKonva)

app.mount('#app')

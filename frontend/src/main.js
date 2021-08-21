import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'

// https://stackoverflow.com/questions/64269587/how-to-correctly-import-axios-in-vue-3-after-creating-new-project-with-cli
const app = createApp(App)

new WaveUI(app, {})

app.use(VueAxios, axios)
app.mount('#app')

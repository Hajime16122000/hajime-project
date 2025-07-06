import { createApp } from 'vue'
import App from './App.vue'
import BaseModal from './components/commons/HajimeModal.vue';
import BaseButton from './components/commons/HajimeButton.vue';


const app = createApp(App);

app.component('base-modal', BaseModal);
app.component('base-button', BaseButton);

app.mount('#app')

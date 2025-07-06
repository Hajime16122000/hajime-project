import { createApp } from 'vue'
import { createStore } from 'vuex';

import App from './App.vue'
import appStore from './store'

import BaseModal from './components/commons/HajimeModal.vue';
import BaseButton from './components/commons/HajimeButton.vue';
import BaseTable from './components/commons/HajimeTable.vue';

const app = createApp(App);
const store = createStore({
    ...appStore,
});
app.use(store);

app.component('base-modal', BaseModal);
app.component('base-button', BaseButton);
app.component('base-table', BaseTable);

app.mount('#app')

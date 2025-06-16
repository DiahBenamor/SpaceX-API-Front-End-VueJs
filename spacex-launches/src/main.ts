import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

import './assets/main.css'

createApp(App).mount('#app')

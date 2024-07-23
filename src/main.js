import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; 
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

createApp(App)
  .use(router)
  .use(store) 
  .use(VueTippy)
  .mount('#app');

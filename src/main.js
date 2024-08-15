import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; 
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  forceTLS: true,
  encrypted: true,
  wsHost: process.env.VUE_APP_PUSHER_HOST || `ws-${process.env.VUE_APP_PUSHER_APP_CLUSTER}.pusher.com`,
  wsPort: process.env.VUE_APP_PUSHER_PORT || 6001,
  wssPort: process.env.VUE_APP_PUSHER_PORT || 6001,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: 'https://api.prattuapp.com.br/broadcasting/auth', // Certificar de que este é o endpoint correto
  auth: {
    headers: {
      Authorization: `Bearer ${store.state.token}`, 
    },
  },
});


createApp(App)
  .use(router)
  .use(store) 
  .use(VueTippy)
  .mount('#app');

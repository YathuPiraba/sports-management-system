// utils/pusher.js
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  encrypted: true,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  }
});

export default echo;
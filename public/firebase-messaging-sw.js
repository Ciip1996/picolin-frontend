/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js');

const isLocalhost = Boolean(
  location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

const config = isLocalhost
  ? {
      apiKey: 'AIzaSyCW72cJFFUmo3x8EeO-F5siP6jIYQBTGDI',
      projectId: 'gpac-epic-test',
      messagingSenderId: '639665134212',
      appId: '1:639665134212:web:719968018ead7a967a00d1'
    }
  : {
      apiKey: '#FIREBASE_API_KEY#',
      projectId: '#FIREBASE_PROJECT_ID#',
      messagingSenderId: '#FIREBASE_SENDER_ID#',
      appId: '#FIREBASE_APP_ID#'
    };

if (firebase.messaging.isSupported()) {
  // Initialize Firebase
  firebase.initializeApp(config);

  // Retrieve an instance of Firebase Messaging so that it can handle background messages.
  const messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(payload => {
    const { data } = payload;
    const { title } = data;
    const options = {
      body: data.body,
      icon: './icon128.png',
      title: data.title,
      data
    };
    self.clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window'
      })
      .then(clients => {
        if (clients && clients.length) {
          clients[0].postMessage({
            type: 'BACKGROUND_MESSAGE_NOTIFICATION',
            data
          });
        }
      });

    return self.registration.showNotification(title, options);
  });

  self.addEventListener('notificationclick', event => {
    const url = event.notification.data && event.notification.data.click_url;

    event.notification.close();

    event.waitUntil(
      // eslint-disable-next-line consistent-return
      clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          // If so, just focus it.
          if (client.url === url && 'focus' in client) {
            client.postMessage({
              type: 'CLICK_BACKGROUND_MESSAGE_NOTIFICATION'
            });
            return client.focus();
          }
        }
        // If not, then open the target URL in a new window/tab.
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  });
}

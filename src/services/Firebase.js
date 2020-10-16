// @flow
import * as firebase from 'firebase/app';
import 'firebase/messaging';

// Firebase config object.
const config = {
  apiKey: window.PICOLIN_ENV?.FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: window.PICOLIN_ENV?.FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL:
    window.PICOLIN_ENV?.FIREBASE_DATABASE_URL || process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: window.PICOLIN_ENV?.FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:
    window.PICOLIN_ENV?.FIREBASE_STORAGE_BUCKET || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    window.PICOLIN_ENV?.FIREBASE_SENDER_ID || process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: window.PICOLIN_ENV?.FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:
    window.PICOLIN_ENV?.FIREBASE_MEASUREMENT_ID || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const setupMessaging = () => {
  // Initialize Firebase
  firebase.initializeApp(config);
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey(
    window.PICOLIN_ENV?.FIREBASE_PUBLIC_API_KEY || process.env.REACT_APP_FIREBASE_PUBLIC_API_KEY
  );
  return messaging;
};

const messaging = firebase.messaging.isSupported() ? setupMessaging() : null;

export { messaging };

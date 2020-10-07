#!/bin/sh

KEYS_TO_REPLACE="FIREBASE_API_KEY FIREBASE_PROJECT_ID FIREBASE_SENDER_ID FIREBASE_APP_ID"

for key in ${KEYS_TO_REPLACE}
do
  eval echo "$key = \$$key"
  eval "sed -i \"s/#$key#/\$$key/g\" build/firebase-messaging-sw.js"
done
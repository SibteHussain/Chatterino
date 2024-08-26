/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotificationOnNewMessage = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const newValue = snap.data();

    // Get the message sender and receiver information
    const sender = newValue.sender;
    const receiver = newValue.receiver;
    const messageText = newValue.text;

    // Get the receiver's FCM token (assuming you store FCM tokens in Firestore)
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(receiver)
      .get();
    const receiverData = userDoc.data();
    const token = receiverData.fcmToken;

    // Send a notification to the receiver
    const payload = {
      notification: {
        title: `New message from ${sender}`,
        body: messageText,
      },
    };

    try {
      await admin.messaging().sendToDevice(token, payload);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });

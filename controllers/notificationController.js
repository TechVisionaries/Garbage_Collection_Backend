import asyncHandler from 'express-async-handler';
import { firestore, messaging } from '../utils/firebase.js';


// @desc    send notificaitons
// route    POST /api/notify/
// @access  Public
const sendNotifications = asyncHandler(async (req, res) => {
    const { targetUserId, notificationTitle, notificationBody } = req.body;

  try {
    // Fetch the target user's FCM token from Firestore
    const userDoc = await firestore.collection('users').doc(targetUserId).get();
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    if (!fcmToken) {
      return res.status(400).send('FCM token not found for the user');
    }

    // Define the notification payload
    const message = {
      token: fcmToken,
      notification: {
        title: notificationTitle,
        body: notificationBody,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK', // Optional, if you want to handle clicks in Flutter
      },
    };

    // Send the notification using Firebase Cloud Messaging
    const response = await messaging.send(message);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
});


 export { 
    sendNotifications
 };
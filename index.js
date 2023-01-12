const express = require('express');
const { WebClient } = require('@slack/web-api');
const { default: axios } = require('axios');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getPercentage } = require('./utils');
const config = require('./config');

// APP
const PORT = config.PORT;
const app = express();

initializeApp({
  credential: cert({
    projectId: config.FIREBASE_PROJECT_ID,
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    privateKey: config.FIREBASE_PRIVATE_KEY
  })
});
const db = getFirestore();

const web = new WebClient(config.SLACK_BOT_TOKEN);

// ROUTES
app.post('/bot', async function (req, res) {
  const result = await axios.get(config.DOLARSI_URL);
  const values = result.data;
  const blue = values.find((value) => value.casa.nombre === 'Blue');
  const actualPrice = parseInt(blue.casa.venta.split(',')[0]);

  const snapshot = await db
    .collection('historyPrice')
    .orderBy('createdAt', 'desc')
    .get();

  if (snapshot.docs.length > 0) {
    console.log('checking price...');

    const lastValue = snapshot.docs[0].data();
    const oldPrice = parseInt(lastValue.value);

    if (actualPrice != oldPrice) {
      await db.collection('historyPrice').add({
        value: actualPrice,
        createdAt: FieldValue.serverTimestamp()
      });

      const changePercentage = getPercentage(oldPrice, actualPrice);

      const text = `:money_with_wings: $ *${actualPrice}*  --  ${changePercentage}`;

      await web.chat.postMessage({
        text: text,
        channel: config.SLACK_CHANNEL_ID
      });
    }
  } else {
    await db.collection('historyPrice').add({
      value: actualPrice,
      createdAt: FieldValue.serverTimestamp()
    });

    await web.chat.postMessage({
      text: `💸 *$ ${actualPrice}*`,
      channel: config.SLACK_CHANNEL_ID
    });
  }

  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Bot listen on port: ${config.PORT}`);
});

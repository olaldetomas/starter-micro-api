const express = require('express');
const { WebClient } = require('@slack/web-api');
const { default: axios } = require('axios');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
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
  const result = await axios.get(config.DOLAR_URL);

  const actualSellPrice = parseInt(result.data.venta.split(',')[0]);
  const actualBuyPrice = parseInt(result.data.compra.split(',')[0]);
  const variation = result.data.variacion;
  const classVariation = result.data['class-variacion'];

  const snapshot = await db
    .collection('historyPrice')
    .orderBy('createdAt', 'desc')
    .get();

  if (snapshot.docs.length > 0) {
    const lastValue = snapshot.docs[0].data();
    const oldPrice = parseInt(lastValue.value);

    if (actualSellPrice != oldPrice) {
      await db.collection('historyPrice').add({
        value: actualSellPrice,
        createdAt: FieldValue.serverTimestamp()
      });

      const arrowVariation =
        classVariation === 'up' ? ':face_with_rolling_eyes:' : ':pensive:';

      const text = `
      > :money_with_wings: Dolar Blue :money_with_wings:
      > Venta ........... $ *${actualSellPrice}*
      > Compra ....... $ *${actualBuyPrice}*
      > Variación ..... ${arrowVariation} *${variation}*
      `;

      await web.chat.postMessage({
        text: text,
        channel: config.SLACK_CHANNEL_ID
      });
    }
  } else {
    await db.collection('historyPrice').add({
      value: actualSellPrice,
      createdAt: FieldValue.serverTimestamp()
    });
  }

  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Bot listen on port: ${config.PORT}`);
});

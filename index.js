const express = require('express');
const { WebClient } = require('@slack/web-api');
const { default: axios } = require('axios');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const config = require('./config');
const cheerio = require('cheerio');

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
  const $ = cheerio.load(result.data);
  const valores = $('div.data__valores p').text();
  var numbers = valores.match(/\d+\.\d+/g);

  const actualBuyPrice = parseInt(numbers[0]);
  const actualSellPrice = parseInt(numbers[1]);

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

      const text = `>:money_with_wings:  Dolar Blue  :money_with_wings:\n>Venta ........... $ *${actualSellPrice}*\n>Compra ....... $ ${actualBuyPrice}`;

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

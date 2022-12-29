const config = require("./config");
const { WebClient } = require("@slack/web-api");
const { default: axios } = require("axios");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp({
  credential: cert({
    projectId: config.FIREBASE_PROJECT_ID,
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    privateKey: config.FIREBASE_PRIVATE_KEY,
  }),
});

const db = getFirestore();

const web = new WebClient(config.SLACK_BOT_TOKEN);

const oneMin = 1000 * 60;
const cantMin = 1;
const delay = oneMin * cantMin;

setInterval(async () => {
  console.log("checking dolar price...");
  const result = await axios.get(config.DOLARSI_URL);
  const values = result.data;

  const blue = values.find(value => value.casa.nombre === "Blue");
  const actualPrice = parseInt(blue.casa.venta.split(",")[0]);

  const snapshot = await db
    .collection("historyPrice")
    .orderBy("createdAt", "desc")
    .get();

  if (snapshot.docs.length > 0) {
    const lastValue = snapshot.docs[0].data();
    const oldPrice = parseInt(lastValue.value);

    console.log(`\n
      Actual price: $ ${actualPrice}
      Old price: $ ${oldPrice}
      Delay: ${cantMin} minutes
    `);

    if (actualPrice > oldPrice) {
      await db.collection("historyPrice").add({
        value: actualPrice,
        createdAt: FieldValue.serverTimestamp(),
      });

      await web.chat.postMessage({
        text: `💸 *$ ${actualPrice}*`,
        channel: config.SLACK_CHANNEL_ID,
      });
    }
  } else {
    await db.collection("historyPrice").add({
      value: actualPrice,
      createdAt: FieldValue.serverTimestamp(),
    });

    await web.chat.postMessage({
      text: `💸 *$ ${actualPrice}*`,
      channel: config.SLACK_CHANNEL_ID,
    });
  }
}, delay);

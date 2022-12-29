require("dotenv").config();

const config = {
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
  DOLARSI_URL: process.env.DOLARSI_URL,
  APX_FIREBASE_CREDENTIALS: process.env.APX_FIREBASE_CREDENTIALS,
  PORT: process.env.PORT || 3000,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

module.exports = config;

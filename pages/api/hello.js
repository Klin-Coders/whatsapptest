// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

  const { Client, RemoteAuth } = require("whatsapp-web.js");
  const { MongoStore } = require("wwebjs-mongo");
  const mongoose = require("mongoose");
  const qrcode = require("qrcode-terminal");

  export default function handler(req, res) {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
      const store = new MongoStore({ mongoose: mongoose });
      const client = new Client({
        authStrategy: new RemoteAuth({
          store: store,
          backupSyncIntervalMs: 300000,
        }),
      });

      client.initialize();

      client.on("qr", (qr) => {
        // NOTE: This event will not be fired if a session is specified.
        console.log("QR RECEIVED", qr);
        qrcode.generate(qr, { small: true });
      });

      client.on("authenticated", () => {
        console.log("AUTHENTICATED");
      });

      client.on("remote_session_saved", () => {
        console.log("SESSION SAVED!");
      });

      client.on("auth_failure", (msg) => {
        // Fired if session restore was unsuccessful
        console.error("AUTHENTICATION FAILURE", msg);
      });

      client.on("ready", () => {
        console.log("READY TO SEND MESSAGES");
      });
    });

    res.status(200).json({ name: "John Doe" });
  }

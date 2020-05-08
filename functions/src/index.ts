import * as functions from 'firebase-functions';
import * as express from 'express';
import productsRouter from './routes/products';
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://colmillitos-pos.firebaseio.com",
});

const app = express();

app.use('/products', productsRouter);

export const api = functions.https.onRequest(app);

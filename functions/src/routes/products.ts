import * as express from 'express';
import * as admin from 'firebase-admin';

const productsRouter = express.Router();

productsRouter.get('/', (request, response) => {
  admin.database().ref('products').once('value', snapshot => {
    const data = snapshot.val();
    response.send(data);
  });
});

export default productsRouter;

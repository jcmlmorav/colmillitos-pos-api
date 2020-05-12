import * as express from 'express';
import * as admin from 'firebase-admin';
import Product from '../models/product';

const productsRouter = express.Router();

productsRouter.get('/:user', (request, response) => {
  try {
    const { user } = request.params;

    admin.database().ref('products').child(user).once('value', snapshot => {
      const products = snapshot.val();

      if (products) {
        response.json({
          data: snapshot.val()
        });
      } else {
        response.json({
          data: {}
        });
      }
    });
  } catch (error) {
    response.status(500).json({
      error: { general: 'Ocurrió un error al consultar la información' }
    });
  }
});

productsRouter.post('/', (request, response) => {
  try {
    const { user, description, code, quantity, price, active } = request.body;
    const errors: any = {};

    if (!user) {
      response.status(401).json({
        error: { general: 'No se puede acceder al guardado de productos' }
      });
    }

    if (!description) {
      errors.description = 'El campo descripción es requerido';
    }

    if ('quantity' in request.body) {
      if (typeof quantity !== 'number') {
        errors.quantity = 'El campo cantidad debe ser numérico';
      }
    }

    if ('price' in request.body) {
      if (typeof price !== 'number') {
        errors.price = 'El campo precio debe ser numérico';
      }
    }

    if ('active' in request.body) {
      if (typeof active !== 'boolean') {
        errors.active = 'El campo activo debe ser verdadero o falso';
      }
    }

    if (Object.keys(errors).length) {
      response.json({
        error: errors
      });
    } else {
      const product = Product(description, code, quantity, price, active);
      const result = admin.database().ref('products').child(user).push(product).key;
  
      response.json({
        data: {
          id: result,
          ...product
        }
      });
    }
  } catch (error) {
    response.status(500).json({
      error: { general: 'Ocurrió un error al guardar la información' }
    });
  }
});

productsRouter.put('/:productId', (request, response) => {
  try {
    const { user, description, code, quantity, price, active } = request.body;
    const { productId } = request.params;
    const errors: any = {};

    admin.database().ref(`products/${user}`).child(productId).once('value').then(snapshot => {
      if (!snapshot.exists()) {
        errors.general = 'El producto que intenta actualizar no existe';
        response.json({
          error: errors
        });
      } else {
        if (!description) {
          errors.description = 'El campo descripción es requerido';
        }
    
        if ('quantity' in request.body) {
          if (typeof quantity !== 'number') {
            errors.quantity = 'El campo cantidad debe ser numérico';
          }
        }
    
        if ('price' in request.body) {
          if (typeof price !== 'number') {
            errors.price = 'El campo precio debe ser numérico';
          }
        }
    
        if ('active' in request.body) {
          if (typeof active !== 'boolean') {
            errors.active = 'El campo activo debe ser verdadero o falso';
          }
        }
    
        if (Object.keys(errors).length) {
          response.json({
            error: errors
          });
        } else {
          const productUpdated = Product(description, code, quantity, price, active);

          admin.database().ref(`products/${user}`).child(productId).update(productUpdated);

          response.json({
            data: {
              id: productId,
              ...productUpdated
            }
          });
        }
      }
    });
  } catch (error) {
    response.status(500).json({
      error: { general: 'Ocurrió un error al actualizar la información' }
    });
  }
});

productsRouter.delete('/:productId', (request, response) => {
  try {
    const errors: any = {};

    admin.database().ref(`products/${request.body.user}`).child(request.params.productId).once('value').then(snapshot => {
      if (!snapshot.exists()) {
        errors.general = 'El producto que intenta eliminar no existe';
        response.json({
          error: errors
        });
      } else {
        admin.database().ref(`products/${request.body.user}`).child(request.params.productId).remove();
        response.json({ data: 'Producto eliminado' });
      }
    });
  } catch (error) {
    response.status(500).json({
      error: { general: 'Ocurrió un error al eliminar la información' }
    });
  }
});

export default productsRouter;

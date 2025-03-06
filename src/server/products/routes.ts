import { Router } from 'express';
import { runAsyncWrapper } from '../../common/utility/run-async-wrapper';
// import { employeeController } from '../employee/controller';
import { productController } from './controller';

const productsRouter = Router()
  .post('/', runAsyncWrapper(productController.create))
  .put('/', runAsyncWrapper(productController.updateById))
  .get('/', runAsyncWrapper(productController.getAll))
  .get('/:id', runAsyncWrapper(productController.getById))
  .delete('/:id', runAsyncWrapper(productController.deleteById));

export { productsRouter };

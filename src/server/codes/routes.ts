import { Router } from 'express';
import { runAsyncWrapper } from '../../common/utility/run-async-wrapper';
// import { employeeController } from '../employee/controller';
import { codesController } from './controller';

const codesRouter = Router()
  .get('/:id', runAsyncWrapper(codesController.getById))
  .get('/', runAsyncWrapper(codesController.getAll))
  .get('/usedByUser/:usedById', runAsyncWrapper(codesController.getUsedBy));

export { codesRouter };

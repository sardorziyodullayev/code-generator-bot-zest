import { Response, Router } from 'express';
import { runAsyncWrapper } from '../common/utility/run-async-wrapper';
import { giftsRouter } from './gifts/routes';
import { CommonException } from '../common/errors/common.error';
import { usersRouter } from './users/routes';
import { userController } from './users/controller';
import { filesRouter } from './file/routes';
import { codesRouter } from './codes/routes';
import { codesController } from './codes/controller';
import { productController } from './products/controller';
import { productsRouter } from './products/routes';
import { dashboardRouter } from './dashboard/routes';

const router = Router()
  .get(
    '/check-health',
    runAsyncWrapper(async (_req: Request, res: Response) => {
      res.success({ message: "I'm OK. THANKS" });
    }),
  )
  .use('/files', filesRouter)
  .use('/users', usersRouter)
  .use('/gifts', userController.authorizeUser, giftsRouter)
  .use('/products', userController.authorizeUser, productsRouter)
  .use('/dashboard', userController.authorizeUser, dashboardRouter)
  .use('/codes', userController.authorizeUser, codesRouter)
  .post('/check-code', runAsyncWrapper(codesController.checkCode));

// // 404 Error
router.all('*', (_req, _res, _next) => {
  throw CommonException.NotFound();
});

export { router };

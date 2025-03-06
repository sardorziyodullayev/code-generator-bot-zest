import { StatusCodes } from '../../common/utility/status-codes';
import { CommonException } from '../../common/errors/common.error';

export class ProductException extends CommonException {
  public static NotFound() {
    return new ProductException('Product not found', StatusCodes.NOT_FOUND);
  }

  public static CannotDelete(data) {
    return new CommonException('Cannot delete this product! ', data);
  }
}

import { PagingDto } from '../../common/validation/dto/paging.dto';
import { Product, ProductModel } from '../../db/models/product.model';
import { BaseService } from '../base.service';
import { ProductDto } from './class-validator';

export class ProductService extends BaseService<Product, ProductDto> {
  constructor(model: typeof ProductModel) {
    super(model);
  }
  async getPaging(query: PagingDto): Promise<{ data: ProductDto[]; total: number }> {
    const filter = { deletedAt: null };
    if (query.search) {
      filter['$or'] = [{ name: { $regex: query.search } }, { id: query.search }];
    }

    return await this.findPaging(filter, { _id: -1 }, query.limit ?? 10, query.page ?? 1, {
      _id: 1,
      id: 1,
      name: 1,
      image: 1,
    });
  }
}

import { validateIt } from '../../common/validation/validate';
import { Request, Response } from 'express';
import { ProductService } from './service';
import { ProductDto, ProductDtoGroup } from './class-validator';
import { StatusCodes } from '../../common/utility/status-codes';
import { ProductModel } from '../../db/models/product.model';
import { PagingDto } from '../../common/validation/dto/paging.dto';

class ProductController {
  private readonly productsService = new ProductService(ProductModel);

  constructor() {
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.updateById = this.updateById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  public async create(req: Request, res: Response) {
    const body = await validateIt(req.body, ProductDto, [ProductDtoGroup.CREATE]);

    const result = await this.productsService.create(body);

    return res.success(result, {}, StatusCodes.CREATED);
  }

  public async updateById(req: Request, res: Response) {
    const body = await validateIt(req.body, ProductDto, [ProductDtoGroup.UPDATE]);

    const product = await this.productsService.findByIdAndUpdate(body, {
      lean: true,
      new: true,
      projection: { _id: 1, id: 1, name: 1, image: 1, totalCount: 1, usedCount: 1, createdAt: 1 },
    });

    return res.success(product);
  }

  public async getById(req: Request, res: Response) {
    const data = await validateIt(req.params, ProductDto, [ProductDtoGroup.GET_BY_ID]);

    const result = await this.productsService.findById(data._id);
    return res.success(result);
  }

  public async getAll(req: Request, res: Response) {
    const query = await validateIt(req.query, PagingDto, [ProductDtoGroup.PAGINATION]);
    const products = await this.productsService.getPaging(query);

    return res.success(products.data, {
      currentPage: query.page,
      totalData: products.total,
      totalPages: Math.ceil(products.total / query.limit),
      limit: query.limit,
    });
  }

  public async deleteById(req: Request, res: Response) {
    const data = await validateIt(req.params, ProductDto, [ProductDtoGroup.DELETE]);

    await this.productsService.deleteById(data._id, req.user._id);

    return res.success({ _id: data._id });
  }
}

export const productController = new ProductController();

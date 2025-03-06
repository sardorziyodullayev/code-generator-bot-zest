import { PipelineStage } from 'mongoose';
import { PagingDto } from '../../common/validation/dto/paging.dto';
import { Code, CodeModel } from '../../db/models/codes.model';
import { BaseService } from '../base.service';
import { CodeDto, CodePagingDto } from './class-validator';
import { COLLECTIONS } from '../../common/constant/tables';
import { CodeException } from './error';
import { ProductModel } from '../../db/models/product.model';
import { QuerySort } from '../../common/validation/types';
import { isMongoId } from 'class-validator';

export class CodeService extends BaseService<Code, CodeDto> {
  constructor(
    model: typeof CodeModel = CodeModel,
    private readonly productModel: typeof ProductModel = ProductModel,
  ) {
    super(model);
  }
  async getPaging(query: CodePagingDto): Promise<{ data: CodeDto[]; total: number; totalUsedCount: number }> {
    const filter = { deletedAt: null };

    if (query.isUsed == true || query.isUsed == false) {
      filter['usedAt'] = query.isUsed ? { $ne: null } : null;
    }

    if (query.search) {
      filter['$or'] = [{ value: query.search }, { id: query.search }];
    }

    if (query.productId && isMongoId(query.productId)) {
      filter['productId'] = this.toObjectId(query.productId);
    }

    query.limit = query.limit ?? 10;
    query.page = query.page ?? 1;
    const $match = { $match: filter };
    const $project = {
      $project: {
        _id: 1,
        id: 1,
        value: 1,
        productId: 1,
        isUsed: 1,
        usedAt: 1,
        usedById: 1,
      },
    };
    const $sort: PipelineStage.Sort = { $sort: { isUsed: -1, id: 1 } };
    const $limit = { $limit: query.limit };
    const $skip = { $skip: (query.page - 1) * query.limit };
    const $lookupUser: PipelineStage.Lookup = {
      $lookup: {
        from: COLLECTIONS.users,
        let: { usedById: '$usedById' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$usedById'],
              },
            },
          },
          {
            $project: {
              _id: 1,
              tgId: 1,
              tgFirstName: 1,
              tgLastName: 1,
              firstName: 1,
              phoneNumber: 1,
            },
          },
        ],
        as: 'usedBy',
      },
    };
    const $lookupProduct: PipelineStage.Lookup = {
      $lookup: {
        from: COLLECTIONS.products,
        let: { productId: '$productId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$productId'],
              },
            },
          },
          {
            $project: {
              _id: 1,
              id: 1,
              name: 1,
              image: 1,
            },
          },
        ],
        as: 'product',
      },
    };

    const $lastProject: PipelineStage.Project = {
      $project: {
        usedBy: { $arrayElemAt: ['$usedBy', 0] },
        product: { $arrayElemAt: ['$product', 0] },
        ...$project.$project,
      },
    };
    const pipeline: PipelineStage.FacetPipelineStage[] = [
      $match,
      $project,
      $sort,
      $skip,
      $limit,
      $lookupUser,
      $lookupProduct,
      $lastProject,
    ];

    const res = await this.model.aggregate<{
      data: CodeDto[];
      total: [{ total: number }];
      totalUsedCount: [{ total: number }];
    }>([
      {
        $facet: {
          data: pipeline,
          total: [$match, { $count: 'total' }],
          totalUsedCount: [
            { $match: { deletedAt: null, isUsed: true, usedAt: { $ne: null } } },
            { $count: 'total' },
          ],
        },
      },
    ]);

    return {
      data: res[0].data,
      total: res[0].total[0] && res[0].total[0].total ? res[0].total[0].total : 0,
      totalUsedCount: res[0].total[0] && res[0].totalUsedCount[0].total ? res[0].totalUsedCount[0].total : 0,
    };
  }

  async getUsedByUserPaging(query: PagingDto, usedById: string): Promise<{ data: CodeDto[]; total: number }> {
    const filter = {
      deletedAt: null,
      usedById: this.toObjectId(usedById),
    };
    if (query.search) {
      filter['$or'] = [{ value: { $regex: query.search } }, { id: Number(query.search) }];
    }

    query.limit = query.limit ?? 10;
    query.page = query.page ?? 1;

    const $match = { $match: filter };
    const $project = {
      $project: {
        _id: 1,
        id: 1,
        value: 1,
        productId: 1,
        isUsed: 1,
        usedAt: 1,
        usedById: 1,
      },
    };
    const orderType = query.orderType === 'ASC' ? 1 : -1;
    const sort: QuerySort<CodeDto> = query.orderBy ? { [query.orderBy]: orderType } : { id: 1 };

    const $sort: PipelineStage.Sort = { $sort: sort };
    const $limit = { $limit: query.limit };
    const $skip = { $skip: (query.page - 1) * query.limit };

    const $lookupProduct: PipelineStage.Lookup = {
      $lookup: {
        from: COLLECTIONS.products,
        let: { productId: '$productId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$productId'],
              },
            },
          },
          {
            $project: {
              _id: 1,
              id: 1,
              name: 1,
              image: 1,
            },
          },
        ],
        as: 'product',
      },
    };

    const $lastProject: PipelineStage.Project = {
      $project: {
        product: { $arrayElemAt: ['$product', 0] },
        ...$project.$project,
      },
    };
    const pipeline: PipelineStage.FacetPipelineStage[] = [
      $match,
      $project,
      $sort,
      $skip,
      $limit,
      $lookupProduct,
      $lastProject,
    ];

    const res = await this.model.aggregate<{ data: CodeDto[]; total: [{ total: number }] }>([
      {
        $facet: {
          data: pipeline,
          total: [$match, { $count: 'total' }],
        },
      },
    ]);

    return {
      data: res[0].data,
      total: res[0].total[0] && res[0].total[0].total ? res[0].total[0].total : 0,
    };
  }

  async checkCode(value: string) {
    const code = await this.findOne({ value: value, deletedAt: null }, { value: 1, productId: 1 });
    if (!code) {
      throw CodeException.NotFound();
    }

    const product = await this.productModel
      .findOne({ _id: code.productId, deletedAt: null }, { name: 1, image: 1 })
      .lean();

    const res = {
      value: code.value,
      product: product,
      gift: null,
    };

    return res;
  }
}

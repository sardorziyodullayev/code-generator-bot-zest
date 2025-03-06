import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { CommonDto, CommonDtoGroup } from '../../common/validation/dto/common.dto';
import { IsCodeProductId } from '../../common/validation/custom/codes.queryParam.productId.validator';
import { PagingDto } from '../../common/validation/dto/paging.dto';
import { Transform } from 'class-transformer';

export class CodeDtoGroup extends CommonDtoGroup {
  static readonly CHECK_CODE = 'CHECK_CODE';
  static readonly GET_USED_BY_USER_ID = 'GET_USED_BY_USER_ID';
}

export class CodeDto extends CommonDto {
  id: number;

  @IsString({ groups: [CodeDtoGroup.CHECK_CODE] })
  value: string;

  @IsOptional({ groups: [CodeDtoGroup.UPDATE] })
  @IsMongoId({ groups: [CodeDtoGroup.UPDATE] })
  giftId: string | null;

  isUsed: boolean;

  @IsMongoId({ groups: [CodeDtoGroup.GET_USED_BY_USER_ID] })
  usedById: string;

  usedAt: string;
}

export class CodePagingDto extends PagingDto {
  @IsOptional({ groups: [CodeDtoGroup.PAGINATION] })
  @IsString({ groups: [CodeDtoGroup.PAGINATION] })
  @Validate(IsCodeProductId, ['null', null, ''], { groups: [CodeDtoGroup.PAGINATION] })
  productId?: string | null;

  @Transform(({ value }) => (value == 'true' ? true : value == 'false' ? false : null), {
    groups: [CodeDtoGroup.PAGINATION],
  })
  @IsOptional({ groups: [CodeDtoGroup.PAGINATION] })
  @IsBoolean({ groups: [CodeDtoGroup.PAGINATION] })
  isUsed?: boolean | null | undefined;
}

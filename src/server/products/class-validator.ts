import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonDto, CommonDtoGroup } from '../../common/validation/dto/common.dto';

export class ProductDtoGroup extends CommonDtoGroup {}

export class ProductDto extends CommonDto {
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsString({ groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE] })
  name!: string;

  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsString({ groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE] })
  image!: string;
}

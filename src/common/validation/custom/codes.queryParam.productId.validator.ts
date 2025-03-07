import { ValidatorConstraint, ValidationArguments, isMongoId } from 'class-validator';

@ValidatorConstraint({ name: 'IsCodeProductId', async: false })
export class IsCodeProductId {
  validate(text: string, args: ValidationArguments) {
    console.log('IsCodeProductId', text, args);
    
    return !args.constraints.find((arg) => arg === text) || !isMongoId(text);
  }

  defaultMessage(args: ValidationArguments) {
    return `productId must mongoId or oneOf${JSON.stringify(args.constraints)}`;
  }
}

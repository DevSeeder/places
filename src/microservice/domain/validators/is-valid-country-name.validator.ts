// // new file "my-validator.validator.ts"
// import { Injectable, Logger } from '@nestjs/common';
// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments
// } from 'class-validator';
// import { GetCountryByNameOrAliasService } from '../service/countries/get-country-by-name-or-alias.service';

// @Injectable()
// @ValidatorConstraint()
// export class IsValidCountryNameConstraint
//   implements ValidatorConstraintInterface
// {
//   protected readonly logger: Logger = new Logger(this.constructor.name);

//   constructor(private getCountryService: GetCountryByNameOrAliasService) {}

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   async validate(name: string, _args: ValidationArguments) {
//     this.logger.log('Validating Country Name...');
//     const res = await this.getCountryService.getCountryByNameOrAlias(name);
//     console.log(res);
//     return res.length > 0;
//   }
// }

// export function IsValidCountryName(validationOptions?: ValidationOptions) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: IsValidCountryNameConstraint
//     });
//   };
// }

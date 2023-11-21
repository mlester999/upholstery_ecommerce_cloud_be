// is-unique.validator.ts
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
import { EntityManager } from 'typeorm';

// decorator options interface
export type IsUniqueInterface = {
    tableName: string,
    column: string
}
  
  @ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
  export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}
    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        const {tableName, column}: IsUniqueInterface = args.constraints[0]

        // database query check data is exists
        const dataExist = await this.entityManager.getRepository(tableName)
            .createQueryBuilder(tableName)
            .where({[column]: value})
            .getExists()
        
        return !dataExist
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        // return custom field message
        const field: string = validationArguments.property
        return `${field} is already exist`
    }
  }
  
  export function IsUnique(options: IsUniqueInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        })
    }
}
  
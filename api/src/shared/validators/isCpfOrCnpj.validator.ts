import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (!value) return false;

          const cleaned = value.replace(/\D/g, '');

          return cpf.isValid(cleaned) || cnpj.isValid(cleaned);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Document must be a valid CPF or CNPJ';
        },
      },
    });
  };
}

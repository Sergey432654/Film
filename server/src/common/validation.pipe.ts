import { UnprocessableEntityException, ValidationPipe, type ValidationError } from '@nestjs/common';

export type FieldErrors = Record<string, string>;

function collectFieldErrors(errors: ValidationError[], parent = ''): FieldErrors {
  return errors.reduce<FieldErrors>((acc, error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const [message] = Object.values(error.constraints ?? {});

    if (message) acc[field] = message;
    if (error.children?.length) Object.assign(acc, collectFieldErrors(error.children, field));

    return acc;
  }, {});
}

/**
 * Global validation: strips unknown fields, converts payloads into DTO instances
 * and answers with the error shape the client expects:
 * `422 { message, errors: { field: message } }`.
 */
export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) =>
      new UnprocessableEntityException({
        message: 'Some fields are invalid.',
        errors: collectFieldErrors(errors),
      }),
  });

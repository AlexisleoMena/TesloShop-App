import { plainToInstance } from 'class-transformer';

export function plainToDto<T>(
  dtoClass: new () => T,
  plainObject: Record<string, any>,
): T {
  return plainToInstance(dtoClass, plainObject, {
    excludeExtraneousValues: true,
  });
}

import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export function getBooleanMetadata(
  reflector: Reflector,
  context: ExecutionContext,
  key: string,
): boolean {
  return reflector.getAllAndOverride<boolean>(key, [
    context.getHandler(),
    context.getClass(),
  ]);
}

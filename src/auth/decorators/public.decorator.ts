import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../../utils/constants';

/**
 * A decorator to mark a controller or a route as public.
 * @param isPublic
 * Whether the controller or route is public. Default to true.
 **/
export function Public(isPublic: boolean = true): CustomDecorator {
  return SetMetadata(PUBLIC_KEY, isPublic);
}

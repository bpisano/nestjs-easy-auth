import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from '../../utils/constants';
import { getBooleanMetadata } from '../../utils/metadata/getBooleanMetadata';
import { Optional } from '../../utils/types/optional';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = getBooleanMetadata(this.reflector, context, PUBLIC_KEY);
    if (isPublic) {
      return true;
    }

    const accessToken: Optional<string> = this.getAccessToken(context);
    if (!accessToken) {
      return false;
    }

    return super.canActivate(context);
  }

  private getAccessToken(context: ExecutionContext): Optional<string> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization: Optional<string> = request.headers['authorization'];
    if (!authorization) {
      return undefined;
    }
    const [bearer, accessToken]: string[] = authorization.split(' ');
    if (bearer.toLowerCase() !== 'bearer') {
      return undefined;
    }
    return accessToken;
  }
}

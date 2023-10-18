import { Body, Controller, Post, Type } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { PublicSession } from '../../session/models/public/publicSession';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { BaseAuthenticationController } from './baseAuthentication.controller';

export class AuthenticationController {
  public static withPath<Input, Credentials extends AnyCredentialsRepresentation, User extends AnyUserRepresentation>(
    path: string,
    options?: { prefix?: string | string[] }
  ): Type<any> {
    @Controller(options?.prefix ?? 'auth')
    class AuthenticationController extends BaseAuthenticationController<Input, Credentials, User> {
      @Public()
      @Post(path)
      public async performAuthentication(@Body() input: Input): Promise<PublicSession<Credentials, User>> {
        return this.authenticate(input);
      }
    }
    return AuthenticationController;
  }
}

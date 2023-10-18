import { DynamicModule, Module } from '@nestjs/common';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { AuthenticatorBundle } from '../services/authenticatorBundle';
import { AUTHENTICATOR } from './authenticatorBundle.moduleKeys';

@Module({})
export class AuthenticatorBundleModule {
  public static withBundle<Input, User extends AnyUserRepresentation>(
    bundle: AuthenticatorBundle<Input, User>
  ): DynamicModule {
    const dynamicModuleClass: any = class {};
    return {
      module: dynamicModuleClass,
      imports: bundle.imports,
      providers: [{ provide: AUTHENTICATOR, useClass: bundle.authenticator }, ...(bundle.providers ?? [])],
      controllers: [bundle.controller],
      exports: [AUTHENTICATOR]
    };
  }
}

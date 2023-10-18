import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticatorBundleModule } from '../../authenticatorBundle/modules/authenticatorBundle.module';
import { AuthenticatorBundle } from '../../authenticatorBundle/services/authenticatorBundle';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';

@Module({})
export class AuthenticatorsModule {
  public static withBundles<User extends AnyUserRepresentation>(
    bundles: AuthenticatorBundle<any, User>[]
  ): DynamicModule {
    return {
      module: AuthenticatorsModule,
      imports: bundles.map((bundle) => AuthenticatorBundleModule.withBundle(bundle))
    };
  }
}

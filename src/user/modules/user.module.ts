import { DynamicModule, Global, Module } from '@nestjs/common';
import { ModelProviderModule } from '../../modelProvider/modules/modelProvider.module';
import { UserModelProvider } from '../../modelProvider/services/modelProvider';
import { AnyUserRepresentation } from '../models/types/anyUserRepresentation';
import { ApiUserService } from '../services/apiUser.service';
import { USER_SERVICE } from './user.moduleKeys';

@Global()
@Module({})
export class UserModule {
  public static withConfiguration<User extends AnyUserRepresentation>(params: {
    modelProvider: UserModelProvider<User>;
  }): DynamicModule {
    return {
      module: UserModule,
      imports: [ModelProviderModule.withProvider(params.modelProvider)],
      providers: [{ provide: USER_SERVICE, useClass: ApiUserService }],
      exports: [USER_SERVICE]
    };
  }
}

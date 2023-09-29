import { DynamicModule, Module, Type } from '@nestjs/common';
import { MongoConfig } from '../../mongoConfig/models/types/mongoConfig';
import { UserStorageModule } from '../../userStorage/modules/userStorage.module';
import { UserStorage } from '../../userStorage/services/userStorage.service';
import { AnyUserRepresentation } from '../models/types/anyUserRepresentation';
import { ApiUserService } from '../services/apiUser.service';
import { USER_SERVICE } from './user.moduleKeys';

@Module({})
export class UserModule {
  public static withConfig<User extends AnyUserRepresentation>(params: {
    storage: Type<UserStorage<User>>;
  }): DynamicModule {
    return {
      module: UserModule,
      imports: [UserStorageModule.usingStorage(params.storage)],
      providers: [{ provide: USER_SERVICE, useClass: ApiUserService }],
      exports: [USER_SERVICE]
    };
  }

  public static mongo(params: { config: MongoConfig }): DynamicModule {
    return {
      module: UserModule,
      imports: [UserStorageModule.mongo({ config: params.config })],
      providers: [{ provide: USER_SERVICE, useClass: ApiUserService }],
      exports: [USER_SERVICE]
    };
  }
}

import { DynamicModule, Module, Type } from '@nestjs/common';
import { MongoConfig } from '../../mongoConfig/models/types/mongoConfig';
import { MongoConfigModule } from '../../mongoConfig/modules/mongoConfig.module';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { MongoUserStorage } from '../services/mongoUserStorage.service';
import { UserStorage } from '../services/userStorage.service';
import { USER_STORAGE } from './userStorage.moduleKeys';

@Module({})
export class UserStorageModule {
  public static usingStorage<User extends AnyUserRepresentation>(storage: Type<UserStorage<User>>): DynamicModule {
    return {
      module: UserStorageModule,
      providers: [{ provide: USER_STORAGE, useClass: storage }],
      exports: [USER_STORAGE]
    };
  }

  public static mongo(params: { config: MongoConfig }): DynamicModule {
    return {
      module: UserStorageModule,
      imports: [MongoConfigModule.withConfiguration(params.config)],
      providers: [{ provide: USER_STORAGE, useClass: MongoUserStorage }],
      exports: [USER_STORAGE]
    };
  }
}

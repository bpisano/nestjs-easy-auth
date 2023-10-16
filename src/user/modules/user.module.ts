import { DynamicModule, Module } from '@nestjs/common';
import { ApiUserService } from '../services/apiUser.service';
import { USER_SERVICE } from './user.moduleKeys';

@Module({})
export class UserModule {
  public static forRoot(): DynamicModule {
    return {
      module: UserModule,
      providers: [{ provide: USER_SERVICE, useClass: ApiUserService }],
      exports: [USER_SERVICE]
    };
  }
}

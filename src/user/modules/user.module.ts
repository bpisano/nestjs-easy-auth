import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { AnyUserRepresentation } from '../models/types/anyUserRepresentation';
import { ApiUserService } from '../services/apiUser.service';
import { USER_MODEL, USER_SERVICE } from './user.moduleKeys';

@Global()
@Module({})
export class UserModule {
  public static withConfiguration<User extends AnyUserRepresentation>(params: {
    model: ClassConstructor<User>;
  }): DynamicModule {
    return {
      module: UserModule,
      providers: [
        { provide: USER_MODEL, useValue: params.model },
        { provide: USER_SERVICE, useClass: ApiUserService }
      ],
      exports: [USER_MODEL, USER_SERVICE]
    };
  }
}

import { DynamicModule, Module } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CredentialsModule } from '../../credentials/modules/credentials.module';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { UserModule } from '../../user/modules/user.module';
import { CredentialsRefreshController } from '../controllers/credentialsRefresh.controller';

@Module({})
export class CredentialsRefreshModule {
  public static withConfiguration<
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation
  >(params: {
    jwtConfig: JWTConfig;
    models: {
      credentials: ClassConstructor<Credentials>;
      user: ClassConstructor<User>;
    };
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [
        CredentialsModule.withConfiguration({ jwtConfig: params.jwtConfig, model: params.models.credentials }),
        UserModule.withConfiguration({ model: params.models.user })
      ],
      controllers: [CredentialsRefreshController]
    };
  }
}

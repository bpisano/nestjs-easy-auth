import { DynamicModule, Module } from '@nestjs/common';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CredentialsModule } from '../../credentials/modules/credentials.module';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { ModelProvider } from '../../modelProvider/services/modelProvider';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { UserModule } from '../../user/modules/user.module';
import { CredentialsRefreshController } from '../controllers/credentialsRefresh.controller';

@Module({})
export class CredentialsRefreshModule {
  public static withConfiguration<
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation
  >(params: { jwtConfig: JWTConfig; modelProvider: ModelProvider<Credentials, User> }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [
        CredentialsModule.withConfiguration({ jwtConfig: params.jwtConfig, modelProvider: params.modelProvider }),
        UserModule.withConfiguration({ modelProvider: params.modelProvider })
      ],
      controllers: [CredentialsRefreshController]
    };
  }
}

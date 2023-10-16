import { DynamicModule, Module } from '@nestjs/common';
import { MapCredentials } from '../../auth/types/mapCredentials';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CredentialsModule } from '../../credentials/modules/credentials.module';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { UserModule } from '../../user/modules/user.module';
import { CredentialsRefreshController } from '../controllers/credentialsRefresh.controller';

@Module({})
export class CredentialsRefreshModule {
  public static withConfiguration<Credentials extends AnyCredentialsRepresentation>(params: {
    jwtConfig: JWTConfig;
    mapCredentials: MapCredentials<Credentials>;
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [
        CredentialsModule.withConfiguration({
          jwtConfig: params.jwtConfig
        }),
        UserModule.forRoot()
      ],
      controllers: [CredentialsRefreshController({ mapCredentials: params.mapCredentials })]
    };
  }
}

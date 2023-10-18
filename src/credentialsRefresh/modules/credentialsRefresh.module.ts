import { DynamicModule, Module } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { CredentialsModule } from '../../credentials/modules/credentials.module';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { UserModule } from '../../user/modules/user.module';
import { CredentialsRefreshController } from '../controllers/credentialsRefresh.controller';

@Module({})
export class CredentialsRefreshModule {
  public static withConfiguration<Credentials extends AnyCredentialsRepresentation>(params: {
    jwtConfig: JWTConfig;
    model: ClassConstructor<Credentials>;
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [
        CredentialsModule.withConfiguration({
          jwtConfig: params.jwtConfig,
          model: params.model
        }),
        UserModule.forRoot()
      ],
      controllers: [CredentialsRefreshController]
    };
  }
}

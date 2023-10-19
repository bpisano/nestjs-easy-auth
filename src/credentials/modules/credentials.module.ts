import { DynamicModule, Global, Module } from '@nestjs/common';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { JWTModule } from '../../jwt/modules/jwt.module';
import { ModelProviderModule } from '../../modelProvider/modules/modelProvider.module';
import { CredentialsModelProvider } from '../../modelProvider/services/modelProvider';
import { AnyCredentialsRepresentation } from '../models/types/anyCredentialsRepresentation';
import { ApiCredentialsService } from '../services/apiCredentials.service';
import { CREDENTIALS_SERVICE } from './credentials.moduleKeys';

@Global()
@Module({})
export class CredentialsModule {
  public static withConfiguration<Credentials extends AnyCredentialsRepresentation>(params: {
    jwtConfig: JWTConfig;
    modelProvider: CredentialsModelProvider<Credentials>;
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [JWTModule.withConfig(params.jwtConfig), ModelProviderModule.withProvider(params.modelProvider)],
      providers: [{ provide: CREDENTIALS_SERVICE, useClass: ApiCredentialsService }],
      exports: [CREDENTIALS_SERVICE]
    };
  }
}

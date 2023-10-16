import { DynamicModule, Module } from '@nestjs/common';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { JWTModule } from '../../jwt/modules/jwt.module';
import { ApiCredentialsService } from '../services/apiCredentials.service';
import { CREDENTIALS_SERVICE } from './credentials.moduleKeys';

@Module({})
export class CredentialsModule {
  public static withConfiguration(params: { jwtConfig: JWTConfig }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [JWTModule.withConfig(params.jwtConfig)],
      providers: [{ provide: CREDENTIALS_SERVICE, useClass: ApiCredentialsService }],
      exports: [CREDENTIALS_SERVICE]
    };
  }
}

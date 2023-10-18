import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { JWTConfig } from '../../jwt/models/types/jwtConfig';
import { JWTModule } from '../../jwt/modules/jwt.module';
import { AnyCredentialsRepresentation } from '../models/types/anyCredentialsRepresentation';
import { ApiCredentialsService } from '../services/apiCredentials.service';
import { CREDENTIALS_MODEL, CREDENTIALS_SERVICE } from './credentials.moduleKeys';

@Global()
@Module({})
export class CredentialsModule {
  public static withConfiguration<Credentials extends AnyCredentialsRepresentation>(params: {
    jwtConfig: JWTConfig;
    model: ClassConstructor<Credentials>;
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [JWTModule.withConfig(params.jwtConfig)],
      providers: [
        { provide: CREDENTIALS_MODEL, useValue: params.model },
        { provide: CREDENTIALS_SERVICE, useClass: ApiCredentialsService }
      ],
      exports: [CREDENTIALS_MODEL, CREDENTIALS_SERVICE]
    };
  }
}

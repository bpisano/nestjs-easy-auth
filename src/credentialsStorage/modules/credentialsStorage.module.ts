import { DynamicModule, Module, Type } from '@nestjs/common';
import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { MongoConfig } from '../../mongoConfig/models/types/mongoConfig';
import { MongoConfigModule } from '../../mongoConfig/modules/mongoConfig.module';
import { CredentialsStorage } from '../services/credentialsStorage.service';
import { MongoCredentialsStorage } from '../services/mongoCredentialsStorage.service';
import { CREDENTIALS_STORAGE } from './credentialsStorage.moduleKeys';

@Module({})
export class CredentialsStorageModule {
  public static usingStorage<Credentials extends AnyCredentialsRepresentation>(
    storage: Type<CredentialsStorage<Credentials>>
  ): DynamicModule {
    return {
      module: CredentialsStorageModule,
      providers: [{ provide: CREDENTIALS_STORAGE, useClass: storage }],
      exports: [CREDENTIALS_STORAGE]
    };
  }

  public static mongo(params: { config: MongoConfig }): DynamicModule {
    return {
      module: CredentialsStorageModule,
      imports: [MongoConfigModule.withConfiguration(params.config)],
      providers: [{ provide: CREDENTIALS_STORAGE, useClass: MongoCredentialsStorage }],
      exports: [CREDENTIALS_STORAGE]
    };
  }
}

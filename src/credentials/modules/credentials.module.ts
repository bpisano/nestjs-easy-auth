import { DynamicModule, Module, Type } from "@nestjs/common";
import { CredentialsStorageModule } from "../../credentialsStorage/modules/credentialsStorage.module";
import { CredentialsStorage } from "../../credentialsStorage/services/credentialsStorage.service";
import { JWTConfig } from "../../jwt/models/types/jwtConfig";
import { JWTModule } from "../../jwt/modules/jwt.module";
import { MongoConfig } from "../../mongoConfig/models/types/mongoConfig";
import { AnyCredentialsRepresentation } from "../models/types/anyCredentialsRepresentation";
import { ApiCredentialsService } from "../services/apiCredentials.service";
import { CREDENTIALS_SERVICE } from "./credentials.moduleKeys";

@Module({})
export class CredentialsModule {
  public static withConfig<
    Credentials extends AnyCredentialsRepresentation,
  >(params: {
    storage: Type<CredentialsStorage<Credentials>>;
    jwtConfig: JWTConfig;
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [
        JWTModule.withConfig(params.jwtConfig),
        CredentialsStorageModule.usingStorage(params.storage),
      ],
      providers: [
        { provide: CREDENTIALS_SERVICE, useClass: ApiCredentialsService },
      ],
      exports: [CREDENTIALS_SERVICE],
    };
  }

  public static mongo(params: {
    config: MongoConfig;
    jwtConfig: JWTConfig;
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [
        JWTModule.withConfig(params.jwtConfig),
        CredentialsStorageModule.mongo({ config: params.config }),
      ],
      providers: [
        { provide: CREDENTIALS_SERVICE, useClass: ApiCredentialsService },
      ],
      exports: [CREDENTIALS_SERVICE],
    };
  }
}

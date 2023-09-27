import { DynamicModule, Module, Type } from "@nestjs/common";
import { MapCredentials } from "../../auth/types/mapCredentials";
import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import { CredentialsModule } from "../../credentials/modules/credentials.module";
import { CredentialsStorage } from "../../credentialsStorage/services/credentialsStorage.service";
import { JWTConfig } from "../../jwt/models/types/jwtConfig";
import { MongoConfig } from "../../mongoConfig/models/types/mongoConfig";
import { AnyUserRepresentation } from "../../user/models/types/anyUserRepresentation";
import { UserModule } from "../../user/modules/user.module";
import { UserStorage } from "../../userStorage/services/userStorage.service";
import { CredentialsRefreshController } from "../controllers/credentialsRefresh.controller";

@Module({})
export class CredentialsRefreshModule {
  public static mongo<
    Credentials extends AnyCredentialsRepresentation,
  >(params: {
    config: MongoConfig;
    jwtConfig: JWTConfig;
    mapCredentials: MapCredentials<Credentials>;
  }): DynamicModule {
    return {
      module: CredentialsRefreshModule,
      imports: [
        CredentialsModule.mongo({
          config: params.config,
          jwtConfig: params.jwtConfig,
        }),
        UserModule.mongo({ config: params.config }),
      ],
      controllers: [
        CredentialsRefreshController({ mapCredentials: params.mapCredentials }),
      ],
    };
  }

  public static withConfig<
    Credentials extends AnyCredentialsRepresentation,
    User extends AnyUserRepresentation,
  >(params: {
    credentialsStorage: Type<CredentialsStorage<Credentials>>;
    userStorage: Type<UserStorage<User>>;
    jwtConfig: JWTConfig;
    mapCredentials: MapCredentials<Credentials>;
  }): DynamicModule {
    return {
      module: CredentialsModule,
      imports: [
        CredentialsModule.withConfig({
          storage: params.credentialsStorage,
          jwtConfig: params.jwtConfig,
        }),
        UserModule.withConfig({
          storage: params.userStorage,
        }),
      ],
      controllers: [
        CredentialsRefreshController({ mapCredentials: params.mapCredentials }),
      ],
    };
  }
}

import { DynamicModule, Module, Type } from "@nestjs/common";
import { AuthenticationFeature } from "../../authenticationMethods/authenticationFeature.service";
import { CredentialsStorageModule } from "../../credentialsStorage/modules/credentialsStorage.module";
import { MongoConfig } from "../../mongoConfig/models/types/mongoConfig";
import { UserStorageModule } from "../../userStorage/modules/userStorage.module";
import { UserStorage } from "../../userStorage/services/userStorage.service";
import { AnyUserRepresentation } from "../models/types/anyUserRepresentation";
import { ApiUserService } from "../services/apiUser.service";
import { USER_SERVICE } from "./user.moduleKeys";

@Module({})
export class UserModule {
  public static forRoot<User extends AnyUserRepresentation>(config: {
    storage: Type<UserStorage<User>>;
  }): DynamicModule {
    return {
      module: UserModule,
      imports: [UserStorageModule.usingStorage(config.storage)],
      providers: [{ provide: USER_SERVICE, useClass: ApiUserService }],
    };
  }

  public static mongo(params: {
    mongoConfig: MongoConfig;
    userSchema: any;
    credentialsSchema: any;
    features: AuthenticationFeature[];
  }): DynamicModule {
    return {
      module: UserModule,
      imports: [
        CredentialsStorageModule.mongo({
          config: params.mongoConfig,
          schema: params.credentialsSchema,
        }),
        UserStorageModule.mongo({
          config: params.mongoConfig,
          schema: params.userSchema,
        }),
      ],
      providers: [
        { provide: USER_SERVICE, useClass: ApiUserService },
        ...params.features.flatMap((feature) => feature.makeProviders()),
      ],
      controllers: params.features.flatMap((feature) =>
        feature.makeControllers()
      ),
      exports: [USER_SERVICE],
    };
  }
}

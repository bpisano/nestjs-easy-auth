import { DynamicModule, Module, Type } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Schema } from "mongoose";
import { MongoConfig } from "../../mongoConfig/models/types/mongoConfig";
import { MongoConfigModule } from "../../mongoConfig/modules/mongoConfig.module";
import { AnyUserRepresentation } from "../../user/models/types/anyUserRepresentation";
import { MongoUserStorage } from "../services/mongoUserStorage.service";
import { UserStorage } from "../services/userStorage.service";
import { USER_MODEL, USER_STORAGE } from "./userStorage.moduleKeys";

@Module({})
export class UserStorageModule {
  public static usingStorage<User extends AnyUserRepresentation>(
    storage: Type<UserStorage<User>>
  ): DynamicModule {
    return {
      module: UserStorageModule,
      providers: [{ provide: USER_STORAGE, useClass: storage }],
    };
  }

  public static mongo(params: {
    config: MongoConfig;
    schema: Type<Schema>;
  }): DynamicModule {
    const schemaModule: any = MongooseModule.forFeature([
      { name: USER_MODEL, schema: params.schema },
    ]);
    return {
      module: UserStorageModule,
      imports: [
        MongoConfigModule.withConfiguration(params.config),
        schemaModule,
      ],
      providers: [{ provide: USER_STORAGE, useClass: MongoUserStorage }],
      exports: [USER_STORAGE],
    };
  }
}

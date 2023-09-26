import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoDB } from "monkey-db";
import { MongoConfig } from "../models/types/mongoConfig";
import {
  MONGO_CREDENTIALS_MODEL,
  MONGO_DB,
  MONGO_USER_MODEL,
} from "./mongoConfig.moduleKeys";

@Module({})
export class MongoConfigModule {
  public static withConfiguration(config: MongoConfig): DynamicModule {
    const credentialsSchemaModule: any = MongooseModule.forFeature([
      { name: MONGO_CREDENTIALS_MODEL, schema: config.credentialsSchema },
    ]);
    const userSchemaModule: any = MongooseModule.forFeature([
      { name: MONGO_USER_MODEL, schema: config.userSchema },
    ]);
    return {
      module: MongoConfigModule,
      imports: [
        ConfigModule.forRoot(),
        credentialsSchemaModule,
        userSchemaModule,
        MongooseModule.forRoot(config.uri, {
          dbName: config.dbName,
        }),
      ],
      providers: [{ provide: MONGO_DB, useClass: MongoDB }],
      exports: [MONGO_DB, credentialsSchemaModule, userSchemaModule],
    };
  }
}

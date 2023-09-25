import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoDB } from "monkey-db";
import { MongoConfig } from "../models/types/mongoConfig";
import { MONGO_DB } from "./mongoConfig.moduleKeys";

@Module({})
export class MongoConfigModule {
  public static withConfiguration(config: MongoConfig): DynamicModule {
    return {
      module: MongoConfigModule,
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(config.uri, {
          dbName: config.dbName,
        }),
      ],
      providers: [{ provide: MONGO_DB, useClass: MongoDB }],
      exports: [MONGO_DB],
    };
  }
}

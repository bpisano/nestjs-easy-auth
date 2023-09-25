import { DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MemoryServer } from "../services/memoryServer.service";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TestMongooseModule: DynamicModule = MongooseModule.forRootAsync({
  useFactory: async () => {
    const memoryServer: MemoryServer = MemoryServer.getInstance();
    const mongoDB: MongoMemoryServer = await memoryServer.create();
    const uri: string = mongoDB.getUri();
    return {
      uri: uri,
    };
  },
});

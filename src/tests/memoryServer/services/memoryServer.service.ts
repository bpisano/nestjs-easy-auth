import { MongoMemoryServer } from "mongodb-memory-server";

export class MemoryServer {
  private static instance?: MemoryServer;

  public mongoDB?: MongoMemoryServer;

  public static getInstance(): MemoryServer {
    if (!MemoryServer.instance) {
      MemoryServer.instance = new MemoryServer();
    }
    return MemoryServer.instance;
  }

  public async create(): Promise<MongoMemoryServer> {
    this.mongoDB = await MongoMemoryServer.create();
    return this.mongoDB;
  }

  public async stop(): Promise<void> {
    if (!this.mongoDB) {
      return;
    }
    await this.mongoDB.stop();
  }
}

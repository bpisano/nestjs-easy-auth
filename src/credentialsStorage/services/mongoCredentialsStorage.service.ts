import { Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateOne, FindOne, MongoDB, MongoDBQuery } from "monkey-db";
import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import {
  MONGO_CREDENTIALS_MODEL,
  MONGO_DB,
} from "../../mongoConfig/modules/mongoConfig.moduleKeys";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";
import { CredentialsStorage } from "./credentialsStorage.service";

export class MongoCredentialsStorage<
  Credentials extends AnyCredentialsRepresentation,
> implements CredentialsStorage<Credentials>
{
  public constructor(
    @InjectModel(MONGO_CREDENTIALS_MODEL)
    private readonly model: Model<DatabaseModelOf<Credentials>>,
    @Inject(MONGO_DB) private readonly db: MongoDB,
  ) {}

  public async getWithAccessToken(
    accessToken: string,
  ): PromiseOptional<DatabaseModelOf<Credentials>> {
    return this.db.perform(
      MongoDBQuery.withModel(this.model).modifier(
        FindOne.where({ accessToken }),
      ),
    );
  }

  public async getWithUserId(
    userId: string,
  ): PromiseOptional<DatabaseModelOf<Credentials>> {
    return this.db.perform(
      MongoDBQuery.withModel(this.model).modifier(FindOne.where({ userId })),
    );
  }

  public async create(
    credentials: Partial<DatabaseModelOf<Credentials>>,
  ): Promise<DatabaseModelOf<Credentials>> {
    return this.db.perform(
      MongoDBQuery.withModel(this.model).modifier(
        CreateOne.withData(credentials),
      ),
    );
  }
}

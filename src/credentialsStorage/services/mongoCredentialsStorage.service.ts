import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import { MONGO_CREDENTIALS_MODEL } from "../../mongoConfig/modules/mongoConfig.moduleKeys";
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
  ) {}

  public async getWithAccessToken(
    _accessToken: string,
  ): PromiseOptional<DatabaseModelOf<Credentials>> {
    throw new Error("Method not implemented.");
  }

  public async getWithUserId(
    _userId: string,
  ): PromiseOptional<DatabaseModelOf<Credentials>> {
    throw new Error("Method not implemented.");
  }

  public async create(
    _credentials: Partial<DatabaseModelOf<Credentials>>,
  ): Promise<DatabaseModelOf<Credentials>> {
    throw new Error("Method not implemented.");
  }
}

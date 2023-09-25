import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AnyCredentialsRepresentation } from "../../credentials/models/types/anyCredentialsRepresentation";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";
import { CREDENTIALS_MODEL } from "../modules/credentialsStorage.moduleKeys";
import { CredentialsStorage } from "./credentialsStorage.service";

export class MongoCredentialsStorage<
  Credentials extends AnyCredentialsRepresentation
> implements CredentialsStorage<Credentials>
{
  public constructor(
    @InjectModel(CREDENTIALS_MODEL)
    private readonly model: Model<DatabaseModelOf<Credentials>>
  ) {}

  public async getWithAccessToken(
    accessToken: string
  ): PromiseOptional<DatabaseModelOf<Credentials>> {
    throw new Error("Method not implemented.");
  }

  public async getWithUserId(
    userId: string
  ): PromiseOptional<DatabaseModelOf<Credentials>> {
    throw new Error("Method not implemented.");
  }

  public async create(
    credentials: Partial<DatabaseModelOf<Credentials>>
  ): Promise<DatabaseModelOf<Credentials>> {
    throw new Error("Method not implemented.");
  }
}

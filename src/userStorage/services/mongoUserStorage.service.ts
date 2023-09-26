import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MONGO_USER_MODEL } from "../../mongoConfig/modules/mongoConfig.moduleKeys";
import { AnyUserRepresentation } from "../../user/models/types/anyUserRepresentation";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";
import { UserStorage } from "./userStorage.service";

@Injectable()
export class MongoUserStorage<User extends AnyUserRepresentation>
  implements UserStorage<User>
{
  public constructor(
    @InjectModel(MONGO_USER_MODEL)
    private readonly model: Model<DatabaseModelOf<User>>,
  ) {}

  public async getWithId(_id: string): PromiseOptional<DatabaseModelOf<User>> {
    console.log(this.model);
    throw new Error("Method not implemented.");
  }

  public async getWith(_params: any): PromiseOptional<DatabaseModelOf<User>> {
    throw new Error("Method not implemented.");
  }

  public async create(
    _user: Partial<DatabaseModelOf<User>>,
  ): Promise<DatabaseModelOf<User>> {
    throw new Error("Method not implemented.");
  }

  public async updateWithId(
    _id: string,
    _user: Partial<DatabaseModelOf<User>>,
  ): Promise<DatabaseModelOf<User>> {
    throw new Error("Method not implemented.");
  }

  public async updteWith(
    _params: any,
    _user: Partial<DatabaseModelOf<User>>,
  ): Promise<DatabaseModelOf<User>> {
    throw new Error("Method not implemented.");
  }

  public async deleteWithId(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async deleteWith(_params: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

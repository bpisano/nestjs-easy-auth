import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";
import { AnyUserRepresentation } from "../models/types/anyUserRepresentation";

export interface UserService<User extends AnyUserRepresentation> {
  getWithId(id: string): PromiseOptional<User>;
  getWith(params: any): PromiseOptional<User>;
  create(user: Partial<DatabaseModelOf<User>>): Promise<User>;
  updateWithId(id: string, user: Partial<DatabaseModelOf<User>>): Promise<User>;
  updateWith(params: any, user: Partial<DatabaseModelOf<User>>): Promise<User>;
  deleteWithId(id: string): Promise<void>;
  deleteWith(params: any): Promise<void>;
}

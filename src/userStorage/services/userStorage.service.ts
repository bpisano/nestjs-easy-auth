import { AnyUserRepresentation } from "../../user/models/types/anyUserRepresentation";
import { DatabaseModelOf } from "../../utils/types/databaseModelOf";
import { PromiseOptional } from "../../utils/types/promiseOptional";

export interface UserStorage<User extends AnyUserRepresentation> {
  getWithId(id: string): PromiseOptional<DatabaseModelOf<User>>;
  getWith(params: any): PromiseOptional<DatabaseModelOf<User>>;
  create(user: Partial<DatabaseModelOf<User>>): Promise<DatabaseModelOf<User>>;
  updateWithId(
    id: string,
    user: Partial<DatabaseModelOf<User>>
  ): Promise<DatabaseModelOf<User>>;
  updteWith(
    params: any,
    user: Partial<DatabaseModelOf<User>>
  ): Promise<DatabaseModelOf<User>>;
  deleteWithId(id: string): Promise<void>;
  deleteWith(params: any): Promise<void>;
}

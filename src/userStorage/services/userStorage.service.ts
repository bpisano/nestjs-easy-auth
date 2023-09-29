import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';
import { DatabaseModelOf } from '../../utils/types/databaseModelOf';
import { PromiseOptional } from '../../utils/types/promiseOptional';

export interface UserStorage<User extends AnyUserRepresentation> {
  getWith(params: any): PromiseOptional<DatabaseModelOf<User>>;
  create(user: Partial<DatabaseModelOf<User>>): Promise<DatabaseModelOf<User>>;
  updateWith(params: any, user: Partial<DatabaseModelOf<User>>): Promise<DatabaseModelOf<User>>;
  deleteWith(params: any): Promise<void>;
}

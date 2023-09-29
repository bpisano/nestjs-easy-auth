import { Inject, Injectable } from '@nestjs/common';
import { USER_STORAGE } from '../../userStorage/modules/userStorage.moduleKeys';
import { UserStorage } from '../../userStorage/services/userStorage.service';
import { DatabaseModelOf } from '../../utils/types/databaseModelOf';
import { Optional } from '../../utils/types/optional';
import { PromiseOptional } from '../../utils/types/promiseOptional';
import { AnyUserRepresentation } from '../models/types/anyUserRepresentation';
import { UserService } from './user.service';

@Injectable()
export class ApiUserService<User extends AnyUserRepresentation> implements UserService<User> {
  public constructor(@Inject(USER_STORAGE) private readonly storage: UserStorage<User>) {}

  public async getWithId(id: string): PromiseOptional<User> {
    return this.getWith({ _id: id });
  }

  public async getWith(params: any): PromiseOptional<User> {
    const dbUser: Optional<DatabaseModelOf<User>> = await this.storage.getWith(params);
    return dbUser?.toAppModel();
  }

  public async create(user: Partial<DatabaseModelOf<User>>): Promise<User> {
    const dbUser: DatabaseModelOf<User> = await this.storage.create(user);
    return dbUser.toAppModel();
  }

  public async updateWithId(id: string, user: Partial<DatabaseModelOf<User>>): Promise<User> {
    return this.updateWith({ _id: id }, user);
  }

  public async updateWith(params: any, user: Partial<DatabaseModelOf<User>>): Promise<User> {
    const dbUser: DatabaseModelOf<User> = await this.storage.updateWith(params, user);
    return dbUser.toAppModel();
  }

  public async deleteWithId(id: string): Promise<void> {
    await this.deleteWith({ _id: id });
  }

  public async deleteWith(params: any): Promise<void> {
    await this.storage.deleteWith(params);
  }
}

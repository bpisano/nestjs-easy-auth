import { UserStorage } from '../../../userStorage/services/userStorage.service';
import { DatabaseModelOf } from '../../../utils/types/databaseModelOf';
import { Optional } from '../../../utils/types/optional';
import { PromiseOptional } from '../../../utils/types/promiseOptional';
import { UserMock } from '../models/app/user.mock';
import { DBUserMock } from '../models/db/dbUser.mock';

export class TestUserStorage implements UserStorage<UserMock> {
  private users: DatabaseModelOf<UserMock>[] = [];

  public async getWith(params: Partial<DatabaseModelOf<UserMock>>): PromiseOptional<DatabaseModelOf<UserMock>> {
    return this.users.find((user) => {
      return Object.keys(params).every((key) => {
        return user[key] === params[key];
      });
    });
  }

  public async create(user: DatabaseModelOf<UserMock>): Promise<DatabaseModelOf<UserMock>> {
    const createdUser: DatabaseModelOf<UserMock> = new DBUserMock(user.id, user.email, user.hashedPassword);
    this.users.push(createdUser);
    return createdUser;
  }

  public async updateWith(
    params: Partial<DatabaseModelOf<UserMock>>,
    update: Partial<DatabaseModelOf<UserMock>>
  ): Promise<DatabaseModelOf<UserMock>> {
    const existingUser: Optional<DatabaseModelOf<UserMock>> = await this.getWith(params);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser: DatabaseModelOf<UserMock> = existingUser;
    for (const key in update) {
      if (Object.prototype.hasOwnProperty.call(update, key)) {
        updatedUser[key] = update[key];
      }
    }

    this.users = this.users.map((user) => {
      return Object.keys(params).every((key) => {
        return user[key] === params[key];
      })
        ? updatedUser
        : user;
    });
    return updatedUser;
  }

  public async deleteWith(params: Partial<DatabaseModelOf<UserMock>>): Promise<void> {
    this.users = this.users.filter((user) => {
      return Object.keys(params).every((key) => {
        return user[key] !== params[key];
      });
    });
  }
}

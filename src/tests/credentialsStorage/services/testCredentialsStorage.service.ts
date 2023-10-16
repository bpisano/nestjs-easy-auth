import { CredentialsStorage } from '../../../credentialsStorage/services/credentialsStorage.service';
import { DatabaseModelOf } from '../../../utils/types/databaseModelOf';
import { PromiseOptional } from '../../../utils/types/promiseOptional';
import { CredentialsMock } from '../models/app/credentials.mock';
import { DBCredentialsMock } from '../models/db/dbCredentials.mock';

export class TestCredentialsStorage implements CredentialsStorage<CredentialsMock> {
  private credentials: DBCredentialsMock[] = [];

  public async getOneWith(
    params: Partial<DatabaseModelOf<CredentialsMock>>
  ): PromiseOptional<DatabaseModelOf<CredentialsMock>> {
    return this.credentials.find((credential) => {
      return Object.keys(params).every((key) => {
        return credential[key] === params[key];
      });
    });
  }

  public async getManyWith(
    params: Partial<DatabaseModelOf<CredentialsMock>>
  ): Promise<DatabaseModelOf<CredentialsMock>[]> {
    return this.credentials.filter((credential) => {
      return Object.keys(params).every((key) => {
        return credential[key] === params[key];
      });
    });
  }

  public async create(credentials: DatabaseModelOf<CredentialsMock>): Promise<DatabaseModelOf<CredentialsMock>> {
    const createdCredentials: DatabaseModelOf<CredentialsMock> = new DBCredentialsMock(
      credentials.userId,
      credentials.authType,
      credentials.accessToken,
      credentials.refreshToken,
      credentials.accessTokenExpiration,
      credentials.refreshTokenExpiration
    );
    this.credentials.push(createdCredentials);
    return createdCredentials;
  }

  public async deleteOneWith(params: Partial<DatabaseModelOf<CredentialsMock>>): Promise<void> {
    this.credentials = this.credentials.filter((credential) => {
      return Object.keys(params).every((key) => {
        return credential[key] !== params[key];
      });
    });
  }
}

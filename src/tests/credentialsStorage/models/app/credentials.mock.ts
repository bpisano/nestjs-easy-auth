import { CredentialsRepresentation } from '../../../../credentials/models/types/credentialsRepresentation';
import { DBCredentialsMock } from '../db/dbCredentials.mock';
import { PublicCredentialsMock } from '../public/publicCredentials.mock';

export class CredentialsMock implements CredentialsRepresentation<DBCredentialsMock, PublicCredentialsMock> {
  public constructor(
    public readonly userId: string,
    public readonly authType: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiration: Date,
    public readonly refreshTokenExpiration: Date
  ) {}

  public toDatabaseModel(): DBCredentialsMock {
    return new DBCredentialsMock(
      this.userId,
      this.authType,
      this.accessToken,
      this.refreshToken,
      this.accessTokenExpiration,
      this.refreshTokenExpiration
    );
  }

  public toPublicModel(): PublicCredentialsMock {
    return new PublicCredentialsMock(
      this.userId,
      this.authType,
      this.accessToken,
      this.refreshToken,
      this.accessTokenExpiration,
      this.refreshTokenExpiration
    );
  }
}

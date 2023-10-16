import { MapCredentialsParams } from '../../../../../auth/types/mapCredentialsParams';
import { CredentialsRepresentation } from '../../../../../credentials/models/types/credentialsRepresentation';
import { DatabaseModelOf } from '../../../../types/databaseModelOf';
import { DBCredentialsDocumentMock } from '../db/dbCredentials.mock';
import { PublicCredentialsMock } from '../public/publicCredentials.mock';

export class CredentialsMock implements CredentialsRepresentation<DBCredentialsDocumentMock, PublicCredentialsMock> {
  public constructor(
    public readonly userId: string,
    public readonly authType: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiration: Date,
    public readonly refreshTokenExpiration: Date
  ) {}

  public static fromMapCredentials(params: MapCredentialsParams): Partial<DatabaseModelOf<CredentialsMock>> {
    return {
      userId: params.userId,
      authType: params.authType,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      accessTokenExpiration: params.accessTokenExpiration,
      refreshTokenExpiration: params.refreshTokenExpiration
    };
  }

  public toDatabaseModel(): DBCredentialsDocumentMock {
    return {
      userId: this.userId,
      authType: this.authType,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      accessTokenExpiration: this.accessTokenExpiration,
      refreshTokenExpiration: this.refreshTokenExpiration
    } as DBCredentialsDocumentMock;
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

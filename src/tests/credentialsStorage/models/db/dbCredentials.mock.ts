import { ToAppModelConvertible } from 'model-conversion';
import { CredentialsMock } from '../app/credentials.mock';

export class DBCredentialsMock implements ToAppModelConvertible<CredentialsMock> {
  public constructor(
    public readonly userId: string,
    public readonly authType: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiration: Date,
    public readonly refreshTokenExpiration: Date
  ) {}

  public toAppModel(): CredentialsMock {
    return new CredentialsMock(
      this.userId,
      this.authType,
      this.accessToken,
      this.refreshToken,
      this.accessTokenExpiration,
      this.refreshTokenExpiration
    );
  }
}

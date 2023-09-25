export class PublicCredentialsMock {
  public constructor(
    public readonly userId: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly accessTokenExpiration: Date,
    public readonly refreshTokenExpiration: Date
  ) {}
}

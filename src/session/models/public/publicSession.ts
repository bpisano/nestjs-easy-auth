export class PublicSession<PublicUser, PublicCredentials> {
  public readonly credentials: PublicCredentials;
  public readonly current_user: PublicUser;

  public constructor(credentials: PublicCredentials, currentUser: PublicUser) {
    this.credentials = credentials;
    this.current_user = currentUser;
  }
}

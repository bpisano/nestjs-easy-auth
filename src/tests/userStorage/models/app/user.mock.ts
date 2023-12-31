import { UserRepresentation } from '../../../../user/models/types/userRepresentation';
import { DBUserMock } from '../db/dbUser.mock';
import { PublicUserMock } from '../public/public.publicUser.mock';

export class UserMock implements UserRepresentation<DBUserMock, PublicUserMock> {
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hashedPassword?: string
  ) {}

  public toDatabaseModel(): DBUserMock {
    return new DBUserMock(this.id, this.email, this.hashedPassword);
  }

  public toPublicModel(): PublicUserMock {
    return new PublicUserMock(this.id, this.email);
  }
}

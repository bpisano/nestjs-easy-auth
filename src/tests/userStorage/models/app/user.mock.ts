import * as bcrypt from 'bcrypt';
import { SignInEmailPasswordInput } from '../../../../authenticator/signInEmailPassword/signInEmailPassword.authenticator';
import { UserRepresentation } from '../../../../user/models/types/userRepresentation';
import { DatabaseModelOf } from '../../../../utils/types/databaseModelOf';
import { DBUserMock } from '../db/dbUser.mock';
import { PublicUserMock } from '../public/public.publicUser.mock';

export class UserMock implements UserRepresentation<DBUserMock, PublicUserMock> {
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hashedPassword?: string
  ) {}

  public static fromSignInEmailPassword(input: SignInEmailPasswordInput): Partial<DatabaseModelOf<UserMock>> {
    const hashedPassword: string = bcrypt.hashSync(input.password, 10);
    return {
      email: input.email,
      hashedPassword
    };
  }

  public toDatabaseModel(): DBUserMock {
    return new DBUserMock(this.id, this.email, this.hashedPassword);
  }

  public toPublicModel(): PublicUserMock {
    return new PublicUserMock(this.id, this.email);
  }
}

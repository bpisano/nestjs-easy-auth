import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { SignInEmailPasswordInput } from '../../../../../authenticator/signInEmailPassword/signInEmailPassword.authenticator';
import { UserRepresentation } from '../../../../../user/models/types/userRepresentation';
import { DatabaseModelOf } from '../../../../types/databaseModelOf';
import { DBUserDocumentMock } from '../db/dbUser.mock';
import { PublicUserMock } from '../public/public.publicUser.mock';

export class UserMock implements UserRepresentation<DBUserDocumentMock, PublicUserMock> {
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

  public toDatabaseModel(): DBUserDocumentMock {
    return {
      _id: new Types.ObjectId(this.id),
      email: this.email,
      hashedPassword: this.hashedPassword
    } as Partial<DBUserDocumentMock> as DBUserDocumentMock;
  }

  public toPublicModel(): PublicUserMock {
    return new PublicUserMock(this.id, this.email);
  }
}

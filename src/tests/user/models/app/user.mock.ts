import { Types } from "mongoose";
import { UserRepresentation } from "../../../../user/models/types/userRepresentation";
import { DBUserDocumentMock } from "../db/dbUser.mock";
import { PublicUserMock } from "../public/public.publicUser.mock";

export class UserMock
  implements UserRepresentation<DBUserDocumentMock, PublicUserMock>
{
  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly hashedPassword?: string
  ) {}

  public toDatabaseModel(): DBUserDocumentMock {
    return {
      _id: new Types.ObjectId(this.id),
      email: this.email,
      hashedPassword: this.hashedPassword,
    } as Partial<DBUserDocumentMock> as DBUserDocumentMock;
  }

  public toPublicModel(): PublicUserMock {
    return new PublicUserMock(this.id, this.email);
  }
}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { UserMock } from "../app/user.mock";

@Schema({ collection: "users" })
export class DBUserMock {
  @Prop()
  public readonly email: string;

  @Prop()
  public readonly hashedPassword?: string;

  public toAppModel: () => UserMock;
}

export type DBUserDocumentMock = HydratedDocument<DBUserMock>;
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DBUserSchemaMock: MongooseSchema<DBUserDocumentMock> =
  SchemaFactory.createForClass(DBUserMock);

DBUserSchemaMock.methods.toAppModel = function (): UserMock {
  return new UserMock(this._id, this.email, this.hashedPassword);
};

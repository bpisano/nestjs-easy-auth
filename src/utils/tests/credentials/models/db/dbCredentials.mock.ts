import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { CredentialsMock } from '../app/credentials.mock';

@Schema({
  collection: 'credentials'
})
export class DBCredentials {
  @Prop()
  public readonly userId: string;

  @Prop()
  public readonly authType: string;

  @Prop()
  public readonly accessToken: string;

  @Prop()
  public readonly refreshToken: string;

  @Prop()
  public readonly accessTokenExpiration: Date;

  @Prop()
  public readonly refreshTokenExpiration: Date;

  public toAppModel: () => CredentialsMock;
}

export type DBCredentialsDocumentMock = HydratedDocument<DBCredentials>;
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DBCredentialsSchemaMock: MongooseSchema<DBCredentialsDocumentMock> =
  SchemaFactory.createForClass(DBCredentials);

DBCredentialsSchemaMock.methods.toAppModel = function (): CredentialsMock {
  return new CredentialsMock(
    this.userId,
    this.authType,
    this.accessToken,
    this.refreshToken,
    this.accessTokenExpiration,
    this.refreshTokenExpiration
  );
};

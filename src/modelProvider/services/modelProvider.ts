import { AnyCredentialsRepresentation } from '../../credentials/models/types/anyCredentialsRepresentation';
import { AnyUserRepresentation } from '../../user/models/types/anyUserRepresentation';

export interface ModelProvider<Credentials extends AnyCredentialsRepresentation, User extends AnyUserRepresentation> {
  provideCredentials(params: any): Credentials;
  provideUser(params: any): User;
}

export type CredentialsModelProvider<Credentials extends AnyCredentialsRepresentation> = ModelProvider<
  Credentials,
  any
>;
export type UserModelProvider<User extends AnyUserRepresentation> = ModelProvider<any, User>;

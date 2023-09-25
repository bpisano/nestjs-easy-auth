import { AnyCredentialsRepresentation } from "../credentials/models/types/anyCredentialsRepresentation";
import { Session } from "../session/models/api/session";
import { AnyUserRepresentation } from "../user/models/types/anyUserRepresentation";

export interface Authenticator<
  Input,
  Credentials extends AnyCredentialsRepresentation,
  User extends AnyUserRepresentation
> {
  authenticate(input: Input): Promise<Session<Credentials, User>>;
}

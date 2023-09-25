import { AnyCredentialsRepresentation } from "../../../credentials/models/types/anyCredentialsRepresentation";
import { AnyUserRepresentation } from "../../../user/models/types/anyUserRepresentation";
import { DatabaseModelOf } from "../../../utils/types/databaseModelOf";

export type SignInWithEmailAndPasswordMapper<
  Credentials extends AnyCredentialsRepresentation,
  User extends AnyUserRepresentation
> = {
  mapUser: (
    email: string,
    hashedPassword: string
  ) => Partial<DatabaseModelOf<User>>;
  mapCredentials: (userId: string) => Partial<DatabaseModelOf<Credentials>>;
};
